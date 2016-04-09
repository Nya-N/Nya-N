'use strict';

/*
 * アプリケーションの状態を管理するクラス
 * ViewModel を生成する Singleton な Factory
 */

var m = require('./mithril');

// イベント一覧
var EventListViewModel = require('./viewmodel/event/list');

// イベント詳細
var EventDetailViewModel = require('./viewmodel/event/detail');


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

// イベント詳細(状態を保存しない)
State.prototype.make_event_detail = function(id) {
	return  new EventDetailViewModel(id);
};

module.exports = new State();
