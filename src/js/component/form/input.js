'use strict';

/*
 * input タグ
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
		// onfocus
		var onfocus = args.onfocus;

		var element = { tag: "input", attrs: {
						type: "text",
						class: "form-control",
						placeholder: placeholder ,
						onchange: m.withAttr("value", prop),
						value: prop(),
						config: args.config
					}};

		return <div class={ error ? "form-group has-error has-feedback" : "form-group"}>
		  { element }
			{ error ? <span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span> : "" }
			<span class="help-block">{ error }</span>
		</div>;
	}
};
