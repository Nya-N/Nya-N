'use strict';

/*
 * イベント一覧 モデル
 *
 */

// API URL
var api_url = "api/event";


var m = require('../../mithril');

var Model = function (data, isInitial) {
};

// サーバからページを読み込む
Model.read = function () {
	return m.request({method: "GET", url: api_url, type: Model});
};

// サーバにページのコンテンツを保存
Model.prototype.save = function () {
	var rule = this.body;

	return m.request({method: "POST", url: api_url, data: {

	}});
};

module.exports = Model;

