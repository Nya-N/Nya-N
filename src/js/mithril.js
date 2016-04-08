'use strict';

/*********************************************
 * mithril フレームワークを拡張する
 *********************************************/

// クライアントのバージョン番号
var version = 1;

var m = require('mithril');

/*********************************************
 * m.request 拡張
 *********************************************/

// 上書き前の m.request
var request = m.request;

// node 環境では document にモックを指定
var document = (typeof window === 'object') ? window.document : { querySelectorAll: function(){ return []; }}; 

// サーバから取得したデータを parse する関数
var unwrapSuccess = function(res) {
	// status が success でなければ
	if(res.status !== 'success') {
		throw new Error(res.error_code);
	}

	// 新しいAPIのバージョンがリリースされてれば
	if(res.version > version) {
		throw new Error();
	}

	// response の中身がサーバから受け取るデータの本質
	return res.response;
};

// m.request を上書き
m.request = function(args) {
	// ローディング画面
	var loaders = document.querySelectorAll(".loader");

	// サーバと通信中はローディング画面を表示
	for (var i = 0; i < loaders.length; i++) {
		loaders[i].style.display = "block";
	}

	// サーバから取得したデータを parse
	if(!args.unwrapSuccess) {
		args.unwrapSuccess = unwrapSuccess;
	}

	return request(args)
	.then(function(value) {
		// 通信成功後はローディング画面を隠す
		for (var i = 0; i < loaders.length; i++) {
			loaders[i].style.display = "none";
		}
		return value;
	}, function(error) {
		// 通信失敗時はローディング画面を隠す
		for (var i = 0; i < loaders.length; i++) {
			loaders[i].style.display = "none";
		}

		// エラー画面に遷移
		m.route('/error');
	});
};

module.exports = m;
