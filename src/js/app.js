'use strict';

var m = require('./mithril');

// TOPページ
var Top = require('./component/top.js');

// イベント作成ページ
var EventCreate = require('./component/event/create.js');
// イベント一覧ページ
var EventList = require('./component/event/list.js');





//HTML要素にコンポーネントをマウント
m.route(document.getElementById("root"), "/", {
	"/": Top,
	"/event/create": EventCreate,
	"/event": EventList,
});
