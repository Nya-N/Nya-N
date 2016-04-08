'use strict';
var m = require('../mithril');

module.exports = {
	controller: function() {},
	view: function(ctrl, args) {
		// 現在のURL
		var active_url = m.route();

		return <div>
			<nav class="navbar navbar-default">
				<div class="container-fluid">
					<div class="navbar-header">
						<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
							<span class="sr-only">Toggle navigation</span>
							<span class="icon-bar">&nbsp;</span>
							<span class="icon-bar">&nbsp;</span>
							<span class="icon-bar">&nbsp;</span>
						</button>
						<span class="navbar-brand">Go ATND</span>
					</div>
					<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
						<ul class="nav navbar-nav">
							<li class={ active_url === "/" ? "active" : "" }><a href="/" config={m.route}>TOP</a></li>
							<li class={ active_url === "/event" ? "active" : "" }><a href="/event" config={m.route}>イベント一覧</a></li>
							<li class={ active_url === "/event/create" ? "active" : "" }><a href="/event/create" config={m.route}>新しくイベントを作る</a></li>
						</ul>
					</div>
				</div>
			</nav>
		</div>;
	}
};
