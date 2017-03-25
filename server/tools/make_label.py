# -*- coding: utf-8 -*-
import argparse
import jinja2
import json
import lxml.etree
import mysql.connector
import os
import pprint
import subprocess
import sys
import z3c.rml.document
import common

TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), 'label-templates')

ITEM_SQL = 'select * from items where barcode = %s'


REGISTRY = []
def register(maker_class):
    REGISTRY.append(maker_class)
    return maker_class


class LabelMaker(object):

    category = None
    template = None

    def __init__(self, item, data=None):
        self.item = item
        self.data = data or {}

    @classmethod
    def is_applicable(cls, item, data=None):
        return False

    def prepare(self):
        pass

    def render(self, output_fn):
        with open(self.template, 'r') as fi:
            template = jinja2.Template(fi.read())

        self.prepare()
        rml = template.render(item=self.item, **self.data)

        root = lxml.etree.fromstring(rml.encode('utf-8'))
        doc = z3c.rml.document.Document(root)

        with open(output_fn, 'w') as fo:
            doc.process(fo)


@register
class LeseleiterLabelMaker(LabelMaker):

    category = 'main'
    template = os.path.join(TEMPLATES_DIR, 'leseleiter.rml')

    @classmethod
    def is_applicable(cls, item, data=None):
        return item['age'].startswith('Leseleiter-')

    def prepare(self):
        age = self.item['age']
        self.data['age'] = age.split('-')[1]


@register
class BilderbuchLabelMaker(LabelMaker):

    category = 'main'
    template = os.path.join(TEMPLATES_DIR, 'bilderbuch.rml')

    classification_to_size = {
        'B/K': u'klein',
        'B/M': u'mittel',
        'B/G': u'groß'
    }

    @classmethod
    def is_applicable(cls, item, data=None):
        return item['classification'] in ('B/K', 'B/M', 'B/G')

    def prepare(self):
        self.data['size'] = self.classification_to_size[
            self.item['classification']]


@register
class BilderbuchWithAuthorLabelMaker(LabelMaker):

    category = 'main'
    template = os.path.join(TEMPLATES_DIR, 'bilderbuch-with-author.rml')

    @classmethod
    def is_applicable(cls, item, data=None):
        return (
            item['classification'].startswith('B/A') or
            item['classification'].startswith('B/K/A'))

    def prepare(self):
        # Sometimes the author or category is listed as part of the
        # classification
        parts = self.item['classification'].split(' ', 1)
        if len(parts) == 1:
            classification = parts[0]
            author = self.item['author'].split(',')[0]
            author_abbr = author[:3]
        else:
            author = None
            classification, author_abbr = parts

            # Special and crappy case.
            if author_abbr == 'Bilderbuch klein Autor':
                # It turns out that if the book is a series, we use it
                # as the author value! WTF?!
                author = self.item['seriestitle']
                if author == 'na':
                    author = self.item['author'].split(',')[0]
                author_abbr = author[:3]
            else:
                # It turns out that if the book is a series, we use it
                # as the author value! WTF?!
                # Sometimes it is just a substring too: Mau -> Die Maus
                if author_abbr in self.item['seriestitle']:
                    author = self.item['seriestitle']
                else:
                    author = self.item['author'].split(',')[0]

        self.data['author_abbr'] = author_abbr[:3].upper()
        self.data['author'] = author
        self.data['classification'] = classification


@register
class BilderbuchWithTopicLabelMaker(LabelMaker):

    category = 'main'
    template = os.path.join(TEMPLATES_DIR, 'bilderbuch-with-topic.rml')

    topics = {
        'bau': u'Bauernhof',
        'fam': u'Familie',
        'far': u'Farben',
        'nat': u'Natur',
        'sch': u'Schule',
        'ti': u'Tiere',
        've': u'Verkehr',
        'za': u'Zahlen',
        'ze': u'Zeit',
    }

    @classmethod
    def is_applicable(cls, item, data=None):
        return (
            any([
                item['classification'].lower().startswith(topic)
                for topic in cls.topics
            ])
            and
            item['subject'].startswith('Bilderbuch'))

    def prepare(self):
        for topic_abbr, topic in self.topics.items():
            if self.item['classification'].lower().startswith(topic_abbr):
                break
        self.data['topic_abbr'] = topic_abbr.title()
        self.data['topic'] = topic


@register
class BoardbookLabelMaker(LabelMaker):

    category = 'main'
    template = os.path.join(TEMPLATES_DIR, 'boardbook.rml')

    @classmethod
    def is_applicable(cls, item, data=None):
        return item['classification'].startswith('Bb')


@register
class BarcodeInsideLabelMaker(LabelMaker):

    category = 'barcode-inside'
    template = os.path.join(TEMPLATES_DIR, 'barcode-inside.rml')

    @classmethod
    def is_applicable(cls, item, data=None):
        return True


def get_label_maker(item, category=None, data=None):
    for maker_class in REGISTRY:
        if category is not None and maker_class.category != category:
            continue
        if not maker_class.is_applicable(item, data):
            continue
        return maker_class(item, data)


def get_db_connection(config):
    db_config = config['db']
    return mysql.connector.connect(
      host=db_config['host'],
      user=db_config['user'],
      password=db_config['password'],
      db=db_config['database'])


def get_item(conn, barcode):
    cursor = conn.cursor()
    cursor.execute(ITEM_SQL % barcode)
    row = cursor.fetchone()
    return dict(zip(cursor.column_names, row))


parser = argparse.ArgumentParser(
    description='Create or print a PDF label for a given library item.')
parser.add_argument(
    'barcode',
    help='The barcode of the library item.')
parser.add_argument(
    '--category', '-c', dest='category', default=None,
    help='Specifies the category of label to use.')
parser.add_argument(
    '--print', '-p', dest='doprint', default=False, action='store_true',
    help='When specifed, the label is sent directly to the printer.'
    )
parser.add_argument(
    '--out', '-o', dest='output',
    help='The output filename of the generated label PDF.')
parser.add_argument(
    '--data', '-d', dest='data', type=json.loads, default=None,
    help='Additional data needed to render the label.')
parser.add_argument(
    '--verbose', '-v', dest='verbose', action='store_true')


def main(argv=sys.argv[1:]):
    args = parser.parse_args(argv)

    config = common.get_json_config(os.environ['NODE_ENV'])

    conn = get_db_connection(config)
    item = get_item(conn, args.barcode)

    if args.verbose:
        print 'Item:'
        pprint.pprint(item)

    label_maker = get_label_maker(item, args.category, args.data)
    if label_maker is None:
        print 'No label maker found!'
        sys.exit(1)
    if args.verbose:
        print 'Label Maker:', label_maker.__class__.__name__

    out_fn = args.output
    if out_fn is None:
        out_fn = 'label-%s.pdf' % args.barcode
    if args.verbose:
        print 'Output Filename:', out_fn

    label_maker.render(out_fn)

    if args.doprint:
        if args.verbose:
            print 'Printing to', config['printer']['name']
        subprocess.call(
            ['lp', '-d', config['printer']['name'], out_fn])


if __name__ == '__main__':
    main()
