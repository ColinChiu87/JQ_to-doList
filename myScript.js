$(function () {
    var $addNewTask = $('.js-add-new-task');
    var $taskTags = $addNewTask.find('.tag');
    var $tag = $addNewTask.find('.tag-select').text();
    var $taskInput = $('.js-task-input');
    var $title = '';
    var $addBtn = $('.js-add');

    var $todolistGroup = []; //儲存每一件事
    var $listGroup = [];
    var $listTag;

    var $tagBox = []; //儲存所有標籤，製作下拉選項
    var $listArea = $('.js-list-area'); //下拉式選單


    //顯示點擊標籤
    $taskTags.on('click', function (e) {
        $(this).addClass('tag-select').siblings().removeClass('tag-select');
    });

    //點擊"+"事件, 儲存文字並清除input
    $addBtn.on('click', function (e) {
        $tag = $('.tag-select').text();
        $title = $taskInput.val().trim();

        //為空就不執行
        if ($title == "") {
            alert("is null");
            return false;
        } else {
            $taskInput.val('');
            storeList();
            showList($listTag);
            closeInfo();
        }
    });

    //下拉式選單
    (function () {
        //增加下拉選單項目
        $tagBox = $.map($taskTags, function (item) {
            return $(item).text();
        });

        $.each($tagBox, function (index, item) {
            $('.js-type-selector').append(
                $('<li class="option">' + item + '</li>')
            );
        });

        $listArea.find('#task-type').on('click', function (e) {
            $('.js-type-selector').toggleClass('hide');
        });

        $('.option').on('click', function (e) {
            $listTag = $(this).text()
            showList($listTag); //切換清單
            $('.chosen').text($listTag);
            closeInfo();
        });
    }());

    showList(); //顯示清單

    //完成效果
    $('.js-todolist').on('click', '.js-li', function (e) {
        var $that = $(this);
        $that.toggleClass('done-check');

        if ($that.hasClass('done-check') == true) {
            console.log('0');
            // $('.js-modify').attr('disabled', true);
        } else {
            console.log('1');
            // $('.js-modify').attr('disabled', false);
        }
    });

    /*//---------------\\\
             修改
    \\\                //*/

    (function () {
        //修改title
        $('.js-todolist').on('click', '.js-modify', function (e) {
            e.stopPropagation(); //防止冒泡

            var $that = $(this);
            var $parentsLi = $that.parents('.js-li'); //為了知道是點擊哪一隻Li，所以所有變數需要從Li開始find
            var $hasInput = $parentsLi.find('.js-input'); //點擊編輯所出現的input
            //判斷Input是否存在
            if ($hasInput.length > 0) {
                var afterTxt = $hasInput.val(); //儲存已編輯的文字
                $hasInput.remove(); //移除input
                $parentsLi.find('.js-text').text(afterTxt);
            } else {
                var beforeTxt = $parentsLi.find('.js-text').text(); //儲存編輯前的文字
                $parentsLi.find('.js-text').text('');
                $parentsLi.find('.js-text').append('<input type="text" value=' + beforeTxt + ' class="modify-input js-input">');
            }
        });

        //進入修改後，利用Enter完成修改
        $('.js-todolist').on('click keyup', '.js-input', function (e) {
            e.stopPropagation(); //防止冒泡
            //按下Enter，完成編輯
            if (e.keyCode == 13) {
                var $thatModify = $(this).parents('.js-li').find('.modify');
                $thatModify.trigger('click');
            }
        });
    }());

    /*//---------------\\\
             刪除
    \\\                //*/

    (function () {
        //刪除List
        $('.js-todolist').on('click', '.js-delete', function (e) {
            var $that = $(this)
            var $parentsLi = $that.parents('.js-li');
            var $clickId = $parentsLi.data('id'); //點擊刪除的Li-id

            //尋找陣列物件的索引
            //$.Array(要找的值, 陣列)，回傳索引
            var deleteItem = $.inArray($todolistGroup.find(function (item) {
                return item.id == $clickId;
            }), $todolistGroup);

            $todolistGroup.splice(deleteItem, 1); //刪除陣列splice(索引, 數量)
            showList($('.chosen').text());
            showInfo();
        })

        //刪除全部
        $('.js-delete-all').on('click', function (e) {
            // var $count = $todolistGroup.length;
            // var $i = 0;
            // while ($i < $count) {
            //     $todolistGroup.splice(0, 1);
            //     $i++;
            //     console.log($todolistGroup);
            // }

            // $listGroup = []; //指定為空陣列

            if ($listTag == undefined) {
                $todolistGroup = [];
            } else {
                if ($listTag == 'all') {
                    $todolistGroup = [];
                }
                $todolistGroup = $.grep($todolistGroup, function (item) {
                    return item.tag != $listTag;
                })
            }

            showList($listTag);
            showInfo();
        })
    }());

    /*//---------------\\\
            function
    \\\                //*/

    //method: 顯示清單、切換清單
    function showList(tag) {
        var $tag = tag ? tag : 'all';

        if ($tag == 'all') {
            $listGroup = $todolistGroup;
        } else {
            $listGroup = $.grep($todolistGroup, function (item) {
                return item.tag == $tag;
            })
        }

        //清空列表
        $('.js-todolist').empty();

        //增加List
        $.map($listGroup, function (item) {
            $('.js-todolist').append(
                $('<li data-id = ' + item.id + ' class="js-li">' +
                    '<div class="list-task">' +
                    '<i class="fas fa-check-circle done" aria-hidden="true"></i>' +
                    '<span class="list-tag ' + item.tag + '">' + item.tag + '</span>' +
                    '<span class="task-name js-text">' + item.text + '</span>' +
                    '</div>' +
                    '<div>' +
                    '<i class="fas fa-pen modify js-modify" data-num="0" aria-hidden="true" style="padding: 0.8rem;"></i>' +
                    '<i class="fas fa-trash delete js-delete" data-num="0" aria-hidden="true" style="padding: 0.8rem;"></i>' +
                    '</div>' +
                    '</li>')
            );
        });

        if ($listGroup.length == 0) {
            $('.js-todolist').append('<p style="color: rgb(170, 170, 170); margin: 0px 0px 1.5rem;">No task here...</p>');
        }

        deallBtn(); //顯示"刪除全部"btn

    }

    //method: 儲存Data(標籤、內容)
    function storeList() {
        var $timer = Number(new Date());
        $todolistGroup.push({
            'id': $timer,
            'tag': $tag,
            'text': $title
        });
    }

    //method: 顯示or隱藏 "全部刪除btn"
    function deallBtn() {
        if ($listGroup.length >= 2) {
            $('.js-delete-all').css('display', 'inline-block');
        } else {
            $('.js-delete-all').css('display', 'none');
        }
    }

    //如果任務全部清空，顯示恭喜完成
    function showInfo() {
        if ($todolistGroup.length == 0) {
            $('.js-info').text('Congratulations! No more task to do.');
        }
    }

    //隱藏恭喜完成
    function closeInfo() {
        $('.js-info').text('');
    }
});
