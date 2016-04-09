'use strict';

/*
 * イベント一覧 モデル
 *
 */

// API URL
var api_url = "api/event/";


var m = require('../../mithril');


// コンストラクタ
var Model = function (data, isInitial) {
	this.id = data.id;
	this.name = data.name;
	this.admin = data.admin;
	this.place = data.place;
	this.image_path = data.image_path;
	this.capacity = data.capacity;
	this.attend_num = data.attend_num;
	this.start_date = data.start_date;
	this.description = data.description;
	this.member_num = data.member_num;
	this.comment_num = data.comment_num;
	this.members = data.members;
	this.comments = data.comments;
};

// サーバからJSONを読み込む
Model.read = function (id) {
	return m.request({
		method: "GET",
		url: api_url + id,
		type: Model
	});
};

// サーバにJSONを保存
Model.prototype.save = function () {
	return m.request({method: "POST", url: api_url, data: {

	}});
};

module.exports = Model;

