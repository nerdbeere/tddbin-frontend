import React from 'react';
import Minion from './minion.js';
import Tower from './tower.js';
import Point from './point.js';

export default class PlayingField extends React.Component {

  render() {
    const {
      snapshot,
      onNext,
      onPrevious,
      onPlay,
      onPause,
      isPlaying,
      victory
    } = this.props;

    if(!snapshot) {
      return <div>
        Game did not run
      </div>;
    }

    var victoryOrDefeat = <div className="outcome defeat">
      Defeat
    </div>;
    if(victory) {
      victoryOrDefeat = <div className="outcome victory">
        Victory
      </div>;
    }

    const minions = snapshot.minions.map(function(minion) {
      return <Minion minion={minion}></Minion>;
    });
    const towers = snapshot.towers.map(function(tower) {
      return <Tower tower={tower}></Tower>;
    });

    const path = snapshot.path.map(function(point) {
      return <Point point={point}></Point>
    });

    var playOrPause = <button onClick={onPlay}>
      <i className="fa fa-play"></i>
    </button>;

    if(isPlaying) {
      playOrPause = <button onClick={onPause}>
        <i className="fa fa-pause"></i>
      </button>;
    }

    return (
      <div className="playing-field-container">
        {victoryOrDefeat}
        <div className="frame-meta-data">
          <span>Frame: {snapshot.frame}</span>
          <span>Credits: {snapshot.credits}</span>
          <span>Minions reached target: {snapshot.minionsReachedTarget}</span>
        </div>
        <div className="playing-field">
          {path}
          {minions}
          {towers}
        </div>
        <div className="controls">
          <button onClick={onPrevious}>
            <i className="fa fa-chevron-left"></i>&nbsp;
          </button>
          {playOrPause}
          <button onClick={onNext}>
            <i className="fa fa-chevron-right"></i>
          </button>
        </div>
      </div>
    );
  }

}
