class MapLeaflet {
    constructor() {
        this.optionMaps = {
            dragging: false,
            zoomControl: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
        }

        // this.center = null;
        this.zoom = 17;
        this.center = [0, 0]

        // this.map = null;
        this.map = L.map('map', this.optionMaps).setView(this.center, this.zoom);
        

        // add icon to marker
        this.avatarIcon = L.icon({
            iconUrl: 'assets/img/icon.png',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });

        this.marker = L.marker(this.center, {icon: this.avatarIcon})
    }
}

const Leaflet = new MapLeaflet();