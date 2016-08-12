/* global $ */
'use strict';

/*
 * ATND イベント詳細ページ
 *
 */

var m = require('../../mithril');

// アプリケーションの状態
var state = require('../../state');

// navbar
var Navbar = require('../navbar');

// form input
var FormInputComponent = require('../form/input');

// form textarea
var FormTextAreaComponent = require('../form/textarea');




module.exports = {
	controller: function() {
		var self = this;

		// イベントID
		self.id = m.route.param("id");

		// TODO: IDが存在しなかった場合のエラー処理

		// ViewModel
		self.vm = state.make_event_edit(self.id);

		self.validator = new m.validator({
			name: function (name) {
				if (!name) {
					return "イベント名を入力してください";
				}
				if(name.length > 50) {
					return "イベント名は50文字以内でお願いします";
				}
			},
			admin: function (admin) {
				if (!admin.name()) {
					return "主催者を入力してください";
				}
				if(admin.name().length > 20) {
					return "主催者は20文字以内でお願いします";
				}
			},
			start_date: function (start_date) {
				if (!start_date) {
					return "日時を入力してください";
				}
			},
			capacity: function (capacity) {
				if (!capacity) {
					return "定員を入力してください";
				}
				if (!capacity.toString().match(/^[0-9]+$/)) {
					return "定員を半角数字で入力してください";
				}

			},
			place: function (place) {
				if (!place.name()) {
					return "場所を入力してください";
				}
				if(place.name().length > 50) {
					return "場所は50文字以内でお願いします";
				}
			},
			description: function (description) {
				if (!description) {
					return "詳細を入力してください";
				}
				if(description.length > 5000) {
					return "詳細は5000文字以内でお願いします";
				}
			},
		});

		// 画像がアップロードされた時
		self.onimage = function(e) {
			var file = e.target.files[0];
			if( ! file) {
				self.vm.model().image(null);
				return;
			}

			var fr = new FileReader();
			fr.readAsDataURL(file);
			m.startComputation();
			fr.onload = function(event) {
				self.vm.model().image(event.target.result);
				m.endComputation();
			};
		};

		// イベント作成ボタンの確認が押下された時
		self.onconfirm = function(e) {
			// 入力値チェック
			self.validator.validate(self.vm.model());

			if (self.validator.hasErrors()) {
				return;
			}

			// 確認画面モーダルを表示
			$('#ConfirmModal').modal('show');

		};
		// イベント作成ボタンが押下された時
		self.onsubmit = function(e) {
			// イベント登録
			self.vm.model().save()
			.then(function(id) {
				// イベント編集フォームをクリア
				state.event_edit = null;

				// イベント詳細もクリア(TODO: できれば編集→詳細にデータを受け渡したい)
				state.event_detail = null;

				// TODO: イベント一覧をクリア

				// イベント詳細画面に遷移
				m.route('/event/detail/' + id);
			});
		};
	},
	view: function(ctrl) {
		var model = ctrl.vm.model();

		return <div>
			{/*navbar*/}
			<div>{ m.component(Navbar, ctrl.vm.account()) }</div>

			<div class="container" style="padding-top:30px" id="root">
				<h1>イベント編集</h1>

			{/* イベント編集フォーム */}
			<form>
				<div class="form-group">
					<label for="EventName">イベント名</label>
					{ m.component(FormInputComponent, {
						prop:  model.name,
						error: ctrl.validator.hasError('name'),
						placeholder: "イベント名",
					}) }

				</div>
				<div class="form-group">
					<label for="EventAdmin">主催者</label>
					{ m.component(FormInputComponent, {
						prop:  model.admin.name,
						error: ctrl.validator.hasError('admin'),
						placeholder: "主催者",
						readonly: true,
					}) }

				</div>

				<div class="form-group">
					<label for="EventDate">日時</label>
					{ m.component(FormInputComponent, {
						prop:  model.start_date,
						error: ctrl.validator.hasError('start_date'),
						placeholder: "日時",
						config: this.showCalendar,
					}) }

				</div>
				<div class="form-group">
					<label for="EventCapacity">定員</label>
					{ m.component(FormInputComponent, {
						prop:  model.capacity,
						error: ctrl.validator.hasError('capacity'),
						placeholder: "定員",
					}) }

				</div>
				<div class="form-group">
					<label for="EventPlace">開催場所</label>
					{ m.component(FormInputComponent, {
						prop:  model.place.name,
						error: ctrl.validator.hasError('place'),
						placeholder: "開催場所",
					}) }

				</div>
				<div class="form-group">
					<label for="EventDetail">詳細</label>
					{ m.component(FormTextAreaComponent, {
						prop:  model.description,
						error: ctrl.validator.hasError('description'),
						placeholder: "詳細",
						rows: 10,
					}) }

				</div>

				<div class="form-group">
					<label for="EventImage">イベント画像</label>
					<input type="file" id="EventImage" onchange={ ctrl.onimage } />
					<p class="help-block">イベント画像をアップロードする</p>
					{ model.image() ? <img src={ model.image() } width="150" height="150" /> : '' }
				</div>

				<div>
					<button
						type="button"
						class="btn btn-lg btn-success"
						onclick={ ctrl.onconfirm }
						disabled={ ctrl.vm.account().id ? false : true }>編集</button>
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
										<div class="form-control-static">{ m.trust(model.description()) }</div>
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
	},
	showCalendar: function(element, isInitialized, context) {
		// 初回描画時のみ処理
		if (isInitialized) return;
		$(element).datetimepicker({
		  format: 'Y-m-d H:i',
			step: 15,
			lang: 'ja'
		});
	}
};
