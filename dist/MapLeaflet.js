class MapLeaflet {
    constructor() {
        this.optionMaps = {
            dragging: false,
            zoomControl: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
        }

        this.allObjectMap = [];

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
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: properties.radius
            });
        } else if (object.type == "wall" || object.type == "weather") {
            switch (properties.type) {
                case "polyline":
                    console.log(properties.poly)
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

        this.allObjectMap.push(object);
        objectMap.addTo(this.map).bindPopup(object.type);
    }
}

const Leaflet = new MapLeaflet()
