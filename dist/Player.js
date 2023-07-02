class PlayerDetail {
    constructor(objects) {
        this.id = objects.id;
        this.name = objects.name;
        this.points = objects.points;
        this.health = objects.health;
        this.speed = objects.speed;
        this.armor = objects.score;
        this.position.lat = objects.position.lat,
        this.position.long = objects.position.long
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setHealth(health) {
        this.health = health;
    }

    setArmor(armor) {
        this.armor = armor;
    }

    setPoints(points) {
        this.points = points;
    }

    setPosition(lat, long) {
        this.position.lat = lat;
        this.position.long = long;
    }

    getSpeed() {
        return this.speed;
    }
}
  
class Player {
    constructor() {
        this.players = new Map();
    }
  
    addPlayer(objects) {
        const newPlayer = new PlayerDetail(objects);
        this.players.set(newPlayer);
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

const Player = new Player();
const PlayerDetail = new PlayerDetail();