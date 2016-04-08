'use strict';

/*
 * ATND イベント詳細ページ
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

			<div class="container" style="padding-top:30px" id="root">
				イベント詳細ページ
			</div>
		</div>;
	}
};
