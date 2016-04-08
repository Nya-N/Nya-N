'use strict';

var m = require('./mithril');

// TOPページ
var Top = require('./component/top.js');

//HTML要素にコンポーネントをマウント
m.route(document.getElementById("root"), "/", {
	"/": Top,
});
