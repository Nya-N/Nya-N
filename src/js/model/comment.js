'use strict';

/*
 * イベントに付随するコメント モデル
 *
 */

// API URL
var api_url = "api/comment";


var m = require('../mithril');


// コンストラクタ
var Model = function (data, isInitial) {
	if( ! data) {
		data = {};
	}
	// コメントID
	this.id = m.prop(data.id);
	// イベントID
	this.event_id = m.prop(data.event_id);
	// コメントした人の名前
	this.name = m.prop(data.name || "");
	// コメント内容
	this.body = m.prop(data.body || "");
};

// サーバからJSONを読み込む
Model.read = function (id) {
	return m.request({
		method: "GET",
		url: api_url + '/' + id,
		type: Model
	});
};

// サーバにJSONを保存
Model.prototype.save = function () {
	return m.request({method: "POST", url: api_url, data: {
		event_id: this.event_id(),
		name:     this.name(),
		body:     this.body()
	}});
};

module.exports = Model;

