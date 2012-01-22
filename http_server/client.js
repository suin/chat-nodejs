var Application, Socket, User;

Application = (function() {

  Application.prototype.MESSAGE_MAX = 50;

  Application.prototype.socket = null;

  Application.prototype.user = null;

  Application.prototype.outlet = {
    loginBlock: '#loginBlock',
    loginForm: '#loginBlock form',
    nameTextbox: '#loginBlock form input[name=name]',
    messageBlock: '#messageBlock',
    messageForm: '#messageBlock form',
    messageTextbox: '#messageBlock form input[name=message]',
    validationError: '#validationError',
    messages: '#messages',
    messageTempalte: '#messageTemplate',
    onlineTotal: '#onlineTotal',
    onlineUsers: '#onlineUsers'
  };

  Application.prototype.config = {
    socketUrl: 'http://localhost:3000/'
  };

  function Application(config) {
    var _this = this;
    this.config = $.extend(this.config, config);
    this.socket = new Socket;
    $(this.outlet.loginForm).on('submit', function(event) {
      return _this.loginAction(event);
    });
    $(this.outlet.messageForm).on('submit', function(event) {
      return _this.sendAction(event);
    });
  }

  Application.prototype.run = function() {
    var _this = this;
    this.socket.connect(this.config.socketUrl);
    this.socket.onOnline(function(data) {
      return _this.onlineAction(data);
    });
    this.socket.onMessage(function(data) {
      return _this.receiveMessageAction(data);
    });
    this.socket.onLogin(function(name) {
      return _this.receiveLoginAction(name);
    });
    this.socket.onLogout(function(name) {
      return _this.receiveLogoutAction(name);
    });
    return $(this.outlet.nameTextbox).focus();
  };

  Application.prototype.loginAction = function(event) {
    var name;
    event.preventDefault();
    name = $(this.outlet.nameTextbox).val();
    if (!name) {
      $(this.outlet.validationError).slideDown();
      return;
    }
    this.user = new User(name);
    this.socket.notifyLogin(name);
    $(this.outlet.loginBlock).slideUp();
    $(this.outlet.messageBlock).slideDown();
    return $(this.outlet.messageTextbox).focus();
  };

  Application.prototype.sendAction = function(event) {
    var $textbox, message;
    event.preventDefault();
    $textbox = $(this.outlet.messageTextbox);
    message = $textbox.val();
    if (!message) return;
    this.socket.sendMessage(this.user.name, message);
    return $textbox.val('');
  };

  Application.prototype.onlineAction = function(data) {
    $(this.outlet.onlineTotal).text(data.length);
    return $(this.outlet.onlineUsers).text(data.join(', '));
  };

  Application.prototype.receiveMessageAction = function(data) {
    return this._renderMessage(data.name, data.message);
  };

  Application.prototype.receiveLoginAction = function(name) {
    return this._renderMessage('-', name + 'さんがログインしました');
  };

  Application.prototype.receiveLogoutAction = function(name) {
    return this._renderMessage('-', name + 'さんがログアウトしました');
  };

  Application.prototype._renderMessage = function(name, message) {
    var $template;
    $template = $(this.outlet.messageTempalte).clone();
    $template.removeAttr('id');
    $template.find('[name]').text(name);
    $template.find('[message]').text(message);
    $template.prependTo(this.outlet.messages).slideDown();
    while ($(this.outlet.messages).children().length > this.MESSAGE_MAX) {
      $(this.outlet.messages).children(':last').remove();
    }
  };

  return Application;

})();

User = (function() {

  User.prototype.name = '';

  function User(name) {
    this.name = name;
  }

  return User;

})();

Socket = (function() {

  Socket.prototype.con = null;

  function Socket() {
    this.con = null;
  }

  Socket.prototype.connect = function(url) {
    if (!(typeof io !== "undefined" && io !== null)) {
      throw "socket.io.jsが読み込まれていません";
    }
    return this.con = io.connect(url);
  };

  Socket.prototype.onOnline = function(callback) {
    return this.con.on('online', callback);
  };

  Socket.prototype.notifyLogin = function(name) {
    return this.con.emit('login', name);
  };

  Socket.prototype.onLogin = function(callback) {
    return this.con.on('login', callback);
  };

  Socket.prototype.sendMessage = function(name, message) {
    return this.con.json.emit('message', {
      name: name,
      message: message
    });
  };

  Socket.prototype.onMessage = function(callback) {
    return this.con.on('message', callback);
  };

  Socket.prototype.onLogout = function(callback) {
    return this.con.on('logout', callback);
  };

  return Socket;

})();

jQuery(function() {
  var app;
  app = new Application({
    socketUrl: 'http://localhost:3000/'
  });
  return app.run();
});
