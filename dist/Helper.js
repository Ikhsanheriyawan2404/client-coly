class HelperManager {
    constructor() {
        this.Leaflet = Leaflet;
    }

    getUserName() {
        const url = new URL(window.location.href);
    
        const params = new URLSearchParams(url.search);
        
        const nameValue = params.get('name');

        return nameValue;
    }

    generateRandomId() {
        const timestamp = Date.now().toString(36); // Convert timestamp to base36 string
        const randomString = Math.random().toString(36).substr(2, 5); // Random alphanumeric string
        const randomId = `${timestamp}-${randomString}`;
        return randomId;
    }

    /**
     * @param {string} polyData
     * @returns {object} geojson
     */
    getRandomPositionByPolygon(polyData) {
        const lines = polyData.trim().split('\n');
        const name = lines[0].trim();
        const coordinates = lines.slice(2, lines.length - 2).map(line => {
            const [lng, lat] = line.trim().split(/\s+/).map(Number);
            return [lng, lat];
        });

        const geojson = {
            type: 'Feature',
            properties: {
                name: name
            },
            geometry: {
                type: 'Polygon',
                coordinates: [coordinates]
            }
        };
        return geojson;
    }

    /**
     * 
     * @param {number} min 
     * @param {number} max 
     * @returns @number
     */
    getRandomInRange(min,  max) {

        return Math.random() * (max - min) + min;
    }

    moveMap(direction) {
        const player = Player.getPlayer(localStorage.getItem('player_id'));
        // console.log(player)
        const stepSize = 0.005; // Adjust the step size as needed
        // const stepSize = 0.015; // Adjust the step size as needed
        const currentCenter = this.Leaflet.map.getCenter();
        let newCenter;

        switch (direction) {
            case 'up':
                newCenter = [currentCenter.lat + (stepSize / this.Leaflet.map.getZoom()), currentCenter.lng];
                break;
            case 'down':
                newCenter = [currentCenter.lat - (stepSize / this.Leaflet.map.getZoom()), currentCenter.lng];
                break;
            case 'left':
                newCenter = [currentCenter.lat, currentCenter.lng - (stepSize / this.Leaflet.map.getZoom())];
                break;
            case 'right':
                newCenter = [currentCenter.lat, currentCenter.lng + (stepSize / this.Leaflet.map.getZoom())];
                break;
            default:
                // Handle invalid direction
                return;
        }

        this.Leaflet.map.panTo(newCenter);
        let newLat = this.Leaflet.map.getCenter().lat
        let newLng = this.Leaflet.map.getCenter().lng
        colyClient.room.send('move', {
            player_id: colyClient.options.id,
            id: player.id,
            position: {
                lat: this.Leaflet.map.getCenter().lat,
                long: this.Leaflet.map.getCenter().lng
            }
        });
        
        player.position.lat = newLat;
        player.position.long = newLng;

        this.Leaflet.setDetectionOnObject()

        this.Leaflet.marker.setLatLng(newCenter);
    }

    polyToGeoJSON(polyData) {
        const lines = polyData.trim().split('\n');
        const name = lines[0].trim();
        const coordinates = lines.slice(2, lines.length - 2).map(line => {
            const [lng, lat] = line.trim().split(/\s+/).map(Number);
            return [lng, lat];
        });

        const geojson = {
            type: 'Feature',
            properties: {
                name: name
            },
            geometry: {
                type: 'Polygon',
                coordinates: [coordinates]
            }
        };
        return geojson;
    }

    getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const currentTime = `${hours}:${minutes}:${seconds}`;
        return currentTime;
    }

    sendMessage() {
        const message = document.getElementById('chat-input').value;
        let data =  {
            message_id: Helper.generateRandomId(),
            type: 'public-message',
            player_id: colyClient.options.id,
            player_name: colyClient.options.name,
            message: message,
            time: this.getCurrentTime()
        }

        document.getElementById('chat-input').value = '';
        colyClient.room.send('send_message', data);
    }


    displayMessage(data) {
        const chatMessages = document.getElementById('chat-messages');
        const newMessage = document.createElement('div');
        newMessage.innerHTML = `${data.time}-<strong>${data.player_name}:</strong> ${data.message}`;
        chatMessages.appendChild(newMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

const Helper = new HelperManager();