'use strict';

/*
 * textarea タグ
 *
 */

var m = require('../../mithril');

module.exports = {
	controller: function() {},
	view: function(ctrl, args) {
		// プロパティ
		var prop = args.prop;
		// エラーメッセージ
		var error = args.error;
		// placeholder
		var placeholder = args.placeholder;
		// rows
		var rows = args.rows || 4;


		return <div class={ error ? "form-group has-error has-feedback" : "form-group"}>
			<textarea class="form-control" rows={rows} onchange={m.withAttr("value", prop)} placeholder={ placeholder }>{ prop() }</textarea>
			{ error ? <span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span> : "" }
			<span class="help-block">{ error }</span>
		</div>;
	}
};
