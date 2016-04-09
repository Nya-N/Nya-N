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
	self.image_path  = m.prop(data.image_path);
	self.capacity    = m.prop(data.capacity    || "");
	self.attend_num  = m.prop(data.attend_num  || 0);
	self.start_date  = m.prop(data.start_date  || "");
	self.description = m.prop(data.description || "");
	self.comment_num = m.prop(data.comment_num || 0);

	// TODO: リファクタ
	// 主催者
	if(data.admin) {
		self.admin = {
			name: m.prop(data.admin.name),
		};
	}
	else {
		self.admin = {
			name: m.prop(""),
		};
	}

	// 場所
	if(data.place) {
		self.place = {
			name: m.prop(data.place.name),
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
};

// サーバからJSONを読み込む
Model.read = function (id) {
	return m.request({
		method: "GET",
		url: api_url + "/" + id,
		type: Model
	});
};

// サーバにJSONを保存
Model.prototype.save = function () {
	var self = this;

	return m.request({method: "POST", url: api_url, data: {
		id:          self.id(),
		name:        self.name(),
		admin:       self.admin(),
		place:       self.place(),
		// TODO: image_path: self.image_path
		capacity:    self.capacity(),
		start_date:  self.start_date(),
		description: self.description(),
	}});
};

module.exports = Model;

