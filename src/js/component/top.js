'use strict';

/*
 * ATND TOP
 *
 */

var m = require('../mithril');

// navbar
var Navbar = require('./navbar');

// account Model
var AccountModel = require('../model/account');


module.exports = {
	controller: function() {

		this.vm = {};
		this.vm.account = AccountModel.read();

	},
	view: function(ctrl) {

		var create_event_btn = "";
		if ( ctrl.vm.account().id > 0 ) {
			create_event_btn =
				<p>
					<a class="btn btn-success btn-lg" href="/event/create" config={m.route} role="button">
						<span class="glyphicon glyphicon-log-in">　</span>
						新しいイベントを作る
					</a>
				</p>
		}

		return <div>
			{/*navbar*/}
			<div>{ m.component(Navbar, ctrl.vm.account()) }</div>

			{/*jumbotron*/}
			<div class="container" style="padding-top:30px" id="root">
				<div class="jumbotron" style="background-color: rgba(255, 255, 255, 0.7);">
					<div class="container">
						<h1>Go ATND</h1>
						<p>
							イベントの告知・運営管理が出来ます。<br />
							仲間内の飲み会から勉強会まで<br />
							色んなイベントで色んな人に会いましょう。<br />
						</p>
						{ create_event_btn }
					</div>
				</div>
			</div>
		</div>;
	}
};
