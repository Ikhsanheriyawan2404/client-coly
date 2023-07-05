class HelperManager {

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
}

const Helper = new HelperManager();