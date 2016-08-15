'use strict';

/*
 * ATND イベント編集 ViewModel
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
	// イベント詳細 Model
	self.model = EventModel.read(id);

	// ログイン情報
	self.account = AccountModel.read();

	// エラーが発生した時のエラーコード
	self.error_code = null;
};

module.exports = ViewModel;
