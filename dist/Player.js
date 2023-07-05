class EntityPlayer {
    #players = [];
    constructor() {
        console.log(this.#players)
    }
  
    addPlayer() {
        const geoJSON = Helper.getRandomPositionByPolygon(Boundery.JakartaBounds);
        const coordinates = geoJSON.geometry.coordinates[0];
        const latitudes = coordinates.map(coord => coord[1]);
        const longitudes = coordinates.map(coord => coord[0]);

        const player = {
          "id": Helper.generateRandomId(),
          "name": Helper.getUserName(),
          "health": 100,
          "armor": 0,
          "speed": 100,
          "position": {
            "lat": Helper.getRandomInRange(Math.min(...latitudes), Math.max(...latitudes)),
            "long": Helper.getRandomInRange(Math.min(...longitudes), Math.max(...longitudes))
          }
        };

        const newPlayer = new PlayerDetail(player);
        this.#players.push(newPlayer);

        return player;
    }
  
    getPlayer(id) {
        return this.players.get(id);
    }
  
    updatePlayer(id, name, score) {
        const player = this.players.get(id);
        if (player) {
            player.name = name;
            player.score = score;
        }
    }
  
    removePlayer(id) {
        this.players.delete(id);
    }
  
    getAllPlayers() {
        return Array.from(this.players.values());
    }
}

const Player = new EntityPlayer();