'use strict';

var m = require('./mithril');

// TOPページ
var Top = require('./component/top.js');

// イベント作成ページ
var EventCreate = require('./component/event/create.js');
// イベント一覧ページ
var EventList = require('./component/event/list.js');
// イベント詳細ページ
var EventDetail = require('./component/event/detail.js');
// イベント編集ページ
var EventEdit = require('./component/event/edit.js');

m.route.mode = "hash";

//HTML要素にコンポーネントをマウント
m.route(document.getElementById("root"), "/", {
	"/": Top,
	"/event/detail/:id": EventDetail,
	"/event/create": EventCreate,
	"/event/edit/:id": EventEdit,
	"/event": EventList,
});
