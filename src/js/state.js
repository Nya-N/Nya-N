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

// イベント作成
var EventCreateViewModel = require('./viewmodel/event/create');

// コンストラクタ
var State = function() {
	// イベント一覧
	this.event_list = null;
	// イベント登録フォーム
	this.event_create = null;
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

// イベント作成
State.prototype.make_event_create = function() {
	if( ! this.event_create) {
		this.event_create = new EventCreateViewModel();
	}

	return this.event_create;
};

module.exports = new State();
