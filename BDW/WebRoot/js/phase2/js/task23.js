/*简化对象选择*/
$ = function(el) {
    return document.querySelector(el);
};

$$ = function(el) {
    return document.querySelectorAll(el);
};

/*addEventLister兼容性*/
function addHandler(ele, type, handler) {
    if (ele.addEventListener) { // 所有主流浏览器，除了 IE 8 及更早版本
        ele.addEventListener(type, handler, false);
    } else if (ele.attachEvent) { // IE 8 及更早版本
        ele.attachEvent("on" + type, handler);
    } else {
        ele["on" + type] = handler;
    }
}

/*阻止事件冒泡*/
function stopHandler(event) {
    window.event ? window.event.cancelBubble = true : event.stopPropagation();
}

var interval = 300; //遍历的时间间隔
lock = false; //判断是否正在染色过程中

window.onload = function() {
    var root = $(".root"),
        search = $("#search"),
        operator = $(".operator"),
        tree = new Tree(root);

    //点击一次变色提示，二次取消提示
    addHandler(root, "click", function(e) {
        var div = e.target;
        if (div && div.nodeName == "DIV") {
            var oriClass = div.className;
            if (oriClass.search("active") == -1) {
                div.style.backgroundColor = "#FEF9D1";
                div.className = "active " + oriClass;
            } else {
                div.style.backgroundColor = "#fff";
                div.className = oriClass.replace("active ", "");
            }
        }
    });

    //添加事件委托
    addHandler(operator, "click", function(e) {
        var btn = e.target;
        if (btn && btn.nodeName === "BUTTON") {
            if (lock) {
                alert("正在遍历中");
                return;
            }
            clearColor(tree); //清除已有的颜色
            switch (btn.id) {
                case "traverseDF":
                case "traverseBF":
                    tree[btn.id]();
                    animation(tree.stack);
                    break;
                case "DFSearch":
                case "BFSearch":
                    tree["traverse" + btn.id.substring(0, 2)]();
                    animation(tree.stack, checkInput(search));
                    break;
            }
        }
    });
};

function checkInput(ele) {
    return ele.value.trim();
}

/**
 * [clearColor 清除已有颜色]
 * @param  {[type]} tree [对象树]
 */
function clearColor(tree) {
    tree.traverseDF();
    tree.stack.forEach(function(ele) {
        ele.style.backgroundColor = "#fff";
    });
}

/**
 * [animation 染色]
 * @param  {array} nodes [对象列表]
 * @param {boolean} stop [是否在结尾停止，针对查找操作]
 */
function animation(nodes, keyword) {
    lock = true;
    var keyword = keyword || null;
    (function show() {
        var next = nodes.shift();
        if (next) {
            next.style.backgroundColor = "#ccc";
            setTimeout(function() {
                if (!(next.firstChild.nodeValue.trim() == keyword)) {
                    next.style.backgroundColor = "#fff";
                }
                show();
            }, interval);
        } else {
            lock = false;
        }
    })();
};

/**
 * [Tree 定义树]
 * @param [root] [根节点]
 * @param [stack] [遍历的节点集合]
 */
function Tree(node) {
    this.stack = [];
    this.root = node;
}

/**
 * [traverseDF 深度优先遍历]
 * @param  {Function} callback [对节点的操作，回调函数]
 */
Tree.prototype.traverseDF = function(callback) {
    var stack = [];
    (function recurse(currentNode) {
        stack.push(currentNode);
        for (var i = 0; i < currentNode.children.length; i++) {
            recurse(currentNode.children[i]);
        }
        callback ? callback(currentNode) : null;
    })(this.root);
    this.stack = stack;
};

/**
 * [traverseBF 广度优先遍历]
 * @param  {Function} callback [对节点的操作，回调函数]
 */
Tree.prototype.traverseBF = function(callback) {
    var queue = [],
        currentNode = this.root;
    this.stack = [];
    this.stack.push(currentNode);
    while (currentNode) {
        var length = currentNode.children.length;
        for (var i = 0; i < length; i++) {
            queue.push(currentNode.children[i]);
        }
        callback ? callback(currentNode) : null;
        currentNode = queue.shift();
        this.stack.push(currentNode);
    }
};