class ColyClient {

	serverUrl;
	client;
	room;
  options;

	constructor() {
    this.port = 3019;
		this.serverUrl = `ws://localhost:${this.port}`;
    this.userId = null;
		this.client = new Colyseus.Client(this.serverUrl);

		this.room = null;
    
    this.user = null;
    this.setPlayer();
    this.connectToServer();
	}

  setPlayer() {
    this.options = {
      "id": Helper.generateRandomId(),
      "name": Helper.getUserName(),
      "position": {
        "lat": 0,
        "long": 0
      },
    }
  }

  async connectToServer() {
    await this.client.joinOrCreate("my_room", this.options).then(room => {
      colyClient.room = room;
      this.addListeners();
    }).catch(e => {
      console.log("JOIN ERROR", e);
    });
  }

	// async connect(roomName, options) {
  //   try {
  //     this.room = await this.client.joinOrCreate(roomName, options);
  //     console.log(this.room.state.Player)
  //     console.log("Joined room:", this.room.name);
  //   } catch (error) {
  //     console.error("Error joining or creating room:", error);
  //   }
  // }

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
        Player.addPlayer(message.player);
        const Leaflet = new MapLeaflet(message.player.position.lat, message.player.position.long);
        // Leaflet.center = [
        //   message.player.position.lat,
        //   message.player.position.long,
        // ];
      });

      this.room.onMessage("onLeave", (message) => {
        toastr.error(`${message} meninggalkan permainan!`);
      });

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
