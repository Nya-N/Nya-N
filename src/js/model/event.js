'use strict';

/*
 * イベント一覧 モデル
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

	self.id = data.id;
	self.name = data.name;
	self.admin = data.admin;
	self.place = data.place;
	self.image_path = data.image_path;
	self.capacity = data.capacity;
	self.attend_num = data.attend_num;
	self.start_date = data.start_date;
	self.description = data.description;
	self.comment_num = data.comment_num;

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
	return m.request({method: "POST", url: api_url, data: {

	}});
};

module.exports = Model;

