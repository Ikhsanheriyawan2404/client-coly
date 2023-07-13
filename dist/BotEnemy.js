class BotEnemy {
    constructor(objects) {
        this.id = objects.id;
        this.name = objects.name;
        this.health = objects.health;
        this.speed = objects.speed;
        this.position = objects.position;
        this.movement = objects.movement;

        this.movementObject = [];
    }
}