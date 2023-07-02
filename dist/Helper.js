class Helper {

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
}

const HelperObj = new Helper();