# メインクラス
class Application

	# メッセージ最大表示数
	MESSAGE_MAX: 50

	socket: null
	user: null

	# セレクター
	outlet: 
		loginBlock: '#loginBlock'
		loginForm: '#loginBlock form'
		nameTextbox: '#loginBlock form input[name=name]'
		messageBlock: '#messageBlock'
		messageForm: '#messageBlock form'
		messageTextbox: '#messageBlock form input[name=message]'
		validationError: '#validationError'
		messages: '#messages'
		messageTempalte: '#messageTemplate'
		onlineTotal: '#onlineTotal'
		onlineUsers: '#onlineUsers'

	# 設定値配列
	config: 
		socketUrl: 'http://localhost:3000/'

	# コンストラクタ
	constructor: (config) ->
		@config = $.extend(@config, config)
		@socket = new Socket # Socketクラスインスタンスを生成する
		$(@outlet.loginForm).on('submit', (event) => @loginAction(event))
		$(@outlet.messageForm).on('submit', (event) => @sendAction(event))

	# 実行
	run: ->
		@socket.connect(@config.socketUrl)
		@socket.onOnline((data) => @onlineAction(data))
		@socket.onMessage((data) => @receiveMessageAction(data))
		@socket.onLogin((name) => @receiveLoginAction(name))
		@socket.onLogout((name) => @receiveLogoutAction(name))
		$(@outlet.nameTextbox).focus()

	# ログインアクション
	loginAction: (event) ->
		event.preventDefault() # 元のイベントをキャンセル
		name = $(@outlet.nameTextbox).val()

		if not name # ハンドルネームが空っぽなら、エラーメッセージを出して中断
			$(@outlet.validationError).slideDown()
			return

		@user = new User(name) # ユーザモデルを作成
		@socket.notifyLogin(name)

		$(@outlet.loginBlock).slideUp()
		$(@outlet.messageBlock).slideDown()
		$(@outlet.messageTextbox).focus()

	# 送信アクション
	sendAction: (event) ->
		event.preventDefault() # 元のイベントをキャンセル
		$textbox = $(@outlet.messageTextbox)
		message = $textbox.val()
		
		if not message # メッセージが空っぽなら中断
			return
		
		@socket.sendMessage(@user.name, message)
		$textbox.val('')

	# オンラインアクション
	onlineAction: (data) ->
		$(@outlet.onlineTotal).text(data.length)
		$(@outlet.onlineUsers).text(data.join(', '))

	# 受信アクション
	receiveMessageAction: (data) ->
		@_renderMessage(data.name, data.message)

	# ログイン感知アクション
	receiveLoginAction: (name) ->
		@_renderMessage('-', name + 'さんがログインしました')

	# ログアウト感知アクション
	receiveLogoutAction: (name) ->
		@_renderMessage('-', name + 'さんがログアウトしました')

	# メッセージを追加する
	_renderMessage: (name, message) ->
		$template = $(@outlet.messageTempalte).clone()
		$template.removeAttr('id')
		$template.find('[name]').text(name)
		$template.find('[message]').text(message)
		$template.prependTo(@outlet.messages).slideDown()
		$(@outlet.messages).children(':last').remove() while $(@outlet.messages).children().length > @MESSAGE_MAX
		return 

# ユーザモデル
class User
	name: ''
	constructor: (name) ->
		@name = name

# socket.io.js のラッパークラス
class Socket

	# コネクション
	con: null

	# コンストラクタ
	constructor: ->
		@con = null

	# 接続する
	connect: (url) ->
		if not io?
			throw "socket.io.jsが読み込まれていません"

		@con = io.connect(url)

	# オンラインイベントのコールバックを登録する
	onOnline: (callback) ->
		@con.on('online', callback)

	# ログインを通知する
	notifyLogin: (name) ->
		@con.emit('login', name)

	# ログインイベントのコールバックを登録する
	onLogin: (callback) ->
		@con.on('login', callback)

	# メッセージを送信する
	sendMessage: (name, message) ->
		@con.json.emit('message', {name: name, message: message})

	# プッシュイベントのコールバックを登録する
	onMessage: (callback) ->
		@con.on('message', callback)

	# ログアウトイベントのコールバックを登録する
	onLogout: (callback) ->
		@con.on('logout', callback)

# 実行処理
jQuery -> 
	app = new Application(
		socketUrl: 'http://'+location.hostname+':3000/' # Socket.ioサーバのURL
	)
	app.run()

