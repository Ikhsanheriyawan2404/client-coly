class EntityPlayer {
    constructor() {
        this.players = [];
    }
  
    addPlayer(objects) {
        const newPlayer = new PlayerDetail(objects);
        this.players.push(newPlayer);
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