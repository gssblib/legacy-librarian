import json
import lxml.etree
import os
import pymysql
import re
import requests
import sys
import time
from bs4 import BeautifulSoup
from captcha_solver import CaptchaSolver
from collections import OrderedDict

session = requests.Session()
session.headers.update(
    {'User-agent': 'Mozilla/5.0'})


def save_image(url, barcode, covers_dir):
    img_path = os.path.join(covers_dir, barcode+'.jpg')
    res = session.get(url)
    with open(img_path, 'wb') as file:
        file.write(res.content)


def handle_captcha(res):
    if 'validateCaptcha' not in res.text:
        return res
    print '='*78
    with open('captcha.html', 'w') as file:
        file.write(res.content)
    soup = BeautifulSoup(res.text, 'html.parser')
    elems = soup.select('form img')
    fields = {
        elem.attrs['name']: elem.attrs['value']
        for elem in soup.select('form input[type="hidden"]')
    }
    print 'Image: ' + elems[0].attrs['src']
    img = session.get(elems[0].attrs['src'])
    with open('captcha.jpg', 'wb') as file:
        file.write(img.content)
    solver = CaptchaSolver('browser')
    fields['field-keywords'] = solver.solve_captcha(img.content).upper()
    res = session.get(
        'https://www.amazon.de/errors/validateCaptcha',
        params=fields)
    print '='*78
    return handle_captcha(res)


def find_amazon_results(isbn, title, author, barcode, covers_dir):
    print 'Amazon Results'
    res = session.get(
        'https://www.amazon.de/s/ref=nb_sb_noss',
        params={'url': 'search-alias=stripbooks', 'field-isbn': isbn},
        )
    if res.status_code != 200:
        print '  WARNING: Book not found: %s' % res.reason
        return
    handle_captcha(res)
    soup = BeautifulSoup(res.text, 'html.parser')
    elems = soup.select('li.s-result-item a.s-access-detail-page')
    if not elems:
        print '  Book not found by ISBN, trying title and author.'
        res = session.get(
            'https://www.amazon.de/s/ref=nb_sb_noss',
            params={'url': 'search-alias=stripbooks',
                    'field-title': title, 'field-author': author},
            )
        if res.status_code != 200:
            print '  WARNING: Book not found: %s' % res.reason
            return
        handle_captcha(res)
        soup = BeautifulSoup(res.text, 'html.parser')
        elems = soup.select('li.s-result-item a.s-access-detail-page')
    saved = False
    # RESULTS CAPPED AT 2!
    for elem in elems[:1]:
        res = session.get(elem['href'])
        handle_captcha(res)
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
            isbn13 = str(
                tuple(isbn13_elems[0].parent.parent.children)[1]).strip()
            print '    ISBN13: %s' % isbn13

        imgs = bsoup.select('img.frontImage')
        if imgs:
            img_json = json.loads(imgs[0].attrs['data-a-dynamic-image'])
            print '    Images:'
            for url, (x, y) in img_json.items():
                print '      %s: %i x %i' % (url, x, y)
            url_map = sorted((x*y, url) for url, (x, y) in img_json.items())
            # Select largest iamge
            img_url = url_map[-1][1]
            save_image(img_url, barcode, covers_dir)
            saved = True
    if not elems or not saved:
        # Write an empty image, so we do not have to keep retrying it later,
        # especially now that we handle captchas properly.
        img_path = os.path.join(covers_dir, barcode+'.jpg')
        with open(img_path, 'wb') as file:
            file.write('')
        print '  NONE'
    print


def find_amazon_dvd_results(title, barcode, covers_dir):
    print 'Amazon Results'
    res = session.get(
        'https://www.amazon.de/s/ref=nb_sb_noss',
        params={'url': 'search-alias=dvd', 'field-keywords': title},
        )
    if res.status_code != 200:
        print '  WARNING: Book not found: %s' % res.reason
        return
    res = handle_captcha(res)
    soup = BeautifulSoup(res.text, 'html.parser')
    elems = soup.select('li.s-result-item a.s-access-detail-page')

    saved = False
    for elem in elems[:2]:
        try:
            res = session.get(elem['href'])
        except:
            continue
        res = handle_captcha(res)
        bsoup = BeautifulSoup(res.text, 'html.parser')
        etitle = bsoup.select('span[id="productTitle"]')
        if etitle:
            print '  - %s' % etitle[0].text.strip()
        else:
            print '  - TITLE NOT FOUND'

        imgs = bsoup.select('#landingImage')
        if imgs:
            img_json = json.loads(
                imgs[0].attrs['data-a-dynamic-image'],
                object_pairs_hook=OrderedDict)
            print '    Images:'
            for url, (x, y) in img_json.items():
                print '      %s: %i x %i' % (url, x, y)
            # Select largest iamge
            img_url = img_json.keys()[0]
            save_image(img_url, barcode, covers_dir)
            saved = True
            break

    if not elems or not saved:
        # Write an empty image, so we do not have to keep retrying it later,
        # especially now that we handle captchas properly.
        img_path = os.path.join(covers_dir, barcode+'.jpg')
        with open(img_path, 'wb') as file:
            file.write('')
        print '  NONE'
    print


def find_covers(covers_dir):
    conn = pymysql.connect(user='gssb', password='gssblib', database='spils')
    cur = conn.cursor()
    # Books
    #cur.execute(
    #    'select barcode, title, author, isbn10, isbn13 from items '
    #    'where isbn10 is not null or isbn13 is not null '
    #)
    #for item in cur.fetchall():
    #    barcode, title, author, isbn10, isbn13 = item
    #    isbn = isbn10 or isbn13
    #    print '-'*78
    #    print '%s [%s] - %s' % (title, author, isbn)
    #    if barcode+'.jpg' in os.listdir(covers_dir):
    #        print '  Skipping, have already cover.'
    #        continue
    #    print
    #    find_amazon_results(
    #        isbn, title, author, barcode, covers_dir)

    # DVDs
    cur.execute(
        "select barcode, title from items where subject = 'DVD'"
        #"limit 10"
    )
    for item in cur.fetchall():
        barcode, title = item
        print '-'*78
        print barcode, title
        if barcode+'.jpg' in os.listdir(covers_dir):
            print '  Skipping, have already cover.'
            continue
        print
        find_amazon_dvd_results(title, barcode, covers_dir)

if __name__ == '__main__':
    find_covers(sys.argv[1])
