require('svelte/register');
const showdown = require('showdown');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const AppComponent = require('./src/App.svelte').default;
const Model = require('./Model');

// make github compatible:
// Build your own `compiler` -> build-your-own-compiler
const converter = new showdown.Converter({ ghCompatibleHeaderId: true });

const content = fs.readFileSync(path.resolve(__dirname, 'README.md'));

const model = new Model(converter.makeHtml(content.toString()));

const { html, head } = AppComponent.render({
  data: model.serialize(),
});

ejs
  .renderFile(path.resolve(__dirname, 'public', './index.ejs'), {
    html,
    head,
    data: model.toJSON(),
    lang: 'zh-TW',
  })
  .then((html) => {
    fs.writeFileSync(path.resolve(__dirname, 'public', 'index.html'), html, {
      encoding: 'utf8',
    });
  });
