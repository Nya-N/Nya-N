'use strict';

/*
 * ATND イベント一覧 ViewModel
 *
 */


var m = require('../../mithril');

var Model = require('../../model/event/list');

// account Model
var AccountModel = require('../../model/account');

// ビューモデル
var ViewModel = function(p) {
	// モデル
	this.model = Model.read(p);

	// ログイン情報
	this.account = AccountModel.read();

};

module.exports = ViewModel;
