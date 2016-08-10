'use strict';

/*
 * ATND イベント作成 ViewModel
 *
 */


var m = require('../../mithril');

// イベント詳細 Model
var EventModel = require('../../model/event');

// account Model
var AccountModel = require('../../model/account');

// ビューモデル
var ViewModel = function(id) {
	var self = this;

	// 入力したイベントデータ
	self.model = new EventModel();

	// ログイン情報
	self.account = AccountModel.read();

};

// 入力されたイベントデータをクリア
ViewModel.prototype.clear = function() {
	var self = this;
	self.model = new EventModel();
};

module.exports = ViewModel;
