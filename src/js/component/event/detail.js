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

				// コメント欄を空にする
				self.vm.clear_comment();
			});
		};

		// イベントに参加ボタンが押下された時
		self.onsubmit_join = function(e) {

			// event_id
			self.vm.join.event_id(self.vm.model().id());

			// サーバーに保存
			self.vm.join.save()
			.then(function(id) {
				// 生成された参加IDを保存
				self.vm.join.id(id);

				// 参加者一覧に新しく参加した人を移動
				self.vm.model().members.push(self.vm.join);

				// 参加者名の入力欄を空にする
				self.vm.clear_join();

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
		// イベントの編集ボタンが押された時
		self.onedit = function(e) {
			m.route('/event/edit/' + self.vm.model().id());
		};


		self.ondestroy_comment_function = function(model, i) {
			// コメントの削除ボタンが押された時
			return function(e) {
				// サーバー上から削除
				model.destroy()
				.then(function() {
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
			<div>{ m.component(NavbarComponent, ctrl.vm.account()) }</div>

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
								コメント一覧({ model.comments.length })
							</div>
							<div class="panel-body">
								{/* コメント一覧 */}
								{
									model.comments.map(function(comment, i) {
										// コメント削除ボタン制御
										var comment_del_btn = "";
										if (ctrl.vm.account().id) {
											comment_del_btn =
												<div class="pull-right" onclick={ ctrl.ondestroy_comment_function(comment, i) }>
													<span class="glyphicon glyphicon-remove-sign"></span>
												</div>;
										}

										return <div>
											{/* 削除ボタン */}
											{ comment_del_btn }
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
										<button
											type="button"
											class="btn btn-lg btn-success"
											onclick={ctrl.onsubmit_comment}
											disabled={ ctrl.vm.account().id ? false : true }>コメントを投稿</button>
									</div>
								</form>
							</div>
						</div>
					</div>
					{/* END: 左本文 */}

					{/* BEGIN: 右サイドバー */}
					<div class="col-md-3">
						<button
							type="button"
							class="btn btn-lg btn-success"
							onclick={ctrl.onsubmit_join}
							disabled={ ctrl.vm.account().id ? false : true }>
							イベントに参加する
						</button>
						<h3>参加人数 {model.members.length} / {model.capacity()}</h3>

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
										// 参加削除ボタン制御
										var member_del_btn = "";
										if (ctrl.vm.account().id) {
											member_del_btn =
												<div class="pull-right" onclick={ ctrl.ondestroy_member_function(member, i) }>
													<span class="glyphicon glyphicon-remove-circle"></span>
												</div>;
										}

										return <span>
											{/* 削除ボタン */}
											{ member_del_btn }

											{ member.name() } さん<br />
										</span>;
									})
								}
							</div>
						</div>

						<button
							type="button"
							class="btn btn-sm btn-warning"
							onclick={ ctrl.onedit }
							disabled={ ctrl.vm.account().id ? false : true }>イベントを編集</button>

						<button
							type="button"
							class="btn btn-sm btn-danger"
							onclick={ ctrl.onconfirm_destroy }
							disabled={ ctrl.vm.account().id ? false : true }>イベントを削除</button>

					</div>
					{/* END: 右サイドバー */}
				</div>

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
