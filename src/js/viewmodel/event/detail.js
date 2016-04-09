'use strict';

/*
 * ATND イベント詳細 ViewModel
 *
 */


var m = require('../../mithril');

// イベント詳細 Model
var EventModel = require('../../model/event/detail');

// コメントモデル
var CommentModel = require('../../model/comment');

// ビューモデル
var ViewModel = function(id) {
	var self = this;
	// イベント詳細 Model
	self.model = EventModel.read(id);

	// 入力したコメント
	self.comment = new CommentModel();
};

module.exports = ViewModel;
