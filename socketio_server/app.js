var Client, ClientCollection, Server, server,
  __hasProp = Object.prototype.hasOwnProperty;

Server = (function() {

  Server.prototype.PORT = 3000;

  Server.prototype.io = null;

  Server.prototype.clients = null;

  function Server(port) {
    if (port == null) port = this.PORT;
    this.io = require('socket.io').listen(port);
    this.clients = new ClientCollection;
    console.log('Socket.io server listening at http://127.0.0.1:%d/', port);
  }

  Server.prototype.run = function() {
    var _this = this;
    return this.io.sockets.on('connection', function(socket) {
      return _this.connectAction(socket);
    });
  };

  Server.prototype.connectAction = function(socket) {
    var client,
      _this = this;
    console.log('新しい接続が開始されました: socket_id: %s', socket.id);
    client = new Client;
    client.id = socket.id;
    this.clients.add(client);
    console.log('クライアントの状態', this.clients.clients);
    this.broadcastOnlineStatus(socket);
    socket.on('message', function(data) {
      return _this.messageAction(socket, data);
    });
    socket.on('login', function(name) {
      return _this.loginAction(socket, name);
    });
    return socket.on('disconnect', function() {
      return _this.disconnectAction(socket);
    });
  };

  Server.prototype.messageAction = function(socket, data) {
    console.log('メッセージを受信しました', data);
    socket.json.emit('message', data);
    socket.json.broadcast.emit('message', data);
    return console.log('メッセージを通知しました', data);
  };

  Server.prototype.loginAction = function(socket, name) {
    var client;
    console.log('ログインがありました', name);
    client = this.clients.get(socket.id);
    client.name = name;
    client.isGuest = false;
    console.log('クライアントの状態', this.clients.clients);
    socket.emit('login', name);
    socket.broadcast.emit('login', name);
    this.broadcastOnlineStatus(socket);
    return console.log('ログインを通知しました', name);
  };

  Server.prototype.disconnectAction = function(socket) {
    var client;
    client = this.clients.get(socket.id);
    console.log('接続が切れました', client);
    if (client.isGuest === false) {
      socket.emit('logout', client.name);
      socket.broadcast.emit('logout', client.name);
      console.log('ログアウトを通知しました', client.name);
    }
    this.clients.remove(socket.id);
    console.log('クライアントの状態', this.clients.clients);
    return this.broadcastOnlineStatus(socket);
  };

  Server.prototype.broadcastOnlineStatus = function(socket) {
    var names;
    names = this.clients.names();
    socket.json.emit('online', names);
    socket.json.broadcast.emit('online', names);
    return console.log('オンライン状況をブロードキャストしました', names);
  };

  return Server;

})();

ClientCollection = (function() {

  function ClientCollection() {}

  ClientCollection.prototype.clients = {};

  ClientCollection.prototype.add = function(client) {
    return this.clients[client.id] = client;
  };

  ClientCollection.prototype.exists = function(id) {
    return this.clients[id] != null;
  };

  ClientCollection.prototype.remove = function(id) {
    if (this.exists(id)) return delete this.clients[id];
  };

  ClientCollection.prototype.get = function(id) {
    if (this.exists(id)) {
      return this.clients[id];
    } else {
      return false;
    }
  };

  ClientCollection.prototype.size = function() {
    return this.names().length;
  };

  ClientCollection.prototype.names = function() {
    var client, id, list, _ref;
    list = [];
    _ref = this.clients;
    for (id in _ref) {
      if (!__hasProp.call(_ref, id)) continue;
      client = _ref[id];
      list.push(client.name);
    }
    return list;
  };

  return ClientCollection;

})();

Client = (function() {

  function Client() {}

  Client.prototype.id = '';

  Client.prototype.name = "ゲスト";

  Client.prototype.isGuest = true;

  return Client;

})();

server = new Server(3000);

server.run();
