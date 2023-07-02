class ColyClient {

	serverUrl;
	client;
	room;
  options;

	constructor() {
		this.serverUrl = "ws://localhost:2567";

		this.client = new Colyseus.Client(this.serverUrl);

		this.room = null;

    this.options = {
      "id": HelperObj.generateRandomId(),
      "name": HelperObj.getUserName(),
      "health": 100,
      "armor": 0,
      "speed": 100,
      "position": {
        "lat": 1292092.192,
        "long": 13334324.182
      }    
    };

    this.connectToServer();
	}

  connectToServer() {
    this.client.joinOrCreate("my_room", this.options).then(room => {
      this.room = room;
      Player.addPlayer(this.options);
      this.addListeners();
    }).catch(e => {
      console.log("JOIN ERROR", e);
    });
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

      this.room.onMessage("send_message", (message) => {
        if (message.message.trim() !== '') {
          toastr.info(`ada pesan masuk`);
          displayMessage(message);
        }
      });

      this.room.onMessage("move", (data) => {
        console.log(data)
      });

      this.room.onMessage("onJoin", (message) => {
        toastr.success(`${message.message} ${message.id}`);
      });

      this.room.onMessage("onLeave", (message) => {
        toastr.error(`${message} meninggalkan permainan!`);
      });

      this.room.onStateChange((state) => {
        state.Message.onAdd = (message, key) => {
          console.log('message', message, key);
          mission.onChange = (changes) => {
            console.log('changes', changes)
          };
        }

        state.Message.onChange = (changes) => {
          console.log('changes', changes)
        };
  
        state.Player.onAdd = (players, key) => {
          console.log(';onadd')
          colyClient.room.state.Player.onChange = (changes) => {
            console.log('changes', changes)
          };
        };
      });
      // this.room.state.listen("position", (value, key) => {
      //   console.log('value', value, key)
      // });

      this.room.state.Player.onRemove = (players, key) => {
        toastr.info(`${players.name} keluar Room`);
        console.log(`${players.name} keluar Room`);
      }

      this.room.onError((code, message) => {
        console.error("Error from server:", code, message);
      });

      this.room.onLeave(() => {
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
