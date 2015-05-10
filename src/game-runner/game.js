import Tower from './tower.js';
import Spawner from './spawner.js';
import PF from 'pathfinding';
import Victor from 'victor';

class SpawnerCollection {
  constructor() {
    this._spawners = [];
  }
  push(spawner) {
    this._spawners.push(spawner);
  }
  getMinions() {
    var minions = [];
    this._spawners.forEach(function(spawner) {
      minions = minions.concat(spawner.getMinions());
    });
    return minions;
  }
  tick() {
    this._spawners.forEach(function(spawner) {
      spawner.tick();
    });
  }
}

export default class Game {

  constructor(levelConfig, playerSourceCode) {
    this._snapshots = [];
    this._simulate(levelConfig, playerSourceCode);
    global.pf = PF;
  }

  getSnapshots() {
    return this._snapshots;
  }

  isVictory() {
    return this._isVictory;
  }

  _executePlayerCode(playerSourceCode) {
    const publicApi = this._getPublicApi();
    const sourceCode = `
      (function(game) {
        ${playerSourceCode}
      })(publicApi);
    `;

    eval(sourceCode);
  }

  _simulate(levelConfig, playerSourceCode) {
    this._setupLevel(levelConfig);

    this._executePlayerCode(playerSourceCode);

    this._frame = 0;
    while (!this._hasFinished()) {
      this._frame++;

      this._spawner.tick();

      // minions tick
      this._spawner.getMinions().forEach(function(minion) {
        minion.tick(this._grid);
      }.bind(this));

      // towers tick
      this._towers.forEach(function(tower) {
        const killedMinion = tower.tick(this._spawner.getMinions());
        if(killedMinion) {
          this._addCredits(killedMinion.getBounty())
        }
      }.bind(this));

      const frame = {
        towers: this._towers.map(function(tower) {
          return tower.getSnapshot();
        })
      };

      // player tick
      this._playerTick(frame);

      this._takeSnapshot();

      if (this._frame === 300) {
        break;
      }
    }

  }

  _setupLevel(levelConfig) {
    this._isVictory = false;
    this._credits = levelConfig.startCredits;
    this._towerCosts = levelConfig.towerCosts;
    this._towers = [];
    this._grid = new PF.Grid(30, 60);
    this._minionTarget = new Victor(
      levelConfig.minionTarget[0],
      levelConfig.minionTarget[1]
    );
    this._maxMinionsToReachTarget = levelConfig.maxMinionsToReachTarget;
    this._spawner = new SpawnerCollection();

    levelConfig.spawners.forEach(function(spawnerConfig) {
      this._spawner.push(new Spawner(
        new Victor(
          spawnerConfig.spawnLocation[0],
          spawnerConfig.spawnLocation[1]
        ),
        this._minionTarget,
        spawnerConfig.minionConfig
      ));
    }.bind(this));
  }

  _hasFinished() {

    if(this._frame === 0) {
      // skip the first frame
      return false;
    }

    if (this._tooManyMinionsReachedTarget()) {
      console.log('defeat - too many minions reached target');
      // player looses
      this._isVictory = false;
      return true;
    }
    if (this._allManyMinionsReachedTarget()) {
      console.log('defeat - all minions reached target');
      // player looses
      this._isVictory = false;
      return true;
    }
    if (this._allMinionsDead()) {
      console.log('victory - all minions dead');
      // player wins
      this._isVictory = true;
      return true;
    }

    return false;
  }

  _allMinionsDead() {
    var minionsAlive = false;
    this._spawner.getMinions().forEach(function(minion) {
      if (!minion.isDead() && !minion.reachedTarget()) {
        minionsAlive = true;
      }
    });

    return !minionsAlive;
  }

  _tooManyMinionsReachedTarget() {
    var minionsReachedTarget = this._getAmountOfMinionsThatReachedTarget();
    return this._maxMinionsToReachTarget < minionsReachedTarget;
  }

  _allManyMinionsReachedTarget() {
    var minionsReachedTarget = this._getAmountOfMinionsThatReachedTarget();
    return this._spawner.getMinions().length === minionsReachedTarget;
  }

  _getAmountOfMinionsThatReachedTarget() {
    var minionsReachedTarget = 0;
    this._spawner.getMinions().forEach(function(minion) {
      if (minion.reachedTarget()) {
        minionsReachedTarget++;
      }
    });
    return minionsReachedTarget;
  }

  _spendCredits(amount) {
    this._credits -= amount;
  }

  _addCredits(amount) {
    this._credits += amount;
  }

  _takeSnapshot() {

    var snapshot = {
      frame: this._frame,
      credits: this._credits,
      grid: this._grid,
      minionsReachedTarget: this._getAmountOfMinionsThatReachedTarget(),
      minionSpawnLocation: this._minionSpawnLocation,
      minionTarget: this._minionTarget,
      minions: this._spawner.getMinions().map(function(minion) {
        return minion.getSnapshot();
      }),
      towers: this._towers.map(function(tower) {
        return tower.getSnapshot();
      })
    };

    this._snapshots.push(snapshot);
  }

  _playerTick() {
  }

  _getPublicApi() {
    var game = this;

    return Object.freeze({
      onFrame: function(callback) {
        game._playerTick = callback;
      },
      getCurrentFrame: function() {
        return game._frame;
      },
      canBuildTower: function() {
        return game._towerCosts <= game._credits;
      },
      buildTower: function(x, y) {
        // @TODO: make sure that towers can't block minions completely
        if (this.canBuildTower() &&
            game._grid.isInside(x, y) &&
            game._grid.isWalkableAt(x, y)) {

          game._spendCredits(game._towerCosts);
          game._towers.push(new Tower(x, y));
          game._grid.setWalkableAt(x, y, false);
        }
      }
    });
  }
}
