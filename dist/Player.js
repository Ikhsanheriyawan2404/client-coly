class EntityPlayer {
    #players = [];
    constructor() {
        console.log(this.#players)
    }
  
    addPlayer(objects) {
        const geoJSON = Helper.getRandomPositionByPolygon(Boundery.JakartaBounds);
        const coordinates = geoJSON.geometry.coordinates[0];
        const latitudes = coordinates.map(coord => coord[1]);
        const longitudes = coordinates.map(coord => coord[0]);

        const player = {
          "id": objects.id,
          "name": objects.name,
          "health": objects.health,
          "armor": objects.health,
          "speed": objects.health,
          "position": {
            "lat": objects.position.lat,
            "long": objects.position.long
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