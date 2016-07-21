'use strict';

/*
 * イベント詳細 モデル
 *
 */

// API URL
var api_url = "api/event";


var m = require('../mithril');

// コメント モデル
var CommentModel = require('./comment');

// コメント モデル
var JoinModel = require('./join');



// コンストラクタ
var Model = function (data, isInitial) {
	var self = this;

	if( ! data) {
		data = {};
	}
	self.id          = m.prop(data.id);
	self.name        = m.prop(data.name        || "");
	self.place       = m.prop(data.place       || "");
	self.image       = m.prop(data.image);
	self.capacity    = m.prop(data.capacity    || "");
	self.start_date  = m.prop(data.start_date  || "");
	self.description = m.prop(data.description || "");

	// 主催者
	if(data.admin) {
		self.admin = {
			name:m.prop(data.admin.name),
		}
	} else {
		self.admin = {
			name:m.prop(""),
		};
	}

	// 場所
	if(data.place) {
		self.place = {
			name: m.prop(data.place),
		};
	}
	else {
		self.place = {
			name: m.prop(""),
		};
	}

	// 参加者一覧
	if(data.members) {
		self.members = [];
		data.members.forEach(function(member) {
			self.members.push(new JoinModel(member));
		});
	}
	
	// コメント一覧
	if(data.comments) {
		self.comments = [];
		data.comments.forEach(function(comment) {
			self.comments.push(new CommentModel(comment));
		});
	}

	self.isInitial = m.prop(true); // サーバーにレコードが存在しない
};

// サーバからJSONを読み込む
Model.read = function (id) {
	return m.request({
		method: "GET",
		url: api_url + "/" + id,
		type: Model
	})
	.then(function(model) {
		model.isInitial(false); // サーバーにレコードが存在する

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

