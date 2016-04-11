/* global $ */
'use strict';

/*
 * ATND イベント詳細ページ
 *
 */

var m = require('../../mithril');


// navbar
var NavbarComponent = require('../navbar');

// error
var ErrorComponent = require('../error');

// form input
var FormInputComponent = require('../form/input');

// form textarea
var FormTextAreaComponent = require('../form/textarea');




// アプリケーションの状態
var state = require('../../state');

module.exports = {
	controller: function() {
		var self = this;

		// イベントID
		self.id = m.route.param("id");

		// TODO: IDが存在しなかった場合のエラー処理

		// ViewModel
		self.vm = state.make_event_detail(self.id);

		// Validator
		self.comment_validator = new m.validator({
			name: function (name) {
				if (!name) {
					return "名前を入力してください";
				}
				if(name.length > 20) {
					return "名前は20文字以内でお願いします";
				}
			},
			body: function (body) {
				if (!body) {
					return "コメントを入力してください";
				}
				if(body.length > 500) {
					return "コメントは500文字以内でお願いします";
				}
			}
		});
		self.join_validator = new m.validator({
			name: function (name) {
				if (!name) {
					return "名前を入力してください";
				}
				if(name.length > 20) {
					return "名前は20文字以内でお願いします";
				}
			}
		});

		// コメントの追加ボタンが押下された時
		self.onsubmit_comment = function(e) {
			// 入力値チェック
			self.comment_validator.validate(self.vm.comment);

			if (self.comment_validator.hasErrors()) {
				return;
			}

			// event_id
			self.vm.comment.event_id(self.vm.model().id());

			// サーバーに保存
			self.vm.comment.save()
			.then(function(id) {
				// 生成されたコメントIDを保存
				self.vm.comment.id(id);

				// コメント一覧に新しく追加したコメントを移動
				self.vm.model().comments.push(self.vm.comment);

				// コメント件数を +1
				self.vm.model().comment_num(self.vm.model().comment_num() + 1);

				// コメント欄を空にする
				self.vm.clear_comment();
			});
		};

		// イベントに参加ボタンが押下された時
		self.onsubmit_join = function(e) {
			// 入力値チェック
			self.join_validator.validate(self.vm.join);

			if (self.join_validator.hasErrors()) {
				return;
			}

			// event_id
			self.vm.join.event_id(self.vm.model().id());

			// サーバーに保存
			self.vm.join.save()
			.then(function(id) {
				// 生成された参加IDを保存
				self.vm.join.id(id);

				// 参加者一覧に新しく参加した人を移動
				self.vm.model().members.push(self.vm.join);

				// 参加者数を +1
				self.vm.model().attend_num(self.vm.model().attend_num() + 1);

				// 参加者名の入力欄を空にする
				self.vm.clear_join();

				// モーダルを閉じる
				$('#AttendModal').modal('hide');
			}, ErrorComponent.handleErrorToViewModel(self.vm));
		};

		// イベントの削除の確認ボタンが押された時
		self.onconfirm_destroy = function(e) {
				// 確認モーダルを表示
				$('#DeleteModal').modal('show');
		};

		// イベントの削除ボタンが押された時
		self.onsubmit_destroy = function(e) {
				self.vm.model().destroy()
				.then(function() {
					// TODO: イベントリストのViewModelキャッシュを更新

					// イベント一覧に遷移
					m.route('/event');
				});
		};

		self.ondestroy_comment_function = function(model, i) {
			// コメントの削除ボタンが押された時
			return function(e) {
				// サーバー上から削除
				model.destroy()
				.then(function() {
					// コメント件数を -1
					self.vm.model().comment_num(self.vm.model().comment_num() - 1);

					// viewmodelからも削除
					self.vm.model().comments.splice(i, 1);
				});
			};
		};

		self.ondestroy_member_function = function(model, i) {
			// 参加者の削除ボタンが押された時
			return function(e) {
				// サーバー上から削除
				model.destroy()
				.then(function() {
					// 参加者件数を -1
					self.vm.model().attend_num(self.vm.model().attend_num() - 1);

					// viewmodelからも削除
					self.vm.model().members.splice(i, 1);
				});
			};
		};
	},
	view: function(ctrl) {
		var model = ctrl.vm.model();
		// HTML
		return <div>
			{/*navbar*/}
			<div>{ m.component(NavbarComponent) }</div>

			<div class="container" style="padding-top:30px" id="root">
				<div class="row">
					<div class="col-md-12">
						{/* イベント名 */}
						<h1>{model.name()}</h1>
					</div>
				</div>

				<div class="row">
					{/* BEGIN: 左本文 */}
					<div class="col-md-9">
						{/* TODO: イベント画像 */}

						<table class="table">
							<tbody>
								<tr>
									<td>日時</td>
									<td>{ model.start_date() + "から"}</td>
								</tr>
								<tr>
									<td>主催者</td>
									<td>{model.admin.name()}</td>
								</tr>
								<tr>
									<td>開催場所</td>
									<td>{model.place.name()}</td>
								</tr>
							</tbody>
						</table>

						<div class="panel panel-default">
							<div class="panel-body">
								{/* イベント詳細 */}
								{ m.trust(model.description()) }
							</div>
						</div>

						<div class="panel panel-default">
							<div class="panel-heading">
								{/* コメント数 */}
								コメント一覧({ model.comment_num() })
							</div>
							<div class="panel-body">
								{/* コメント一覧 */}
								{
									model.comments.map(function(comment, i) {
										return <div>
											{/* 削除ボタン */}
											<div class="pull-right" onclick={ ctrl.ondestroy_comment_function(comment, i) }>
												<span class="glyphicon glyphicon-remove-sign"></span>
											</div>
											{/* コメント投稿者 */}
											{ comment.name() }<br />
											{/* コメント本文 */}
											{ comment.body() }<hr />
										</div>;
									})
								}
								{/* コメント投稿フォーム */}
								<form>
									{/* コメントの名前入力 */}
									{ m.component(FormInputComponent, {
										prop:  ctrl.vm.comment.name,
										error: ctrl.comment_validator.hasError('name'),
										placeholder: "名前",
									}) }
									{/* コメントの内容入力 */}
									{ m.component(FormTextAreaComponent, {
										prop:  ctrl.vm.comment.body,
										error: ctrl.comment_validator.hasError('body'),
										placeholder: "コメント内容",
										rows: 4,
									}) }
									<div>
										<button type="button" class="btn btn-lg btn-success" onclick={ctrl.onsubmit_comment}>コメントを投稿</button>
									</div>
								</form>
							</div>
						</div>
					</div>
					{/* END: 左本文 */}

					{/* BEGIN: 右サイドバー */}
					<div class="col-md-3">
						<button type="button" class="btn btn-lg btn-success" data-toggle="modal" data-target="#AttendModal">
							イベントに参加する
						</button>
						<h3>参加人数 {model.attend_num()} / {model.capacity()}</h3>

						<div class="panel panel-default">
							<div class="panel-heading">
									{/* 参加者数 */}
									参加者一覧
							</div>
							<div class="panel-body">
								{/* 参加者が一人もいなければ"なし"と表示 */}
								{ model.members.length === 0 ? "なし" : "" }
								{
									model.members.map(function(member, i) {
										return <span>
											{/* 削除ボタン */}
											<div class="pull-right" onclick={ ctrl.ondestroy_member_function(member, i) }>
												<span class="glyphicon glyphicon-remove-circle"></span>
											</div>

											{ member.name() } さん<br />
										</span>;
									})
								}
							</div>
						</div>

						<button type="button" class="btn btn-sm btn-warning">イベントを編集</button>
						<button type="button" class="btn btn-sm btn-danger" onclick={ ctrl.onconfirm_destroy }>イベントを削除</button>

					</div>
					{/* END: 右サイドバー */}
				</div>

				{/* BEGIN: イベント参加 入力モーダル */}
				<div id="AttendModal" class="modal fade" role="dialog">
					<div class="modal-dialog">

						<div class="modal-content">
							<div class="modal-header">
								{/* 閉じるボタン */}
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 class="modal-title">イベントに参加する</h4>
							</div>
							<div class="modal-body">
								{/* イベント参加に必要な各入力項目 */}
								<form>
									{/* 名前入力 */}
									<label>名前</label>
									{ m.component(FormInputComponent, {
										prop:  ctrl.vm.join.name,
										error: ctrl.join_validator.hasError('name'),
										placeholder: "名前",
									}) }
								</form>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-lg btn-success" onclick={ ctrl.onsubmit_join}>参加</button>
								<button type="button" class="btn btn-lg btn-warning" data-dismiss="modal">閉じる</button>
							</div>
						</div>
					</div>
				</div>
				{/* END: イベント参加 入力モーダル */}

				{/* BEGIN: イベント削除 確認モーダル */}
				<div id="DeleteModal" class="modal fade" role="dialog">
					<div class="modal-dialog">

						<div class="modal-content">
							<div class="modal-header">
								{/* 閉じるボタン */}
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 class="modal-title">イベントを削除します</h4>
							</div>
							<div class="modal-body">
							「{ model.name() }」を削除します。<br />
							本当によろしいですか？
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-lg btn-danger" data-dismiss="modal" onclick={ ctrl.onsubmit_destroy }>削除</button>
								<button type="button" class="btn btn-lg btn-success" data-dismiss="modal">閉じる</button>
							</div>
						</div>
					</div>
				</div>
				{/* END: イベント参加 入力モーダル */}


				{/* エラーモーダル */}
				{ m.component(ErrorComponent, ctrl.vm) }
			</div>
		</div>;
	}
};
