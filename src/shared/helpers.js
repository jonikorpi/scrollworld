import uuid from "uuid/v4";

const rules = {
  areaWidth: 8,
  worldLength: 12,
  secondsPerTurn: 60,
  maxMana: 10,
};

const listTilesInRange = ({ x, y, range = 1, areaLength }) => {
  const tiles = [];

  for (let xOffset = -range; xOffset <= range; xOffset++) {
    for (let yOffset = -range; yOffset <= range; yOffset++) {
      const thisX = Math.floor(x + xOffset);
      const thisY = Math.floor(y + yOffset);
      const isInRange =
        Math.sqrt(Math.pow(x - thisX, 2) + Math.pow(y - thisY, 2)) <= range;

      const isLikelyInArea =
        thisX < rules.areaWidth &&
        thisX >= 0 &&
        thisY >= 0 &&
        thisY < areaLength;

      if (isInRange && isLikelyInArea) {
        tiles.push({ x: thisX, y: thisY });
      }
    }
  }

  return tiles;
};

const getVisibleTilesForPlayer = (gameState, playerID) => {
  let units = [];

  Object.keys(gameState.locations).forEach(x => {
    Object.keys(gameState.locations[x]).forEach(y => {
      const unit = { ...gameState.locations[x][y].unit };
      unit.x = +x;
      unit.y = +y;

      if (unit && unit.playerID === playerID) {
        units.push(unit);
      }
    });
  });

  return units.reduce((visibleTiles, unit) => {
    listTilesInRange({
      ...unit,
      areaLength: gameState.details.areaLength,
    }).forEach(({ x, y }) => {
      visibleTiles[x] = visibleTiles[x] || {};
      visibleTiles[x][y] = true;
    });

    return visibleTiles;
  }, {});
};

const getFreshArea = startTime => {
  // listTilesInRange({
  //   ...startingLocation,
  //   range: 2,
  //   areaLength: gameState.details.areaLength,
  // }).forEach(({ x, y }) => {
  //   gameState.locations[x] = gameState.locations[x] || {};
  //   gameState.locations[x][y] = {
  //     tile: {
  //       type: "water",
  //     },
  //   };
  // });

  return {
    details: {
      areaLength: 24,
    },
    players: {},
    locations: {},
  };
};

const addUnitToLocation = (unit, x, y, gameState) => {
  gameState.locations[x] = gameState.locations[x] || {};
  gameState.locations[x][y] = gameState.locations[x][y] || {};

  if (!gameState.locations[x][y].unit) {
    gameState.locations[x][y].unit = unit;
  }

  return gameState;
};

const addPlayerToArea = ({ playerID, startingX }, currentArea) => {
  let gameState = { ...currentArea };
  const startingLocation = {
    x: startingX,
    y: gameState.details.areaLength - 1,
  };

  addUnitToLocation(
    {
      unitID: uuid(),
      playerID: playerID,
      type: "ship",
      range: 10,
    },
    startingLocation.x,
    startingLocation.y,
    gameState
  );

  console.log(gameState);

  gameState.players[playerID] = {
    visibleTiles: getVisibleTilesForPlayer(gameState, playerID),
    mana: 0,
    lastUsedManaAt: Date.now(),
  };

  return gameState;
};

const singlePlayerUserID = "solo";

export {
  rules,
  getFreshArea,
  addPlayerToArea,
  singlePlayerUserID,
  listTilesInRange,
  getVisibleTilesForPlayer,
};
