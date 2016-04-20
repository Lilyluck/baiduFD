$ = function(el) {
	return document.querySelector(el);
};
var data = [];
function render(match) {
	$('#result').innerHTML = data.map(
			function(d) {
				var r = d;
				if (match != null && match.length > 0) {
					/*其中match为表示表达式内容
					 * g,全局匹配，i不区分大小写，m执行多行匹配，用最多的为g和i*/
					r = r.replace(new RegExp(match, "g"),
							"<span class='select'>" + match + "</span>");
				}
				return "<div>" + r + "</div>";
			}).join('');
}
function deal(func, succ) {
	var args = [].slice.call(arguments, 2);
	return function(e) {
		try {
			var arg = args.map(function(item) {
				return typeof item === "function" ? item(e) : item;
			});
			var result;
			if (Object.prototype.toString.call(arg[0]) === '[object Array]') {
				arg[0].forEach(function(d) {
					result = func.apply(data, [ d ].concat(arg.slice(1)));
				});
			} else {
				result = func.apply(data, arg);
			}
			if (succ != null) {
				succ(result);
			}
		} catch (ex) {
			if (ex.message != '')
				alert(ex.message);
		}
		render();
	};
}
function getInputValue() {
	/*\u4e00-\u9fa5表示汉字头和汉字尾*/
	return $('#input').value.split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/).filter(
			function(d) {
				return d != '';
			});
}
function getClickIndex(e) {
	var node = e.target;
	if (node.id == "result")
		throw new Error('');
	return [].indexOf.call(node.parentNode.children, node);
}
$('#left-in').onclick = deal([].unshift, null, getInputValue);
$('#right-in').onclick = deal([].push, null, getInputValue);
$('#left-out').onclick = deal([].shift, window.alert,null);
$('#right-out').onclick = deal([].pop, window.alert,null);
$('#result').onclick = deal([].splice, null, getClickIndex, 1);
$('#search').onclick = function() {
	render($('#search-text').value);
};
