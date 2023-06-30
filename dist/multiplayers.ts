import { Client } from "colyseus.js";

export default class ColyClient {

	public serverUrl: string;
	public client: any;
	public room: any;

	constructor() {
		console.log("ColyClient");

		this.serverUrl = "ws://localhost:2567";

		// Inisialisasi klien Colyseus
		this.client = new Client(this.serverUrl);

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

	async joinOrCreateRoom(roomName: string, options: any) {
    try {
      this.room = await this.client.joinOrCreate(roomName, options);
      console.log("Joined room:", this.room.name);
    } catch (error) {
      console.error("Error joining or creating room:", error);
    }
  }

	public addListeners() {
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

	sendMessage(message: string)  {
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

// Contoh penggunaan:
const colyseusClient = new ColyClient();
colyseusClient.connect().then(() => {
  colyseusClient.joinOrCreateRoom("treasure-hunter", {
		playerName: "John Doe",
	});
});
