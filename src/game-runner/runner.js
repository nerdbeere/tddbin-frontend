import React from 'react';
import Game from './game.js';
import PlayingField from './component/playing-field.js';

export default class TestRunner {

  constructor(domNode) {
    this._domNode = domNode;
    this._snapshots = [];
    this._currentSnapshot = 0;
  }

  render() {
    React.render(
      <PlayingField
        onNext={this.onNext.bind(this)}
        onPrevious={this.onPrevious.bind(this)}
        snapshot={this._snapshots[this._currentSnapshot]}
      ></PlayingField>,
      this._domNode
    )
  }

  send(sourceCode) {
    var game = new Game(sourceCode);
    this._snapshots = game.getSnapshots();
    this.render();
  }

  onNext() {
    if(this._currentSnapshot === this._snapshots.length - 1) {
      return false;
    }
    this._currentSnapshot++;
    this.render();
  }

  onPrevious() {
    if(this._currentSnapshot === 0) {
      return false;
    }
    this._currentSnapshot--;
    this.render();
  }

  onStats(fn) {
    this._onStats = fn;
  }

  handleDataReceived(data) {
    if (this._onStats) {
      var stats = data.data;
      this._onStats(stats);
    }
  }

}
