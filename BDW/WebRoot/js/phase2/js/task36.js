/**
 * 用于存储小方块对象，考虑到全局要用，所以使用一个全局变量存储
 * @type {null}
 */
var square = null;
/**
 * 定义常量
 */
var WIDTH = 42;//小方块的宽
var HEIGHT = 42;//小方块的高
var ROW = 25;//地图行数
var COL = 25;//地图列数
var TOTAL = ROW * COL;//总格子数
var map = [];//0表示无墙，1表示有墙
var mapDOM = [];//存储全图的格子DOM对象
var NUM = 80;//每次随机造墙总个数，但是由于可以叠加造墙，可能第二次、第三次生成的墙会少于80个
/**
 * 一些基础功能
 * @type {{craetTable, $, addEvent}}
 */
var func = (function () {
    /**
     * 返回模块
     */
    return {
        /**
         * 接收参数，创建地图
         * @param tbody
         * @param row
         * @param col
         */
        createMap: function (container, config) {
            var fragment = document.createDocumentFragment(),
                div = null;
            for (var i = 0; i < config.x; i++) {
                map[i] = [];
                mapDOM[i] = [];
                for (var j = 0; j < config.y; j++) {
                    div = func.createDiv({
                        x: config.x,
                        y: config.y,
                        i: i,
                        j: j
                    });
                    div.dataset.row = i + "";
                    div.dataset.col = j + "";
                    map[i][j] = 0;
                    mapDOM[i][j] = div;
                    fragment.appendChild(div);
                }
            }
            container.style.width = config.y * WIDTH + config.y - 1 + "px";
            container.appendChild(fragment);
            return func.mkAction(container, config);
        },
        createDiv: function (obj) {
            var oDiv = document.createElement("div");
            oDiv.className = "maze-block";
            /**
             * 如果是最后一行的单元格，没有下边框
             */
            if (obj.i === obj.x - 1) {
                oDiv.className += " bottom-maze-block";
            }
            /**
             * 如果是最后一列的单元格，没有右边框
             */
            if (obj.j === obj.y - 1) {
                oDiv.className += " right-maze-block";
            }
            oDiv.dataset.wall = "0";
            return oDiv;
        },
        mkAction: function (container, obj) {
            var ox = Math.floor(Math.random() * obj.x + 0);
            var oy = Math.floor(Math.random() * obj.y + 0);
            var action = func.createAction(ox, oy);
            container.appendChild(action);
            return new Square(ox, oy, 0, 0, action);
        },
        createAction: function (ox, oy) {
            var oAction = document.createElement('div');
            oAction.className = "Action";
            oAction.style.position = "absolute";
            oAction.style.left = oy * (WIDTH + 1) + 'px';
            oAction.style.top = ox * (HEIGHT + 1) + 'px';
            return oAction;
        },
        /**
         * 生成索引
         * @param topList
         * @param leftList
         * @param config
         */
        createList: function (topList, leftList, config) {
            var str = "";
            for (var i = 0; i < config.x; i++) {
                str += "<li>" + i + "</li>";
            }
            leftList.innerHTML = str;
            str = "";
            for (i = 0; i < config.y; i++) {
                str += "<li>" + i + "</li>";
            }
            topList.innerHTML = str;
        },
        /**
         * 获取元素
         * @param id
         * @returns {Element|HTMLElement}
         */
        $: function (id) {
            return document.getElementById(id);
        },
        /**
         * 添加事件
         * @param element
         * @param event
         * @param listener
         */
        addEvent: function (element, event, listener) {
            if (element.addEventListener) { //标准
                element.addEventListener(event, listener, false);
            } else if (element.attachEvent) { //低版本ie
                element.attachEvent("on" + event, listener);
            } else { //都不行的情况
                element["on" + event] = listener;
            }
        },
        /**
         * 对代码编号框进行渲染
         * @param inputArea
         * @param index
         */
        renderCmd: function (inputArea, index, isCheck) {//isCheck为false表示不检查，true表示进行检查
            var error = false;//每次渲染都新建这个变量，代表所有输入的指令是否合法，false表示所有指令都合法，反之表示有不合法的指令存在
            var arrData = inputArea.value.split("\n");//用换行符分割
            var str = "";
            for (var i = 0; i < arrData.length; i++) {
                if (isCheck && func.checkCmd(arrData[i])) {
                    str += "<li class='error'>" + (i + 1) + "</li>";
                    error = true;//如果有不合法的指令则变为true
                } else {
                    str += "<li>" + (i + 1) + "</li>";
                }
            }
            index.innerHTML = str;
            /**
             * 返回一个对象，包含代表所有指令是否合法的布尔值和分割好的初始指令序列
             */
            return {
                haveError: error,
                commandArray: arrData
            };
        },
        /**
         * 对每条指令进行检查，允许的指令格式为
         * GO，GO n
         * TUN LEF，TUN RIG，TUN BAC
         * TRA LEF n，TRA RIG n，TRA TOP n，TRA BOT n，TRA LEF，TRA RIG，TRA TOP，TRA BOT
         * MOV LEF n，MOV RIG n，MOV TOP n，MOV BOT n，MOV LEF，MOV RIG，MOV TOP，MOV BOT
         * @param data
         * @returns {boolean}
         */
        checkCmd: function (data) {
            var regGO = /^GO(\s\d+)?$/;
            var regTUN = /^TUN\s(LEF|BAC|RIG)$/; //检测TUN指令
            var regTRAMOV = /^(TRA|MOV)\s(LEF|RIG|TOP|BOT)(\s\d+)?$/; //检测TRA指令跟MOV指令
            var regBUILD = /^BUILD$/; //BUILD指令
            var regBRU = /^BRU\s(#[0-9A-Fa-f]{3}|#[0-9A-Fa-f]{6})$/; //BRU指令
            var regMOVTO = /^MOV\sTO\s\d+,\d+$/; //MOVTO指令
            return !regGO.test(data) && !regTUN.test(data) && !regTRAMOV.test(data) && !regBUILD.test(data) && !regBRU.test(data) && !regMOVTO.test(data);//返回检测结果
        },
        /**
         * 随机造墙
         * @param points
         * @param num
         */
        randomWall: function (points, num) {
            var index = 0,
                col = 0,
                row = 0,
                n = 0;
            while (n < num) {
                index = Math.floor(Math.random() * TOTAL);
                row = parseInt(index / COL);//取得随机数在地图中第几行
                col = index % COL;//第几列
                if (points[row][col].dataset.wall === "0" && map[row][col] === 0 && !(square.x === row && square.y === col)) {
                    points[row][col].dataset.wall = "1";
                    map[row][col] = 1;
                    mapDOM[row][col].style.backgroundColor = "#aaa";
                }
                n++;
            }
        }
    }
})();
/**
 * 生成地图和小方块对象
 * @type {*|Element|HTMLElement}
 */
var container = func.$("container");
square = func.createMap(container, {
    x: ROW,
    y: COL
});
/**
 * 生成顶部和左边的索引
 */
var topList = func.$("list_top");
var leftList = func.$("list_left");
func.createList(topList, leftList, {
    x: ROW,
    y: COL
});
/**
 * 小方块构造器
 * @param x：行号
 * @param y：列号
 * @param deg：旋转角度
 * @param direction：方向，0：上，1：右，2：下，3：左
 * @param domSquare：DOM中的小方块
 * @constructor
 */
function Square(x, y, deg, direction, domSquare) {
    this.x = x;
    this.y = y;
    this.deg = deg;
    this.direction = direction;
    this.domSquare = domSquare;
}
/**
 * 前进
 */
Square.prototype.go = function () {
    if (this.direction === 0) {
        if (this.analyse(this.x - 1, this.y) === "allow") {
            this.x--;
        }
    } else if (this.direction === 1) {
        if (this.analyse(this.x, this.y + 1) === "allow") {
            this.y++;
        }
    } else if (this.direction === 2) {
        if (this.analyse(this.x + 1, this.y) === "allow") {
            this.x++;
        }
    } else {
        if (this.analyse(this.x, this.y - 1) === "allow") {
            this.y--;
        }
    }
    this.domSquare.style.left = this.y * (WIDTH + 1) + "px";
    this.domSquare.style.top = this.x * (HEIGHT + 1) + "px";
};
/**
 * 左右和反向旋转，反向旋转默认是顺时针方向
 * @param value
 */
Square.prototype.changeDirection = function (value) {
    if (value === "right") {
        if (this.direction === 3) {
            this.direction = 0;
        } else  {
            this.direction++;
        }
        this.deg += 90;
        this.domSquare.style.transform = "rotate(" + this.deg + "deg)";
    } else if (value === "left") {
        if (this.direction === 0) {
            this.direction = 3;
        } else {
            this.direction--;
        }
        this.deg -= 90;
        this.domSquare.style.transform = "rotate(-" + this.deg + "deg)";
    } else if (value === "back") {
        if (this.direction === 3) {
            this.direction = 1;
        } else if (this.direction === 2) {
            this.direction = 0;
        } else {
            this.direction += 2;
        }
        this.deg += 180;
    }
    this.domSquare.style.transform = "rotate(" + this.deg + "deg)";
};
/**
 * 平移
 * @param value
 */
Square.prototype.translationSquare = function (value) {
    if (value === "left") {//往左平移一格
        if (this.analyse(this.x, this.y - 1) === "allow") {
            this.y--;
        }
    } else if (value === "right") {//往右平移一格
        if (this.analyse(this.x, this.y + 1) === "allow") {
            this.y++;
        }
    } else if (value === "bottom") {//往下平移一格
        if (this.analyse(this.x + 1, this.y) === "allow") {
            this.x++;
        }
    } else if (value === "top") {//往上平移一格
        if (this.analyse(this.x - 1, this.y) === "allow") {
            this.x--;
        }
    }
    this.domSquare.style.left = this.y * (WIDTH + 1) + "px";
    this.domSquare.style.top = this.x * (HEIGHT + 1) + "px";
};
/**
 * 旋转之后前进
 * @param value
 */
Square.prototype.moveAndRotate = function (value) {
    if (value === "left") {//如果要朝向左边
        if (this.direction === 0) {//如果当前方向是朝上
            this.changeDirection("left");//往左旋转
        } else if (this.direction === 1) {//如果当前方向是朝右
            this.changeDirection("back");//反向旋转
        } else if (this.direction === 2) {//如果当前方向是朝下
            this.changeDirection("right");//往右旋转
        }
    } else if (value === "right") {//如果要朝向右边
        if (this.direction === 0) {//如果当前方向是朝上
            this.changeDirection("right");//往右旋转
        } else if (this.direction === 2) {//如果当前方向是朝下
            this.changeDirection("left");//往左旋转
        } else if (this.direction === 3) {//如果当前方向是朝左
            this.changeDirection("back");//反向旋转
        }
    } else if (value === "bottom") {//如果要朝向下边
        if (this.direction === 0) {//如果当前方向是朝上
            this.changeDirection("back");//反向旋转
        } else if (this.direction === 1) {//如果当前方向是朝右
            this.changeDirection("right");//往右旋转
        } else if (this.direction === 3) {//如果当前方向是朝左
            this.changeDirection("left");//往左旋转
        }
    } else if (value === "top") {//如果要朝向上边
        if (this.direction === 1) {//如果当前方向是朝右
            this.changeDirection("left");//往左旋转
        } else if (this.direction === 2) {//如果当前方向是朝下
            this.changeDirection("back");//反向旋转
        } else if (this.direction === 3) {//如果当前方向是朝左
            this.changeDirection("right");//往右旋转
        }
    }
    this.go();//旋转之后前进
};
/**
 * 分析、运行指令
 * @param value
 */
Square.prototype.analyseCommand = function (value) {
    if (typeof value === "string") {//如果指令是字符串
        switch (value) {
            case "GO":
                square.go();
                break;
            case "TUN LEF":
                square.changeDirection("left");
                break;
            case "TUN RIG":
                square.changeDirection("right");
                break;
            case "TUN BAC":
                square.changeDirection("back");
                break;
            case "TRA LEF":
                square.translationSquare("left");
                break;
            case "TRA TOP":
                square.translationSquare("top");
                break;
            case "TRA RIG":
                square.translationSquare("right");
                break;
            case "TRA BOT":
                square.translationSquare("bottom");
                break;
            case "MOV LEF":
                square.moveAndRotate("left");
                break;
            case "MOV TOP":
                square.moveAndRotate("top");
                break;
            case "MOV RIG":
                square.moveAndRotate("right");
                break;
            case "MOV BOT":
                square.moveAndRotate("bottom");
                break;
            case "BUILD":
                square.build();
                break;
            default:
                square.painting(value);
                break;
        }
    } else {//如果指令是数组
        if (value[0] > ROW - 1 || value[1] > COL - 1) {
            console.log("目标点不存在");
            return false;
        } else {
            var path = square.findway(mapDOM, mapDOM[square.x][square.y], mapDOM[value[0]][value[1]]);
            var afterCommand = square.translateCommand(path, mapDOM[square.x][square.y]);
            if (afterCommand) {
                runCommand(afterCommand);
            }
        }
    }
};
/**
 * 修墙指令
 */
Square.prototype.build = function () {
    if (this.direction === 0) {
        if (this.analyse(this.x - 1, this.y) === "allow") {
            this.startBuildWall(this.x - 1, this.y);
        }
    } else if (this.direction === 1) {
        if (this.analyse(this.x, this.y + 1) === "allow") {
            this.startBuildWall(this.x, this.y + 1);
        }
    } else if (this.direction === 2) {
        if (this.analyse(this.x + 1, this.y) === "allow") {
            this.startBuildWall(this.x + 1, this.y);
        }
    } else {
        if (this.analyse(this.x, this.y - 1) === "allow") {
            this.startBuildWall(this.x, this.y - 1);
        }
    }
};
/**
 * 指令翻译器
 * @param path
 * @param start
 * @returns {Array}
 */
Square.prototype.translateCommand = function (path, start) {
    if (path) {
        var p = start;
        var arrCommand = [];
        for (var i = 0, len = path.length; i < len; i++) {
            if (p.dataset.row === path[i].dataset.row) {
                if (parseInt(path[i].dataset.col) > parseInt(p.dataset.col)) {
                    arrCommand[i] = "TRA RIG";
                } else {
                    arrCommand[i] = "TRA LEF";
                }
            } else {
                if (parseInt(path[i].dataset.row) > parseInt(p.dataset.row)) {
                    arrCommand[i] = "TRA BOT";
                } else {
                    arrCommand[i] = "TRA TOP";
                }
            }
            p = path[i];
        }
        return arrCommand;
    } else {
        console.log("不存在路径，无法翻译成指令");
        return false;
    }
};
/**
 * 寻路算法
 * @param points
 * @param start
 * @param end
 * @returns {*}
 */
Square.prototype.findway = function (points, start, end) {
    if (mapDOM[parseInt(end.dataset.row)][parseInt(end.dataset.col)].dataset.wall === "1" && map[parseInt(end.dataset.row)][parseInt(end.dataset.col)] === 1) {
        console.log("目标点是墙");
        return false;
    } else if (start === end) {
        console.log("目标点和起点重叠");
        return false;
    } else {
        resetP();//每次执行MOV TO指令时先重置所有P指针
        var opens = [];  // 存放可检索的方块(开启列表)
        var closes = [];  // 存放已检索的方块（关闭列表）
        var cur = null;  // 当前指针
        var bFind = true;  // 是否检索
        // 设置开始点的F、G为0并放入opens列表（F=G+H）
        start.F = 0;
        start.G = 0;
        start.H = 0;
        // 将起点压入closes数组，并设置cur指向起始点
        closes.push(start);
        cur = start;
        // 如果起始点紧邻结束点则不计算路径直接将起始点和结束点压入closes数组
        if (Math.abs(parseInt(start.dataset.row) - parseInt(end.dataset.row)) + Math.abs(parseInt(start.dataset.col) - parseInt(end.dataset.col)) === 1) {
            end.P = start;
            closes.push(end);
            bFind = false;
        }
        // 计算路径
        while (cur && bFind) {
            //如果当前元素cur不在closes列表中，则将其压入closes列表中
            if (!inList(closes, cur)) {
                closes.push(cur);
            }
            // 然后获取当前点四周点
            var rounds = getRounds(points, cur);
            // 当四周点不在opens数组中并且可移动，设置G、H、F和父级P，并压入opens数组
            for (var i = 0; i < rounds.length; i++) {
                if (rounds[i].dataset.wall === "1" || inList(closes, rounds[i]) || inList(opens, rounds[i])) {
                    continue;
                } else if (!inList(opens, rounds[i]) && rounds[i].dataset.wall !== "1") {
                    rounds[i].G = cur.G + 1;//不算斜的，只算横竖，设每格距离为1
                    rounds[i].H = Math.abs(parseInt(rounds[i].dataset.col) - parseInt(end.dataset.col)) + Math.abs(parseInt(rounds[i].dataset.row) - parseInt(end.dataset.row));
                    rounds[i].F = rounds[i].G + rounds[i].H;
                    rounds[i].P = cur;//cur为.P的父指针
                    opens.push(rounds[i]);
                }
            }
            // 如果获取完四周点后opens列表为空，则代表无路可走，此时退出循环
            if (!opens.length) {
                cur = null;
                opens = [];
                closes = [];
                break;
            }
            // 按照F值由小到大将opens数组排序
            opens.sort(function (a, b) {
                return a.F - b.F;
            });
            // 取出opens数组中F值最小的元素，即opens数组中的第一个元素
            var oMinF = opens[0];
            var aMinF = [];  // 存放opens数组中F值最小的元素集合
            // 循环opens数组，查找F值和cur的F值一样的元素，并压入aMinF数组。即找出和最小F值相同的元素有多少
            for (var i = 0; i < opens.length; i++) {
                if (opens[i].F == oMinF.F)
                    aMinF.push(opens[i]);
            }
            // 如果最小F值有多个元素
            if (aMinF.length > 1) {
                // 计算元素与cur的曼哈顿距离
                for (var i = 0; i < aMinF.length; i++) {
                    aMinF[i].D = Math.abs(parseInt(aMinF[i].dataset.row) - parseInt(cur.dataset.row)) + Math.abs(parseInt(aMinF[i].dataset.col) - parseInt(cur.dataset.col));
                }
                // 将aMinF按照D曼哈顿距离由小到大排序（按照数值的大小对数字进行排序）
                aMinF.sort(function (a, b) {
                    return a.D - b.D;
                });
                oMinF = aMinF[0];
            }
            // 将cur指向D值最小的元素
            cur = oMinF;
            // 将cur压入closes数组
            if (!inList(closes, cur)) {
                closes.push(cur);
            }
            // 将cur从opens数组中删除
            for (var i = 0; i < opens.length; i++) {
                if (opens[i] == cur) {
                    opens.splice(i, 1);//将第i个值删除
                    break;
                }
            }
            // 找到最后一点，并将结束点压入closes数组
            if (cur.H == 1) {
                end.P = cur;
                closes.push(end);
                cur = null;
            }
        }
        if (closes.length) {
            // 从结尾开始往前找
            var dotCur = closes[closes.length - 1];
            var path = [];  // 存放最终路径
            var i = 0;
            while (dotCur) {
                path.unshift(dotCur);  // 将当前点压入path数组的头部
                dotCur = dotCur.P;  // 设置当前点指向父级
                if (!dotCur.P) {
                    dotCur = null;
                }
            }
            return path;
        }
        else {
            console.log("无路可走");
            return false;
        }
    }
    /**
     * 监测是否在列表中
     * @param list
     * @param current
     * @returns {boolean}
     */
    function inList(list, current) {
        for (var i = 0, len = list.length; i < len; i++) {
            if ((current.dataset.row === list[i].dataset.row && current.dataset.col === list[i].dataset.col) || (current === list[i]))
                return true;
        }
        return false;
    }

    /**
     * 重置所有P指针
     */
    function resetP() {
        for (var i = 0; i < ROW; i++) {
            for (var j = 0; j < COL; j++) {
                mapDOM[i][j].P = null;
            }
        }
    }

    /**
     * 获取四周点
     * @param points
     * @param current
     * @returns {Array}
     */
    function getRounds(points, current) {
        var u = null;//上
        var l = null;//左
        var d = null;//下
        var r = null;//右
        var rounds = [];
        // 上
        if (parseInt(current.dataset.row) - 1 >= 0) {
            u = points[parseInt(current.dataset.row) - 1][parseInt(current.dataset.col)];
            rounds.push(u);
        }
        // 左
        if (parseInt(current.dataset.col) - 1 >= 0) {
            l = points[parseInt(current.dataset.row)][parseInt(current.dataset.col) - 1];
            rounds.push(l);
        }
        // 下
        if (parseInt(current.dataset.row) + 1 < points.length) {
            d = points[parseInt(current.dataset.row) + 1][parseInt(current.dataset.col)];
            rounds.push(d);
        }
        // 右
        if (parseInt(current.dataset.col) + 1 < points[0].length) {
            r = points[parseInt(current.dataset.row)][parseInt(current.dataset.col) + 1];
            rounds.push(r);
        }
        return rounds;
    }
};
/**
 * 分析能否移动和造墙
 * @param x
 * @param y
 * @returns {boolean}
 */
Square.prototype.analyse = function (x, y) {
    if (x < 0 || y < 0 || x > ROW - 1 || y > COL - 1) {
        console.log("已到达边界");
        return "bound";
    } else if (mapDOM[x][y].dataset.wall === "1" && map[x][y] === 1) {
        console.log("有墙存在");
        return "wall";
    } else {
        return "allow";
    }
};
/**
 * 开始造墙
 * @param x
 * @param y
 */
Square.prototype.startBuildWall = function (x, y) {
    map[x][y] = 1;
    mapDOM[x][y].dataset.wall = "1";
    this.changeWallColor(x, y, "#aaa");
    console.log("造墙成功");
};
/**
 * 改变墙的颜色
 * @param x
 * @param y
 * @param color
 */
Square.prototype.changeWallColor = function (x, y, color) {
    mapDOM[x][y].style.backgroundColor = color;
};
/**
 * 粉刷功能
 * @param color
 */
Square.prototype.painting = function (color) {
    if (this.direction === 0) {
        if (this.analyse(this.x - 1, this.y) === "wall") {
            this.changeWallColor(this.x - 1, this.y, color);
            console.log("粉刷成功");
        } else {
            console.log("前面没有墙，不能粉刷");
        }
    } else if (this.direction === 1) {
        if (this.analyse(this.x, this.y + 1) === "wall") {
            this.changeWallColor(this.x, this.y + 1, color);
            console.log("粉刷成功");
        } else {
            console.log("前面没有墙，不能粉刷");
        }
    } else if (this.direction === 2) {
        if (this.analyse(this.x + 1, this.y) === "wall") {
            this.changeWallColor(this.x + 1, this.y, color);
            console.log("粉刷成功");
        } else {
            console.log("前面没有墙，不能粉刷");
        }
    } else {
        if (this.analyse(this.x, this.y - 1) === "wall") {
            this.changeWallColor(this.x, this.y - 1, color);
            console.log("粉刷成功");
        } else {
            console.log("前面没有墙，不能粉刷");
        }
    }
};
/**
 * 输入命令并运行
 * @type {*|Element|HTMLElement}
 */
var command = func.$("command");//获取输入区域
var sure = func.$("sure");//获取执行按钮
var index = func.$("index");//获取左侧代码编号框
func.addEvent(sure, "click", startMove);
/**
 * 点击执行按钮运行的事件处理函数
 */
function startMove() {
    var result = func.renderCmd(command, index, true);//再次渲染代码编号框并进行检查
    var i = 0;
    if (!result.haveError) {//如果所有指令都输入正确
        runCommand(getCommandNumber(result.commandArray));//开始执行指令
    }
}
/**
 * 接收分割好的初始指令序列作为参数
 * 解析初始指令序列，分离出指令和执行次数，比如GO 4，那么返回的数组中这样出现：GO, GO, GO, GO
 * @param originCommandArray
 */
function getCommandNumber(originCommandArray) {
    var newCommandArray = [];
    for (var i in originCommandArray) {
        if (/#/.test(originCommandArray[i])) {//如果数据包含"#"，表示粉刷指令，去掉前面的BRU，将颜色直接作为要执行的指令
            var lastSpace = originCommandArray[i].lastIndexOf(" ");//找最后出现的空格
            newCommandArray.push(originCommandArray[i].substring(lastSpace + 1, originCommandArray[i].length));
        } else if (/,/.test(originCommandArray[i])) {//如果数据包含","，表示MOV TO指令，去掉前面的MOV TO，将坐标存在一个数组内，直接作为要执行的指令
            var arr = [];
            var lastSpace = originCommandArray[i].lastIndexOf(" ");//找最后出现的空格
            var lastComma = originCommandArray[i].lastIndexOf(",");//找最后出现的逗号
            arr[0] = parseInt(originCommandArray[i].substring(lastSpace + 1, lastComma));
            arr[1] = parseInt(originCommandArray[i].substring(lastComma + 1, originCommandArray[i].length));
            newCommandArray.push(arr);
        } else if (/\d/.test(originCommandArray[i])) {
            var lastSpace = originCommandArray[i].lastIndexOf(" ");//找最后出现的空格
            for (var j = 0; j < parseInt(originCommandArray[i].substring(lastSpace + 1, originCommandArray[i].length)); j++) {
                newCommandArray.push(originCommandArray[i].substring(0, lastSpace));
            }
        } else {
            newCommandArray.push(originCommandArray[i]);
        }
    }
    return newCommandArray;
}
/**
 * 接收来自getCommandNumber返回的处理好的单指令序列
 * 延时递归调用runCommand，每一秒执行一条指令
 * @param commandArray
 */
function runCommand(commandArray) {
    var command = commandArray.shift();//从队首弹出一个指令并执行
    if (command) {//指令存在的话才执行
        square.analyseCommand(command);
        setTimeout(function () {
            runCommand(commandArray);
        }, 200);
    }
}
/**
 * 给输入区域添加输入事件，每次输入都动态刷新代码行编号框
 */
func.addEvent(command, "input", renderConsole);
func.addEvent(command, "propertychange", renderConsole);//兼容IE8及以下
function renderConsole() {
    func.renderCmd(command, index, false);
}
/**
 * 给输入区域添加滚动事件，让左侧的代码编号框也一起滚动
 */
func.addEvent(command, "scroll", checkScroll);
function checkScroll() {
    index.scrollTop = command.scrollTop;
}
/**
 * 清空命令输入框
 */
var refresh = func.$("refresh");
func.addEvent(refresh, "click", clear);
function clear() {
    command.value = "";
    index.innerHTML = "<li>1</li>";
}
var randomBuild = func.$("random");
/**
 * 点击随机造墙
 */
func.addEvent(randomBuild, "click", randomBuildWall);
function randomBuildWall() {
    func.randomWall(mapDOM, NUM);
}