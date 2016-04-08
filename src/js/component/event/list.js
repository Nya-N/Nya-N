'use strict';

/*
 * ATND イベント一覧
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
				<div class="panel panel-default">
					<div class="panel-heading">
						<a href="/event/detail/1" config={m.route}>
							イベント名1
						</a>
					</div>
					<div class="panel-body">
						<div class="pull-left">
							<img src="img/150x150.png" height="150" width="150" />
						</div>
						イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細
					</div>
					<div class="panel-footer">
						<div class="pull-right">
							2016/04/09 (土) 13:30 から
						</div>
							225/250人
					</div>
				</div>

				<div class="panel panel-default">
					<div class="panel-heading">
						<a href="/event/detail/1" config={m.route}>
							イベント名1
						</a>

					</div>
					<div class="panel-body">
						<div class="pull-left">
							<img src="img/150x150.png" height="150" width="150" />
						</div>
						イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細
					</div>
					<div class="panel-footer">
						<div class="pull-right">
							2016/04/09 (土) 13:30 から
						</div>
							225/250人
					</div>
				</div>
			</div>
		</div>;
	}
};
