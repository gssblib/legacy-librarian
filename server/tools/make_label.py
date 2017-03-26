# -*- coding: utf-8 -*-
import argparse
import contextlib
import flask
import jinja2
import json
import lazy
import logging
import lxml.etree
import mysql.connector
import os
import pprint
import shutil
import subprocess
import sys
import tempfile
import z3c.rml.document
import zope.interface
import zope.schema

import common

TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), 'label-templates')

ITEM_SQL = 'select * from items where barcode = %s'

APP = flask.Flask('Label Maker')

log = logging.getLogger('label_maker')


class AttrDict(dict):

    def __getattr__(self, name):
        try:
            return self[name]
        except KeyError:
            raise AttributeError(name)


@contextlib.contextmanager
def TemporaryDirectory():
    path = tempfile.mkdtemp()
    try:
        yield path
    finally:
        shutil.rmtree(path)


class Labels(object):

    makers = []

    @classmethod
    def register(cls, maker):
        cls.makers.append(maker)
        return maker

    @lazy.lazy
    def config(self):
        return common.get_json_config(os.environ['NODE_ENV'])

    @lazy.lazy
    def connection(self):
        db_config = self.config['db']
        return mysql.connector.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            db=db_config['database'])

    def get_label_maker(self, item, category=None):
        for maker_cls in self.makers:
            if category is not None and maker_cls.category != category:
                continue
            if not maker_cls.is_applicable(item):
                continue
            log.info('Selected Label Maker: %s', maker_cls.__name__)
            return maker_cls
        raise ValueError('No label maker class found')

    def get_item(self, barcode):
        cursor = self.connection.cursor()
        cursor.execute(ITEM_SQL % barcode)
        row = cursor.fetchone()
        item = AttrDict(zip(cursor.column_names, row))
        log.debug('Item:\n%s', pprint.pformat(item))
        return item

    def create_label(self, item, category=None, data=None, pdf_path=None):
        if pdf_path is None:
            pdf_path = tempfile.mktmep('label-%s.pdf' % item.barcode)

        label_maker_cls = self.get_label_maker(item, category)
        label_maker = label_maker_cls(item, data)
        label_maker.render(pdf_path)
        log.info('Label saved: %s', pdf_path)

        return pdf_path

    def preview_label(self, pdf_path, png_path=None):
        if png_path is None:
            png_path = pdf_path[:-3] + 'png'

        cmd = ['convert', '-density', '300', pdf_path, png_path]
        log.debug('Running command: %s' % ' '.join(cmd))
        subprocess.call(cmd)

        return png_path

    def print_label(self, pdf_path):
        printer = self.config['printer']['name']
        log.info('Printing to %s', printer)

        cmd = [
            'lp', '-d', printer,
             # Make sure we are printing in high-quality mode, so that
             # graphics, especially barcodes are printed in sufficiant detail.
             '-o', 'DymoPrintQuality=Graphics',
             '-o', 'Resolution=300x600dpi',
             pdf_path]
        log.debug('Running command: %s' % ' '.join(cmd))
        subprocess.call(cmd)

    def list_categories(self, item):
        categories = set()
        for maker_cls in self.makers:
            if maker_cls.is_applicable(item):
                categories.add(maker_cls.category)
        return list(categories)

    def get_category_details(self, item, category=None):
        # 2. Get the label maker.
        label_maker = self.get_label_maker(item, category)

        # 3. Create the field descriptions.
        fields = []
        if label_maker.data_schema:
            for name, field in zope.schema.getFieldsInOrder(
                    label_maker.data_schema):
                fields.append({
                    'name': name,
                    'title': field.title,
                    'type': field.__class__.__name__.lower(),
                    'required': field.required,
                    'default': field.default,
                })

        details = {
            'category': label_maker.category,
            'fields': fields}
        return details


class LabelMaker(object):

    category = None
    template = None
    data_schema = None

    def __init__(self, item, data=None):
        self.item = item
        self.data = data or {}

    @classmethod
    def is_applicable(cls, item):
        return False

    def prepare(self):
        pass

    def validate_data(self):
        if self.data_schema is None:
            return
        for name, field in zope.schema.getFieldsInOrder(self.data_schema):
            if name in self.data:
                field.validate(self.data[name])
                continue
            if field.default is not None:
                self.data[name] = field.default

    def render(self, output_fn):
        with open(self.template, 'r') as fi:
            template = jinja2.Template(fi.read().decode('utf-8'))

        self.validate_data()
        self.prepare()
        rml = template.render(item=self.item, **self.data)

        root = lxml.etree.fromstring(rml.encode('utf-8'))
        doc = z3c.rml.document.Document(root)

        with open(output_fn, 'w') as fo:
            doc.process(fo)


@Labels.register
class LeseleiterLabelMaker(LabelMaker):

    category = 'main'
    template = os.path.join(TEMPLATES_DIR, 'leseleiter.rml')

    @classmethod
    def is_applicable(cls, item):
        return item.age.startswith('Leseleiter-')

    def prepare(self):
        age = self.item.age
        self.data['age'] = age.split('-')[1]


@Labels.register
class ErzaehlungLabelMaker(LabelMaker):

    category = 'main'
    template = os.path.join(TEMPLATES_DIR, 'erzaehlung.rml')

    @classmethod
    def is_applicable(cls, item):
        return item.subject.startswith('Erzaehlung')

    def prepare(self):
        self.data['big'] = big = self.item.classification.startswith('E/G')
        if big:
            author_abbr = self.item.author[:3]
        # Messed up data once more.
        elif self.item.classification in (u'Erzaehlung',
                                          u'Erzaehlungen',
                                          u'Erzählung'):
            author_abbr = self.item.author[:3]
        else:
            author_abbr = self.item.classification
        self.data['author_abbr'] = author_abbr


@Labels.register
class ComicLabelMaker(LabelMaker):

    category = 'main'
    template = os.path.join(TEMPLATES_DIR, 'comic.rml')

    @classmethod
    def is_applicable(cls, item):
        return item.subject.startswith('Comic')

    def prepare(self):
        sub_cat = self.item.classification
        if sub_cat.startswith('Comic') or sub_cat.startswith('Serie'):
            sub_cat = self.item.seriestitle
        if sub_cat == 'na':
            sub_cat = ''

        self.data['sub_category'] = sub_cat
        self.data['sub_category_abbr'] = sub_cat[:3]
        self.data['sc_font_size'] = 12
        if len(sub_cat) > 10:
            self.data['sc_font_size'] = 12 - 4 * (len(sub_cat)-15) / 10


@Labels.register
class ZeitschriftLabelMaker(LabelMaker):

    category = 'main'
    template = os.path.join(TEMPLATES_DIR, 'zeitschrift.rml')

    @classmethod
    def is_applicable(cls, item):
        return item.subject.startswith('Zeitschrift')


@Labels.register
class HolidayLabelMaker(LabelMaker):

    category = 'main'
    template = os.path.join(TEMPLATES_DIR, 'feiertage.rml')

    holidays = (
        'Fasching',
        'Halloween',
        'Ostern',
        'St. Martin',
        'Weihnachten',
    )

    @classmethod
    def is_applicable(cls, item):
        return item.subject in cls.holidays

    def prepare(self):
        self.data['holiday'] = self.item.subject
        self.data['holiday_initial'] = self.item.subject[0]


@Labels.register
class BilderbuchLabelMaker(LabelMaker):

    category = 'main'
    template = os.path.join(TEMPLATES_DIR, 'bilderbuch.rml')

    classification_to_size = {
        'B/K': u'klein',
        'B/M': u'mittel',
        'B/G': u'groß'
    }

    @classmethod
    def is_applicable(cls, item):
        return item.classification in ('B/K', 'B/M', 'B/G')

    def prepare(self):
        self.data['size'] = self.classification_to_size[
            self.item.classification]


@Labels.register
class BilderbuchWithAuthorLabelMaker(LabelMaker):

    category = 'main'
    template = os.path.join(TEMPLATES_DIR, 'bilderbuch-with-author.rml')

    @classmethod
    def is_applicable(cls, item):
        return (
            item.classification.startswith('B/A') or
            item.classification.startswith('B/K/A'))

    def prepare(self):
        # Sometimes the author or category is listed as part of the
        # classification
        parts = self.item.classification.split(' ', 1)
        if len(parts) == 1:
            classification = parts[0]
            author = self.item.author.split(',')[0]
            author_abbr = author[:3]
        else:
            author = None
            classification, author_abbr = parts

            # Special and crappy case.
            if author_abbr == 'Bilderbuch klein Autor':
                # It turns out that if the book is a series, we use it
                # as the author value! WTF?!
                author = self.item.seriestitle
                if author == 'na':
                    author = self.item.author.split(',')[0]
                author_abbr = author[:3]
            else:
                # It turns out that if the book is a series, we use it
                # as the author value! WTF?!
                # Sometimes it is just a substring too: Mau -> Die Maus
                if author_abbr in self.item.seriestitle:
                    author = self.item.seriestitle
                else:
                    author = self.item.author.split(',')[0]

        self.data['author_abbr'] = author_abbr[:3].upper()
        self.data['author'] = author
        self.data['classification'] = classification


@Labels.register
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
    def is_applicable(cls, item):
        return (
            any([
                item.classification.lower().startswith(topic)
                for topic in cls.topics
            ])
            and
            item.subject.startswith('Bilderbuch'))

    def prepare(self):
        for topic_abbr, topic in self.topics.items():
            if self.item.classification.lower().startswith(topic_abbr):
                break
        self.data['topic_abbr'] = topic_abbr.title()
        self.data['topic'] = topic


@Labels.register
class BoardbookLabelMaker(LabelMaker):

    category = 'main'
    template = os.path.join(TEMPLATES_DIR, 'boardbook.rml')

    @classmethod
    def is_applicable(cls, item):
        return item.classification.startswith('Bb')


@Labels.register
class BarcodeLabelMaker(LabelMaker):

    category = 'barcode'
    template = os.path.join(TEMPLATES_DIR, 'barcode.rml')

    @classmethod
    def is_applicable(cls, item):
        return True


@Labels.register
class PropertyLabelMaker(LabelMaker):

    category = 'property'
    template = os.path.join(TEMPLATES_DIR, 'property.rml')

    class data_schema(zope.interface.Interface):

        year = zope.schema.TextLine(
            title=u'School Year Aquired',
            required=False)

        include_price = zope.schema.Bool(
            title=u'Include Replacement Price',
            default=True,
            required=False)

    @classmethod
    def is_applicable(cls, item):
        return True


@Labels.register
class BarcodeInsideLabelMaker(LabelMaker):

    category = 'barcode-inside'
    template = os.path.join(TEMPLATES_DIR, 'barcode-inside.rml')

    @classmethod
    def is_applicable(cls, item):
        return True


@Labels.register
class CopyrightLabelMaker(LabelMaker):

    category = 'copyright'
    template = os.path.join(TEMPLATES_DIR, 'copyright.rml')

    @classmethod
    def is_applicable(cls, item):
        return True


# -----[ Flask Endpoints ]-----------------------------------------------------

@APP.route("/<barcode>/<category>/label")
def endpoint_create_label(barcode, category):
    item = APP.labels.get_item(barcode)
    data = flask.request.get_json()
    with TemporaryDirectory() as dir:
        pdf_path = os.path.join(dir, 'label.pdf')
        APP.labels.create_label(item, category, data, pdf_path)

        return flask.send_file(pdf_path, mimetype='application/pdf')


@APP.route("/<barcode>/<category>/preview")
def endpoint_preview_label(barcode, category):
    item = APP.labels.get_item(barcode)
    data = flask.request.get_json()
    with TemporaryDirectory() as dir:
        pdf_path = os.path.join(dir, 'label.pdf')
        APP.labels.create_label(item, category, data, pdf_path)
        png_path = APP.labels.preview_label(pdf_path)

        return flask.send_file(png_path, mimetype='image/png')


@APP.route("/<barcode>/<category>/print")
def endpoint_print_label(barcode, category):
    item = APP.labels.get_item(barcode)
    data = flask.request.get_json()
    with TemporaryDirectory() as dir:
        pdf_path = os.path.join(dir, 'label.pdf')
        APP.labels.create_label(item, category, data, pdf_path)
        APP.labels.print_label(pdf_path)
    return 'Ok'


@APP.route("/<barcode>/categories")
def endpoint_categories(barcode):
    item = APP.labels.get_item(barcode)
    categories = APP.labels.list_categories(item)
    return flask.jsonify({'categories': categories})


@APP.route("/<barcode>/<category>/details")
def endpoint_category_details(barcode, category):
    item = APP.labels.get_item(barcode)
    details = APP.labels.get_category_details(item, category)
    return flask.jsonify(details)


# -----[ Command Line Interface ]----------------------------------------------


def cli_create(args):
    labels = Labels()

    # 1. Get the item.
    item = labels.get_item(args.barcode)

    # 2. Create the label.
    out_fn = args.output
    if out_fn is None:
        out_fn = 'label-%s.pdf' % args.barcode
    out_fn = labels.create_label(
        item, category=args.category, data=args.data, pdf_path=out_fn)

    # 3. If requested, create preview PNG.
    if args.aspng:
        labels.preview_label(out_fn)

    # 4. If requested, print label.
    if args.doprint:
        labels.print_label(out_fn)


def cli_list(args):
    labels = Labels()

    # 1. Get the item.
    item = labels.get_item(args.barcode)

    # 2. Compute all available categories for the item.
    categories = labels.list_categories(item)

    # 3. Output the categories in the requested format.
    if args.json:
        print json.dumps({'categories': categories})
    else:
        print '\n'.join(categories)


def cli_details(args):
    labels = Labels()

    # 1. Get the item.
    item = labels.get_item(args.barcode)

    # 2. Get the category information.
    details = labels.get_category_details(item, args.category)

    # 3. Output the details in the requested format.
    if args.json:
        print json.dumps(details)
    else:
        pprint.pprint(details)


def cli_serve(args):
    APP.labels = Labels()
    config = APP.labels.config['label-server']
    APP.run(
        host=args.host \
            if args.host is not None else config.get('host', '0.0.0.0'),
        port=args.port \
            if args.port is not None else config.get('port', 3001))


parser = argparse.ArgumentParser(
    description='Create or print a PDF label for a given library item.')
subparsers = parser.add_subparsers(
    title='Available sub-commands')

create_parser = subparsers.add_parser(
    'create', help='Create a label.')
create_parser.set_defaults(func=cli_create)
create_parser.add_argument(
    'barcode',
    help='The barcode of the library item.')
create_parser.add_argument(
    '--category', '-c', dest='category', default=None,
    help='Specifies the category of label to use.')
create_parser.add_argument(
    '--print', '-p', dest='doprint', default=False, action='store_true',
    help='When specifed, the label is sent directly to the printer.'
    )
create_parser.add_argument(
    '--png', '-i', dest='aspng', default=False, action='store_true',
    help='When specifed, a PNG file is also created.'
    )
create_parser.add_argument(
    '--out', '-o', dest='output',
    help='The output filename of the generated label PDF.')
create_parser.add_argument(
    '--data', '-d', dest='data', type=json.loads, default=None,
    help='Additional data needed to render the label.')
create_parser.add_argument(
    '--verbose', '-v', dest='verbose', action='store_true')


list_parser = subparsers.add_parser(
    'list', help='List all categories available for the given item.')
list_parser.set_defaults(func=cli_list)
list_parser.add_argument(
    'barcode',
    help='The barcode of the library item.')
list_parser.add_argument(
    '--verbose', '-v', dest='verbose', action='store_true')
list_parser.add_argument(
    '--json', dest='json', action='store_true',
    help='Returns the result as JSON string.')


details_parser = subparsers.add_parser(
    'details', help='Provides details about a specific category.')
details_parser.set_defaults(func=cli_details)
details_parser.add_argument(
    'barcode',
    help='The barcode of the library item.')
details_parser.add_argument(
    '--category', '-c', dest='category', default=None,
    help='Specifies the category of label to use.')
details_parser.add_argument(
    '--verbose', '-v', dest='verbose', action='store_true')
details_parser.add_argument(
    '--json', dest='json', action='store_true',
    help='Returns the result as JSON string.')


serve_parser = subparsers.add_parser(
    'serve', help='Start the Label Maker HTTP microservice.')
serve_parser.set_defaults(func=cli_serve)
serve_parser.add_argument(
    '--host', '-H', dest='host',
    help='Network Interface of HTTP server.')
serve_parser.add_argument(
    '--port', '-p', dest='port', type=int,
    help='Port of HTTP server.')


def main(argv=sys.argv[1:]):
    args = parser.parse_args(argv)
    args.func(args)


if __name__ == '__main__':
    main()
