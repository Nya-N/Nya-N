'use strict';

/*
 * ATND イベント作成 ViewModel
 *
 */


var m = require('../../mithril');

// イベント詳細 Model
var EventModel = require('../../model/event');


// ビューモデル
var ViewModel = function(id) {
	var self = this;

	// 入力したイベントデータ
	self.model = new EventModel();
};

// 入力されたイベントデータをクリア
ViewModel.prototype.clear = function() {
	var self = this;
	self.model = new EventModel();
};

module.exports = ViewModel;
