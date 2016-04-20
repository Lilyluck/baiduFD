 $ = function (el) { return document.querySelector(el); };
    $$ = function (el) { return document.querySelectorAll(el); };
    var data = [];
    var sizeFactor = 5; 
    var aniQue = delay(function(){}, 0); 
    var inAnimation = false; 
    var renderInterval = 10;
   
    function delay(fn, t) {
      var queue = [], self, timer;
      function schedule(fn, t) {
        timer = setTimeout(function() {
          timer = null;
          fn();
          if (queue.length) {
            var next = queue.shift();
            schedule(next.fn, next.t);
          }
        }, t);
      }
      self = {
        delay: function(fn, t) {
          if (queue.length || timer) {
            queue.push({fn: fn, t: t});
          } else {
            schedule(fn, t);
          }
          return self;
        },
        cancel: function() {
          clearTimeout(timer);
          queue = [];
        }
      };
      return self.delay(fn, t);
    }
  
    function sort_partition(left, right) {
      var p = data[left];
      renderSortRange(left, right, false);
      while (left < right) {
        renderSort(right);
        while (left < right && data[right] >= p) {
          right--;
          renderSort(right);
        }
        data[left] = data[right];
        renderSort(left, data[left]);
        while (left < right && data[left] <= p) {
          left++;
          renderSort(left);
        }
        data[right] = data[left];
        renderSort(right, data[right]);
      }
      data[left] = p;
      renderSort(left, data[left]);
      renderSortRange(left, right, true);
      return left;
    }
  
    function sort(left, right) {
      if (left >= right) return;
      var idx = sort_partition(left, right);
      if (left < idx - 1) {
        sort(left, idx - 1);
      }
      if (idx < right) {
        sort(idx + 1, right);
      }
    }
   
    function renderSort(idx, value) {
      aniQue.delay(function() {
        $$('#result div')[idx].className = 'blue';
      }, 0);
      if (value != null) {
        aniQue.delay(function() {
          $$('#result div')[idx].style.height = value * sizeFactor + 'px';
          $$('#result div')[idx].title = value.toString();
        }, 0);
      }
      aniQue.delay(function() {
        $$('#result div')[idx].className = 'red';
      }, renderInterval);
    }
    
    function renderSortRange(start, end, cancel) {
      aniQue.delay(function() {
        for (var i = start; i <= end; i++) {
          $$('#result div')[i].className = cancel ? 'red' : 'green';
        }
      }, 0);
    }
  
    function randomForTest() {
      if (inAnimation) {
        alert('in animation');
        return;
      }
      data = [];
      for (var i = 0; i < 50; i++) {
        data.push(Math.floor(Math.random() * 91 + 10));
      }
      render();
    }
  
    function render() {
      $('#result').innerHTML =
        data.map(function(d) { return "<div class='red' style='height:" + d * sizeFactor + "px' title='" + d + "'></div>"; })
          .join('');
    }
  
    function deal(func, succ) {
      var args = [].slice.call(arguments, 2);
      return function(e) {
        if (inAnimation) {
          alert('in animation');
          return;
        }
        try {
          var arg = args.map(function(item) {
            return typeof item === "function" ? item(e) : item;
          });
          var result = func.apply(data, arg);
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
      var numStr = $('input').value;
      if (!validateStr(numStr)) throw new Error('input error');
      if (data.length > 59) throw new Error('no room');
      var val = parseInt(numStr);
      if (val < 10 || val > 100) throw new Error('out of range');
      return val;
    }
 
    function getClickIndex(e) {
      var node = e.target;
      if (node.id == "result") throw new Error(''); // 中断你们，破坏流程，毁灭世界
      return [].indexOf.call(node.parentNode.children, node);
    }
    
    function getLastIndex() {
      return data.length - 1;
    }
    /* 过滤 */
    function validateStr(str) {
      return /\d+/.test(str);
    }
    /* 绑定事件 */
    $('#left-in').onclick = deal([].unshift, null, getInputValue);
    $('#right-in').onclick = deal([].push, null, getInputValue);
    $('#left-out').onclick = deal([].shift, window.alert);
    $('#right-out').onclick = deal([].pop, window.alert);
    $('#result').onclick = deal([].splice, null, getClickIndex, 1);
    $('#sort').onclick = function(){
      if (inAnimation) {
        alert('in animation');
        return;
      }
      inAnimation = true;
      renderInterval = parseInt($('#renderInterval').value);
      renderInterval = renderInterval || 150;
      sort(0, getLastIndex());
      aniQue.delay(function(){
        inAnimation = false;
      }, 0);
    };
    $('#random').onclick = randomForTest;