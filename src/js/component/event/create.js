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
					<button type="submit" class="btn btn-lg btn-success">イベントを新規作成</button>
				</div>
			</form>

			</div>
		</div>;
	}
};
