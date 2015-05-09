import Victor from 'victor';
import PF from 'pathfinding';

export default class Minion {
  constructor(spawnLocation, target, minionConfig) {
    this._position = spawnLocation;
    this._target = target;
    this._health = minionConfig.health || 100;
    this._maxHealth = this._health;
  }

  isDead() {
    return this._health === 0;
  }

  reachedTarget() {
    return this._position.distance(this._target) === 0;
  }

  tick(grid) {
    if(this.isDead() || this.reachedTarget()) {
      return false;
    }
    var clonedGrid = grid.clone();
    var finder = new PF.AStarFinder();
    var path = finder.findPath(
      this._position.x,
      this._position.y,
      this._target.x,
      this._target.y,
      clonedGrid
    );

    const position = new Victor(path[1][0], path[1][1]);
    this._move(position);
  }

  getPosition() {
    return this._position;
  }

  takeDamage(damage) {
    console.log('minion takes damage');
    this._health -= damage;
    if (this._health < 0) {
      this._health = 0;
    }
  }

  _move(position) {
    this._oldPosition = this._position;
    this._position = position;
  }

  getSnapshot() {
    return {
      position: this._position,
      oldPosition: this._oldPosition,
      health: this._health,
      maxHealth: this._maxHealth,
      isDead: this.isDead()
    };
  }
}
