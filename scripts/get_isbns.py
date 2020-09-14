import pymysql
import re
import requests
from bs4 import BeautifulSoup
from rapidfuzz import fuzz

# INSERT INTO table1 VALUES(1, LOAD_FILE('data.png'));

ISBNDB_KEY = 'I19JI9RZ'


def clean(str):
    for char in ':,!':
        str = str.replace(char, '')
    return str


def match_class(target):
    def do_match(tag):
        classes = tag.get('class', [])
        return all(c in classes for c in target)
    return do_match


def find_openlib_results(title, author):
    print 'Open Library Results'
    res = requests.get(
        'http://openlibrary.org/search.json',
        {'title': clean(title), 'author': clean(author)})
    if res.status_code != 200:
        print '  WARNING: Book not found: %s' % res.reason
        return
    json = res.json()
    for doc in json['docs']:
        print '  - %s' % doc['title']
        print '    Authors: %s' % ', '.join(doc['author_name'])
        print '    Pub Year: %s' % ', '.join([str(y) for y in doc['publish_year']])
        print '    ISBNS: %s' % ', '.join(doc['isbn'])
    if not json['docs']:
        print '  NONE'
    print

def find_isbndb_results(title, author):
    print 'ISBN DB Results'
    res = requests.get(
        'http://isbndb.com/api/v2/json/%s/books' % ISBNDB_KEY,
        {'q': '%s %s' % (clean(title), clean(author))})
    if res.status_code != 200:
        print '  WARNING: Book not found: ' + res.reason
        return
    json = res.json()
    docs = [(fuzz.ratio(d['title'], title), d) for d in json['data']]
    # Filter out ridiculous matches.
    docs = [doc for doc in docs if doc[0] > 40]
    # RESULTS LIMITED TO THE FIRST 3 MATCHING TITLE BEST.
    for m, doc in docs[:3]:
        print '  - %s' % doc['title']
        print '    Authors: %s' % ', '.join(a['name'] for a in doc['author_data'])
        print '    Pub Year: %s' % doc['edition_info']
        print '    ISBNS: %s, %s' % (doc['isbn10'], doc['isbn13'])
    if not docs:
        print '  NONE'
    print


def find_antolin_results(title, author):
    print 'Antolin Results'
    res = requests.get(
        'https://www.antolin.de/booksearch.do',
        {'target': 'html', 'keywords': title, 'author': author})
    soup = BeautifulSoup(res.text, 'html.parser')
    elems = soup.find_all(match_class(["var_searchresult_link"]))
    # RESULTS CAPPED AT 2!
    for elem in elems[:2]:
        res = requests.get(
            'https://www.antolin.de' + elem['href'])
        bsoup = BeautifulSoup(res.text, 'html.parser')
        title = bsoup.select('div.result_body h2 span.red b')
        if title:
            print '  - %s' % title[0].text
        else:
            print '  - TITLE NOT FOUND'

        isbns = re.findall('ISBN-1. [0-9-]{10,13}', res.text)
        print '    ISBNS: %s' % ', '.join(isbns)
        imgs = bsoup.find_all(lambda t: t.get('alt') == 'Buch-Cover')
        if imgs:
            print '    Image: %s' % imgs[0]['src']
    if not elems:
        print '  NONE'
    print


def find_amazon_results(title, author):
    headers = {'User-agent': 'Mozilla/5.0'}
    print 'Amazon Results'
    res = requests.get(
        'https://www.amazon.de/s/ref=nb_sb_noss',
        {'url': 'search-alias=stripbooks', 'field-title': title},
        headers=headers)
    if res.status_code != 200:
        print '  WARNING: Book not found: %s' % res.reason
        return
    soup = BeautifulSoup(res.text, 'html.parser')
    elems = soup.select('li.s-result-item a.s-access-detail-page')
    # RESULTS CAPPED AT 2!
    for elem in elems[:2]:
        res = requests.get(elem['href'], headers=headers)
        bsoup = BeautifulSoup(res.text, 'html.parser')
        etitle = bsoup.select('span[id="productTitle"]')
        if etitle:
            print '  - %s' % etitle[0].text
        else:
            print '  - TITLE NOT FOUND'
        isbn10_elems = list(bsoup(text=re.compile(r'ISBN-10')))
        if isbn10_elems:
            isbn10 = tuple(isbn10_elems[0].parent.parent.children)[1].strip()
            print '    ISBN10: %s' % isbn10
        isbn13_elems = list(bsoup(text=re.compile(r'ISBN-13')))
        if isbn13_elems:
            isbn13 = tuple(isbn13_elems[0].parent.parent.children)[1].strip()
            print '    ISBN13: %s' % isbn13

        imgs = bsoup.select('img.frontImage')
        if imgs:
            print '    Image: %s' % imgs[0]['src'][:30].strip()
    if not elems:
        print '  NONE'
    print


def find_isbns():
    conn = pymysql.connect(user='gssb', password='gssblib', database='spils')
    cur = conn.cursor()
    cur.execute('select title, author from items limit 1')

    for item in cur.fetchall():
        title, author = item
        print '-'*78
        print title
        print author
        print
        find_openlib_results(title, author)
        find_isbndb_results(title, author)
        find_antolin_results(title, author)
        find_amazon_results(title, author)

if __name__ == '__main__':
    find_isbns()
