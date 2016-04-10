'use strict';

/*
 * ATND イベント詳細ページ
 *
 */

var m = require('../../mithril');


// mithril-validator
require('mithril-validator')(m);

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
			// TODO:入力値チェック

			// event_id
			self.vm.join.event_id(self.vm.model().id());

			// サーバーに保存
			self.vm.join.save()
			.then(function(id) {
				// 生成された参加IDを保存
				self.vm.join.id(id);

				// 参加者一覧に新しく参加した人を移動
				self.vm.model().members.push(self.vm.join);

				// コメント件数を +1
				self.vm.model().attend_num(self.vm.model().attend_num() + 1);

				// コメント欄を空にする
				self.vm.clear_join();
			}, ErrorComponent.handleErrorToViewModel(self.vm));
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
											{/* コメント投稿者 */}
											{ comment.name() }<br />
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
								{
									model.members.map(function(member, i) {
										return <span>
											{ member.name() } さん<br />
										</span>;
									})
								}
							</div>
						</div>
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
									<div class="form-group">
										<label for="AttendName">名前</label>
										<input type="text" class="form-control" id="AttendName" placeholder="あなたの名前" onchange={ m.withAttr("value", ctrl.vm.join.name) } value={ ctrl.vm.join.name() } />
									</div>
								</form>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-lg btn-success" data-dismiss="modal" onclick={ ctrl.onsubmit_join}>参加</button>
								<button type="button" class="btn btn-lg btn-warning" data-dismiss="modal">閉じる</button>
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
