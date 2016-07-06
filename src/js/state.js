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

// イベント編集
var EventEditViewModel = require('./viewmodel/event/edit');




// コンストラクタ
var State = function() {
	// イベント一覧
	this.event_list = null;
	// イベント登録フォーム
	this.event_create = null;
	// イベント編集フォーム
	this.event_edit = null;
	// イベント詳細
	this.event_detail = null;
};

// イベント一覧
State.prototype.make_event_list = function(p) {
	p = Number(p);
	// キャッシュしてた ViewModel と同じ p ならば使い回す
	if(this.event_list && p === this.event_list.model().p()) {
		return this.event_list;
	}

	this.event_list = new EventListViewModel(p);

	return this.event_list;
};

// イベント詳細
State.prototype.make_event_detail = function(id) {
	id = Number(id);
	// キャッシュしてた ViewModel と同じ id ならば使い回す
	if(this.event_detail && id === this.event_detail.model().id()) {
		return this.event_detail;
	}

	this.event_detail = new EventDetailViewModel(id);
	return this.event_detail;
};

// イベント作成
State.prototype.make_event_create = function() {
	if( ! this.event_create) {
		this.event_create = new EventCreateViewModel();
	}

	return this.event_create;
};

// イベント編集
State.prototype.make_event_edit = function(id) {
	id = Number(id);
	// キャッシュしてた ViewModel と同じ id ならば使い回す
	if(this.event_edit && id === this.event_edit.model().id()) {
		return this.event_edit;
	}

	this.event_edit = new EventEditViewModel(id);
	return this.event_edit;
};




module.exports = new State();
