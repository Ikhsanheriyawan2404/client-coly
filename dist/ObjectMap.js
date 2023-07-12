class ObjectMap {
    constructor(objects) {
        this.id = objects.id;
        this.is_active = objects.is_active;
        this.type = objects.type;
        this.properties = JSON.parse(objects.properties);

        this.interval = null;
        this.listDetect = [];
    }

    detectPlayerMovement = (objectId = null) => {
        let object = this;
        let interval_ = window.setInterval(() => {
            let players = Player.getAllPlayer();
            for (const player of players) {

                let detectedEntity = object.listDetect.includes(player.getId());

                let intersection = this.checkIntersectCircle(player, object);

                if (intersection) {

                    if(detectedEntity === false) 
                    {
                        object.listDetect.push(player.getId());
                    }
                } else {
                    if (detectedEntity) {
                        let index = object.listDetect.indexOf(player.getId());
                        object.listDetect.splice(index, 1);
                    }
                }
            }
        }, 1000);
        object.interval = interval_;
    }

    checkIntersectCircle = (player, object) => {
        //
    }
}