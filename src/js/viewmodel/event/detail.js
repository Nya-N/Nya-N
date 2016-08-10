'use strict';

/*
 * ATND イベント詳細 ViewModel
 *
 */


var m = require('../../mithril');

// イベント詳細 Model
var EventModel = require('../../model/event');

// コメントモデル
var CommentModel = require('../../model/comment');

// コメントモデル
var JoinModel = require('../../model/join');

// account Model
var AccountModel = require('../../model/account');



// ビューモデル
var ViewModel = function(id) {
	var self = this;
	// イベント詳細 Model
	self.model = EventModel.read(id);

	// 入力したコメント
	self.comment = new CommentModel();

	// 入力した参加登録
	self.join = new JoinModel();

	// ログイン情報
	self.account = AccountModel.read();

	// エラーが発生した時のエラーコード
	self.error_code = null;
};

// 入力されたコメントをクリア
ViewModel.prototype.clear_comment = function() {
	var self = this;
	self.comment = new CommentModel();
};

// 入力された参加登録をクリア
ViewModel.prototype.clear_join = function() {
	var self = this;
	self.join = new JoinModel();
};

module.exports = ViewModel;
