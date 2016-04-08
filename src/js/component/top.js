'use strict';

/*
 * ATND TOP
 *
 */

var m = require('../mithril');

// ナビバー
var Navbar = require('./navbar');


module.exports = {
	controller: function() {
	},
	view: function(ctrl) {
		return <div>
			<div>{ m.component(Navbar) }</div>

			<div class="container" style="padding-top:30px" id="root">
				Hello World!
			</div>
		</div>;
	}
};
