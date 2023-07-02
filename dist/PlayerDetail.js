class PlayerDetail {
    constructor(objects) {
        this.id = objects.id;
        this.name = objects.name;
        this.points = objects.points;
        this.health = objects.health;
        this.speed = objects.speed;
        this.armor = objects.score;
        this.position = {
            lat: objects.position.lat,
            long: objects.position.long
        }
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