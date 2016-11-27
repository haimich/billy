#!/bin/bash
set -e

CHECKOUT_DIR=checkout

rm -rf $CHECKOUT_DIR
git clone git@github.com:haimich/billy.git $CHECKOUT_DIR
cd $CHECKOUT_DIR
npm install
npm run setup
npm run build
npm test
rm -rf node_modules
npm install --production
npm run rebuild
npm run publish:mac