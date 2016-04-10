'use strict';

/*
 * ATND イベント作成ページ
 *
 */

var m = require('../../mithril');

// アプリケーションの状態
var state = require('../../state');

// navbar
var Navbar = require('../navbar');



module.exports = {
	controller: function() {
		var self = this;
		// ViewModel
		self.vm = state.make_event_create();

		// イベント作成ボタンが押下された時
		self.onsubmit = function(e) {
			// TODO: イベント登録処理

			// イベント詳細画面に遷移
			m.route('/event/detail/1');
		};
	},
	view: function(ctrl) {
		var model = ctrl.vm.model;

		return <div>
			{/*navbar*/}
			<div>{ m.component(Navbar) }</div>

			<div class="container" style="padding-top:30px" id="root">
				<h1>イベントを新規作成</h1>

			{/* イベント登録フォーム */}
			<form>
				<div class="form-group">
					<label for="EventName">イベント名</label>
					<input type="text" class="form-control" id="EventName" placeholder="イベント名" onchange={m.withAttr("value", model.name)} value={model.name()} />
				</div>
				<div class="form-group">
					<label for="EventAdmin">主催者</label>
					<input type="text" class="form-control" id="EventAdmin" placeholder="主催者" onchange={m.withAttr("value", model.admin.name)} value={model.admin.name()} />
				</div>

				<div class="form-group">
					<label for="EventDate">日時</label>
					<input type="text" class="form-control" id="EventDate" placeholder="日時" onchange={m.withAttr("value", model.start_date)} value={model.start_date()} />
				</div>
				<div class="form-group">
					<label for="EventCapacity">定員</label>
					<input type="text" class="form-control" id="EventCapacity" placeholder="定員" onchange={m.withAttr("value", model.capacity)} value={model.capacity()} />
				</div>
				<div class="form-group">
					<label for="EventPlace">開催場所</label>
					<input type="text" class="form-control" id="EventPlace" placeholder="開催場所" onchange={m.withAttr("value", model.place.name)} value={model.place.name()} />
				</div>
				<div class="form-group">
					<label for="EventDetail">詳細</label>
					<textarea class="form-control" rows="10" id="EventDetail" placeholder="詳細" onchange={m.withAttr("value", model.description)} value={model.description()}></textarea>
				</div>

				<div class="form-group">
					<label for="EventImage">イベント画像</label>
					<input type="file" id="EventImage" />
					<p class="help-block">イベント画像をアップロードする</p>
				</div>

				<div>
					<button type="button" class="btn btn-lg btn-success" data-toggle="modal" data-target="#ConfirmModal">イベントを新規作成</button>
				</div>

				{/* BEGIN: 確認画面モーダル */}
				<div id="ConfirmModal" class="modal fade" role="dialog">
					<div class="modal-dialog">

						<div class="modal-content">
							<div class="modal-header">
								{/* 閉じるボタン */}
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 class="modal-title">確認画面</h4>
							</div>
							<div class="modal-body">
								{/* モーダル本文 */}
								<form>
									<div class="form-group">
										<label>イベント名</label>
										<div class="form-control-static">{ model.name() }</div>
									</div>
									<div class="form-group">
										<label>主催者</label>
										<div class="form-control-static">{ model.admin.name() }</div>
									</div>

									<div class="form-group">
										<label>日時</label>
										<div class="form-control-static">{ model.start_date() }</div>
									</div>
									<div class="form-group">
										<label>定員</label>
										<div class="form-control-static">{ model.capacity() }</div>
									</div>
									<div class="form-group">
										<label>開催場所</label>
										<div class="form-control-static">{ model.place.name() }</div>
									</div>
									<div class="form-group">
										<label>詳細</label>
										<div class="form-control-static">{ model.description() }</div>
									</div>
								</form>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-lg btn-success" data-dismiss="modal"  onclick={ctrl.onsubmit}>送信</button>
								<button type="button" class="btn btn-lg btn-warning" data-dismiss="modal">修正</button>
							</div>
						</div>

					</div>
				</div>
				{/* END: 確認画面モーダル */}
			</form>

			</div>
		</div>;
	}
};
