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
        if (object.type == "explosion" || object.type == "item") {
            const center = [properties.lat, properties.long];
            objectMap = L.circle(center, {
                color: object.type == "explosion" ? 'red' : 'green',
                // fillColor: '#f03',
                fillOpacity: 0.5,
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

        let newObject = new ObjectMap(object);
        this.allObjectMap.push(newObject);
        objectMap.addTo(this.map).bindPopup(object.type);
    }

    plotEnemyBot(object) {
        let objectMap = null;

        let newObject = new BotEnemy(object);
        this.botEnemy.push(newObject);

       
    }

    setPergerakanBot()
    {
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

       
        // trackplayback.rePlaying();
        const trackplaybackControl = L.trackplaybackcontrol(trackplayback);
        trackplaybackControl.addTo(this.map);
        // hide control on maps
        // trackplaybackControl.hide();

        this.trackplayback = trackplayback;
    }
}

const Leaflet = new MapLeaflet()
