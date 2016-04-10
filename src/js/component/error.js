/* global $ */
'use strict';

/*
 * エラーが発生した時のモーダル コンポーネント
 */

// error_code => エラーメッセージ
var error_code_to_message = {
	1:   "アプリケーションが更新されました。ブラウザのリロードをおねがいします。",
	100: "満員になってしまいました。"
};

var m = require('../mithril');

module.exports = {
	// ErrorCode を ViewModelに引き渡すメソッド
	handleErrorToViewModel: function(vm) {
		// TODO: vm の型チェック

		return function(ErrorObject) {
			// ViewModel にエラーコードを保存
			vm.error_code = Number(ErrorObject.message);
		};
	},
	controller: function(vm) {
		// 呼び出し元のViewModel
		this.vm = vm;
	},
	view: function(ctrl, vm) {
		// エラーコードがセットされていればエラーモーダルを表示する
		if(ctrl.vm.error_code) {
			$('#ErrorModal').modal('show');
		}

		return <div id="ErrorModal" class="modal fade" role="dialog">
			{/* BEGIN: エラーの表示モーダル */}
			<div class="modal-dialog">

				<div class="modal-content">
					<div class="modal-header">
						{/* 閉じるボタン */}
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<h4>エラー</h4>
					</div>
					<div class="modal-body">
						{/* エラーメッセージ */}
						{ vm.error_code in error_code_to_message ? error_code_to_message[vm.error_code] : "エラーが発生しました。エラーコード: " + vm.error_code }
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-lg btn-info" data-dismiss="modal">閉じる</button>
					</div>
				</div>
			</div>
			{/* END: エラーの表示モーダル */}
		</div>;
	}
};
