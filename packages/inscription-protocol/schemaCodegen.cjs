#!/usr/bin/env node

const { exit } = require('process');
const fs = require('fs');
const tsGen = require('json-schema-to-typescript');
const http = require('https');
const path = require('path');

tsGen.DEFAULT_OPTIONS.bannerComment = `
/* eslint-disable */
// prettier-ignore
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
`;

const tsOut = path.resolve('./src/data/inscription.ts');
var schemaUri =
  'https://jenkins.ivyteam.io/job/core_json-schema/job/master/lastSuccessfulBuild/artifact/workspace/ch.ivyteam.ivy.inscription.lsp.schema/target/schema/process/13.1.0/inscription.json';

const args = process.argv.slice(2);
if (args.length > 0) {
  if (args[0] === 'clean') {
    console.log('cleaning ' + tsOut);
    if (fs.existsSync(tsOut)) {
      fs.unlinkSync(tsOut);
    }
    exit(0);
  }
  schemaUri = args[0];
}

function loadJson(uri) {
  console.log(`loading ${uri}`);
  const download = new Promise(result =>
    http.get(uri, res => {
      res.setEncoding('utf8');
      let body = '';
      res.on('data', data => {
        body += data;
      });
      res.on('end', () => {
        body = JSON.parse(body);
        result(body);
      });
    })
  );
  return download;
}

function writeSrc(ts) {
  let nonNullTs = ts.replace(/\?:/g, ':');
  nonNullTs = nonNullTs.replace(/:(.*) \| null/g, '?:$1');
  fs.writeFileSync(tsOut, nonNullTs);
  console.log(`generated ${tsOut}`);
}

if (schemaUri.startsWith('http')) {
  loadJson(schemaUri)
    .then(schema => tsGen.compile(schema, 'inscription'))
    .then(ts => writeSrc(ts));
} else {
  tsGen.compileFromFile(schemaUri).then(ts => writeSrc(ts));
}
