// const dotenv = require('dotenv');
// dotenv.config();

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
    if (await auth.check()) {
      await this.client.joinOrCreate("my_room", this.options).then(room => {
        colyClient.room = room;
        localStorage.setItem("player_id", room.sessionId)
        this.addListeners();
        console.log("JOIN SUCCESS", room);


      }).catch(e => {
        console.log("JOIN ERROR", e);
      });
    } else {
      alert("Login dulu guys");
      window.location.href = "index.html";
    }
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
          Helper.displayMessage(messages);
        });
        
        state.ObjectMap.$items.forEach((object, key) => {
          Leaflet.plotObject(object);
          // Leaflet.allObjectMap.push(object);
        });

        state.BotEnemy.$items.forEach((bot, key) => {
          Leaflet.plotEnemyBot(bot);
        });

        state.Player.$items.forEach((player, key) => {
          if (player.id == localStorage.getItem('player_id')) {
            Leaflet.map.setView([
              player.position.lat,
              player.position.long
            ], Leaflet.zoom);

            // trackplayback
            

            // Leaflet.marker = L.marker([
            //   player.position.lat,
            //   player.position.long
            // ], {icon: Leaflet.avatarIcon}).addTo(Leaflet.map);
          }
        });

        state.Player.onAdd((player, key) => {
          console.log("onadd")
          let dataPlayer = player;
          const center = [dataPlayer.position.lat, dataPlayer.position.long];
          Leaflet.center = center;
          
          dataPlayer.marker = L.marker(center, {icon: Leaflet.avatarIcon});
          Player.addPlayer(dataPlayer);
        })

      });

      this.room.onStateChange((state) => {

        // state.Player.$items.forEach((player, key) => {
        //   console.log("perubahan")
        // });
        
      })

      this.room.onMessage("send_message", (message) => {
        if (message.message.trim() !== '') {
          toastr.info(`ada pesan masuk`);
          Helper.displayMessage(message);
        }
      });

      this.room.onMessage("onJoin", (message) => {
        toastr.success(`${message.message} ${message.id}`);
      });

      this.room.onMessage("deleteObject", (message) => {
        let object = Leaflet.allObjectMap.find((obj) => obj.id == message.id);
        object.hideObject();
        object.is_active = false;
        Leaflet.allObjectMap = Leaflet.allObjectMap.filter((value) => {
            return value.id != message.id;
        })
      });

      this.room.onMessage("increaseHealth", (message) => {
        let player = Player.getPlayer(message.player_id);
        document.getElementById('healthBar').textContent = message.health;
        player.setHealth(message.health);
      });

      this.room.onMessage("decreaseHealth", (message) => {
        let player = Player.getPlayer(message.player_id);
        document.getElementById('healthBar').textContent = message.health;
        player.setHealth(message.health);
        if (message.health <= 0) {
          if (message.player_id == localStorage.getItem('player_id')) {
            this.room.leave();
            alert(`You Died!`);
            window.location.href = "index.html";
          }
        }
      });

      this.room.onMessage("increasePoint", (message) => {
        let player = Player.getPlayer(message.player_id);
        document.getElementById('pointsBar').textContent = message.points;
        player.setPoints(message.points);
        if (message.points >= 200) {
          this.room.send("endGame", {
            player_id: message.player_id,
            theWinner: player.name
          })
          alert(`${player.name} Winning the game!`);
          window.location.href = "index.html";
        }
      });

      this.room.onMessage("increaseSpeed", (message) => {
        let player = Player.getPlayer(message.player_id);
        document.getElementById('speedBar').textContent = message.speed;
        player.setSpeed(message.speed);
      });
      
      this.room.onMessage("move", (message) => {
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
