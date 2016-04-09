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
	this.model = Model.read();
};

module.exports = ViewModel;
