import Ace from './_external-deps/ace.js';

export default class Editor {

  constructor(domNodeId) {
    this.ace = new Ace();
    this.ace.setDomNodeId(domNodeId);
    this.ace._editor.setTheme('ace/theme/twilight');
  }

  setContent(content) {
    this.ace.setContent(content);
  }

  getContent() {
    return this.ace.getContent();
  }

}
