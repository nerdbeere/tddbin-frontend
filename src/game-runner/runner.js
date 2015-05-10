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
    this._isVictory = false;
  }

  render(noAutoplay) {
    var snapshot = this._snapshots[this._currentSnapshot];
    if(!snapshot && this._snapshots.length > 0) {
      snapshot = this._snapshots[this._snapshots.length - 1];
    }
    React.render(
      <PlayingField
        onNext={this.onNext.bind(this)}
        onPrevious={this.onPrevious.bind(this)}
        onPlay={this.onPlay.bind(this)}
        onPause={this.onPause.bind(this)}
        isPlaying={this._playing}
        snapshot={snapshot}
        victory={this._isVictory}
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

    const levelConfig = {
      startCredits: 100,
      towerCosts: 60,
      minionTarget: [15, 55],
      spawners: [
        {
          spawnLocation: [15, 1],
          minionConfig: [{
            health: 100
          }, {
            health: 100
          }, {
            health: 100
          }, {
            health: 100
          }, {
            health: 100
          }, {
            health: 100
          }, {
            health: 100
          }, {
            health: 100
          }, {
            health: 100
          }]
        }
      ],
      maxMinionsToReachTarget: 5
    };

    var game = new Game(levelConfig, sourceCode);
    this._isVictory = game.isVictory();
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

  onPause() {
    this.stop();
    this.render(true);
  }

  onPrevious() {
    this.stop();
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
