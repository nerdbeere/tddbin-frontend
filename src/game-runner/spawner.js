import Minion from './minion.js';

export default class Spawner {
  constructor(spawnLocation, target, minionConfig) {
    this._position = spawnLocation;
    this._target = target;
    this._minionConfig = minionConfig;
    this._minions = [];
    this._spawnedLastTick = false;
  }

  _spawn() {
    if(this._minionConfig.length === 0) {
      return false;
    }
    var minionConfig = this._minionConfig.shift();
    var minion = new Minion(this._position, this._target, minionConfig);
    this._minions.push(minion);
    this._spawnedLastTick = true;
  }

  tick() {
    if(this._spawnedLastTick) {
      this._spawnedLastTick = false;
      return;
    }
    this._spawn();
  }

  getMinions() {
    return this._minions;
  }
}
