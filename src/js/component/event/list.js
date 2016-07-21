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
		var p = m.route.param('p');

		// ViewModel
		this.vm = state.make_event_list(p);
	},
	view: function(ctrl) {
		var model = ctrl.vm.model();

		// 前へ
		var prev_id = model.prev_id;
		// 次へ
		var next_id = model.next_id;

		// イベント一覧
		var events = model.events;

		// HTML
		return <div>
			{/*navbar*/}
			<div>{ m.component(Navbar) }</div>

			<div class="container" style="padding-top:30px" id="root">
				{
					events.map(function(event, i) {
						return <div class="panel panel-default">
							<div class="panel-heading">
								{/* イベント名 */}
								<a href={"/event/detail/" + event.id} config={m.route}>{ event.name }</a>
							</div>
							<div class="panel-body">
								<div class="pull-left">
									{/* イベント画像 */}
									<img src={ event.image } height="150" width="150" />
								</div>
								{
									/* イベント詳細 */
									event.description
								}
							</div>
							<div class="panel-footer">
								<div class="pull-right">
									{/* イベント開始時刻 */}
									{ event.start_date + "から" }
								</div>
								{/* 参加人数／定員 */}
								{ event.members.length + " / " + event.capacity + "人"}
							</div>
						</div>;

					})
				}
				{/* ページャー */}
				<nav>
					<ul class="pager">
				  		{/*<li class="previous disabled"><a href=""><span aria-hidden="true">&larr;</span> Older</a></li>*/}
				  		<li class="previous"><a href={"/event?p=" + prev_id} config={m.route}><span aria-hidden="true">&larr;</span> Older</a></li>
						<li class="next"><a href={"/event?p=" + next_id} config={m.route}>Newer <span aria-hidden="true">&rarr;</span></a></li>
				  	</ul>
				</nav>
			</div>
		</div>;
	}
};
