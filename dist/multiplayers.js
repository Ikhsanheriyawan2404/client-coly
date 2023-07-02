class ColyClient {

	serverUrl;
	client;
	room;

	constructor() {
		this.serverUrl = "ws://localhost:2567";

		this.client = new Colyseus.Client(this.serverUrl);

		this.room = null;
    this.controlClient = false;

		// this.addListeners();
	}

	async connect(roomName, options) {
    try {
      this.room = await this.client.joinOrCreate(roomName, options);
      console.log("Joined room:", this.room.name);
    } catch (error) {
      console.error("Error joining or creating room:", error);
    }
  }

  _StateMessage(message, key) {
    message.onChange = (changes) => {
      console.log('changes', changes)
    };
    console.log('message', message, key)
  }

	addListeners() {
    if (this.room) {
      this.room.onStateChange.once((state) => {

        state.Message.$items.forEach((messages, key) => {
          displayMessage(messages);
        });

        state.ObjectMap.$items.forEach((objectMaps, key) => {
        });

      });

      colyClient.room.state.listen("send_message",(message, key) => {
        console.log('kontol')
      })

      colyClient.room.state.Message.onAdd = (message, key) => {
        console.log('message', message, key);
        mission.onChange = (changes) => {
          console.log('changes', changes)
        };
      }

      colyClient.room.state.Player.onAdd = (players, key) => {
        console.log(';onadd')
        colyClient.room.state.Player.onChange = (changes) => {
          console.log('changes', changes)
        };
      };

      this.room.state.Player.onRemove = (players, key) => {
        // toastr.info(`${players.name} keluar Room`);
      }

      this.room.onError((code, message) => {
        console.error("Error from server:", code, message);
      });

      this.room.onLeave(() => {
        console.log("Left the room.");
        this.room = null;
      });
    } else {
      console.log('wakwau')
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

