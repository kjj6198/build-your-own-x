const { JSDOM } = require('jsdom');

class Model {
  constructor(html) {
    this.html = html;
    this.dom = new JSDOM(html);
  }

  getCategories() {
    const { window } = this.dom;
    return Array.from(window.document.querySelectorAll('h4')).map((elm) => ({
      text: elm.textContent,
      id: elm.id,
      posts: this.getPosts(elm.id),
      totalCount: this.getPosts(elm.id).length,
    }));
  }

  getPosts(category) {
    const { window } = this.dom;
    return Array.from(
      window.document.querySelectorAll(`#${category} + ul > li > a`)
    ).map((elm) => ({
      title: elm.textContent,
      language: elm.querySelector('strong')
        ? elm.querySelector('strong').textContent
        : '',
      href: elm.getAttribute('href'),
    }));
  }

  getTableOfContent() {
    const { window } = this.dom;
    return Array.from(
      window.document.querySelectorAll('h2#table-of-contents + ul > li a')
    ).map((elm) => ({
      id: elm.getAttribute('href'),
      title: elm.textContent,
    }));
  }

  getLanguages() {
    const { window } = this.dom;
    return [
      ...new Set(
        Array.from(window.document.querySelectorAll('a[href^="http"]'))
          .map((elm) =>
            elm.querySelector('strong')
              ? elm.querySelector('strong').textContent
              : ''
          )
          .filter((lang) => !!lang)
      ),
    ];
  }

  serialize() {
    return {
      tableOfContent: this.getTableOfContent(),
      categories: this.getCategories(),
      languages: this.getLanguages(),
    };
  }

  toJSON() {
    return JSON.stringify(this.serialize());
  }
}

module.exports = Model;
