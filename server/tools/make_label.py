import argparse
import jinja2
import json
import lxml.etree
import mysql.connector
import os
import pprint
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
    def is_applicable(self, item, data=None):
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
    def is_applicable(self, item, data=None):
        return item['age'].startswith('Leseleiter-')

    def prepare(self):
        age = self.item['age']
        if not age.startswith('Leseleiter-'):
            raise ValueError('Leseleiter age not found in "%s"' % age)
        self.data['age'] = age.split('-')[1]


def get_label_maker(item, category=None, data=None):
    for maker_class in REGISTRY:
        if category is not None and maker_class.category != category:
            continue
        if not maker_class.is_applicable(item, data):
            continue
        return maker_class(item, data)


def get_db_connection():
    config = common.get_json_config(os.environ['NODE_ENV'])
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
    '--print', '-p', dest='print', default=False, action='store_true',
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

    conn = get_db_connection()
    item = get_item(conn, args.barcode)

    if args.verbose:
        print 'Item:'
        pprint.pprint(item)

    label_maker = get_label_maker(item, args.category, args.data)
    if args.verbose:
        print 'Label Maker:', label_maker.__class__.__name__

    out_fn = args.output
    if out_fn is None:
        out_fn = 'label-%s.pdf' % args.barcode
    if args.verbose:
        print 'Output Filename:', out_fn

    label_maker.render(out_fn)


if __name__ == '__main__':
    main()
