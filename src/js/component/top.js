'use strict';

/*
 * ATND TOP
 *
 */

var m = require('../mithril');

// navbar
var Navbar = require('./navbar');


module.exports = {
	controller: function() {
		console.log("AccountID:" + AccountID);
	},
	view: function(ctrl) {
		return <div>
			{/*navbar*/}
			<div>{ m.component(Navbar) }</div>

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
						<p>
							<a class="btn btn-success btn-lg" href="/event/create" config={m.route} role="button">
								<span class="glyphicon glyphicon-log-in">　</span>
								新しいイベントを作る
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>;
	}
};
