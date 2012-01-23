# サーバクラス
class Server

	# 定数
	PORT: 3000

	# メンバ変数
	io: null
	clients: null

	# コンストラクタ
	constructor: (port = @PORT) ->
		@io = require('socket.io').listen(port)
		@clients = new ClientCollection
		console.log('Socket.io server listening at http://127.0.0.1:%d/', port)

	# サーバを起動する
	run: ->
		@io.sockets.on('connection', (socket) => @connectAction(socket))

	# 接続確立時のアクション
	connectAction: (socket) ->
		console.log('新しい接続が開始されました: socket_id: %s', socket.id)
		
		# クライアント追加処理
		client = new Client
		client.id = socket.id
		@clients.add(client)
		console.log('クライアントの状態', @clients.clients)

		# オンライン状況を通知する
		@broadcastOnlineStatus(socket)
		
		# イベントの登録
		socket.on('message', (data) => @messageAction(socket, data))
		socket.on('login', (name) => @loginAction(socket, name))
		socket.on('disconnect', => @disconnectAction(socket))

	# メッセージ受信時のアクション
	messageAction: (socket, data) ->
		console.log('メッセージを受信しました', data)

		# 全員に知らせる (emitは本人だけ, broadcastは本人以外の全員)
		socket.json.emit('message', data)
		socket.json.broadcast.emit('message', data)

		console.log('メッセージを通知しました', data)

	# ログイン時のアクション
	loginAction: (socket, name) ->
		console.log('ログインがありました', name)

		# ゲストからハンドルネームに名前変更
		client = @clients.get(socket.id)
		client.name = name
		client.isGuest = false
		console.log('クライアントの状態', @clients.clients)

		# 全員に知らせる (emitは本人だけ, broadcastは本人以外の全員)
		socket.emit('login', name)
		socket.broadcast.emit('login', name)

		# オンライン状況通知
		@broadcastOnlineStatus(socket)

		console.log('ログインを通知しました', name)

	# クライアントとの接続が切れた時のアクション
	disconnectAction: (socket) ->
	
		client = @clients.get(socket.id)
	
		console.log('接続が切れました', client)

		if client.isGuest is false
			# ゲストでなければ、ログアウトを全員に知らせる
			socket.emit('logout', client.name)
			socket.broadcast.emit('logout', client.name)
			console.log('ログアウトを通知しました', client.name)

		@clients.remove(socket.id)
		console.log('クライアントの状態', @clients.clients)

		@broadcastOnlineStatus(socket)

	# オンライン状況をクライアントにブロードキャストする
	broadcastOnlineStatus: (socket) ->
		names = @clients.names()

		# 全員に知らせる (emitは本人だけ, broadcastは本人以外の全員)
		socket.json.emit('online', names)
		socket.json.broadcast.emit('online', names)

		console.log('オンライン状況をブロードキャストしました', names)

# クライアントの名簿クラス
class ClientCollection
	clients: {}
	
	# クライアントを追加する
	add: (client) ->
		@clients[client.id] = client
	
	# クライアントが存在するか
	exists: (id) ->
		return @clients[id]?
	
	# クライアントを取り除く
	remove: (id) ->
		if @exists(id)
			delete @clients[id]
	
	# クライアントを返す
	get: (id) ->
		if @exists(id)
			return @clients[id]
		else
			return false
	
	# クライアントの数を返す
	size: ->
		return @names().length

	# ハンドルネーム一覧を返す
	names: ->
		list = []
		for own id, client of @clients
			list.push(client.name)
		return list

# クライアントモデル
class Client
	id: ''
	name: "ゲスト"
	isGuest: true


# サーバ起動 & 実行
server = new Server(3000)
server.run()
