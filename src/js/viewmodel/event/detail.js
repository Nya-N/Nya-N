'use strict';

/*
 * ATND イベント詳細 ViewModel
 *
 */


var m = require('../../mithril');

var Model = require('../../model/event/detail');

// ビューモデル
var ViewModel = function(id) {
	// モデル
	this.model = Model.read(id);
};

module.exports = ViewModel;
