'use strict';

/*
 * ATND イベント一覧 ViewModel
 *
 */


var m = require('../../mithril');

var Model = require('../../model/event/list');

// ビューモデル
var ViewModel = function(p) {
	// モデル
	this.model = Model.read(p);
};

module.exports = ViewModel;
