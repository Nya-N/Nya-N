'use strict';

/*
 * ATND イベント作成ページ
 *
 */

var m = require('../../mithril');

// navbar
var Navbar = require('../navbar');


module.exports = {
	controller: function() {
		// イベント作成ボタンが押下された時
		this.onsubmit = function(e) {
			e.preventDefault();

			// TODO: イベント登録処理

			// イベント詳細画面に遷移
			m.route('/event/detail/1');
		};
	},
	view: function(ctrl) {
		return <div>
			{/*navbar*/}
			<div>{ m.component(Navbar) }</div>

			<div class="container" style="padding-top:30px" id="root">
				<h1>イベントを新規作成</h1>

			<form>
				<div class="form-group">
					<label for="EventName">イベント名</label>
					<input type="text" class="form-control" id="EventName" placeholder="イベント名" />
				</div>
				<div class="form-group">
					<label for="EventAdmin">主催者</label>
					<input type="text" class="form-control" id="EventAdmin" placeholder="主催者" />
				</div>

				<div class="form-group">
					<label for="EventDate">日時</label>
					<input type="text" class="form-control" id="EventDate" placeholder="日時" />
				</div>
				<div class="form-group">
					<label for="EventCapacity">定員</label>
					<input type="text" class="form-control" id="EventCapacity" placeholder="定員" />
				</div>
				<div class="form-group">
					<label for="EventPlace">開催場所</label>
					<input type="text" class="form-control" id="EventPlace" placeholder="開催場所" />
				</div>
				<div class="form-group">
					<label for="EventDetail">詳細</label>
					<textarea class="form-control" rows="10"></textarea>
				</div>


				<div class="form-group">
					<label for="EventImage">イベント画像</label>
					<input type="file" id="EventImage" />
					<p class="help-block">イベント画像をアップロードする</p>
				</div>

				<div>
					<button type="button" class="btn btn-lg btn-success" data-toggle="modal" data-target="#ConfirmModal">イベントを新規作成</button>
				</div>

				{/* 確認画面モーダル */}
				<div id="ConfirmModal" class="modal fade" role="dialog">
					<div class="modal-dialog">

						<div class="modal-content">
							<div class="modal-header">
								{/* 閉じるボタン */}
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 class="modal-title">確認画面</h4>
							</div>
							<div class="modal-body">
								<p>{/* TODO: 確認事項を書く */}</p>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-lg btn-success" data-dismiss="modal"  onclick={ctrl.onsubmit}>送信</button>
								<button type="button" class="btn btn-lg btn-warning" data-dismiss="modal">修正</button>
							</div>
						</div>

					</div>
				</div>
			</form>

			</div>
		</div>;
	}
};
