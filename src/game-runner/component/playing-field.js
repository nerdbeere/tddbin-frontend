import React from 'react';
import Minion from './minion.js';
import Tower from './tower.js';

export default class PlayingField extends React.Component {

  render() {
    const {snapshot, onNext, onPrevious} = this.props;

    if(!snapshot) {
      return <div>
        Game did not run
      </div>;
    }

    console.log(snapshot);
    const minions = snapshot.minions.map(function(minion) {
      return <Minion minion={minion}></Minion>
    });
    const towers = snapshot.towers.map(function(tower) {
      return <Tower tower={tower}></Tower>
    });

    return (
      <div className="playing-field-container">
        <div className="frame-meta-data">
          <span>Frame: {snapshot.frame}</span>
          <span>Credits: {snapshot.credits}</span>
          <span>Minions reached target: {snapshot.minionsReachedTarget}</span>
        </div>
        <div className="playing-field">
          {minions}
          {towers}
        </div>
        <div className="controls">
          <button onClick={onPrevious}>previous</button>
          <button onClick={onNext}>next</button>
        </div>
      </div>
    );
  }

}
