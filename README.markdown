# Suin Chat

Suin Chat は Node.js, Socket.io, CoffeeScript, jQueryを組み合わせて作られたウェブチャットアプリケーションです。Socket.ioを勉強するために作ったシンプルな実装例になっています。

## 特徴

Suin Chatを作りにあたって、1) Node.js側の実装を最小限にする、2) CoffeeScript で書かれている に注力しました。

### 1) Node.js 側の実装は最小限にする

クライアントでもサーバでもJavaScriptで構築できるのがNode.jsの魅力です。
しかし、既存のアプリケーションが PHP、Python、Ruby で動いているケースが少なくありません。
既存アプリケーションをNode.jsに移植することなく、あくまで追加機能としてWebSocketを実装したいと考えました。
そこで、Node.jsはWebSocketサーバとしてのみ使う設計にしました。
express を使い Node.js で socket.io を使いたいという方にはあまり参考にならないかもしれません。

### 2) CoffeeScript で書かれている

このプロジェクトは、CoffeeScriptのサンプルも兼ねています。
慣れ親しんでいる人には、かえって邪魔かもしれませんが、CoffeeScriptには必要以上にコメントを書きました。
また、CoffeeScriptとjQueryライブラリとの組み合わせの参考例になると思います。

## 利用手順

このアプリケーションを使うためには、 node.js, npm がインストールされている必要があり、pythonが使える環境が推奨されます。

### 1. socket.io のダウンロード・インストール

このアプリケーションには socket.io がバンドルされていません。socketio_server フォルダに socket.io をダウンロード・インストールします。

```
cd socketio_server
npm install socket.io
```

ターミナルで、上記を実行してください。
問題なくインストールされると、下記が出力され node_modules フォルダに socket.io が追加されます。

```
npm http GET https://registry.npmjs.org/socket.io/0.8.7
npm http 304 https://registry.npmjs.org/socket.io/0.8.7
npm http GET https://registry.npmjs.org/socket.io-client/0.8.7
npm http GET https://registry.npmjs.org/policyfile/0.0.4
npm http GET https://registry.npmjs.org/redis/0.6.7
npm http 304 https://registry.npmjs.org/socket.io-client/0.8.7
npm http 304 https://registry.npmjs.org/policyfile/0.0.4
npm http 304 https://registry.npmjs.org/redis/0.6.7
npm http GET https://registry.npmjs.org/uglify-js/1.0.6
npm http GET https://registry.npmjs.org/websocket-client/1.0.0
npm http GET https://registry.npmjs.org/xmlhttprequest/1.2.2
npm http 304 https://registry.npmjs.org/xmlhttprequest/1.2.2
npm http 304 https://registry.npmjs.org/websocket-client/1.0.0
npm http 304 https://registry.npmjs.org/uglify-js/1.0.6
socket.io@0.8.7 ./node_modules/socket.io 
├── policyfile@0.0.4
├── redis@0.6.7
└── socket.io-client@0.8.7
```

### 2. Socket.ioサーバの起動

start_socketio_server.sh を実行します。

```
sh start_socketio_server.sh
```

うまくサーバが起動すれば、下記のログが表示されます。

```
   info  - socket.io started
Socket.io server listening at http://127.0.0.1:3000/
```

ためしにブラウザで http://localhost:3000/ にアクセスしてみると「Welcome to socket.io.」と表示されるでしょう。

### 3. HTTPサーバの起動

python が使える環境であれば、下記を実行するだけで起動することができます。

```
sh start_http_server.sh 
```

この場合のログは次のようになるでしょう。デフォルトでは 8000 ポートでサーバを起動します。

```
Serving HTTP on 0.0.0.0 port 8000 ...
```

python が使えない環境では、ApacheなどのHTTPサーバを用意する必要があります。
LAMPやXAMPP、MAMPなど、Apacheが手軽に使える環境を構築しておくと良いでしょう。

この場合は、http_server フォルダがドキュメントルートになるよう、適切に配置してください。

### 4. ブラウザでアクセスする

pythonでサーバを起動した場合は http://localhost:8000/ に、
その他の場合は、おそらく http://localhost/ にアクセスします。
アプリケーションが使えるようになっているでしょう。

### 5. サーバを終了する

サーバを終了する場合は、control + C でプロセスを終了してください。

### 注意書き

* 数カ所 http_server フォルダ内のファイルで localhost と直書きになっているところがあります。このため LAN経由 や 公開サーバ でテストするときは、適宜、ローカルIPやドメインに書き換えてください。

## CoffeeScript のコンパイル

下記のコマンドで compile_coffee_script.sh を実行することで、CoffeeScript を JavaScript にコンパイルすることができます。
内部的にどんな処理をやっているかは compile_coffee_script.sh をご覧ください。

```
sh compile_coffee_script.sh
```

## ファイル構成

```
.
├── http_server → HTTPサーバ
│   ├── bootstrap.css
│   ├── client.coffee → client.js の CoffeeScript
│   ├── client.js
│   ├── index.html
│   ├── jquery-1.7.1.min.js
│   └── style.css
├── socketio_server → Node.jsサーバ
│   ├── app.coffee → app.js の CoffeeScript
│   ├── app.js
│   ├── node_modules → socket.io などのモジュールが置かれるフォルダ
│   └── package.json
├── compile_coffee_script.sh → CoffeeScriptをコンパイルするシェル
├── start_http_server.sh → HTTPサーバを起動するシェル
└── start_socketio_server.sh → Socket.ioサーバを起動するシェル
```

## ライセンス

MIT ライセンス

## 依存するライブラリとライセンス

おそらく Twitter Bootstrap を含んでいるでしょう

https://github.com/twitter/bootstrap 
Copyright 2011 Twitter, Inc.
Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0

------

おそらく jQuery を含んでいるでしょう

http://jquery.com/
You may use any jQuery project under the terms of either the MIT License or the GNU General Public License (GPL) Version 2.
The MIT License is recommended for most projects. It is simple and easy to understand and it places almost no restrictions on what you can do with a jQuery project.

If the GPL suits your project better you are also free to use a jQuery project under that license.

You don’t have to do anything special to choose one license or the other and you don’t have to notify anyone which license you are using. You are free to use a jQuery project in commercial projects as long as the copyright header is left intact.

-----

おそらく Socket.io を含んでいるでしょう

https://github.com/LearnBoost/socket.io
(The MIT License)

Copyright (c) 2011 Guillermo Rauch <guillermo@learnboost.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.