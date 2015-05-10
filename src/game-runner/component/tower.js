import React from 'react';

export default class Tower extends React.Component {

  render() {
    const {tower} = this.props;

    var towerStyle = {
      left: tower.position.x * 10,
      top: tower.position.y * 10,
      transform: `rotate(${tower.angle * -1}deg)`
    };

    const visibleRange = tower.range * 10;

    var rangeStyle = {
      width: visibleRange * 2,
      height: visibleRange * 2,
      left: -(visibleRange) + 5,
      top: -(visibleRange) + 5
    };

    return (
      <div style={towerStyle} className="tower">
        <div className="range" style={rangeStyle}></div>
        <div className="cannon"></div>
      </div>
    );
  }

}
