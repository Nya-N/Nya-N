'use strict';

/*
 * イベントに付随する参加者 モデル
 *
 */

// API URL
var api_url = "api/join";


var m = require('../mithril');


// コンストラクタ
var Model = function (data, isInitial) {
	if( ! data) {
		data = {};
	}
	// JOIN ID
	this.id = m.prop(data.id);
	// account_id
	this.account_id = m.prop(data.account_id);
	// イベントID
	this.event_id = m.prop(data.event_id);
	// 参加者の名前
	this.name = m.prop(data.name || "");
	// 画像
	this.image = m.prop(data.image || "");
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
	}})
	.then(function(res) {
		// 生成されたコメントID
		return res.id;
	});
};

// サーバからJSONを破棄
Model.prototype.destroy = function () {
	return m.request({
		method: "DELETE",
		url: api_url + "/" + this.id(),
		data: {}
	});
};

module.exports = Model;
