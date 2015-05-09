import React from 'react';

export default class Minion extends React.Component {

  render() {
    const {minion} = this.props;

    const divStyle = {
      left: minion.position.x * 10,
      top: minion.position.y * 10
    };

    const healthPercent = minion.health * 100 / minion.maxHealth;

    const healthStyle = {
      top: (100 - healthPercent) / 10
    };

    var classes = ['minion'];

    if(minion.isDead) {
      classes.push('dead');
    }

    return (
      <div style={divStyle} className={classes.join(' ')}>
        <div className="health" style={healthStyle}></div>
      </div>
    );
  }

}
