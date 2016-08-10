'use strict';

/*
 * イベント詳細 モデル
 *
 */

// API URL
var api_url = "api/account";

var m = require('../mithril');


// コンストラクタ
var Model = function (data, isInitial) {
	var self = this;

	console.log("いい",data);

	if( ! data) {
		data = {};
	}

	self.id          = m.prop(data.id);
	self.name        = m.prop(data.name        || "");
	self.image       = m.prop(data.image    || "");

};

// サーバからJSONを読み込む
Model.read = function(id) {
	return m.request({
		method: "GET",
		url: api_url,
		type: this.Model
	})
	.then(function(model) {
		console.log("うう", model);

		return model;
	});
};



// サーバにJSONを保存
Model.prototype.save = function () {
	var self = this;

	var method = self.isInitial() ? 'POST' : 'PUT';
	var url    = self.isInitial() ? api_url : api_url + "/" + self.id();

	return m.request({method: method, url: url, data: {
		name:        self.name(),
		admin:       self.admin.name(),
		start_date:  self.start_date(),
		capacity:    Number(self.capacity()), // int
		place:       self.place.name(),
		image:       self.image(),
		description: self.description(),
	}})
	.then(function(res) {
		self.isInitial(false); // サーバーにレコードが存在する
		// 生成されたイベントID
		return self.id() || res.id;
	});
};

// サーバからJSONを破棄
Model.prototype.destroy = function () {
	return m.request({
		method: "DELETE",
		url: api_url + "/" + this.id(),
		data: {}
	})
	.then(function(model) {
		model.isInitial(true); // サーバーにレコードが存在しない
	});

};

module.exports = Model;
