'use strict';

/*
 * ATND イベント一覧
 *
 */

// mithril
var m = require('../../mithril');

// アプリケーションの状態
var state = require('../../state');

// navbar
var Navbar = require('../navbar');

module.exports = {
	controller: function() {
		// ViewModel
		this.vm = state.make_event_list();
	},
	view: function(ctrl) {
		var model = ctrl.vm.model();

		// 前へ
		var prev_id = model.prev_id;
		// 次へ
		var next_id = model.next_id;

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
				{/* ページャー */}
				<nav>
					<ul class="pager">
				  		{/*<li class="previous disabled"><a href=""><span aria-hidden="true">&larr;</span> Older</a></li>*/}
				  		<li class="previous"><a href={"/event?prev_id=" + prev_id} config={m.route}><span aria-hidden="true">&larr;</span> Older</a></li>
						<li class="next"><a href={"/event?next_id=" + next_id} config={m.route}>Newer <span aria-hidden="true">&rarr;</span></a></li>
				  	</ul>
				</nav>
			</div>
		</div>;
	}
};
