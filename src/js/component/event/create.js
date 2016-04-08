'use strict';

/*
 * ATND TOP
 *
 */

var m = require('../../mithril');

// navbar
var Navbar = require('../navbar');


module.exports = {
	controller: function() {
	},
	view: function(ctrl) {
		return <div>
			{/*navbar*/}
			<div>{ m.component(Navbar) }</div>

			{/*jumbotron*/}
			<div class="container" style="padding-top:30px" id="root">
				イベント作成ページ
			</div>
		</div>;
	}
};
