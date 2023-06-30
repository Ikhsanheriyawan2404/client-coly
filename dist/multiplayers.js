class ColyClient {

	serverUrl;
	client;
	room;

	constructor() {
		this.serverUrl = "ws://localhost:4000";

		// Inisialisasi klien Colyseus
		this.client = new Colyseus.Client(this.serverUrl);

		// Menyimpan referensi ke ruangan Colyseus yang saat ini diikuti
		this.room = null;

		this.addListeners();
	}

	async connect() {
		try {
			await this.client.connect();
			console.log("Connected to Colyseus server!");
		} catch (error) {
			console.error("Error connecting to Colyseus server:", error);
		}
	}

	async joinOrCreateRoom(roomName, options) {
    try {
      this.room = await this.client.joinOrCreate(roomName, options);
      console.log("Joined room:", this.room.name);
    } catch (error) {
      console.error("Error joining or creating room:", error);
    }
  }

	addListeners() {
    if (this.room) {
      this.room.onMessage("message", (message) => {
        console.log("Received message from server:", message);
      });

      this.room.onStateChange((state) => {
        console.log("Room state updated:", state);
      });

      this.room.onError((code, message) => {
        console.error("Error from server:", code, message);
      });

      this.room.onLeave(() => {
        console.log("Left the room.");
        this.room = null;
      });
    }
  }

	sendMessage(message)  {
    if (this.room) {
      this.room.send("message", message);
    } else {
      console.warn("Not in a room. Unable to send message.");
    }
  }

	leaveRoom() {
    if (this.room) {
      this.room.leave();
    } else {
      console.warn("Not in a room.");
    }
  }
}


const colyClient = new ColyClient();
const options = {
  "id": 1,
  "name": "IKhsan HEriyawan",
  "email": "ikhsan@gmail.com",
  "health": 100,
  "armor": 0,
  "speed": 100,
  "position": {
    "lat": 1292092.192,
    "long": 13334324.182
  }    
};
colyClient.client.joinOrCreate("my_room", options).then(room => {
  console.log(room.sessionId, "joined", room.name);
}).catch(e => {
  console.log("JOIN ERROR", e);
});
