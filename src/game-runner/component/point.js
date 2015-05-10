import React from 'react';

export default class Tower extends React.Component {

  render() {
    const {point} = this.props;
    const [x, y] = point;

    var pointStyle = {
      left: x * 10,
      top: y * 10
    };

    return (
      <div style={pointStyle} className="point">
      </div>
    );
  }

}
