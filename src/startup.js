export default class StartUp {
  constructor(xhrGet, xhrGetDefaultKata) {
    this.xhrGet = xhrGet;
    this.xhrGetDefaultKata = xhrGetDefaultKata;
  }

  loadSourceCode(kataUrl, withSourceCode) {
    var sourceCode = localStorage.getItem('code');
    if (kataUrl) {
      this.loadKataFromUrl(kataUrl, withSourceCode);
    } else if (sourceCode) {
      withSourceCode(sourceCode);
    } else {
      this.loadDefaultKata(withSourceCode);
    }
    window.location.hash = window.location.hash.replace(/kata=([^&]+)/, '');
  }

  loadDefaultKata(onLoaded) {
    this.xhrGetDefaultKata(
      (_, {status}) =>
onLoaded(`// Rules:
// 1. Not more than 5 minions shall reach their target
// 2. Try to stop minions by placing towers in strategic positions
// 3. Killed minions give you credits, use it to build new towers

// setup

// Hint: try to play with this value in order to win
const towerOffsetY = 20;

// build our first tower
game.buildTower(14, towerOffsetY);

// this function gets called on each tick
game.onFrame(function(frame) {

  // get the current amount of towers
  const currentAmountOfTowers = frame.towers.length;

  // check if we can build a new tower
  if(game.canBuildTower()) {

    // calculate the new y position of the tower
    const newTowerOffsetY = towerOffsetY * (currentAmountOfTowers + 1);

    // build a new tower
    game.buildTower(14, newTowerOffsetY);
  }
});`),
      data => { onLoaded(data); }
    );
  }

  loadKataFromUrl(kataUrl, onLoaded) {
    this.xhrGet(
      kataUrl,
      (_, {status}) =>
        onLoaded(`// Kata at "${kataUrl}" not found (status ${status})\n// Maybe try a different kata (see URL).`),
      data => { onLoaded(data); }
    );
  }

}
