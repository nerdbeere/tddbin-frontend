import React from 'react';
import Game from './game.js';
import PlayingField from './component/playing-field.js';

export default class TestRunner {

  constructor(domNode) {
    this._domNode = domNode;
    this._snapshots = [];
    this._currentSnapshot = 0;
    this._autoPlayTimeout = 300;
    this._stop = false;
    this._playing = false;
  }

  render(noAutoplay) {
    React.render(
      <PlayingField
        onNext={this.onNext.bind(this)}
        onPrevious={this.onPrevious.bind(this)}
        onPlay={this.onPlay.bind(this)}
        snapshot={this._snapshots[this._currentSnapshot]}
      ></PlayingField>,
      this._domNode
    );

    if(noAutoplay !== true) {
      setTimeout(this.play.bind(this), this._autoPlayTimeout);
    }
  }

  play() {
    if(this._playing) {
      return false;
    }
    this._stop = false;
    this._playing = true;
    var that = this;
    (function playLoop() {
      if(!that._stop && that._currentSnapshot < that._snapshots.length - 1) {
        setTimeout(playLoop, that._autoPlayTimeout);
      } else {
        that.stop();
        return;
      }
      that._next();
      that.render(true);
    })();
  }

  stop() {
    this._stop = true;
    this._playing = false;
  }

  send(sourceCode) {
    var game = new Game(sourceCode);
    this._snapshots = game.getSnapshots();
    this.render();
  }

  onNext() {
    this.stop();
    this._next();
    this.render(true);
  }

  _next() {
    if(this._currentSnapshot === this._snapshots.length - 1) {
      return false;
    }
    this._currentSnapshot++;
  }

  _previous() {
    if(this._currentSnapshot === 0) {
      return false;
    }
    this._currentSnapshot--;
  }

  onPlay() {
    this.play();
  }

  onPrevious() {
    this._previous();
    this.render(true);
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
