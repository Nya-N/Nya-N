'use strict';

/*
 * ATND イベント一覧 ViewModel
 *
 */


var m = require('../../mithril');

var Model = require('../../model/event/list');

// ビューモデル
var ViewModel = function() {
	// モデル
	this.model = null;
};

ViewModel.prototype.init = function() {
	var self = this;

	// モデルを読み込み
	return Model.read().then(function(model) {
		self.model = model;
		return model;
	});
};
module.exports = ViewModel;
