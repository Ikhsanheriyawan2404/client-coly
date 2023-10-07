class MapLeaflet {
    constructor() {
        this.optionMaps = {
            // dragging: false,
            // zoomControl: false,
            // scrollWheelZoom: false,
            // doubleClickZoom: false,
            // touchZoom: false,
        }
        this.trackplayback = null;
        this.allObjectMap = [];
        this.botEnemy = [];
        this.dataObjectInScreen = [];

        // this.optionMaps = {}

        // this.center = null;
        this.zoom = 17;
        this.center = [
            0,
            0,
        ];
        // this.center = [
        //     colyClient.options.position.lat,
        //     colyClient.options.position.long,
        // ],

        // this.map = null;
        this.map = L.map('map', this.optionMaps).setView(this.center, this.zoom);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        // add icon to marker
        this.avatarIcon = L.icon({
            iconUrl: 'assets/img/icon.png',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });

        this.marker = L.marker(this.center, {icon: this.avatarIcon});

        L.control.compass({
            position: 'topright',
            autoActive: true,
            showDigit: true,
            digitStyle: {
                color: 'white',
                fontSize: '16px'
            }
        }).addTo(this.map);
    }

    plotObject(object) {
        let properties = JSON.parse(object.properties);
        let objectMap = null;
        if (object.type == "explosion" || object.type == "item" || object.type == "treasure" || object.type == "speed") {
            const center = [properties.lat, properties.long];
            let color = "";
            switch (object.type) {
                case "explosion":
                    color = "red";
                    break;
                case "item":
                    color = "green";
                    break;
                case "treasure":
                    color = "yellow";
                    break;
                case "speed":
                    color = "blue";
                    break;
            }

            objectMap = L.circle(center, {
                color: color,
                // fillColor: '#f03',
                fillOpacity: 0.3,
                radius: properties.radius
            });
        } else if (object.type == "wall" || object.type == "weather") {
            switch (properties.type) {
                case "polyline":
                    objectMap = L.polyline(properties.poly, {
                        color: 'red',
                        weight: 3,
                        opacity: 0.5,
                        smoothFactor: 1
                    });
                    break;
                case "polygon":
                    objectMap = L.polygon(properties.poly, {
                        color: 'red',
                        weight: 3,
                        opacity: 0.5,
                        smoothFactor: 1
                    });
                    break;
            }
        }

        object.layer = objectMap;
        let newObject = new ObjectMap(object);
        this.allObjectMap.push(newObject);
        objectMap.addTo(this.map).bindPopup(object.type);
        newObject.is_active = false;
        newObject.layer.removeFrom(this.map);
    }

    plotEnemyBot(object) {
        let objectMap = null;

        let newObject = new BotEnemy(object);
        this.botEnemy.push(newObject);

       
    }

    setPergerakanBot() {
        const data = [];
        for (const bot of this.botEnemy) {
            const newObject = bot;
            let row = [];
            const startTime = moment(); // Waktu awal
            const timeInterval = 1_000_000_000; // Interval waktu (dalam milidetik)

            for (const coord of newObject.movement.poly) {
                const timestamp = moment(startTime).add(timeInterval, 'miliseconds').unix(); // Menambahkan detik ke waktu awal
                row.push({
                    lat: coord.lat,
                    lng: coord.long,
                    time: timestamp,// setting waktu disini,
                    info: []
                });
                startTime.add(timeInterval, 'milliseconds'); // Menambahkan interval waktu ke waktu awal untuk iterasi selanjutnya
            }
            data.push(row)
        }
        
        console.log(data)
        const trackplayback = L.trackplayback(data, this.map, {
            targetOptions: {
                useImg: true,
                imgUrl: 'assets/img/ship.png'
            },
            clockOptions: {
                speed: 20,
                maxSpeed: 65
            },
            // trackLineOptions: {
            //     // whether draw track line
            //     isDraw: true,
            //     stroke: true,
            //     color: '#1C54E2',
            //     weight: 2,
            //     fill: false,
            //     fillColor: '#000',
            //     opacity: 0.3
            // },
        });

        trackplayback.start();
        // trackplayback.showTrackLine();

       
        trackplayback.rePlaying();
        const trackplaybackControl = L.trackplaybackcontrol(trackplayback);
        trackplaybackControl.addTo(this.map);
        // hide control on maps
        // trackplaybackControl.hide();

        this.trackplayback = trackplayback;
    }

    getObjectInScreen(objects) {
        let rectangle = L.rectangle(this.map.getBounds());
        let data = [];
        
        for (const key of objects) {
            let keyLatLng = null;
            if (key.properties.type == "polygon") {
                keyLatLng = {
                    lat: key.properties.poly[0][0],
                    lng: key.properties.poly[0][1],
                };
            } else {
                keyLatLng = {
                    lat: key.properties.lat,
                    lng: key.properties.long,
                };
            }

            let point  = turf.point([keyLatLng.lng, keyLatLng.lat]);
            var poly   = rectangle.toGeoJSON();
            var inside = turf.inside(point, poly);
            if (inside) {
                data.push(key)
                this.dataObjectInScreen.push(key.id);
                key.is_active = true;
                key.showObject();
            } else {
                this.dataObjectInScreen = this.dataObjectInScreen.filter((value) => {
                    return value == key.id;
                })
                key.hideObject();
            }
        }
        return data;
    }

    setDetectionOnObject() {
        let allObjInScreen = this.getObjectInScreen(this.allObjectMap);
        const player = Player.getPlayer(localStorage.getItem('player_id'));

        // set interval to detect player
        if (allObjInScreen) {
            // const interval_ = window.setInterval(() => {
                for (const object of allObjInScreen) {
                    let intersect = false;
                    if (object.properties.type == "polygon") {
                        intersect = this.isPointInPolygon(player.position, object.properties.poly);
                    } else {
                        intersect = this.isPointInCircle(player.position, object.properties);
                    }
                    if (intersect) {
                        let data = {};
                        let endpoint = "";
                        // delete object
                        if (object.type == "treasure") {
                            endpoint = "increasePoint";
                            data = {
                                player_id: player.id,
                                points: object.properties.point,
                            }
                            toastr.info("Kamu dapat TREASURE : " + object.properties.point)
                        } else if (object.type == "speed") {
                            endpoint = "increaseSpeed";
                            data = {
                                player_id: player.id,
                                speed: object.properties.speed,
                            }
                            toastr.info("Kamu lebih cepat : " + object.properties.speed)
                        } else if (object.type == "item") {
                            endpoint = "increaseHealth";
                            data = {
                                player_id: player.id,
                                health: object.properties.health,
                            }
                            toastr.info(`Kamu dapat item HEALTH:${object.properties?.health}`)
                        } else if (object.type == "explosion") {
                            endpoint = "decreaseHealth";
                            data = {
                                player_id: player.id,
                                damage: object.properties.damage,
                            }
                            toastr.warning("Kamu terkena ledakan :" + object.properties?.damage)
                        } else if (object.type == "weather") {
                            endpoint = "decreaseHealth";
                            data = {
                                player_id: player.id,
                                damage: object.properties.damage,
                            }
                            toastr.warning("Kamu nabrak tembok :" + object.properties?.damage)
                        }

                        console.log(endpoint, data);

                        colyClient.room.send(endpoint, data);

                        colyClient.room.send("deleteObject", {
                            id: object.id,
                        });
                        
                        // this.allObjectMap = this.allObjectMap.filter((value) => {
                        //     return value.id != object.id;
                        // })
                    }
                }
            // }, 100);
            
            // window.clearInterval(interval_);
            // object.interval = null;
        }
    }

    // Fungsi untuk menghitung jarak antara dua titik
    calculateDistance(point1, point2) {
        const lat1InKm = point1.lat * 111.32;
        const lat2InKm = point2.lat * 111.32;
      
        // Hitung jarak dalam kilometer
        const dxInKm = lat1InKm - lat2InKm;
        const dyInKm = (point1.long - point2.long) * 111.32;
      
        // Konversi kilometer ke meter (1 kilometer = 1000 meter)
        const distanceInMeters = Math.sqrt(dxInKm * dxInKm + dyInKm * dyInKm) * 1000;
      
        return distanceInMeters;
        // return Math.sqrt(dx * dx + dy * dy);
    }   
    
    // Fungsi untuk memeriksa apakah titik berada dalam circle
    isPointInCircle(point, circle) {
        const distance = this.calculateDistance(point, circle);
        return distance <= circle.radius;
    }
    
    // Fungsi untuk memeriksa apakah titik berada dalam polygon
    isPointInPolygon(point, polygon) {
        const x = point.lat;
        const y = point.long;
    
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x;
            const yi = polygon[i].y;
            const xj = polygon[j].x;
            const yj = polygon[j].y;
        
            const intersect =
                yi > y !== yj > y &&
                x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) {
                inside = !inside;
            }
        }
    
        return inside;
    }
    
}

const Leaflet = new MapLeaflet()
