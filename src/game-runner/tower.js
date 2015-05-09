import Victor from 'victor';

export default class Tower {
  constructor(x, y) {
    this._position = new Victor(x, y);
    console.log('new tower at', x, y);
    this._range = 6;
    this._target = null;
    this._damage = 10;
  }

  tick(minions) {

    if(this._hasTarget() && this._targetIsOutOfRange()) {
      this._clearTarget();
    }

    if(!this._hasTarget()) {
      this._findTarget(minions);
    }

    if(this._hasTarget()) {
      return this._damageTarget();
    }

    return null;
  }

  _hasTarget() {
    return !!this._target;
  }

  _findTarget(minions) {
    var newTarget = null;
    var newTargetDistance = Infinity;
    minions.forEach(function(minion) {
      if(minion.isDead()) {
        return;
      }
      var distanceToMinion = this._position.distance(minion.getPosition());
      if(distanceToMinion <= this._range && distanceToMinion < newTargetDistance) {
        newTargetDistance = distanceToMinion;
        newTarget = minion;
      }
    }.bind(this));

    console.log('Tower new target', newTarget, newTargetDistance);

    this._target = newTarget;
  }

  _damageTarget() {
    this._target.takeDamage(this._damage);
    var killedMinion = null;
    if(this._target.isDead()) {
      killedMinion = this._target;
      this._clearTarget();
    }
    return killedMinion;
  }

  _targetIsOutOfRange() {
    var distanceToTarget = this._position.distance(this._target.getPosition());
    return distanceToTarget > this._range;
  }

  _clearTarget() {
    this._target = null;
  }

  getSnapshot() {
    return {
      position: this._position,
      range: this._range,
      damage: this._damage
    };
  }
}
