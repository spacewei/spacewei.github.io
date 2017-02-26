/**
 * Created by SPACEY on 2016/12/4.
 */
;(function($){//;用于防止之前引入的js文件没有;结尾,用立即执行匿名函数封装
    /*日历插件的构造函数*/
    var calendarSpacePlug = function(type,calendarSite) {
        this.date = this.calendarPlug(type,calendarSite);
        //this.getCalendarSpaceDate();
    };
    /*构造函数的原型,共用calendarPlug*/
    calendarSpacePlug.prototype = {
        //重置回构造函数,不然是Object
        constructor:calendarSpacePlug,
        /*主函数,内部的函数要共用作用域*/
        calendarPlug:function(type,calendarSite){
            //要返回的变量
            var returnDate = {};
            /*修饰函数,用type选择日历的类型:Toggle可关闭,Show只显示*/
            var calendarType = function(type,calendarSite){
                if (type === 'Toggle'){
                    calendarToggle(calendarSite);
                }
                if (type === 'Show'){
                    calendarShow(calendarSite);
                }
            };
            /*修饰函数,增加可关闭功能*/
            var calendarToggle = function (calendarSite) {
                var calendarToggleBtn = $(calendarSite+'.calendar-space-toggle').eq(0);
                var calendarToggleSiteJQ = $(calendarSite+'.calendar-space-view').eq(0);
                calendarToggleBtn.css('cursor', 'pointer');
                //创建日历的目标DOM
                calendarSite = calendarSite+'.calendar-space-view';
                //创建日历
                calendarInit(calendarSite);
                var calendar = $(calendarSite);
                calendar.css('display','none');
                //日历显示按钮监听事件
                calendarToggleBtn.on('click', function () {
                    if(calendar.css('display') === 'block'){
                        //日历建立目标DOM内日历显示,则隐藏,且移除一个css
                        calendar.css('display','none');
                        $('head link[href="calendarSpace.css"]').eq(0).remove();
                    } else {
                        //日历建立目标DOM内日历隐藏,建立日历并引入css
                        $('head').append('<link rel="stylesheet" href="calendarSpace.css">');
                        calendar.css('display','block');
                    }
                });
            };
            /*修饰函数,只显示式日历,一次加载一个css*/
            var calendarShow = function(calendarSite){
                $('head').append('<link rel="stylesheet" href="calendarSpace.css">');
                //创建日历的目标DOM
                calendarSite = calendarSite+'.calendar-space-view';
                //创建日历
                calendarInit(calendarSite);
            };
            /*日历初始化,原来的主函数*/
            var calendarInit = function (calendarSite) {
                var timeObj = {};
                var showJQ = {};
                //获取今天日期
                var dataToday = new Date();
                timeObj.year = Number(dataToday.getFullYear());
                timeObj.month = Number(dataToday.getMonth());
                timeObj.date = Number(dataToday.getDate());
                //绘制框架
                drawStructure(calendarSite);
                //绘制框架完成后,抓取DOM
                showJQ.yearJQ = $(calendarSite+' .select-year');
                showJQ.monthJQ = $(calendarSite+' .select-month');
                showJQ.dateShowJQ = $(calendarSite+' .date-show');
                //绘制前后箭头
                drawIcon(calendarSite);
                //初始化年select
                selectYear(timeObj, showJQ);
                //初始化月份select
                selectMonth(timeObj, showJQ);
                //显示当月日期
                renderDateShow(timeObj, showJQ,calendarSite);
                //选取select后,改变显示
                selectDate(timeObj, showJQ,calendarSite);
                //点击canvas后松开,改变date显示
                drawIconListen(timeObj, showJQ,calendarSite);
            };
            /*绘制日历框架*/
            var drawStructure = function (calendarSite) {
                var calendarSiteJQ = $(calendarSite);
                calendarSiteJQ.get(0).innerHTML =
                    '<div class="calendar-space">' +
                    '<div class="calendar-space-header">' +
                    '<span class="calendar-space-title">space日历</span>' +
                    '<canvas class="calendar-space-close"></canvas>' +
                    '</div>' +
                    '<div class="calendar-space-select">' +
                        //'<span>' +
                    '<canvas class="canvas-backward"></canvas>' +
                        //'</span>' +
                    '<select class="select-year"></select>' +
                    '<select class="select-month"></select>' +
                    '<span>' +
                    '<canvas class="canvas-forward"></canvas>' +
                    '</span>' +
                    '</div>' +
                    '<div class="calendar-space-week">' +
                    '<span class="cell week0">日</span>' +
                    '<span class="cell week1">一</span>' +
                    '<span class="cell week2">二</span>' +
                    '<span class="cell week3">三</span>' +
                    '<span class="cell week4">四</span>' +
                    '<span class="cell week5">五</span>' +
                    '<span class="cell week6">六</span>' +
                    '</div>' +
                    '<div class="date-show"></div>' +
                    '</div>';
            };
            /*绘制前进和后退canvas图标,及退出叉*/
            var drawIcon = function (calendarSite) {
                var backwardJQ = $(calendarSite+' .canvas-backward');
                var forwardJQ = $(calendarSite+' .canvas-forward');
                var closeJQ = $(calendarSite+' .calendar-space-close');
                var backwardDOM = backwardJQ.get(0);
                var forwardDOM = forwardJQ.get(0);
                var closeDOM = closeJQ.get(0);
                var backward = backwardDOM.getContext('2d');
                var forward = forwardDOM.getContext('2d');
                var close = closeDOM.getContext('2d');
                //参数
                var canvasW = 32;
                var canvasH = 32;
                var r = 16;
                var fillColor = 'blue';
                var strokeColor = 'red';
                //设置canvas宽高
                backwardDOM.width = canvasW;
                backwardDOM.height = canvasH;
                forwardDOM.width = canvasW;
                forwardDOM.height = canvasH;
                closeDOM.width = canvasW;
                closeDOM.height = canvasH;
                //后退图标绘制
                backward.beginPath();
                backward.moveTo(0, canvasH / 2);
                backward.lineTo(canvasW / 2, 0);
                backward.lineTo(canvasW / 2, 1 / 4 * canvasH);
                backward.lineTo(canvasW, 1 / 4 * canvasH);
                backward.lineTo(canvasW, 3 / 4 * canvasH);
                backward.lineTo(canvasW / 2, 3 / 4 * canvasH);
                backward.lineTo(canvasW / 2, canvasH);
                backward.closePath();
                backward.fillStyle = fillColor;
                backward.fill();
                //前进图标绘制
                forward.beginPath();
                forward.moveTo(canvasW, canvasW / 2);
                forward.lineTo(canvasW / 2, canvasH);
                forward.lineTo(canvasW / 2, 3 / 4 * canvasH);
                forward.lineTo(0, 3 / 4 * canvasH);
                forward.lineTo(0, 1 / 4 * canvasH);
                forward.lineTo(canvasW / 2, 1 / 4 * canvasH);
                forward.lineTo(canvasW / 2, 0);
                forward.closePath();
                forward.fillStyle = fillColor;
                forward.fill();
                //关闭图标绘制
                closeDOM.style.borderRadius = r + 'px';
                close.arc(canvasW / 2, canvasH / 2, r, 0, 2 * Math.PI);
                close.fillStyle = 'transparent';
                close.fill();
                close.strokeStyle = strokeColor;
                close.beginPath();
                close.moveTo(canvasW / 2 - r * Math.cos(Math.PI / 4), canvasH / 2 - r * Math.cos(Math.PI / 4));
                close.lineTo(canvasW / 2 + r * Math.cos(Math.PI / 4), canvasH / 2 + r * Math.cos(Math.PI / 4));
                close.closePath();
                close.stroke();
                close.beginPath();
                close.moveTo(canvasW / 2 - r * Math.cos(Math.PI / 4), canvasH / 2 + r * Math.cos(Math.PI / 4));
                close.lineTo(canvasW / 2 + r * Math.cos(Math.PI / 4), canvasH / 2 - r * Math.cos(Math.PI / 4));
                close.closePath();
                close.stroke();
                //鼠标放置后显示手势
                backwardDOM.style.cursor = 'pointer';
                forwardDOM.style.cursor = 'pointer';
                closeDOM.style.cursor = 'pointer';
                //点击后凹陷,松开恢复
                backwardJQ.on('mousedown', function () {
                    backwardJQ.css('box-shadow', '0px 3px 3px rgba(34, 25, 25, 0.2) inset')
                });
                backwardJQ.on('mouseup', function () {
                    backwardJQ.css('box-shadow', '0px 0px 0px rgba(34, 25, 25, 0.2) inset')
                });
                forwardJQ.on('mousedown', function () {
                    forwardJQ.css('box-shadow', '0px 3px 3px rgba(34, 25, 25, 0.2) inset')
                });
                forwardJQ.on('mouseup', function () {
                    forwardJQ.css('box-shadow', '0px 0px 0px rgba(34, 25, 25, 0.2) inset')
                });
                closeJQ.on('mousedown', function () {
                    closeJQ.css('box-shadow', '0px 3px 3px rgba(34, 25, 25, 0.2) inset')
                });
                closeJQ.on('mouseup', function () {
                    closeJQ.css('box-shadow', '0px 0px 0px rgba(34, 25, 25, 0.2) inset')
                });
            };
            /*初始化及年改变后创建年option*/
            var selectYear = function (timeObj, showJQ) {
                showJQ.yearJQ.empty();
                var i;
                //初始化前十年
                for (i = 10; i > 0; i--) {
                    showJQ.yearJQ.get(0).innerHTML += "<option>" + Number(timeObj.year - i) + "</option>";
                }
                //今年
                showJQ.yearJQ.get(0).innerHTML += "<option selected>" + Number(timeObj.year) + "</option>";
                //初始化后十年
                for (i = 1; i <= 10; i++) {
                    showJQ.yearJQ.get(0).innerHTML += "<option>" + (Number(timeObj.year) + Number(i)) + "</option>";
                }
            };
            /*初始化及月select改变后创建月option*/
            var selectMonth = function (timeObj, showJQ) {
                showJQ.monthJQ.empty();
                var i;
                //初始化前面月份
                for (i = 1; i <= timeObj.month; i++) {
                    showJQ.monthJQ.get(0).innerHTML += "<option>" + i + "</option>";
                }
                //今月
                showJQ.monthJQ.get(0).innerHTML += "<option selected>" + (Number(timeObj.month) + 1) + "</option>";
                //初始化后面月份
                for (i = (timeObj.month + 2); i <= 12; i++) {
                    showJQ.monthJQ.get(0).innerHTML += "<option>" + i + "</option>";
                }
            };
            /*渲染当前月的date,包括上月最后一周的几天,及下月第一周的几天*/
            var renderDateShow = function (timeObj, showJQ,calendarSite) {
                showJQ.dateShowJQ.empty();
                var year = timeObj.year;
                var month = timeObj.month;
                var dateCll = {};
                var i;
                //获取当月第一天,当月最后一天,上月最后一天,下月第一天
                var boundary = getBoundary(year, month);
                var thisMonthFirstDate = boundary.thisMonthFirstDate;
                var thisMonthLastDate = boundary.thisMonthLastDate;
                var lastMonthLastDate = boundary.lastMonthLastDate;
                var nextMonthFirstDate = boundary.nextMonthFirstDate;
                //获取上月最后一周数组,本月第一周数组,本月最后一周数组,下月第一周数组
                var lastMonthLastWeek = getLastMonthLastWeek(lastMonthLastDate);
                var thisMonthFirstWeek = getThisMonthFirstWeek(thisMonthFirstDate);
                var thisMonthLastWeek = getThisMonthLastWeek(thisMonthLastDate);
                var nextMonthFirstWeek = getNextMonthFirstWeek(nextMonthFirstDate);
                //渲染上月最后一周和本月第一周
                if (thisMonthFirstDate.getDay() !== 0) {
                    for (i = 0; i < lastMonthLastWeek.length; i++) {
                        showJQ.dateShowJQ.get(0).innerHTML += "<span class='cell date-last cell-virtual'>" + lastMonthLastWeek[i] + "</span>";
                    }
                }
                for (i = 0; i < thisMonthFirstWeek.length; i++) {
                    showJQ.dateShowJQ.get(0).innerHTML += "<span class='cell date-this date-cell-" + Number(thisMonthFirstWeek[i]) + "'>" + thisMonthFirstWeek[i] + "</span>";
                }
                //渲染当月除第一周和最后一周的剩余天
                for (i = thisMonthFirstWeek[thisMonthFirstWeek.length - 1] + 1; i < thisMonthLastWeek[0]; i++) {
                    showJQ.dateShowJQ.get(0).innerHTML += "<span class='cell date-this date-cell-" + Number(i) + "'>" + i + "</span>";
                }
                //渲染本月最后一周和下月第一周
                for (i = 0; i < thisMonthLastWeek[i]; i++) {
                    showJQ.dateShowJQ.get(0).innerHTML += "<span class='cell date-this date-cell-" + Number(thisMonthLastWeek[i]) + "'>" + thisMonthLastWeek[i] + "</span>";
                }
                if (nextMonthFirstDate.getDay() !== 0) {
                    for (i = 0; i < nextMonthFirstWeek.length; i++) {
                        showJQ.dateShowJQ.get(0).innerHTML += "<span class='cell date-next cell-virtual'>" + Number(nextMonthFirstWeek[i]) + "</span>";
                    }
                }
                //获取渲染出来的上月,当月,下月日期
                dateCll.dateThisCellJQ = $(calendarSite+' .date-this');
                dateCll.dateLastCellJQ = $(calendarSite+' .date-last');
                dateCll.dateNextCellJQ = $(calendarSite+' .date-next');
                //初始化时红框日期(今天),监听点击date时红框该date
                highLightDate(timeObj, showJQ, dateCll,calendarSite);
                //返回渲染后的日期
                returnDate = timeObj;
            };
            /*初始化时红框日期(今天),监听点击date时红框该date*/
            var highLightDate = function (timeObj, showJQ, dateCll,calendarSite) {
                //红框渲染date后,timeObj中date的日期
                dateCll.dateThisCellJQ.eq(timeObj.date - 1).css('border', '1px solid red');
                //当点到上月date上翻一月,点到下月date下翻译月
                dateCll.dateLastCellJQ.on('click', function () {
                    backwardMonth(timeObj, showJQ,calendarSite);
                });
                dateCll.dateNextCellJQ.on('click', function () {
                    forwardMonth(timeObj, showJQ,calendarSite);
                });
                //当月date监听点击时红框该日期,并更新timeObj.date
                dateCll.dateThisCellJQ.on('click', function (e) {
                    var dateThisJQ = $(e.target);
                    var dateThis = Number(dateThisJQ.text());
                    //防止点击已经红框了的date时重复更新timeObj.date
                    if (timeObj.date !== dateThis) {
                        dateCll.dateThisCellJQ.eq(timeObj.date - 1).css('border', '1px solid transparent');
                        timeObj.date = Number(dateThis);
                        dateThisJQ.css('border', '1px solid red');
                        //返回点选后的日期
                        returnDate = timeObj;
                    }
                });
            };
            /*后退一月重新渲染date且更新年,月select*/
            var backwardMonth = function (timeObj, showJQ,calendarSite) {
                if (timeObj.month !== 0) {
                    timeObj.month = timeObj.month - 1;
                    renderDateShow(timeObj, showJQ,calendarSite);
                    selectMonth(timeObj, showJQ);
                } else {
                    timeObj.month = 11;
                    timeObj.year = timeObj.year - 1;
                    renderDateShow(timeObj, showJQ,calendarSite);
                    selectYear(timeObj, showJQ);
                    selectMonth(timeObj, showJQ);
                }
            };
            /*前进一月重渲染date且更新年,月select*/
            var forwardMonth = function (timeObj, showJQ,calendarSite) {
                if (timeObj.month !== 11) {
                    timeObj.month = Number(timeObj.month) + 1;
                    renderDateShow(timeObj, showJQ,calendarSite);
                    selectMonth(timeObj, showJQ);
                } else {
                    timeObj.month = 0;
                    timeObj.year = Number(timeObj.year) + 1;
                    renderDateShow(timeObj, showJQ,calendarSite);
                    selectYear(timeObj, showJQ);
                    selectMonth(timeObj, showJQ);
                }
            };
            /*年,月select改变option后重渲染date且更新年,月select的option*/
            var selectDate = function (timeObj, showJQ,calendarSite) {
                showJQ.yearJQ.on('change', function () {
                    timeObj.year = Number($(calendarSite+' .select-year option:selected').val());
                    selectYear(timeObj, showJQ);
                    renderDateShow(timeObj, showJQ,calendarSite);
                });
                showJQ.monthJQ.on('change', function () {
                    timeObj.month = Number($(calendarSite+' .select-month option:selected').val() - 1);
                    selectMonth(timeObj, showJQ);
                    renderDateShow(timeObj, showJQ,calendarSite);
                });
            };
            /*前进,后退图标增加监听事件*/
            var drawIconListen = function (timeObj, showJQ,calendarSite) {
                var backwardJQ = $(calendarSite+' .canvas-backward');
                var forwardJQ = $(calendarSite+' .canvas-forward');
                backwardJQ.on('click', function () {
                    backwardMonth(timeObj, showJQ,calendarSite);
                });
                forwardJQ.on('click', function () {
                    forwardMonth(timeObj, showJQ,calendarSite);
                });
            };
            /*获取当月第一天,当月最后一天,上月最后一天,下月第一天*/
            var getBoundary = function (year, month) {
                var thisMonthFirstDate = new Date(year, month, 1);
                var thisMonthLastDate = new Date(year, Number(month) + 1, 0);
                var lastMonthLastDate = new Date(year, month, 0);
                var nextMonthFirstDate = new Date(year, Number(month) + 1, 1);
                return {
                    thisMonthFirstDate: thisMonthFirstDate,
                    thisMonthLastDate: thisMonthLastDate,
                    lastMonthLastDate: lastMonthLastDate,
                    nextMonthFirstDate: nextMonthFirstDate
                }
            };
            /*获取上月最后一周*/
            var getLastMonthLastWeek = function (lastMonthLastDate) {
                var lastMonthLastWeek = [];
                var lastMonthLastWeekFirstDate = lastMonthLastDate.getDate() - lastMonthLastDate.getDay();
                for (var i = lastMonthLastWeekFirstDate; i <= lastMonthLastDate.getDate(); i++) {
                    lastMonthLastWeek.push(i);
                }
                return lastMonthLastWeek;
            };
            /*获取当月第一周*/
            var getThisMonthFirstWeek = function (thisMonthFirstDate) {
                var thisMonthFirstWeek = [];
                var thisMonthFirstWeekLastDate = thisMonthFirstDate.getDate() + (6 - thisMonthFirstDate.getDay());
                for (var i = thisMonthFirstDate.getDate(); i <= thisMonthFirstWeekLastDate; i++) {
                    thisMonthFirstWeek.push(i);
                }
                return thisMonthFirstWeek;
            };
            /*获取当月最后一周*/
            var getThisMonthLastWeek = function (thisMonthLastDate) {
                var thisMonthLastWeek = [];
                var thisMonthLastWeekFirstDate = thisMonthLastDate.getDate() - thisMonthLastDate.getDay();
                for (var i = thisMonthLastWeekFirstDate; i <= thisMonthLastDate.getDate(); i++) {
                    thisMonthLastWeek.push(i);
                }
                return thisMonthLastWeek;
            };
            /*获取下月第一周*/
            var getNextMonthFirstWeek = function (nextMonthFirstDate) {
                var nextMonthFirstWeek = [];
                var nextMonthFirstWeekLastDate = nextMonthFirstDate.getDate() + (6 - nextMonthFirstDate.getDay());
                for (var i = nextMonthFirstDate.getDate(); i <= nextMonthFirstWeekLastDate; i++) {
                    nextMonthFirstWeek.push(i);
                }
                return nextMonthFirstWeek;
            };
            //运行日历类型选择
            calendarType(type,calendarSite);
            //返回主函数结束后的日期
            return returnDate;
        },
        getCalendarSpaceDate:function(){
            var date = {};
            date.year = this.date.year;
            date.month = this.date.month + 1;
            date.date = this.date.date;
            return date;
        }
    };
    //在全局作用域中注册calendarSpacePlug!不然外界无法访问匿名立即执行函数中任何对象及基本数据!
    window['calendarSpacePlug'] = calendarSpacePlug;
})(jQuery);