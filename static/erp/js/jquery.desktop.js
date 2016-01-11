//
// Namespace - Module Pattern.
//
var JQD = (function($, window, document, undefined) {
  // Expose innards of JQD.
  return {
    go: function() {
      for (var i in JQD.init) {
        JQD.init[i]();
      }
    },
    init: {
      frame_breaker: function() {
        if (window.location !== window.top.location) {
          window.top.location = window.location;
        }
      },
      //
      // Initialize the clock.
      //
      clock: function() {
        var clock = $('#clock');

        if (!clock.length) {
          return;
        }

        // Date variables.
        var date_obj = new Date();
        var hour = date_obj.getHours();
        var minute = date_obj.getMinutes();
        var day = date_obj.getDate();
        var year = date_obj.getFullYear();
        var suffix = 'AM';

        // Array for weekday.
        var weekday = [
          '周日',
          '周一',
          '周二',
          '周三',
          '周四',
          '周五',
          '周六'
        ];

        // Array for month.
        var month = [
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月'
        ];

        // Assign weekday, month, date, year.
        weekday = weekday[date_obj.getDay()];
        month = month[date_obj.getMonth()];

        // AM or PM?
        if (hour >= 12) {
          suffix = 'PM';
        }

        // Convert to 12-hour.
        if (hour > 12) {
          hour = hour - 12;
        }
        else if (hour === 0) {
          // Display 12:XX instead of 0:XX.
          hour = 12;
        }

        // Leading zero, if needed.
        if (minute < 10) {
          minute = '0' + minute;
        }

        // Build two HTML strings.
        var clock_time = weekday + ' ' + hour + ':' + minute + ' ' + suffix;
        var clock_date = month + ' ' + day + ', ' + year;

        // Shove in the HTML.
        clock.html(clock_time).attr('title', clock_date);

        // Update every 60 seconds.
        setTimeout(JQD.init.clock, 60000);
      },
      //
      // Initialize the desktop.
      //
      desktop: function() {
        // Alias to document.
        var d = $(document);

        // Cancel mousedown.
        d.mousedown(function(ev) {
          var tags = [
            'a',
            'button',
            'input',
            'select',
            'textarea',
            'tr'
          ].join(',');

          if (!$(ev.target).closest(tags).length) {
            JQD.util.clear_active();
            ev.preventDefault();
            ev.stopPropagation();
          }
        });

        // Cancel right-click.
        d.on('contextmenu', function() {
          return false;
        });
        
        //
        	//
        d.on('dblclick', 'a.icon', function(){
        	var winId;
        	var y;
        	var x = $(this).attr('href');
        	var iconType = x.substring('#icon_dock_'.length);       	
        	
        	var windowName, picture, bottom;            	
        	switch(iconType){
        	case 'rkmanage':
        		windowName = '入库管理';
        		picture = 'icon_16_computer.png';
        		bottom = '';
        		break;
        	/*
			case 'salemanage':
        		windowName = '销售管理';
        		picture = 'icon_16_users.png';
        		bottom = '';
        		break;
        	case 'stockmanage':
        		windowName = '库存管理';
        		picture = 'icon_16_smartshirt.png';
        		bottom = '';        		
        		break;
        	case 'clientmanage':
        		windowName = '客户管理';
        		picture = 'icon_16_computer.png';
        		bottom = '';
        		break;
			*/
			case 'productmanage':
        		windowName = '产品管理';
        		picture = 'icon_16_computer.png';
        		bottom = '';
        		break;
			case 'settingup':
        		windowName = '系统设置';
        		picture = 'icon_16_computer.png';
        		bottom = 'test';
        		break;
        	default:
        		alert("Coming soon！");
        	}
        	winId = createWindow(iconType, windowName, picture, bottom);
    		y = '#' + winId.win_div_id;        	     	
        	
        	if($(x).is(':hidden')){
        		$(x).remove().appendTo('#dock');
        		$(x).show('fast');
        	}
        	//Bring window to front
        	JQD.util.window_flat();
        	$(y).addClass("window_stack").show();
        	
			//对某个图标的窗口进行全屏展示
        	if(iconType == 'smartshirt'){
        		  var win = $("#window_smartshirt");                
	              win.attr({
	                // Save window position.
	                'data-t': win.css('top'),
	                'data-l': win.css('left'),
	                'data-r': win.css('right'),
	                'data-b': win.css('bottom'),
	                'data-w': win.css('width'),
	                'data-h': win.css('height')
	              }).addClass('window_full').css({
	                // Maximize dimensions.
	                'top': '0',
	                'left': '0',
	                'right': '0',
	                'bottom': '0',
	                'width': '100%',
	                'height': '100%'
	              });
        	}
        });        
        
        // Relative or remote links?
        d.on('click', 'a', function(ev) {
          var url = $(this).attr('href');
          this.blur();

          if (url && url.match(/^#/)) {
            ev.preventDefault();
            ev.stopPropagation();
          }
          else {
            $(this).attr('target', '_blank');
          }
        });

        // Make top menus active.
        d.on('mousedown', 'a.menu_trigger', function() {
          if ($(this).next('ul.menu').is(':hidden')) {
            JQD.util.clear_active();
            $(this).addClass('active').next('ul.menu').show();
          }
          else {
            JQD.util.clear_active();
          }
        });
        
        // Transfer focus, if already open.
        d.on('mouseenter', 'a.menu_trigger', function() {
          if ($('ul.menu').is(':visible')) {
            JQD.util.clear_active();
            $(this).addClass('active').next('ul.menu').show();
          }
        });

        // Cancel single-click.
        d.on('mousedown', 'a.icon', function() {
          // Highlight the icon.
          JQD.util.clear_active();
          $(this).addClass('active');
        });
/*
        // Respond to double-click.
        d.on('dblclick', 'a.icon', function() {
          // Get the link's target.
          var x = $(this).attr('href');
          var y = $(x).find('a').attr('href');

          // Show the taskbar button.
          if ($(x).is(':hidden')) {
            $(x).remove().appendTo('#dock');
            $(x).show('fast');
          }

          // Bring window to front.
          JQD.util.window_flat();
          $(y).addClass('window_stack').show();
        });
*/
        
        d.on('dblclick', 'table.create_sub_window tr', function(){        	
			//用于双击表格里的列时创建子窗口
        	var winId = createSubWindow($(this));
        	
        	if(!winId || !winId.hasOwnProperty("icon_dock_id")){
        		return;
        	}
        	
        	//console.log(winId);
        	var x = '#' + winId.icon_dock_id;
        	var y = '#' + winId.win_div_id;
        	
        	//Show the taskbar button
        	if($(x).is(':hidden')){
        		$(x).remove().appendTo('#dock');
        		$(x).show('fast');
        	}
        	
        	//Bring window to front
        	JQD.util.window_flat();
        	$(y).addClass('window_stack').show();
        });
        
		// 有些action-menu在点击时也需要创建窗口
		d.on('click', 'a.create_sub_window', function(){
			
        	var winId = createSubWindow($(this).closest('tr'));
        	
        	if(!winId || !winId.hasOwnProperty("icon_dock_id")){
        		return;
        	}
        	
        	//console.log(winId);
        	var x = '#' + winId.icon_dock_id;
        	var y = '#' + winId.win_div_id;
        	
        	//Show the taskbar button
        	if($(x).is(':hidden')){
        		$(x).remove().appendTo('#dock');
        		$(x).show('fast');
        	}
        	
        	//Bring window to front
        	JQD.util.window_flat();
        	$(y).addClass('window_stack').show();
        });
		
        // Make icons draggable.
        d.on('mouseenter', 'a.icon', function() {
          $(this).off('mouseenter').draggable({
            revert: true,
            containment: 'parent'
          });
        });
		
		//响应会打开新窗口的按钮
		d.on('click', 'button.btn_create_newWindow', function(){
			if($(this).hasClass('test')){
				var winId = createWindow($(this).attr('value'), $(this).attr('name'), 
						'icon_16_computer.png', 'bottom');
        	}
			var y = '#' + winId.win_div_id;
        	var x = '#' + winId.icon_doc_id;
        	if($(x).is(':hidden')){
        		$(x).remove().appendTo('#dock');
        		$(x).show('fast');
        	}
        	//Bring window to front
        	JQD.util.window_flat();
        	$(y).addClass("window_stack").show();
        });
		
        //Response when click buttons
        d.on('click', 'button', function() {
			//alert('asd');
            button_click($(this));
          });
        /*
        //用于创建template时，
        //创建VM、switch、router时，改变选项列表
        d.on('change', 'select', function(){
        	select_change($(this));
        });
		*/
        // Taskbar buttons.
        d.on('click', '#dock a', function() {
          // Get the link's target.
          var x = $($(this).attr('href'));

          // Hide, if visible.
          if (x.is(':visible')) {
            x.hide();
          }
          else {
            // Bring window to front.
            JQD.util.window_flat();
            x.show().addClass('window_stack');
          }
        });

        // Focus active window.
        d.on('mousedown', 'div.window', function() {
          // Bring window to front.
          JQD.util.window_flat();
          $(this).addClass('window_stack');
        });

        // Make windows draggable.
        d.on('mouseenter', 'div.window', function() {
          $(this).off('mouseenter').draggable({
            // Confine to desktop.
            // Movable via top bar only.
            cancel: 'a',
            containment: 'parent',
            handle: 'div.window_top'
          }).resizable({
            containment: 'parent',
            minWidth: 800,
            minHeight: 400,
            resize: function(event, ui){
				/** vis画图时改变窗口尺寸会导致画图被拉伸，需要重新绘制，
				  * 此函数用于此
				  */
            	//workspace_window_resize($(this));
            }
          });
        });

        // Double-click top bar to resize, ala Windows OS.
        d.on('dblclick', 'div.window_top', function() {
          JQD.util.window_resize(this);
          setTimeout(10);
		  //workspace_window_resize($(this).closest('div.window'));
        });

        // Double click top bar icon to close, ala Windows OS.
        d.on('dblclick', 'div.window_top img', function() {
          // Traverse to the close button, and hide its taskbar button.
          $($(this).closest('div.window_top').find('a.window_close').attr('href')).hide('fast');

          // Close the window itself.
          $(this).closest('div.window').hide();
          setTimeout(10);
		  //workspace_window_resize($(this).closest('div.window'));
          // Stop propagation to window's top bar.
          return false;
        });

        // Minimize the window.
        d.on('click', 'a.window_min', function() {
          $(this).closest('div.window').hide();          
        });

        // Maximize or restore the window.
        d.on('click', 'a.window_resize', function() {
          JQD.util.window_resize(this);
          //var length = $(this).closest('.window_inner').find('.window_main').height();			 
		  setTimeout(10);
		  //workspace_window_resize($(this).closest('div.window'));
		  //$(this).closest('.window_inner').find('iframe').removeAttr('style').attr('style', 'width: 100%; height: ' + length + 'px');
        });

        // Close the window.
        d.on('click', 'a.window_close', function() {
          //$(this).closest('div.window').hide();
          //$($(this).attr('href')).hide('fast');
          //清除窗口而不是隐藏他们
		  $('#' + $(this).closest('div.window').attr('id')).remove();
		  $('#' + $($(this).attr('href')).attr('id')).remove();
        });

        // Show desktop button, ala Windows OS.
        d.on('mousedown', '#show_desktop', function() {
          // If any windows are visible, hide all.
          if ($('div.window:visible').length) {
            $('div.window').hide();
          }
          else {
            // Otherwise, reveal hidden windows that are open.
            $('#dock li:visible a').each(function() {
              $($(this).attr('href')).show();
            });
          }
        });

        $('table.data').each(function() {
          // Add zebra striping, ala Mac OS X.
          $(this).find('tbody tr:odd').addClass('zebra');
        });

        d.on('mousedown', 'table.data tr', function() {
          // Clear active state.
          JQD.util.clear_active();

          // Highlight row, ala Mac OS X.
          $(this).closest('tr').addClass('active');
        });

		// 修改窗口的bottom
		d.on('click', 'a.tab', function(){
			//alert($(this).attr('href'));			
			if($(this).attr('href') == '#product_baseinfo'){
				$('#product_baseinfo').closest('div.window').find('div.window_bottom')
						.html('产品基本信息');
			}else if($(this).attr('href') == '#product_topCategory'){
				$('#product_topCategory').closest('div.window').find('div.window_bottom')
						.html('提示：您可以双击顶级分类为其添加子分类，也可以点击“更多->添加子分类”。');
			}else if($(this).attr('href') == '#product_subCategory'){
				$('#product_subCategory').closest('div.window').find('div.window_bottom')
						.html('提示：您可以点击“更多”来修改或删除子分类。');
			}else if($(this).attr('href') == '#product_unit'){
				$('#product_unit').closest('div.window').find('div.window_bottom')
						.html('产品计量单位。');
			}
		});
        
		/***************************************************
		 *****下面的代码是响应所有a.actionMenu的点击********
		 **************************************************/
        // 顶级分类窗口里的操作部分
		d.on('click', 'a.actionMenu', function(){    	
        	
			if($(this).hasClass('topCategory-menu')){
				$(this).after($('#topCategory-menu'));
				//update links
				//对于添加子分类的情况，需要新打开一个窗口，因此不需调用product_category_action函数
				//$('#topCategory-menu').find(".topCategory-addSub").attr("href", "#")
					//.attr("onclick", "product_category_action($(this), 'add_sub_category', 'top_category'); return false;");
				$('#topCategory-menu').find(".topCategory-edit").attr("href", "#")
					.attr("onclick", "product_category_action($(this), 'update', 'top_category'); return false;");
				$('#topCategory-menu').find(".topCategory-delete").attr("href", "#")
					.attr("onclick", "product_category_action($(this), 'delete', 'top_category'); return false;");
        	}else if($(this).hasClass('subCategory-menu')){
				$(this).after($('#subCategory-menu'));
				//update links
				$('#subCategory-menu').find(".subCategory-edit").attr("href", "#")
					.attr("onclick", "product_category_action($(this), 'update', 'sub_category'); return false;");
				$('#subCategory-menu').find(".subCategory-delete").attr("href", "#")
					.attr("onclick", "product_category_action($(this), 'delete', 'sub_category'); return false;");
			}
    		//show dropdown
    		if(!$(this).parent().hasClass("open")){
    			$(this).closest('table').find('.open').removeClass('open');
    			$(this).parent().addClass('open');
    		}else{
    			$(this).parent().addClass('open');
    		}
        });
		
		
      },
      wallpaper: function() {
        // Add wallpaper last, to prevent blocking.
        if ($('#desktop').length) {
          $('body').prepend('<img id="wallpaper" class="abs" src="/static/erp/img/misc/wallpaper.jpg" />');
        }
      }
    },    
    
    util: {
      //
      // Clear active states, hide menus.
      //
      clear_active: function() {
        $('a.active, tr.active').removeClass('active');
        $('ul.menu').hide();
      },
      //
      // Zero out window z-index.
      //
      window_flat: function() {
        $('div.window').removeClass('window_stack');
      },
      //
      // Resize modal window.
      //
      window_resize: function(el) {
        // Nearest parent window.
        var win = $(el).closest('div.window');

        // Is it maximized already?
        if (win.hasClass('window_full')) {
          // Restore window position.
          win.removeClass('window_full').css({
            'top': win.attr('data-t'),
            'left': win.attr('data-l'),
            'right': win.attr('data-r'),
            'bottom': win.attr('data-b'),
            'width': win.attr('data-w'),
            'height': win.attr('data-h')
          });
          	
        }
        else {
          win.attr({
            // Save window position.
            'data-t': win.css('top'),
            'data-l': win.css('left'),
            'data-r': win.css('right'),
            'data-b': win.css('bottom'),
            'data-w': win.css('width'),
            'data-h': win.css('height')
          }).addClass('window_full').css({
            // Maximize dimensions.
            'top': '0',
            'left': '0',
            'right': '0',
            'bottom': '0',
            'width': '100%',
            'height': '100%'
          });
          	
        }

        // Bring window to front.
        JQD.util.window_flat();
        win.addClass('window_stack');
      }
    }
  };
// Pass in jQuery.
})(jQuery, this, this.document);

//
// Kick things off.
//
jQuery(document).ready(function() {
  JQD.go();
});

