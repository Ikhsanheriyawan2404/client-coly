class MapLeaflet {
    constructor(lat, long) {
        this.optionMaps = {}

        // this.center = null;
        this.zoom = 17;
        this.center = [
            lat,
            long,
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

        this.marker = L.marker(this.center, {icon: this.avatarIcon}).addTo(this.map);
    }
}
