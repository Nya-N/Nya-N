'use strict';

/*
 * アプリケーションの状態を管理するクラス
 * シングルトン
 */

var m = require('./mithril');

var EventListViewModel = require('./viewmodel/event/list');

// コンストラクタ
var State = function() {
	// イベント一覧
	this.event_list = null;
};

// イベント一覧
State.prototype.make_event_list = function() {
	if( ! this.event_list) {
		this.event_list = new EventListViewModel();
	}

	return this.event_list;
};

module.exports = new State();
