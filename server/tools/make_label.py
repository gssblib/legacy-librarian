import sys
import lxml.etree
import z3c.rml.document
import jinja2
import mysql.connector

TEMPLATE = 'label-templates/leseleiter.rml'

ITEM_SQL = 'select * from items where barcode = %s'

conn =  mysql.connector.connect(
    host='localhost',
    user='gssb',
    password='gssblib',
    db='spils')

cursor = conn.cursor()
cursor.execute(ITEM_SQL % sys.argv[1])
item = cursor.fetchone()

print item

# Assume Leseleiter.
# Look up classification.
classification = item[8]
if not classification.startswith('Leseleiter-'):
    print 'Book not found: %s' % sys.argv[1]
    sys.exit(1)

age = classification.split('-')[1]

with open(TEMPLATE, 'r') as file:
    template = jinja2.Template(file.read())
rml = template.render(age=age)

root = lxml.etree.fromstring(rml.encode('utf-8'))
doc = z3c.rml.document.Document(root)

with open('sample.pdf', 'w') as file:
    doc.process(file)
