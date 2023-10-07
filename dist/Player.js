class EntityPlayer {
    #players = [];
    constructor() {
    }
  
    addPlayer(objects) {
        // const geoJSON = Helper.getRandomPositionByPolygon(Boundery.JakartaBounds);
        // const coordinates = geoJSON.geometry.coordinates[0];
        // const latitudes = coordinates.map(coord => coord[1]);
        // const longitudes = coordinates.map(coord => coord[0]);

        const player = {
          "id": objects.id,
          "name": objects.name,
          "health": objects.health,
          "speed": objects.speed,
          "points": objects.points,
          "position": {
            "lat": objects.position.lat,
            "long": objects.position.long
          },
          "marker": objects.marker,
        };

        const newPlayer = new PlayerDetail(player);
        this.#players.push(newPlayer);
    }

    getAllPlayer() {
        return this.#players;
    }

    getPlayer(id) {
        const player = this.#players.find(player => player.id === id);
        return player ? player : null;
    }
  
    updatePlayer(id, name, score) {
        const player = this.players.get(id);
        if (player) {
            player.name = name;
            player.score = score;
        }
    }
  
    removePlayer(playerId) {
        const index = this.#players.findIndex(player => player.id === playerId);
        // remove marker
        this.#players[index].marker.remove();
        if (index !== -1) {
            this.#players.splice(index, 1);
            console.log(`Player with ID ${playerId} has been removed.`);
        } else {
            console.log(`Player with ID ${playerId} does not exist.`);
        }
    }
  
    getAllPlayers() {
        return Array.from(this.players.values());
    }
}

const Player = new EntityPlayer();