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
      localStorage.setItem("player_id", room.sessionId)
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
      this.room.onStateChange((state) => {
        

        state.Message.$items.forEach((messages, key) => {
          Helper.displayMessage(messages);
        });

        state.Player.$items.forEach((player, key) => {
          let dataPlayer = player;
          const center = [dataPlayer.position.lat, dataPlayer.position.long];
          dataPlayer.marker = L.marker(center, {icon: Leaflet.avatarIcon});
          Player.addPlayer(dataPlayer);
        });

        state.ObjectMap.$items.forEach((messages, key) => {
          // Leaflet.plotObject(messages);
        });

      })


      this.room.state.Player.onAdd = (players, key) => {
        console.log('onadd')
      }

      this.room.onMessage("send_message", (message) => {
        if (message.message.trim() !== '') {
          toastr.info(`ada pesan masuk`);
          Helper.displayMessage(message);
        }
      });

      this.room.onMessage("onJoin", (message) => {
        toastr.success(`${message.message} ${message.id}`);
      });

      
      this.room.onMessage("move", (message) => {
        console.log(message.player_id, "bergerak")
        console.log(message.position.lat, message.position.long)
        let player = Player.getPlayer(message.id)
        player.moveIcon(message.position.lat, message.position.long);
      });

      this.room.onMessage("onLeave", (message) => {
        toastr.error(`${message} meninggalkan permainan!`);
        Player.removePlayer(message);
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
