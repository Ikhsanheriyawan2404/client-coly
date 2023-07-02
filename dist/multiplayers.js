class ColyClient {

	serverUrl;
	client;
	room;
  options;

	constructor() {
		this.serverUrl = "ws://localhost:2567";
    this.userId = null;
		this.client = new Colyseus.Client(this.serverUrl);

		this.room = null;

    this.options = {
      "id": HelperObj.generateRandomId(),
      "name": HelperObj.getUserName(),
      // "health": 100,
      // "armor": 0,
      // "speed": 100,
      // "position": {
      //   "lat": 1292092.192,
      //   "long": 13334324.182
      // }
    };

    this.user = null;

    this.connectToServer();
	}

  connectToServer() {
    this.client.joinOrCreate("my_room", this.options).then(room => {
      colyClient.room = room;
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

  _StatePlayer(player, key) {
    //
  }

	addListeners() {
    if (this.room) {
      this.room.onStateChange.once((state) => {
        state.Message.$items.forEach((messages, key) => {
          displayMessage(messages);
        });
      })
      this.room.onStateChange((state) => {

        this.room.state.Player.onAdd = (player, sessionId) => {
          console.log('New player added:', player); // Data player yang baru ditambahkan
          // Lakukan apa pun yang diperlukan untuk meng-assign data player ke objek di frontend
          // Misalnya, jika Anda memiliki array players di frontend:
        };

        state.Player.$items.forEach((player, key) => {
          // if (player.id !== this.userId) {
          //   this.user = player;
          //   Leaflet.map.setView([player.position.lat, player.position.long], Leaflet.zoom);
          //   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          //   }).addTo(Leaflet.map);
          //   Leaflet.marker.setLatLng([player.position.lat, player.position.long]).addTo(Leaflet.map);
          // }
        });

      });

      this.room.state.Player.onAdd = (players, key) => {
        console.log('onadd')
      }

      this.room.onMessage("send_message", (message) => {
        if (message.message.trim() !== '') {
          toastr.info(`ada pesan masuk`);
          displayMessage(message);
        }
      });

      this.room.onMessage("move", (data) => {
        // set marker position

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
        colyClient.room = null;
      });
    } else {
      console.log('Not connected any room')
    }
  }

	leaveRoom() {
    if (colyClient.room) {
      colyClient.room.leave();
    } else {
      console.warn("Not in a room.");
    }
  }
}

const colyClient = new ColyClient();
