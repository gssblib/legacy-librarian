#!/usr/bin/env node
/**
 * Node.js script setting the has_cover_image flags in the items table by
 * looking for the cover image files in the `covers` directory (as configured
 * in the node config).
 */
const fs = require('fs'),
      path = require('path'),
      config = require('config'),
      crypto = require('crypto'),
      mysql = require('mysql'),
      mysqlq = require('../lib/mysqlq'),
      db = mysqlq(mysql.createPool(config.get('db')));

var img_root_path = config['resources']['covers'];
if (img_root_path[0] != '/') {
  img_root_path = __dirname + '/../' + img_root_path;
}

function resetHasCoverImage() {
  return db.query('update items set has_cover_image = 0');
}

function setHasCoverImage(barcodes) {
  return db.query(
    'update items set has_cover_image = 1 where barcode in (?)', [barcodes]);
}

function main() {
  resetHasCoverImage().then(() => {
    fs.readdir(img_root_path, (err, files) => {
      const barcodes = files.map(file => path.basename(file, '.jpg'));
      console.log(`found ${barcodes.length} images`);
      setHasCoverImage(barcodes).then(
        () => {
          console.log('set cover image flags');
        },
        err => console.log('failure:', err)
      ).fin(() => {
        db.pool.end();
      });
    });
  });
}

main();
