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
		// イベントID
		this.id = m.route.param("id");
	},
	view: function(ctrl) {
		return <div>
			{/*navbar*/}
			<div>{ m.component(Navbar) }</div>

			<div class="container" style="padding-top:30px" id="root">
				{/* イベント名 */}
				<div class="row">
					<div class="col-md-12">
						<h1>イベント1</h1>
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
									<td>2016/04/09 (土) 13:30 から</td>
								</tr>
								<tr>
									<td>主催者</td>
									<td>田中</td>
								</tr>
								<tr>
									<td>開催場所</td>
									<td>第一会議室</td>
								</tr>
							</tbody>
						</table>

						<div class="panel panel-default">
							<div class="panel-body">
								{/* イベント詳細 */}
								<h2>勉強会の趣旨</h2>
								<p>Go言語をプロダクションで導入している企業による勉強会です。<br />
								導入の事例紹介やノウハウ共有ができる場にしたいと思います。</p>
								<h2>タイムテーブル</h2>
								<table class="table">
								<tr>
									<th>時間</th>
									<th>内容</th>
									<th>発表者</th>
								</tr>
								<tr>
									<td>19:00 – 19:20</td>
									<td>開場</td>
									<td>-</td>
								</tr>
								<tr>
									<td>19:20 – 19:30</td>
									<td>挨拶＆会場説明</td>
									<td>-</td>
								</tr>
								<tr>
									<td>19:30 – 19:40</td>
									<td>自己紹介タイム</td>
									<td>参加者全員</td>
								</tr>
								<tr>
									<td>19:40 – 20:00</td>
									<td>ああああああああああについて</td>
									<td>株式会社ああああああああ</td>
								</tr>
								<tr>
									<td>20:00 – 20:20</td>
									<td>ああああああああああについて</td>
									<td>株式会社ああああああああ</td>
								</tr>
								<tr>
									<td>20:20 – 20:40</td>
									<td>ああああああああああについて</td>
									<td>株式会社ああああああああ</td>
								</tr>
								<tr>
									<td>20:40 – 21:00</td>
									<td>質疑応答タイム</td>
									<td>-</td>
								</tr>
								</table>
								<h2>勉強会の対象者</h2>
								<p>Go言語に興味があるエンジニアのかた<br />
								これからGo言語の導入を検討されているかた</p>
							</div>
						</div>

						<div class="panel panel-default">
							<div class="panel-heading">
								コメント一覧(1)
							</div>
							<div class="panel-body">
								{/* コメント一覧 */}
								山本さん<br />
								よろしくお願いします！
								<hr />
								{/* コメント投稿フォーム */}
								<form>
									<div class="form-group">
										<textarea class="form-control" rows="3"></textarea>
									</div>
									<div>
										<button type="button" class="btn btn-lg btn-success">コメントを投稿</button>
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
						<h3>参加人数 100 / 225</h3>

						<div class="panel panel-default">
							<div class="panel-heading">
									参加者一覧
							</div>
							<div class="panel-body">
								山本 さん<br />
								田中 さん<br />
								太郎 さん<br />
								山本 さん<br />
								田中 さん<br />
								太郎 さん<br />
								山本 さん<br />
								田中 さん<br />
								太郎 さん<br />
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
										<input type="text" class="form-control" id="AttendName" placeholder="あなたの名前" />
									</div>
								</form>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-lg btn-success" data-dismiss="modal">参加</button>
								<button type="button" class="btn btn-lg btn-warning" data-dismiss="modal">閉じる</button>
							</div>
						</div>
					</div>
				</div>
				{/* END: イベント参加 入力モーダル */}
			</div>
		</div>;
	}
};
