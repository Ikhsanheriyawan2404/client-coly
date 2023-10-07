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
        this.marker = objects.marker;

    }

    // plotIcon = () => {
    //     // push to maps
    //     const center = [
    //         this.position.lat,
    //         this.position.long,
    //     ];
    //     // Leaflet.map.setView(Leaflet.center, Leaflet.zoom);
    //     Leaflet.marker = L.marker(center, {icon: Leaflet.avatarIcon}).addTo(Leaflet.map);
    // }

    setHealth(health) {
        this.health = health;
    }

    setPoints(points) {
        this.points = points;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    getStepSize() {
        let tempResult = this.speed / 20;
        return tempResult / 1000;
    }

    moveIcon = (lat, long) => {
        const center = [
            lat,
            long,
        ];
        this.marker.setLatLng(center).addTo(Leaflet.map);        
    }

    getId() {
        return this.id;
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