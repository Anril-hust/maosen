/**
 * Created by Ran Li on 1/10/2016
 */


 
 /**
  * 用模态框的方式弹出通知，可以弹出正确信息或错误通知
  * @message:	显示的信息。
  * @flag:		标记是否为正确通知('success')或错误通知('error')
  */
 function alert_message(message, flag){
	 if(flag == 'success'){
		 var content = '<div class="alert alert-success" role="alert">'
				+ message
				+ '</div>';
	 }else if(flag == 'error'){
		 var content = '<div class="alert alert-danger" role="alert">'
				+ message
				+ '</div>';
	 }else{
		 alert('函数alert_message的第二个参数只能为"success"或"error"！');
	 }
	 
	 var message_html = '<div class="modal fade bs-example-modal-sm" tabindex="-1"'
			+ ' role="dialog" aria-labelledby="mySmallModalLabel">'
			+ '<div class="modal-dialog modal-sm">'
			+ '<div class="modal-content">'
			+ message
			+ '</div></div></div>';
	
	$(message_html).modal('show');
 }
 
 $(document).ready(
	function() {
		$('.tabs .tab-link a')
			.on('click', function(e) {
				var currentAttrValue = $(this).attr('href');
				// 显示当前tab并隐藏其他tab
				$('.tabs ' + currentAttrValue).show().siblings().hide();
				// 激活当前tab
				$(this).parrent('li').addClass('active').siblings().removeClass('active');
				e.preventDefault();
		});
});

/**
 * 
 * @param element
 * @param message
 * @param effects
 */
function run_waitMe(element, message, effects) {
	var obj;
	if(element.hasClass('window_main')){
		obj = element;
	}else{
		obj = element.closest('.window_main');
	}
    obj.waitMe({
        effect: effects,
        text: message,
        bg: 'rgba(255,255,255,0.7)',
        color:'#000',
        sizeW:'',
        sizeH:''
    });
}

/**
 * 向窗口的内容区域中添加内容，添加到<div class="window_main"></div>里
 * 
 * @param winId       完整的窗口id
 */
function addWindowContent(winId) {
	//alert(winId);
	var win_main = $(winId).find('.window_main').empty();
	
	/**
	 * 开始“入库管理”窗口及其相关的子窗口的内容显示
	 */
	if (winId == '#window_rkmanage') {
		rkmanage_content(winId, win_main);
	}
	/**
	 * 开始“产品管理”窗口及其相关的子窗口的内容显示
	 */
	else if(winId == '#window_productmanage'){	// 为三个tab页面（产品基本信息，
		productmanage_content(winId, win_main);	// 产品分类管理，产品计量单位）显示内容
	}else if(winId.substring(0, '#window_product_topCategory_'.length) == '#window_product_topCategory_'){
		product_subCategory(winId, win_main);	//双击顶级分类时打开的窗口显示和添加子分类
	}
	/**
	 * 开始“系统设置”窗口及其子窗口的内容显示
	 */	
	else if(winId == '#window_infomanage'){
		infomanage_content(winId, win_main);
	}
	else if(winId == '#window_settingup'){
		//settingup_content(winId, win_main);
	}
	
	else if (winId.substring(0, '#window_labProject_'.length) == '#window_labProject_') {
		
	}else if(winId.substring(0, '#window_labTemplate_'.length) == '#window_labTemplate_'){
		
	}

	$('.tabs').tabs();
	
}

/**
 * 创建窗口函数，由jquery-desktop.js里click事件调用
 * 
 * @param winId
 *            窗口id，不包含#window_前缀，注意与其他函数的winId不同
 * @param windowName
 *            窗口名字，
 * @param picture
 *            图片名字（包含后缀名）
 * @param bottom
 * @returns {___anonymous2126_2196}
 */
function createWindow(winId, windowName, picture, bottom) {
	//alert(winId);
	if ($('#window_' + winId).length <= 0) {
		var window = $(document.createElement('div')).attr("id",
				"window_" + winId).attr("class", "abs window").appendTo(
				$('#desktop'));
		var img_url = '/static/erp/img/icons/';		
		var winInner = '<div class="abs window_inner">'
				+ '<div class="window_top">' + '<span class="float_left">'
				+ '<img src="' + img_url + picture + '">' 
				+ '<span name="window_name">' + windowName + '</span>'
				+ '</span>' + '<span class="float_right">'
				+ '<a href="#" class="window_min"></a>'
				+ '<a href="#" class="window_resize"></a>'
				+ '<a href="#icon_dock_' + winId
				+ '" class="window_close"></a>' + '</span>' + '</div>'
				+ '<div class="abs window_content">'				
				+ '<div class="window_main">'				
				+ '</div>' + '</div>'
				+ '<div class="abs window_bottom">'
				+ bottom + '</div>' 
				+ '</div>';
		$(winInner).appendTo(window);
		
		$('<span class="abs ui-resizable-handle ui-resizable-se"></span>')
				.appendTo(window);

		var dock = '<li id="icon_dock_' + winId + '">' + '<a href="#window_'
				+ winId + '"><img src= "' + img_url + picture + '" />'
				+ windowName + '</a></li>';

		$(dock).appendTo('#dock').attr('style', 'display: list-item');

	}
	//alert(winId);
	addWindowContent("#window_" + winId);
	return {
		"win_div_id" : "window_" + winId,
		"icon_dock_id" : "icon_dock_" + winId
	};
}

/**
 * 创建窗口上面的tabs选项卡
 * 
 * @param winId
 *            窗口id
 * @param win_main
 *            窗口内容区域，class
 * @param tabs
 *            选项卡，格式为{tabId:[],tabName:[]}
 * @param buttons
 *            按钮
 */
function createTabs(winId, win_main, tabs, buttons) {
	
	var tab_div = $(document.createElement('div')).appendTo(win_main);
	tab_div.addClass("tabs");
	var tab_head = $(document.createElement('ul')).appendTo(tab_div);
	tab_head.addClass("tabs-links");

	if(tabs != null){
		for (var i = 0; i < tabs.tabId.length; ++i) {
			var li = $(document.createElement('li')).appendTo(tab_head);
			$(document.createElement('a')).addClass('tab').attr('href',
					'#' + tabs.tabId[i]).html(tabs.tabName[i]).appendTo(li);
			if (i == 0)
				li.addClass("active");
		}
	
		var tab_content = $(document.createElement('div')).addClass("tab-content")
				.appendTo(tab_div);
	
		for (var i = 0; i < tabs.tabId.length; ++i) {
			var contentDiv = $('<div class="tab" id="' + tabs.tabId[i] + '"></div>')
					.appendTo(tab_content);
			if (i == 0)
				contentDiv.addClass("active");
		}
	}

	if (buttons != null) {
		for (var i = 0; i < buttons.buttonId.length; i++) {
			var newButton = $(document.createElement('button')).appendTo(
					tab_head);
			newButton.attr("id", buttons.buttonId[i]).addClass('dialog-btn')
					.css('position', 'absolute').css('right',
							(100 * i + 20) + 'px').css('color', '#1C94C4').css(
							'margin-top', '4px').text(buttons.buttonName[i]);
		}
	}
}

/**
 * 创建和添加“产品管理”的内容，包括 “产品基本信息”、“产品分类管理”和“产品计量单位”
 * 
 * @param winId
 *            窗口id
 * @param win_main
 *            窗口内容区域，class
 */
function productmanage_content(winId, win_main) {
	var tabs = {
		tabId : [ "product_baseinfo", "product_topCategory", /*"product_unit"*/ ],
		tabName : [ "产品基本信息", "产品分类管理", /*"产品计量单位"*/ ]
	};
	var buttons = null;
	
	//为窗口建立用于切换的标签
	createTabs(winId, win_main, tabs, buttons);	
	
	//开始创建产品基本信息子页面
	var table_baseinfo = $('<table class="data display" cellspacing="0" width="100%" id="tbl_product_baseinfo"></table>')
					.appendTo($("#product_baseinfo"));
	var thead_baseinfo = $('<thead><tr>' 
					+ '<th class="hidden">ID</th>'
					+ '<th>序号</th>'
					+ '<th>名称</th>'
					+ '<th>规格</th>'
					+ '<th>分类</th>'
					+ '<th>单位</th>'
					+ '<th>进价</th>'
					+ '<th>供应商</th>'
					+ '<th>产品类型</th>'
					+ '<th>助记词</th>'
					+ '<th>操作</th>'
					+ '</tr></thead>').appendTo(table_baseinfo);
	var tbody_baseinfo = $(document.createElement('tbody')).appendTo(table_baseinfo);
	
	var html_baseinfo = '<tr>'
			+ '<td class="hidden">' + 123 +'</td>'
			+ '<td>' + 6 + '</td>'
			+ '<td>' + 'XF6063' + '</td>'
			+ '<td >' + '900mm，28#铜电机，360度环吸设计，超大玻璃面板，触摸开关' + '</td>'
			+ '<td>' + '厨房电器 > 油烟机' + '</td>'
			+ '<td>' + '台' + '</td>'
			+ '<td>' + '￥390' + '</td>'
			+ '<td>' + '中山市新新电器有限公司' + '</td>'
			+ '<td>' + '正常销售' + '</td>'
			+ '<td>' + 'YJ' + '</td>'
			+ '<td class="dropdown"><a class="btn btn-default baseinfo-menu actionMenu"'
			+ ' data-toggle="dropdown" href="#">更多 <i class="fa fa-sort-down"></i></a></td>'
			+ '</tr>'
	$(html_baseinfo).appendTo(tbody_baseinfo);
	//使用Jquery DataTable插件	
	$('#tbl_product_baseinfo').DataTable();	
	$('#tbl_product_baseinfo').closest('div.window').find('div.window_bottom')
			.html('提示：产品基本信息。');
	
	//开始创建产品分类管理子页面
	$('<button type="button" class="btn btn-primary add_top_category" value="add_top_category"' 
			+ ' name="添加顶级分类">添加顶级分类</button>').css('float', 'right')
			.appendTo($("#product_topCategory"));
	/*
	// 这个注释掉的原因是，应该在点击tab切换窗口时再调用这些
	display_top_category('product_topCategory');
	*/
	
	/*
	//开始创建产品计量单位子页面
	$('<button type="button" class="btn btn-primary add_product_unit" value="add_producr_unit"' 
			+ ' name="添加计量单位">添加计量单位</button>')
			.appendTo($("#product_unit"));
	
	display_product_unit('product_unit');
	*/
}

/**
 * 为每个顶级分类的窗口显示子分类，并未其添加新的子分类
 *
 */
function product_subCategory(winId, win_main){
	var top_category_id = winId.substring('#window_product_topCategory_'.length);
	//alert(top_category_id);
	var tabs = {
		tabId : [ "product_subCategory_" + top_category_id ],
		tabName : [ "子分类信息" ]
	};
	var buttons = null;
	
	//为窗口建立用于切换的标签
	createTabs(winId, win_main, tabs, buttons);		
	
	//开始创建产品子分类管理子页面
	$('<button type="button" class="btn btn-primary add_sub_category" value="add_sub_category"' 
			+ ' name="新建子分类">新建子分类</button>').css('float', 'right')
			.appendTo($("#product_subCategory_" + top_category_id));
	
	display_sub_category("product_subCategory_" + top_category_id);	
}

/**
 * 显示产品顶级分类的信息
 * @tabID	所属窗口的tab的ID
 */
function display_top_category (tabID){
	
	if($('#tbl_' + tabID)){//如果当前table已经有内容，先将其删除
		$('#tbl_' + tabID + '_wrapper').remove();//将jquery DataTable包裹table的div删除
	}
	
	var table_topCategory = $('<table class="data display create_sub_window" cellspacing="0"' 
				+ ' width="100%" id="tbl_product_topCategory"></table>').appendTo($('#' + tabID));
	var thead_topCategory = $(
			'<thead><tr>' + '<th class="shrink">&nbsp;</th>'
					+ '<th class="hidden">ID</th>'
					+ '<th>序号</th>'
					+ '<th>分类名称</th>'
					+ '<th>分类描述</th>'
					+ '<th>操作</th>'
					+ '</tr></thead>').appendTo(table_topCategory);
	var tbody_topCategory = $(document.createElement('tbody')).appendTo(
			table_topCategory);
	
	run_waitMe($('#'+tabID), '请稍后...', 'win8_linear');
	$.getJSON('/product/display_top_category/', function (json_data){		
		if(json_data){
			//console.log(json_data);
			var i = 0;
			$.each(json_data, function (index, item) {				
				var html_topCategory = '<tr>' +
					'<td><img src="/static/erp/img/icons/' + 'icon_16_computer.png' + '"></img></td>' +		
					'<td class="hidden">' + item.id + '</td>' +
					'<td>' + ++i + '</td>' +
					'<td>' + item.category + '</td>' +
					'<td>' + item.desc + '</td>' +		
					'<td class="dropdown"><a class="btn btn-default topCategory-menu actionMenu"' + 
					' data-toggle="dropdown" href="#">更多 <i class="fa fa-sort-down"></i></a></td>' +
					'</tr>';
			
				$(html_topCategory).appendTo(tbody_topCategory);
				
			});
		}
		
	});
	setTimeout(function(){
		$('#'+tabID).closest('.window_main').waitMe('hide');
	}, 300);
	/**Jquery DataTable必须要在html页面加载出来后再调用，
	 * 否则会出问题，因此延迟0.1秒调用该函数。
	 */
	setTimeout(function(){
		$('#tbl_product_topCategory').DataTable();//使用Jquery DataTable插件	
	
		var contextMenu = $(document.createElement('ul')).appendTo(tbody_topCategory);
		contextMenu.addClass('dropdown-menu').attr('role', 'menu').attr('id', 'topCategory-menu')
			.css('top', '80%').css('font-size', '12px').css('left', '0px').css('left', 'auto').css('min-width', '100px');
		$('<li><a tabindex="-1" href="#" class="topCategory-addSub create_sub_window">添加子分类</a></li>').appendTo(contextMenu);
		$('<li><a tabindex="-1" href="#" class="topCategory-edit">修改</a></li>').appendTo(contextMenu);
		$('<li role="separator" class="divider"></li>').appendTo(contextMenu);
		$('<li><a tabindex="-1" href="#" class="topCategory-delete" style="color:red">删除</a></li>').appendTo(contextMenu);
	}, 100);
}


/**
 * 显示产品顶级分类的信息
 * @tabID	所属窗口的tab的ID
 */
function display_sub_category (tabID){
	var top_category_id = $('#' + tabID).closest('div.window').attr('id').substring('window_product_topCategory_'.length);
	
	if($('#tbl_' + tabID)){//如果table当前已经存在内容，先将其删除
		$('#tbl_' + tabID + '_wrapper').remove();
	}

	var table_subCategory = $('<table class="data display create_sub_window" cellspacing="0"' 
					+ ' width="100%" id="tbl_product_subCategory_' + top_category_id + '"></table>')
					.appendTo($('#' + tabID));
	var thead_subCategory = $(
			'<thead><tr>' + '<th class="shrink">&nbsp;</th>'
					+ '<th class="hidden">ID</th>'
					+ '<th>序号</th>'
					+ '<th>产品名称</th>'					
					+ '<th>计量单位</th>'
					+ '<th>产品描述</th>'
					+ '<th>操作</th>'
					+ '</tr></thead>').appendTo(table_subCategory);
	var tbody_subCategory = $(document.createElement('tbody')).appendTo(
			table_subCategory);
	
	run_waitMe($('#'+tabID), '请稍后...', 'win8_linear');
	$.get('/product/display_sub_category/', {'top_category_id': top_category_id}, function (json_data){
		if(json_data){
			//console.log(json_data);
			var i = 0;			
			$.each(json_data, function (index, item) {				
				var html_subCategory = '<tr>' +
					'<td><img src="/static/erp/img/icons/' + 'icon_16_computer.png' + '"></img></td>' +		
					'<td class="hidden">' + item.id + '</td>' +
					'<td>' + ++i + '</td>' +
					'<td>' + item.category + '</td>' +
					'<td>' + item.unit + '</td>' +
					'<td>' + item.desc + '</td>' +		
					'<td class="dropdown"><a class="btn btn-default subCategory-menu actionMenu"' + 
					' data-toggle="dropdown" href="#">更多 <i class="fa fa-sort-down"></i></a></td>' +
					'</tr>';			
				$(html_subCategory).appendTo(tbody_subCategory);				
			});
		}
	}, 'json');
	setTimeout(function(){
		$('#'+tabID).closest('.window_main').waitMe('hide');
	}, 300);
	
	/**Jquery DataTable必须要在html页面加载出来后再调用，
	 * 否则会出问题，因此延迟0.1秒调用该函数。
	 */
	setTimeout(function(){
		//使用Jquery DataTable插件		
		$('#tbl_product_subCategory_' + top_category_id).DataTable();
		
		var contextMenu = $(document.createElement('ul')).appendTo(tbody_subCategory);
		contextMenu.addClass('dropdown-menu').attr('role', 'menu').attr('id', 'subCategory-menu')
			.css('top', '80%').css('font-size', '12px').css('left', '0px').css('left', 'auto').css('min-width', '100px');
		$('<li><a tabindex="-1" href="#" class="subCategory-edit">修改</a></li>').appendTo(contextMenu);
		$('<li role="separator" class="divider"></li>').appendTo(contextMenu);
		$('<li><a tabindex="-1" href="#" class="subCategory-delete" style="color:red">删除</a></li>').appendTo(contextMenu);
	}, 100);
}

/**
 * 响应按钮的点击事件
 * @param element
 */
function button_click(element) {
	//var eid = element.attr("id");
	if(element.hasClass('add_top_category')){
		product_category_action(element, 'add', 'top_category');
	}else if(element.hasClass('add_sub_category')){
		product_category_action(element, 'add', 'sub_category');
	}else if(element.hasClass('add_provider')){
		provider_action(element, 'add');
	}else if(element.hasClass('add_staff')){
		staff_action(element, 'add');
	}else if(element.hasClass('add_department')){
		department_action(element, 'add');
	}else if(element.hasClass('add_duty')){
		duty_action(element, 'add');
	}
}

/**
 * 只用于处理产品分类管理页面里的action
 * @element		当前action-menu的jquery对象，一般为$(this)
 * @action		操作，例如'add'、'update'、'delete'等
 * @category_type	标记当前操作的为子分类或者顶级分类
 *
 */
function product_category_action(element, action, category_type){
	if(category_type == 'top_category'){
		var category_name = element.closest('tr').children().eq(3).html() || '';
		var category_desc = element.closest('tr').children().eq(4).html() || '';
		var category_id = element.closest('tr').children().eq(1).html();		
		
		if(action == 'add'){
			var form_html = '<form method="post" class="contact_form" id="form_add_top_category" style="width:400px">' +
					'<ul><li><h2>您正在创建新的顶级分类</h2>' +
					'<span class="required_notification">* 必填</span></li>' +
					'<li><label for="top_category_name">顶级分类名:</label>' +
					'<input type="text" name="top_category_name" id="top_category_name" value="' + category_name + '" required="true" /></il>' +
					'<li><label for="top_category_desc">描述:</label>' +
					'<textarea name="top_category_desc" id="top_category_desc" cols="40" rows="4">' + category_desc + '</textarea></li>' +
					'</ul></form>' +
					'<div id="result_top_category"></div>';
			var dlg_form = $(document.createElement('div')).appendTo($('#desktop'));
			dlg_form.addClass('dialog').attr('id', 'dlg_add_top_category').attr('title', '添加顶级分类');
			$(form_html).appendTo(dlg_form);
			$('#dlg_add_top_category').dialog({
				modal: true,
				width: 650,
				buttons: {
					"取消": function () {
						$(this).dialog('close');
					},
					"添加": function () {
						$(this).dialog('close');
						var category_name = dlg_form.find('#top_category_name').val();
						var category_desc = dlg_form.find('#top_category_desc').val();
						category_desc = (!category_desc) ? "暂无描述" : category_desc;
						if (!category_name.trim()) {
							alert('顶级分类名不能为空！');
						}else {
							run_waitMe(element, '请稍后...', 'win8_linear');
							$.ajax({
								type : 'POST',
								url : '/product/add_category/',
								data : {
									"category_name": category_name,
									"category_unit": "顶级分类",
									"category_desc": category_desc,									
									"category_reid": 0
								},
								dataType : 'json',
								beforeSend: function(xhr, settings){  
									var csrftoken = $.cookie('csrftoken');  
									xhr.setRequestHeader("X-CSRFToken", csrftoken);  
								 },
								success : function(data) {
									console.log(data);
									display_top_category('product_topCategory');
									element.closest('.window_main').waitMe('hide');
								},
								error : function(xhr, state) {
									element.closest('.window_main').waitMe('hide');
									alert('添加顶级分类出错! Please try again!')
								}
							});              		
						}
					},					
				},
				close: function (event, ui) {
					$(this).remove();
				}
			});
		}// end of add top_category
		else if(action == 'update'){
			var form_html = '<form method="post" class="contact_form" id="form_add_top_category" style="width:400px">' +
					'<ul><li><h2>您当前正在修改分类“<strong style="color:red">' + category_name + '</strong>”</h2>' +
					'<span class="required_notification">* 必填</span></li>' +
					'<li><label for="top_category_name">顶级分类名:</label>' +
					'<input type="text" name="top_category_name" id="top_category_name" value="' + category_name + '" required="true" /></il>' +
					'<li><label for="top_category_desc">描述:</label>' +
					'<textarea name="top_category_desc" id="top_category_desc" cols="40" rows="4">' + category_desc + '</textarea></li>' +
					'</ul></form>' +
					'<div id="result_top_category"></div>';

			var dlg_form = $(document.createElement('div')).appendTo($('#desktop'));
			dlg_form.addClass('dialog').attr('id', 'dlg_add_top_category').attr('title', '添加顶级分类');
			$(form_html).appendTo(dlg_form);
			$('#dlg_add_top_category').dialog({
				modal: true,
				width: 650,
				buttons: {
					"取消": function () {
						$(this).dialog('close');
					},
					"修改": function () {
						$(this).dialog('close');
						var category_name = dlg_form.find('#top_category_name').val();
						var category_desc = dlg_form.find('#top_category_desc').val();
						category_desc = (!category_desc) ? "暂无描述" : category_desc;
						if (!category_name.trim()) {
							alert('顶级分类名不能为空！');
						}else {
							run_waitMe(element, '请稍后...', 'win8_linear');
							$.ajax({
								type : 'POST',
								url : '/product/update_category/',
								data : {
									"category_id": category_id,
									"category_name": category_name,
									"category_unit": "顶级分类",
									"category_desc": category_desc,
									"reid": 0
								},
								dataType : 'json',
								beforeSend: function(xhr, settings){  
									var csrftoken = $.cookie('csrftoken');  
									xhr.setRequestHeader("X-CSRFToken", csrftoken);  
								 },
								success : function(data) {
									//console.log(data);
									display_top_category('product_topCategory');
									element.closest('.window_main').waitMe('hide');
								},
								error : function(xhr, state) {
									element.closest('.window_main').waitMe('hide');
									alert('修改顶级分类出错! Please try again!')
								}
							});

							element.closest('.dialog').dialog('close');                		
						}
					},					
				},
				close: function (event, ui) {
					$(this).remove();
				}
			});
		}//end of update top category
		else if(action == 'delete'){
			var dlg_form = $(document.createElement('div')).appendTo($('#desktop'));
			dlg_form.addClass('dialog').attr('id', 'dlg_delete_top_category').attr('title', '删除分类');			
			var form_html = '<span>请问您确定要删除分类“<strong style="color:red">' + category_name + '</strong>”？<br>这将删除其下所有子分类！</span>';
			$(form_html).appendTo(dlg_form);
			$('#dlg_delete_top_category').dialog({
				modal: true,
				width: 400,
				buttons: {
					"取消": function () {
						$(this).dialog('close');
					},
					"确定": function () {                	
						 $(this).dialog('close');
						 run_waitMe(element, '请稍后...', 'win8_linear');
						 //delete
						$.ajax({
							type : 'POST',
							url : '/product/delete_category/',
							data : {
								"category_id": category_id,
								"is_top_category": 1,
							},
							dataType : 'json',
							beforeSend: function(xhr, settings){  
								var csrftoken = $.cookie('csrftoken');  
								xhr.setRequestHeader("X-CSRFToken", csrftoken);  
							 },  
							success : function(data) {
								display_top_category('product_topCategory');
								element.closest('.window_main').waitMe('hide');
							},
							error : function(xhr, state) {
								element.closest('.window_main').waitMe('hide');
								alert('Ajax delete error! Please try again!')
							}
						});
						setTimeout(function(){
							element.closest('.window_main').waitMe('hide');
						}, 200);                    
					},
					
				},
				close: function (event, ui) {
					$(this).remove();
				}
			});
		}//end of delete top_category
	}//end of top_category
	else if(category_type == 'sub_category'){
		var top_category_id = element.closest('div.window').attr('id').substring('window_product_topCategory_'.length);
		var top_category_name = element.closest('div.window').find('span[name="window_name"]').html();
			
		if(action == 'add'){
			//alert(top_category_name.);
			var form_html = '<form method="post" class="contact_form" id="form_add_sub_category" style="width:400px">' +
				'<ul><li><h2>您正在为“<strong style="color:red">' + top_category_name + '</strong>”添加子分类</h2>' +
				'<span class="required_notification">* 必填</span></li>' +
				'<li><label for="sub_category_name">子分类名:</label>' +
				'<input type="text" name="sub_category_name" id="sub_category_name" value="" required="true" /></il>' +
				'<li><label for="sub_category_name">计量单位:</label>' +
				'<input type="text" name="sub_category_unit" id="sub_category_unit" value="" required="true" /></il>' +
				'<li><label for="sub_category_desc">描述:</label>' +
				'<textarea name="sub_category_desc" id="sub_category_desc" cols="40" rows="4"></textarea></li>' +
				'</ul></form>' +
				'<div id="result_sub_category"></div>';
			var dlg_form = $(document.createElement('div')).appendTo($('#desktop'));
			dlg_form.addClass('dialog').attr('id', 'dlg_add_sub_category').attr('title', '添加子分类');
			$(form_html).appendTo(dlg_form);
			$('#dlg_add_sub_category').dialog({
				modal: true,
				width: 650,
				buttons: {
					"取消": function () {
						$(this).dialog('close');
					},
					"添加": function () {
						$(this).dialog('close');
						var category_name = dlg_form.find('#sub_category_name').val();
						var category_desc = dlg_form.find('#sub_category_desc').val();
						var category_unit = dlg_form.find('#sub_category_unit').val();
						category_desc = (!category_desc) ? "暂无描述" : category_desc;
						if (!category_name.trim() || !category_unit.trim()) {
							alert('分类名或计量单位不能为空！');
						}else {
							run_waitMe(element, '请稍后...', 'win8_linear');
							$.ajax({
								type : 'POST',
								url : '/product/add_category/',
								data : {
									"category_name": category_name,
									"category_desc": category_desc,
									"category_unit": category_unit,
									"category_reid": top_category_id
								},
								dataType : 'json',
								beforeSend: function(xhr, settings){  
									var csrftoken = $.cookie('csrftoken');  
									xhr.setRequestHeader("X-CSRFToken", csrftoken);  
								 },
								success : function(data) {
									console.log(data);
									display_sub_category('product_subCategory_' + top_category_id);
									element.closest('.window_main').waitMe('hide');
								},
								error : function(xhr, state) {
									element.closest('.window_main').waitMe('hide');
									alert('添加子分类出错! Please try again!')
								}
							});

							element.closest('.dialog').dialog('close');                		
						}
					},					
				},
				close: function (event, ui) {
					$(this).remove();
				}
			});
		}//end of add sub_category
		else if(action == 'update'){
			var category_name = element.closest('tr').children().eq(3).html();
			var category_unit = element.closest('tr').children().eq(4).html();
			var category_desc = element.closest('tr').children().eq(5).html();
			var category_id = element.closest('tr').children().eq(1).html();
			var top_category_id = element.closest('div.window').attr('id').substring('window_product_topCategory_'.length);
			var form_html = '<form method="post" class="contact_form" id="form_add_sub_category" style="width:400px">' +
				'<ul><li><h2>您正在修改“<strong style="color:red">' + category_name + '</strong>”分类</h2>' +
				'<span class="required_notification">* 必填</span></li>' +
				'<li><label for="sub_category_name">子分类名:</label>' +
				'<input type="text" name="sub_category_name" id="sub_category_name" value="' + category_name + '" required="true" /></il>' +
				'<li><label for="sub_category_name">计量单位:</label>' +
				'<input type="text" name="sub_category_unit" id="sub_category_unit" value="' + category_unit + '" required="true" /></il>' +
				'<li><label for="sub_category_desc">描述:</label>' +
				'<textarea name="sub_category_desc" id="sub_category_desc" cols="40" rows="4">' + category_desc + '</textarea></li>' +
				'</ul></form>' +
				'<div id="result_sub_category"></div>';
			var dlg_form = $(document.createElement('div')).appendTo($('#desktop'));
			dlg_form.addClass('dialog').attr('id', 'dlg_add_sub_category').attr('title', '修改分类');
			$(form_html).appendTo(dlg_form);
			$('#dlg_add_sub_category').dialog({
				modal: true,
				width: 650,
				buttons: {
					"取消": function () {
						$(this).dialog('close');
					},
					"修改": function () {
						$(this).dialog('close');
						var category_name = dlg_form.find('#sub_category_name').val();
						var category_name = dlg_form.find('#sub_category_unit').val();
						var category_desc = dlg_form.find('#sub_category_desc').val();
						category_desc = (!category_desc) ? "暂无描述" : category_desc;
						if (!category_name.trim() || !category_unit.trim()) {
							alert('分类名或计量单位不能为空！');
						}else {
							run_waitMe(element, '请稍后...', 'win8_linear');
							$.ajax({
								type : 'POST',
								url : '/product/update_category/',
								data : {
									"category_id": category_id,
									"category_name": category_name,
									"category_unit": category_unit,
									"category_desc": category_desc,
								},
								dataType : 'json',
								beforeSend: function(xhr, settings){  
									var csrftoken = $.cookie('csrftoken');  
									xhr.setRequestHeader("X-CSRFToken", csrftoken);  
								 },
								success : function(data) {
									//console.log(data);
									display_sub_category('product_subCategory_' + top_category_id);
									element.closest('.window_main').waitMe('hide');
								},
								error : function(xhr, state) {
									element.closest('.window_main').waitMe('hide');
									alert('修改分类出错! Please try again!')
								}
							});

							element.closest('.dialog').dialog('close');                		
						}
					},					
				},
				close: function (event, ui) {
					$(this).remove();
				}
			});
		}//end of update sub_category
		else if(action == 'delete'){			
			var category_id = element.closest('tr').children().eq(1).html();
			var category_name = element.closest('tr').children().eq(3).html();
			var top_category_id = element.closest('div.window').attr('id').substring('window_product_topCategory_'.length);
			var dlg_form = $(document.createElement('div')).appendTo($('#desktop'));
			dlg_form.addClass('dialog').attr('id', 'dlg_delete_sub_category').attr('title', '删除分类');
			var form_html = '<span>请问您确定要删除分类<strong style="color:red">“' + category_name + '</strong>”？</span>';
			$(form_html).appendTo(dlg_form);
			$('#dlg_delete_sub_category').dialog({
				modal: true,
				width: 400,
				buttons: {
					"取消": function () {
						$(this).dialog('close');
					},
					"确定": function () {                	
						 $(this).dialog('close');
						 run_waitMe(element, '请稍后...', 'win8_linear');
						 //delete
						$.ajax({
							type : 'POST',
							url : '/product/delete_category/',
							data : {
								"category_id": category_id,
								"is_top_category": 0,
							},
							dataType : 'json',
							beforeSend: function(xhr, settings){  
								var csrftoken = $.cookie('csrftoken');  
								xhr.setRequestHeader("X-CSRFToken", csrftoken);  
							 },  
							success : function(data) {
								display_sub_category('product_subCategory_' + top_category_id);
								element.closest('.window_main').waitMe('hide');
							},
							error : function(xhr, state) {
								element.closest('.window_main').waitMe('hide');
								alert('Ajax delete error! Please try again!')
							}
						});
						setTimeout(function(){
							element.closest('.window_main').waitMe('hide');
						}, 200);                    
					},
					
				},
				close: function (event, ui) {
					$(this).remove();
				}
			});
		}//end of delete sub_category	
	}//end of sub_category
}

/**
 * 用于为某个窗口创建子窗口
 * 主要是响应某个窗口的按钮等点击或双击事件
 *
 */
function createSubWindow(element){
	// 当需要创建子窗口时，如果点击的元素属于一个table，则获取该table的id，
	// 如果该元素不属于table，则获取它所属的最上层具有class="tab"的div的id
	var window_id = element.closest('table.create_sub_window').attr('id') 
			|| element.closest('div.tab').attr('id');
	//alert(window_id);
	if(window_id == 'tbl_product_topCategory'){
		var top_category_id = element.closest('tr').children().eq(1).html(),
			top_category_name = element.closest('tr').children().eq(3).html(),
			picture = 'icon_16_computer.png',
			bottom = '提示：当前打开的顶级分类为“' + top_category_name + '”，您可以查看或为其添加子分类。';
		
		return createWindow('product_topCategory_'+top_category_id, top_category_name, picture, bottom);
	}
	
}


/**
 * 创建和添加“信息管理”的内容，包括 “供应商管理”、“员工管理”和“仓库管理”
 * 
 * @param winId
 *            窗口id
 * @param win_main
 *            窗口内容区域，class
 */
function infomanage_content(winId, win_main) {
	var tabs = {
		tabId : [ "info_provider", "info_staff", "info_storage", "info_department", 'info_duty' ],
		tabName : [ "供应商管理", "员工管理", "仓库管理", "部门管理", "职务管理" ]
	};
	var buttons = null;
	
	//为窗口建立用于切换的标签
	createTabs(winId, win_main, tabs, buttons);	
	
	//开始创建供应商子页面
	$('<button type="button" class="btn btn-primary add_provider" value="add_provider"' 
			+ ' name="添加供应商">添加供应商</button>').css('float', 'right')
			.appendTo($("#info_provider"));
	
	display_provider('info_provider');	
	
	//开始创建员工子页面
	$('<button type="button" class="btn btn-primary add_staff" value="add_staff"' 
			+ ' name="添加员工">添加员工</button>').css('float', 'right')
			.appendTo($("#info_staff"));	
			
	//开始创建仓库子页面
	$('<button type="button" class="btn btn-primary add_storage" value="add_storage"' 
			+ ' name="添加仓库">添加仓库</button>').css('float', 'right')
			.appendTo($("#info_storage"));	
	
	//开始创建部门子页面
	$('<button type="button" class="btn btn-primary add_department" value="add_department"' 
			+ ' name="添加部门">添加部门</button>').css('float', 'right')
			.appendTo($("#info_department"));
	
	//开始创建职务子页面
	$('<button type="button" class="btn btn-primary add_duty" value="add_duty"' 
			+ ' name="添加职务">添加职务</button>').css('float', 'right')
			.appendTo($("#info_duty"));	
}

/**
 * 显示供应商列表
 * @param tabID		供应商所属tab的ID
 *
 */
function display_provider(tabID){
	if($('#tbl_' + tabID)){//如果当前table已经有内容，先将其删除
		$('#tbl_' + tabID + '_wrapper').remove();//将jquery DataTable包裹table的div删除
	}
	var table_provider = $('<table class="data display" cellspacing="0" width="100%" id="tbl_' + tabID + '"></table>')
				.appendTo($("#" + tabID));
	var thead_provider = $('<thead><tr>' 
					+ '<th class="hidden">ID</th>'
					+ '<th>序号</th>'
					+ '<th>供应商名称</th>'
					+ '<th>联系人</th>'
					+ '<th>联系地址</th>'
					+ '<th>联系电话</th>'
					+ '<th>QQ</th>'
					+ '<th>微信</th>'
					+ '<th>操作</th>'
					+ '</tr></thead>').appendTo(table_provider);
	var tbody_provider = $('<tbody></tbody>').appendTo(table_provider);
	run_waitMe($('#'+tabID), '请稍后...', 'win8_linear');
	
	$.getJSON('/infomanage/display_provider/', function(json_data){
		if(json_data){
			var i = 0;
			$.each(json_data, function(index, item){
				var html_provider = '<tr>'
						+ '<td class="hidden">' + index +'</td>'
						+ '<td>' + ++i + '</td>'
						+ '<td>' + item.name + '</td>'
						+ '<td >' + item.people + '</td>'
						+ '<td>' + item.addr + '</td>'
						+ '<td>' + item.phone + '</td>'
						+ '<td>' + item.qq + '</td>'
						+ '<td>' + item.weixin + '</td>'
						+ '<td class="dropdown"><a class="btn btn-default provider-menu actionMenu"'
						+ ' data-toggle="dropdown" href="#">更多 <i class="fa fa-sort-down"></i></a></td>'
						+ '</tr>'
				$(html_provider).appendTo(tbody_provider);
			});
		}
	});
	
	setTimeout(function(){
		$('#'+tabID).closest('.window_main').waitMe('hide');
	}, 300);
	
	setTimeout(function(){
		//使用Jquery DataTable插件		
		$('#tbl_' + tabID).DataTable();
		
		var contextMenu = $(document.createElement('ul')).appendTo(tbody_provider);
		contextMenu.addClass('dropdown-menu').attr('role', 'menu').attr('id', 'provider-menu')
			.css('top', '80%').css('font-size', '12px').css('left', '0px').css('left', 'auto').css('min-width', '100px');
		$('<li><a tabindex="-1" href="#" class="provider-edit">修改</a></li>').appendTo(contextMenu);
		$('<li role="separator" class="divider"></li>').appendTo(contextMenu);
		$('<li><a tabindex="-1" href="#" class="provider-delete" style="color:red">删除</a></li>').appendTo(contextMenu);
	}, 100);
	
	$('#tbl_' + tabID).closest('div.window').find('div.window_bottom')
			.html('提示：您可以在此添加或删除供应商。');
}

/**
 * 响应供应商管理页面的action-menu
 *
 *
 */
 function provider_action(element, action){ 
	 if($('div.dialog')){
		 $('div.dialog').remove();
	 }
	 if(action == 'add'){		 
		 var form_html = '<form method="post", class="contact_form" style="width:500px">'
				+ '<ul><li><h2>您正在添加新的供应商</h2><span class="required_notification">* 不能为空</span></li>'
				+ '<li><label for="provider_name">*供应商名称</label>'
				+ '<input type="text" name="provider_name" id="provider_name" value="" required="true"></li>'
				+ '<li><label for="provider_people">联系人</label>'
				+ '<input type="text" name="provider_people" id="provider_people" value="" required="true"></li>'
				+ '<li><label for="provider_addr">联系地址</label>'
				+ '<textarea name="provider_addr" id="provider_addr" cols="40" rows="3"></textarea></li>'
				+ '<li><label for="provider_phone">联系电话</label>'
				+ '<input type="text" name="provider_phone" id="provider_phone" value=""></li>'
				+ '<li><label for="provider_qq">供应商QQ</label>'
				+ '<input type="text" name="provider_qq" id="provider_qq" value=""></li>'
				+ '<li><label for="provider_weixin">供应商微信</label>'
				+ '<input type="text" name="provider_weixin" id="provider_weixin" value=""></li>'
				+ '</ul></form>';
		
		var dlg_form = $('<div></div>').appendTo($('#desktop'));
		dlg_form.addClass('dialog').attr('id', 'dlg_add_provider').attr('title', '添加新供应商');
		
		$(form_html).appendTo(dlg_form);
		$('#dlg_add_provider').dialog({
			modal: true,
			width: 650,
			buttons: {
				"取消": function(){
					$(this).dialog('close');
				},
				"确定": function(){
					var provider_name = dlg_form.find('#provider_name').val(),
						provider_people = dlg_form.find('#provider_people').val(),
						provider_addr = dlg_form.find('#provider_addr').val(),
						provider_phone = dlg_form.find('#provider_phone').val(),
						provider_qq = dlg_form.find('#provider_qq').val(),
						provider_weixin = dlg_form.find('#provider_weixin').val();
					if(!provider_name.trim()){
						alert("供应商名称不能为空！");
						return false;
					}
					//alert(provider_name+' '+provider_phone);
					//return false;
					$(this).dialog('close');
					
					run_waitMe(element, '请稍后...', 'win8_linear');
					
					$.ajax({
						type : 'POST',
						url : '/infomanage/add_provider/',
						data : {
							'name': provider_name,
							'people': provider_people,
							'addr': provider_addr,
							'phone': provider_phone,
							'qq': provider_qq,
							'weixin': provider_weixin,
						},
						beforeSend: function(xhr, settings){  
							var csrftoken = $.cookie('csrftoken');  
							xhr.setRequestHeader("X-CSRFToken", csrftoken);  
						},
						success: function(data){
							console.log(data);
							display_provider("info_provider");
							element.closest('.window_main').waitMe('hide');
						},
						error: function(xhrm, data){
							element.closest('.window_main').waitMe('hide');
							alert('添加供应商失败');
						}
					});
					
					setTimeout(function(){
						element.closest('.window_main').waitMe('hide');
					}, 1000);
				}
			}
		});
	 }else if(action == 'update'){
		 var obj = element.closest('tr').children();
		 var provider_id = obj.eq(0).html(),
			 provider_name = obj.eq(2).html(),
			 provider_people = obj.eq(3).html(),
			 provider_addr = obj.eq(4).html(),
			 provider_phone = obj.eq(5).html(),
			 provider_qq = obj.eq(6).html(),
			 provider_weixin = obj.eq(7).html();
		//alert(provider_id); return false;
		 var form_html = '<form method="post", class="contact_form" style="width:500px">'
				+ '<ul><li><h2>您正在修改供应商：<strong style="color:red">' + provider_name + '</strong></h2><span class="required_notification">* 不能为空</span></li>'
				+ '<li><label for="provider_name">*供应商名称</label>'
				+ '<input type="text" name="provider_name" id="provider_name" value="' + provider_name + '" required="true"></li>'
				+ '<li><label for="provider_people">联系人</label>'
				+ '<input type="text" name="provider_people" id="provider_people" value="' + provider_people + '" required="true"></li>'
				+ '<li><label for="provider_addr">联系地址</label>'
				+ '<textarea name="provider_addr" id="provider_addr" cols="40" rows="3">' + provider_addr + '</textarea></li>'
				+ '<li><label for="provider_phone">联系电话</label>'
				+ '<input type="text" name="provider_phone" id="provider_phone" value="' + provider_phone + '" required="true"></li>'
				+ '<li><label for="provider_qq">供应商QQ</label>'
				+ '<input type="text" name="provider_qq" id="provider_qq" value="' + provider_qq + '"></li>'
				+ '<li><label for="provider_weixin">供应商微信</label>'
				+ '<input type="text" name="provider_weixin" id="provider_weixin" value="' + provider_weixin + '"></li>'
				+ '</ul></form>';
		
		var dlg_form = $('<div></div>').appendTo($('#desktop'));
		dlg_form.addClass('dialog').attr('id', 'dlg_update_provider').attr('title', '修改供应商');
		
		$(form_html).appendTo(dlg_form);
		$('#dlg_update_provider').dialog({
			modal: true,
			width: 650,
			buttons: {
				"取消": function(){
					$(this).dialog('close');
				},
				"确定": function(){
					var name = dlg_form.find('#provider_name').val(),
						people = dlg_form.find('#provider_people').val(),
						addr = dlg_form.find('#provider_addr').val(),
						phone = dlg_form.find('#provider_phone').val(),
						qq = dlg_form.find('#provider_qq').val(),
						weixin = dlg_form.find('#provider_weixin').val();
					if(!provider_name.trim()){
						alert("供应商名称不能为空！");
						return false;
					}
					//alert(name+' '+people); //return false;
					
					$(this).dialog('close');
					
					run_waitMe(element, '请稍后...', 'win8_linear');
					
					$.ajax({
						type : 'POST',
						url : '/infomanage/update_provider/',
						data : {
							'id': provider_id,
							'name': name,
							'people': people,
							'addr': addr,
							'phone': phone,
							'qq': qq,
							'weixin': weixin,
						},
						beforeSend: function(xhr, settings){  
							var csrftoken = $.cookie('csrftoken');  
							xhr.setRequestHeader("X-CSRFToken", csrftoken);  
						},
						success: function(data){
							console.log(data);
							display_provider("info_provider");
							element.closest('.window_main').waitMe('hide');
						},
						error: function(xhrm, data){
							element.closest('.window_main').waitMe('hide');
							alert('修改供应商失败');
						}
					});
					
					setTimeout(function(){
						element.closest('.window_main').waitMe('hide');
					}, 1000);
				}
			}
		});
	 }else if(action == 'delete'){
		 var obj = element.closest('tr').children();
		 var provider_id = obj.eq(0).html(),
			 provider_name = obj.eq(2).html();
		var dlg_form = $(document.createElement('div')).appendTo($('#desktop'));
		dlg_form.addClass('dialog').attr('id', 'dlg_delete_provider').attr('title', '删除供应商');
		var form_html = '<span>请问您确定要删除供应商“<strong style="color:red">' + provider_name + '</strong>”？</span>';
		$(form_html).appendTo(dlg_form);
		$('#dlg_delete_provider').dialog({
			modal: true,
			width: 400,
			buttons: {
				"取消": function () {
					$(this).dialog('close');
				},
				"确定": function () {                	
					 $(this).dialog('close');
					 run_waitMe(element, '请稍后...', 'win8_linear');
					 //delete
					$.ajax({
						type : 'POST',
						url : '/infomanage/delete_provider/',
						data : {
							"id": provider_id,
						},
						dataType : 'json',
						beforeSend: function(xhr, settings){  
							var csrftoken = $.cookie('csrftoken');  
							xhr.setRequestHeader("X-CSRFToken", csrftoken);  
						 },  
						success : function(data) {
							display_provider('info_provider');
							element.closest('.window_main').waitMe('hide');
						},
						error : function(xhr, state) {
							element.closest('.window_main').waitMe('hide');
							alert('Ajax delete error! Please try again!')
						}
					});
					setTimeout(function(){
						element.closest('.window_main').waitMe('hide');
					}, 200);                    
				},
				
			},
			close: function (event, ui) {
				$(this).remove();
			}
		});
	 }
 }


 /**
  * 显示员工子页面的内容
  * @param tabID	职务子页面所属的tab的ID
  */
function display_staff(tabID){
	if($('#tbl_' + tabID)){//如果当前table已经有内容，先将其删除
		$('#tbl_' + tabID + '_wrapper').remove();//将jquery DataTable包裹table的div删除
	}
	var table_staff = $('<table class="data display" cellspacing="0" width="100%" id="tbl_' + tabID + '"></table>')
				.appendTo($("#" + tabID));
	var thead_staff = $('<thead><tr>' 
					+ '<th class="hidden">ID</th>'
					+ '<th>序号</th>'
					+ '<th>姓名</th>'
					+ '<th>联系地址</th>'
					+ '<th>联系电话</th>'
					+ '<th>提成方式</th>'
					+ '<th>提成率</th>'
					+ '<th>部门</th>'
					+ '<th>职务</th>'
					+ '<th>操作</th>'
					+ '</tr></thead>').appendTo(table_staff);
	var tbody_staff = $('<tbody></tbody>').appendTo(table_staff);
	run_waitMe($('#'+tabID), '请稍后...', 'win8_linear');
	
	$.getJSON('/infomanage/display_staff/', function(json_data){
		var i = 0;
		var department, duty;
		if(json_data){
			//查询部门
			$.ajaxSettings.async = false;
			$.getJSON('/infomanage/display_department/', function(json_data){
				if(json_data){
					//console.log(json_data);
					department = json_data;
				}
			});
			//查询职务
			$.getJSON('/infomanage/display_duty/',function(json_data){
				if(json_data){
					//console.log(json_data);
					duty = json_data;
				}
			});
			$.ajaxSettings.async = true;
			$.each(json_data, function(index, item){				
				var html_staff = '<tr>'
						+ '<td class="hidden">' + index +'</td>'
						+ '<td>' + ++i + '</td>'
						+ '<td>' + item.name + '</td>'
						+ '<td>' + item.addr + '</td>'
						+ '<td>' + item.phone + '</td>'
						+ '<td>' + item.method + '</td>'
						+ '<td>' + item.rate + '</td>'
						+ '<td>' + department[item.department_id]['name'] + '</td>'
						+ '<td>' + duty[item.duty_id]['duty'] + '</td>'
						+ '<td class="dropdown"><a class="btn btn-default staff-menu actionMenu"'
						+ ' data-toggle="dropdown" href="#">更多 <i class="fa fa-sort-down"></i></a></td>'
						+ '</tr>'
				$(html_staff).appendTo(tbody_staff);
			});
		}
	});
	
	setTimeout(function(){
		$('#'+tabID).closest('.window_main').waitMe('hide');
	}, 300);
	
	setTimeout(function(){
		//使用Jquery DataTable插件		
		$('#tbl_' + tabID).DataTable();
		
		var contextMenu = $(document.createElement('ul')).appendTo(tbody_staff);
		contextMenu.addClass('dropdown-menu').attr('role', 'menu').attr('id', 'staff-menu')
			.css('top', '80%').css('font-size', '12px').css('left', '0px').css('left', 'auto').css('min-width', '100px');
		$('<li><a tabindex="-1" href="#" class="staff-edit">修改</a></li>').appendTo(contextMenu);
		$('<li role="separator" class="divider"></li>').appendTo(contextMenu);
		$('<li><a tabindex="-1" href="#" class="staff-delete" style="color:red">删除</a></li>').appendTo(contextMenu);
	}, 100);
	
	$('#tbl_' + tabID).closest('div.window').find('div.window_bottom')
			.html('提示：您可以在此添加或删除员工。');
}


/**
 * 响应员工管理页面的action-menu
 *
 *
 */
 function staff_action(element, action){ 
	 if($('div.dialog')){
		 $('div.dialog').remove();
	 }
	 if(action == 'add'){		 
		 var form_html = '<form method="post", class="contact_form" style="width:500px">'
				+ '<ul><li><h2>您正在添加新的职务</h2><span class="required_notification">* 不能为空</span></li>'
				+ '<li><p>提示：您可能需要先在“部门管理”页面添加部门和在“职务管理”页面添加职务。</p></li>'
				+ '<li><label for="staff_name">*员工姓名</label>'
				+ '<input type="text" name="staff_name" id="staff_name" value="" required="true"></li>'
				+ '<li><label for="staff_addr">联系地址</label>'
				+ '<input type="text" name="staff_addr" id="staff_addr" value=""></li>'
				+ '<li><label for="staff_phone">联系电话</label>'
				+ '<input type="text" name="staff_phone" id="staff_phone" value=""></li>'
				+ '<li><label for="staff_method">提成方式</label><select id="staff_method">'
				+ '<option value ="尚未实现">尚未实现</option>'
				+ '</select></li>'
				+ '<li><label for="staff_rate">*提成率<br>(为0表示不提成)</label>'
				+ '<input type="text" name="staff_rate" id="staff_rate" value="0" placeholder="0" required="true">%</li>'
				+ '<li><label for="staff_department">部门</label><select id="staff_department">'				
				+ '<option value ="">请选择部门</option>'
				+ '</select>&nbsp;&nbsp;&nbsp;<span id="new_department">添加新部门</span></li>'	
				+ '<li><label for="staff_duty">职务</label><select id="staff_duty">'				
				+ '<option value ="">请选择职务</option>'
				+ '</select>&nbsp;&nbsp;&nbsp;<span id="new_department">添加新职务</span></li>'	
				+ '</ul></form>';
		
		var dlg_form = $('<div></div>').appendTo($('#desktop'));
		dlg_form.addClass('dialog').attr('id', 'dlg_add_staff').attr('title', '添加新员工');		
		$(form_html).appendTo(dlg_form);
		
		//填充部门的select
		$.getJSON('/infomanage/display_department/', function(json_data){
			if(json_data){
				$.each(json_data, function(index, item){
					var option_html = '<option value="'
							+ item.name							
							+ '" name="'
							+ index
							+ '">'
							+ item.name
							+ '</option>';
					$(option_html).appendTo('#staff_department');
				});
			}
		});
		//填充职务的select
		$.getJSON('/infomanage/display_duty/',function(json_data){
			if(json_data){
				$.each(json_data, function(index, item){
					var option_html = '<option value="'
							+ item.duty
							+ '" name="'
							+ index
							+ '">'							
							+ item.duty
							+ '</option>';
					$(option_html).appendTo('#staff_duty');
				});
			}
		});
		
		$('#dlg_add_staff').dialog({
			modal: true,
			width: 650,
			buttons: {
				"取消": function(){
					$(this).dialog('close');
				},
				"确定": function(){
					var name = dlg_form.find('#staff_name').val(),
						addr = dlg_form.find('#staff_addr').val(),
						phone = dlg_form.find('#staff_phone').val(),
						method = '', //dlg_form.find('#staff_method option:selected').text(),
						rate = parseFloat(dlg_form.find('#staff_rate').val()),
						department_id = parseInt(dlg_form.find('#staff_department option:selected').attr('name')),
						duty_id = parseInt(dlg_form.find('#staff_duty option:selected').attr('name'));
										
					if(!name.trim()){
						alert("员工姓名不能为空！");
						//alert(name);
						return false;
					}
					$(this).dialog('close');
					
					run_waitMe(element, '请稍后...', 'win8_linear');
					
					$.ajax({
						type : 'POST',
						url : '/infomanage/add_staff/',
						data : {
							'name': name,
							'addr': addr,
							'phone': phone,
							'method': method,
							'rate': rate,
							'department_id': department_id,
							'duty_id': duty_id,
						},
						beforeSend: function(xhr, settings){  
							var csrftoken = $.cookie('csrftoken');  
							xhr.setRequestHeader("X-CSRFToken", csrftoken);  
						},
						success: function(data){
							console.log(data);
							display_staff("info_staff");
							element.closest('.window_main').waitMe('hide');
						},
						error: function(xhrm, data){
							element.closest('.window_main').waitMe('hide');
							alert('添加员工失败');
						}
					});
					
					setTimeout(function(){
						element.closest('.window_main').waitMe('hide');
					}, 1000);
				}
			}
		});
	 }else if(action == 'update'){
		 var obj = element.closest('tr').children();
		 var staff_id = obj.eq(0).html(),
			 name = obj.eq(2).html(),
			 addr = obj.eq(3).html(),
			 phone = obj.eq(4).html(),
			 method = obj.eq(5).html(),
			 rate = obj.eq(6).html(),
			 department = obj.eq(7).html(),
			 duty = obj.eq(8).html();
		 //alert(department + '  ' + duty);
		 var form_html = '<form method="post", class="contact_form" style="width:500px">'
				+ '<ul><li><h2>您正在添加新的职务</h2><span class="required_notification">* 不能为空</span></li>'
				+ '<li><p>提示：您可能需要先在“部门管理”页面添加部门和在“职务管理”页面添加职务。</p></li>'
				+ '<li><label for="staff_name">*员工姓名</label>'
				+ '<input type="text" name="staff_name" id="staff_name" value="' + name + '" required="true"></li>'
				+ '<li><label for="staff_addr">联系地址</label>'
				+ '<input type="text" name="staff_addr" id="staff_addr" value="' + addr + '"></li>'
				+ '<li><label for="staff_phone">联系电话</label>'
				+ '<input type="text" name="staff_phone" id="staff_phone" value="' + phone + '"></li>'
				+ '<li><label for="staff_method">提成方式</label><select id="staff_method">'
				+ '<option value ="尚未实现">尚未实现</option>'
				+ '</select></li>'
				+ '<li><label for="staff_rate">*提成率<br>(为0表示不提成)</label>'
				+ '<input type="text" name="staff_rate" id="staff_rate" value="' + rate + '" placeholder="0" required="true">%</li>'
				+ '<li><label for="staff_department">部门</label><select id="staff_department">'				
				+ '<option value ="">请选择部门</option>'
				+ '</select>&nbsp;&nbsp;&nbsp;<span id="new_department">添加新部门</span></li>'	
				+ '<li><label for="staff_duty">职务</label><select id="staff_duty">'				
				+ '<option value ="">请选择职务</option>'
				+ '</select>&nbsp;&nbsp;&nbsp;<span id="new_department">添加新职务</span></li>'	
				+ '</ul></form>';
		
		var dlg_form = $('<div></div>').appendTo($('#desktop'));
		dlg_form.addClass('dialog').attr('id', 'dlg_update_staff').attr('title', '修改职务');
		
		$(form_html).appendTo(dlg_form);
				//填充部门的select
		$.getJSON('/infomanage/display_department/', function(json_data){
			if(json_data){
				$.each(json_data, function(index, item){
					if(item.name == department){
						var option_html = '<option selected value="'
							+ item.name							
							+ '" name="'
							+ index
							+ '">'
							+ item.name
							+ '</option>';
					}else{
						var option_html = '<option value="'
							+ item.name							
							+ '" name="'
							+ index
							+ '">'
							+ item.name
							+ '</option>';
					}
					
					$(option_html).appendTo('#staff_department');
				});
			}
		});
		//填充职务的select
		$.getJSON('/infomanage/display_duty/',function(json_data){
			if(json_data){
				$.each(json_data, function(index, item){
					if(item.duty == duty){
						var option_html = '<option selected value="'
							+ item.duty							
							+ '" name="'
							+ index
							+ '">'
							+ item.duty
							+ '</option>';
					}else{
						var option_html = '<option value="'
							+ item.duty							
							+ '" name="'
							+ index
							+ '">'
							+ item.duty
							+ '</option>';
					}
					$(option_html).appendTo('#staff_duty');
				});
			}
		});
		var i = 0;		
		
		$('#dlg_update_staff').dialog({
			modal: true,
			width: 650,
			buttons: {
				"取消": function(){
					$(this).dialog('close');
				},
				"确定": function(){
					var name = dlg_form.find('#staff_name').val(),
						addr = dlg_form.find('#staff_addr').val(),
						phone = dlg_form.find('#staff_phone').val(),
						method = '', //dlg_form.find('#staff_method option:selected').text(),
						rate = parseFloat(dlg_form.find('#staff_rate').val()),
						department_id = parseInt(dlg_form.find('#staff_department option:selected').attr('name')),
						duty_id = parseInt(dlg_form.find('#staff_duty option:selected').attr('name'));
					//alert(department_id + '  ' + duty_id);
					if(!name.trim()){
						alert("员工名称不能为空！");
						return false;
					}
					$(this).dialog('close');
					
					run_waitMe(element, '请稍后...', 'win8_linear');
					
					$.ajax({
						type : 'POST',
						url : '/infomanage/update_staff/',
						data : {
							'staff_id': staff_id,
							'name': name,
							'addr': addr,
							'phone': phone,
							'method': method,
							'rate': rate,
							'department_id': department_id,
							'duty_id': duty_id,
						},
						beforeSend: function(xhr, settings){  
							var csrftoken = $.cookie('csrftoken');  
							xhr.setRequestHeader("X-CSRFToken", csrftoken);  
						},
						success: function(data){
							console.log(data);
							display_staff("info_staff");
							element.closest('.window_main').waitMe('hide');
						},
						error: function(xhrm, data){
							element.closest('.window_main').waitMe('hide');
							alert('修改职务失败');
						}
					});
					
					setTimeout(function(){
						element.closest('.window_main').waitMe('hide');
					}, 1000);
				}
			}
		});
	 }else if(action == 'delete'){
		 var obj = element.closest('tr').children();
		 var staff_id = obj.eq(0).html(),
			 staff_name = obj.eq(2).html();
		var dlg_form = $(document.createElement('div')).appendTo($('#desktop'));
		dlg_form.addClass('dialog').attr('id', 'dlg_delete_staff').attr('title', '删除职务');
		var form_html = '<span>请问您确定要删除员工“<strong style="color:red">' + staff_name + '</strong>的所有信息”？</span>';
		$(form_html).appendTo(dlg_form);
		$('#dlg_delete_staff').dialog({
			modal: true,
			width: 400,
			buttons: {
				"取消": function () {
					$(this).dialog('close');
				},
				"确定": function () {                	
					 $(this).dialog('close');
					 run_waitMe(element, '请稍后...', 'win8_linear');
					 //delete
					$.ajax({
						type : 'POST',
						url : '/infomanage/delete_staff/',
						data : {
							"id": staff_id,
						},
						dataType : 'json',
						beforeSend: function(xhr, settings){  
							var csrftoken = $.cookie('csrftoken');  
							xhr.setRequestHeader("X-CSRFToken", csrftoken);  
						 },  
						success : function(data) {
							display_staff('info_staff');
							element.closest('.window_main').waitMe('hide');
						},
						error : function(xhr, state) {
							element.closest('.window_main').waitMe('hide');
							alert('Ajax delete error! Please try again!')
						}
					});
					setTimeout(function(){
						element.closest('.window_main').waitMe('hide');
					}, 200);                    
				},
				
			},
			close: function (event, ui) {
				$(this).remove();
			}
		});
	 }
 }
 

 /**
  * 显示部门子页面的内容
  * @param tabID	部门子页面所属的tab的ID
  */
function display_department(tabID){
	if($('#tbl_' + tabID)){//如果当前table已经有内容，先将其删除
		$('#tbl_' + tabID + '_wrapper').remove();//将jquery DataTable包裹table的div删除
	}
	var table_department = $('<table class="data display" cellspacing="0" width="100%" id="tbl_' + tabID + '"></table>')
				.appendTo($("#" + tabID));
	var thead_department = $('<thead><tr>' 
					+ '<th class="hidden">ID</th>'
					+ '<th>序号</th>'
					+ '<th>部门名称</th>'
					+ '<th>负责人</th>'
					+ '<th>描述或备注</th>'
					+ '<th>操作</th>'
					+ '</tr></thead>').appendTo(table_department);
	var tbody_department = $('<tbody></tbody>').appendTo(table_department);
	run_waitMe($('#'+tabID), '请稍后...', 'win8_linear');
	
	$.getJSON('/infomanage/display_department/', function(json_data){
		if(json_data){
			var i = 0;
			$.each(json_data, function(index, item){
				var html_department = '<tr>'
						+ '<td class="hidden">' + index +'</td>'
						+ '<td>' + ++i + '</td>'
						+ '<td>' + item.name + '</td>'
						+ '<td >' + item.leader + '</td>'
						+ '<td>' + item.remark + '</td>'
						+ '<td class="dropdown"><a class="btn btn-default department-menu actionMenu"'
						+ ' data-toggle="dropdown" href="#">更多 <i class="fa fa-sort-down"></i></a></td>'
						+ '</tr>'
				$(html_department).appendTo(tbody_department);
			});
		}
	});
	
	setTimeout(function(){
		$('#'+tabID).closest('.window_main').waitMe('hide');
	}, 300);
	
	setTimeout(function(){
		//使用Jquery DataTable插件		
		$('#tbl_' + tabID).DataTable();
		
		var contextMenu = $(document.createElement('ul')).appendTo(tbody_department);
		contextMenu.addClass('dropdown-menu').attr('role', 'menu').attr('id', 'department-menu')
			.css('top', '80%').css('font-size', '12px').css('left', '0px').css('left', 'auto').css('min-width', '100px');
		$('<li><a tabindex="-1" href="#" class="department-edit">修改</a></li>').appendTo(contextMenu);
		$('<li role="separator" class="divider"></li>').appendTo(contextMenu);
		$('<li><a tabindex="-1" href="#" class="department-delete" style="color:red">删除</a></li>').appendTo(contextMenu);
	}, 100);
	
	$('#tbl_' + tabID).closest('div.window').find('div.window_bottom')
			.html('提示：您可以在此添加或删除部门。');
}

/**
 * 响应部门管理页面的action-menu
 *
 *
 */
 function department_action(element, action){ 
	 if($('div.dialog')){
		 $('div.dialog').remove();
	 }
	 if(action == 'add'){		 
		 var form_html = '<form method="post", class="contact_form" style="width:500px">'
				+ '<ul><li><h2>您正在添加新的部门</h2><span class="required_notification">* 不能为空</span></li>'
				+ '<li><label for="department_name">*部门名称</label>'
				+ '<input type="text" name="department_name" id="department_name" value="" required="true"></li>'
				+ '<li><label for="department_leader">负责人</label>'
				+ '<input type="text" name="department_leader" id="department_leader" value="" required="true"></li>'
				+ '<li><label for="department_remark">描述或备注</label>'
				+ '<textarea name="department_remark" id="department_reamrk" cols="40" rows="5"></textarea></li>'				
				+ '</ul></form>';
		
		var dlg_form = $('<div></div>').appendTo($('#desktop'));
		dlg_form.addClass('dialog').attr('id', 'dlg_add_department').attr('title', '添加新部门');
		
		$(form_html).appendTo(dlg_form);
		$('#dlg_add_department').dialog({
			modal: true,
			width: 650,
			buttons: {
				"取消": function(){
					$(this).dialog('close');
				},
				"确定": function(){
					var department_name = dlg_form.find('#department_name').val(),
						department_leader = dlg_form.find('#department_leader').val(),
						department_remark = dlg_form.find('#department_remark').val() || '暂无';					
					if(!department_name.trim()){
						alert("供应商名称不能为空！");
						return false;
					}
					//alert(department_name+' '+department_phone);
					//return false;
					$(this).dialog('close');
					
					run_waitMe(element, '请稍后...', 'win8_linear');
					
					$.ajax({
						type : 'POST',
						url : '/infomanage/add_department/',
						data : {
							'name': department_name,
							'leader': department_leader,
							'remark': department_remark,
						},
						beforeSend: function(xhr, settings){  
							var csrftoken = $.cookie('csrftoken');  
							xhr.setRequestHeader("X-CSRFToken", csrftoken);  
						},
						success: function(data){
							console.log(data);
							display_department("info_department");
							element.closest('.window_main').waitMe('hide');
						},
						error: function(xhrm, data){
							element.closest('.window_main').waitMe('hide');
							alert('添加部门失败');
						}
					});
					
					setTimeout(function(){
						element.closest('.window_main').waitMe('hide');
					}, 1000);
				}
			}
		});
	 }else if(action == 'update'){
		 var obj = element.closest('tr').children();
		 var department_id = obj.eq(0).html(),
			 department_name = obj.eq(2).html(),
			 department_leader = obj.eq(3).html(),
			 department_remark = obj.eq(4).html();
			 
		 var form_html = '<form method="post", class="contact_form" style="width:500px">'
				+ '<ul><li><h2>您正在修改部门：<strong style="color:red">' + department_name + '</strong></h2><span class="required_notification">* 不能为空</span></li>'
				+ '<li><label for="department_name">*部门名称</label>'
				+ '<input type="text" name="department_name" id="department_name" value="' + department_name + '" required="true"></li>'
				+ '<li><label for="department_leader">负责人</label>'
				+ '<input type="text" name="department_leader" id="department_leader" value="' + department_leader + '" required="true"></li>'
				+ '<li><label for="department_remark">描述或备注</label>'
				+ '<textarea name="department_remark" id="department_remark" cols="40" rows="5">' + department_remark + '</textarea></li>'				
				+ '</ul></form>';
		
		var dlg_form = $('<div></div>').appendTo($('#desktop'));
		dlg_form.addClass('dialog').attr('id', 'dlg_update_department').attr('title', '修改部门');
		
		$(form_html).appendTo(dlg_form);
		$('#dlg_update_department').dialog({
			modal: true,
			width: 650,
			buttons: {
				"取消": function(){
					$(this).dialog('close');
				},
				"确定": function(){
					var name = dlg_form.find('#department_name').val(),
						leader = dlg_form.find('#department_leader').val(),
						remark = dlg_form.find('#department_remark').val() || '暂无';
					if(!department_name.trim()){
						alert("部门名称不能为空！");
						return false;
					}
					//alert(name+' '+leader); //return false;
					
					$(this).dialog('close');
					
					run_waitMe(element, '请稍后...', 'win8_linear');
					
					$.ajax({
						type : 'POST',
						url : '/infomanage/update_department/',
						data : {
							'id': department_id,
							'name': name,
							'leader': leader,
							'remark': remark,
						},
						beforeSend: function(xhr, settings){  
							var csrftoken = $.cookie('csrftoken');  
							xhr.setRequestHeader("X-CSRFToken", csrftoken);  
						},
						success: function(data){
							console.log(data);
							display_department("info_department");
							element.closest('.window_main').waitMe('hide');
						},
						error: function(xhrm, data){
							element.closest('.window_main').waitMe('hide');
							alert('修改部门失败');
						}
					});
					
					setTimeout(function(){
						element.closest('.window_main').waitMe('hide');
					}, 1000);
				}
			}
		});
	 }else if(action == 'delete'){
		 var obj = element.closest('tr').children();
		 var department_id = obj.eq(0).html(),
			 department_name = obj.eq(2).html();
		var dlg_form = $(document.createElement('div')).appendTo($('#desktop'));
		dlg_form.addClass('dialog').attr('id', 'dlg_delete_department').attr('title', '删除供应商');
		var form_html = '<span>请问您确定要删除部门“<strong style="color:red">' + department_name + '</strong>”？</span>';
		$(form_html).appendTo(dlg_form);
		$('#dlg_delete_department').dialog({
			modal: true,
			width: 400,
			buttons: {
				"取消": function () {
					$(this).dialog('close');
				},
				"确定": function () {                	
					 $(this).dialog('close');
					 run_waitMe(element, '请稍后...', 'win8_linear');
					 //delete
					$.ajax({
						type : 'POST',
						url : '/infomanage/delete_department/',
						data : {
							"id": department_id,
						},
						dataType : 'json',
						beforeSend: function(xhr, settings){  
							var csrftoken = $.cookie('csrftoken');  
							xhr.setRequestHeader("X-CSRFToken", csrftoken);  
						 },  
						success : function(data) {
							display_department('info_department');
							element.closest('.window_main').waitMe('hide');
						},
						error : function(xhr, state) {
							element.closest('.window_main').waitMe('hide');
							alert('Ajax delete error! Please try again!')
						}
					});
					setTimeout(function(){
						element.closest('.window_main').waitMe('hide');
					}, 200);                    
				},
				
			},
			close: function (event, ui) {
				$(this).remove();
			}
		});
	 }
 }
 
 
 /**
  * 显示职务子页面的内容
  * @param tabID	职务子页面所属的tab的ID
  */
function display_duty(tabID){
	if($('#tbl_' + tabID)){//如果当前table已经有内容，先将其删除
		$('#tbl_' + tabID + '_wrapper').remove();//将jquery DataTable包裹table的div删除
	}
	var table_duty = $('<table class="data display" cellspacing="0" width="100%" id="tbl_' + tabID + '"></table>')
				.appendTo($("#" + tabID));
	var thead_duty = $('<thead><tr>' 
					+ '<th class="hidden">ID</th>'
					+ '<th>序号</th>'
					+ '<th>职务名称</th>'
					+ '<th class="hidden">Authority</th>'
					+ '<th>权限描述</th>'
					+ '<th>备注</th>'
					+ '<th>操作</th>'
					+ '</tr></thead>').appendTo(table_duty);
	var tbody_duty = $('<tbody></tbody>').appendTo(table_duty);
	run_waitMe($('#'+tabID), '请稍后...', 'win8_linear');
	
	$.getJSON('/infomanage/display_duty/', function(json_data){
		if(json_data){
			var i = 0;
			$.each(json_data, function(index, item){
				var authority_content = '';
				if(item.authority & (1 << 5)){
					authority_content = '| 超级管理员 |';
				}else{
					if(item.authority & (1 << 0)){
						authority_content += '| 销售管理 |';
					}
					if(item.authority & (1 << 1)){
						authority_content += '| 入库管理 |';
					}
					if(item.authority & (1 << 2)){
						authority_content += '| 仓库管理 |';
					}
					if(item.authority & (1 << 3)){
						authority_content += '| 财务管理 |';
					}
					if(item.authority & (1 << 4)){
						authority_content += '| 采购管理 |';
					}
				}
				var html_duty = '<tr>'
						+ '<td class="hidden">' + index +'</td>'
						+ '<td>' + ++i + '</td>'
						+ '<td>' + item.duty + '</td>'
						+ '<td class="hidden">' + item.authority + '</td>'
						+ '<td>' + authority_content + '</td>'
						+ '<td>' + item.content + '</td>'
						+ '<td class="dropdown"><a class="btn btn-default duty-menu actionMenu"'
						+ ' data-toggle="dropdown" href="#">更多 <i class="fa fa-sort-down"></i></a></td>'
						+ '</tr>'
				$(html_duty).appendTo(tbody_duty);
			});
		}
	});
	
	setTimeout(function(){
		$('#'+tabID).closest('.window_main').waitMe('hide');
	}, 300);
	
	setTimeout(function(){
		//使用Jquery DataTable插件		
		$('#tbl_' + tabID).DataTable();
		
		var contextMenu = $(document.createElement('ul')).appendTo(tbody_duty);
		contextMenu.addClass('dropdown-menu').attr('role', 'menu').attr('id', 'duty-menu')
			.css('top', '80%').css('font-size', '12px').css('left', '0px').css('left', 'auto').css('min-width', '100px');
		$('<li><a tabindex="-1" href="#" class="duty-edit">修改</a></li>').appendTo(contextMenu);
		$('<li role="separator" class="divider"></li>').appendTo(contextMenu);
		$('<li><a tabindex="-1" href="#" class="duty-delete" style="color:red">删除</a></li>').appendTo(contextMenu);
	}, 100);
	
	$('#tbl_' + tabID).closest('div.window').find('div.window_bottom')
			.html('提示：您可以在此添加或删除职务。');
}


/**
 * 响应职务管理页面的action-menu
 *
 *
 */
 function duty_action(element, action){ 
	 if($('div.dialog')){
		 $('div.dialog').remove();
	 }
	 if(action == 'add'){		 
		 var form_html = '<form method="post", class="contact_form" style="width:500px">'
				+ '<ul><li><h2>您正在添加新的职务</h2><span class="required_notification">* 不能为空</span></li>'
				+ '<li><p style="float:right">请谨慎选择下列操作权限！！</p></li>'
				+ '<li><label for="duty_name">*职务名称</label>'
				+ '<input type="text" name="duty_name" id="duty_name" value="" required="true"></li>'
				+ '<li><label for="duty_authority">*权限</label>'
				+ '<label class="checkbox-inline"><input type="checkbox" id="duty_authority_1" value="1">销售管理</label>'
				+ '<label class="checkbox-inline"><input type="checkbox" id="duty_authority_2" value="2">入库管理</label>'
				+ '<label class="checkbox-inline"><input type="checkbox" id="duty_authority_3" value="4">仓库管理</label>'
				+ '</li>'
				+ '<li><label for="duty_authority">&nbsp;</label>'
				+ '<label class="checkbox-inline"><input type="checkbox" id="duty_authority_4" value="8">财务管理</label>'
				+ '<label class="checkbox-inline"><input type="checkbox" id="duty_authority_5" value="16">采购管理</label>'
				+ '<label class="checkbox-inline"><input type="checkbox" id="duty_authority_6" value="32">超级管理</label>'
				+ '</li>'
				+ '<li><label for="duty_content">描述或备注</label>'
				+ '<textarea name="duty_content" id="duty_content" cols="40" rows="5"></textarea></li>'				
				+ '</ul></form>';
		
		var dlg_form = $('<div></div>').appendTo($('#desktop'));
		dlg_form.addClass('dialog').attr('id', 'dlg_add_duty').attr('title', '添加新职务');
		
		$(form_html).appendTo(dlg_form);
		$('#dlg_add_duty').dialog({
			modal: true,
			width: 650,
			buttons: {
				"取消": function(){
					$(this).dialog('close');
				},
				"确定": function(){
					var name = dlg_form.find('#duty_name').val(),
						authority = 0,
						content = dlg_form.find('#duty_content').val();
					
					$(':checkbox').each(function(){
						if(this.checked)
							authority |= $(this).attr('value');
					});
					if(!name.trim() || authority==0){
						alert("职务名称不能为空或您尚未选择任何职务权限！");						
						return false;
					}
					$(this).dialog('close');
					
					run_waitMe(element, '请稍后...', 'win8_linear');
					
					$.ajax({
						type : 'POST',
						url : '/infomanage/add_duty/',
						data : {
							'duty': name,
							'authority': authority,
							'content': content,
						},
						beforeSend: function(xhr, settings){  
							var csrftoken = $.cookie('csrftoken');  
							xhr.setRequestHeader("X-CSRFToken", csrftoken);  
						},
						success: function(data){
							console.log(data);
							display_duty("info_duty");
							element.closest('.window_main').waitMe('hide');
						},
						error: function(xhrm, data){
							element.closest('.window_main').waitMe('hide');
							alert('添加职务失败');
						}
					});
					
					setTimeout(function(){
						element.closest('.window_main').waitMe('hide');
					}, 1000);
				}
			}
		});
	 }else if(action == 'update'){
		 var obj = element.closest('tr').children();
		 var duty_id = obj.eq(0).html(),
			 name = obj.eq(2).html(),
			 authority = obj.eq(3).html(),
			 content = obj.eq(5).html();
		 //alert(authority);	 
		 var form_html = '<form method="post", class="contact_form" style="width:500px">'
				+ '<ul><li><h2>您正在修改职务：<strong style="color:red">' + name + '</strong></h2><span class="required_notification">* 不能为空</span></li>'
				+ '<li><p style="float:right">请谨慎选择下列操作权限！！</p></li>'
				+ '<li><label for="duty_name">*职务名称</label>'				
				+ '<input type="text" name="duty_name" id="duty_name" value="' + name + '" required="true"></li>'
				+ '<li><label for="duty_authority">*权限</label>'
				+ '<label class="checkbox-inline"><input type="checkbox" id="duty_authority_1" value="1">销售管理</label>'
				+ '<label class="checkbox-inline"><input type="checkbox" id="duty_authority_2" value="2">入库管理</label>'
				+ '<label class="checkbox-inline"><input type="checkbox" id="duty_authority_3" value="4">仓库管理</label>'
				+ '</li>'
				+ '<li><label for="duty_authority">&nbsp;</label>'
				+ '<label class="checkbox-inline"><input type="checkbox" id="duty_authority_4" value="8">财务管理</label>'
				+ '<label class="checkbox-inline"><input type="checkbox" id="duty_authority_5" value="16">采购管理</label>'
				+ '<label class="checkbox-inline"><input type="checkbox" id="duty_authority_6" value="32">超级管理</label>'
				+ '</li>'
				+ '<li><label for="duty_content">描述或备注</label>'
				+ '<textarea name="duty_content" id="duty_content" cols="40" rows="5">' + content + '</textarea></li>'				
				+ '</ul></form>';
		
		var dlg_form = $('<div></div>').appendTo($('#desktop'));
		dlg_form.addClass('dialog').attr('id', 'dlg_update_duty').attr('title', '修改职务');
		
		$(form_html).appendTo(dlg_form);
		var i = 0;
		if(authority & (1 << 5)){
			$('#duty_authority_6').attr('checked', true);
		}else{
			//alert(authority);
			$(':checkbox').each(function(){
				if(i < 5 && authority & (1 << i))
					$('#duty_authority_' + (i+1)).attr('checked', true);
				++i;
			});
		}
		
		$('#dlg_update_duty').dialog({
			modal: true,
			width: 650,
			buttons: {
				"取消": function(){
					$(this).dialog('close');
				},
				"确定": function(){
					var name = dlg_form.find('#duty_name').val(),
						duty_authority = 0,
						content = dlg_form.find('#duty_content').val();
					
					$(':checkbox').each(function(){
						if(this.checked)
							duty_authority |= $(this).attr('value');
					});
					if(!name.trim() || duty_authority == 0){
						alert("职务名称不能为空或您尚未选择任何职位权限！");
						return false;
					}
					$(this).dialog('close');
					
					run_waitMe(element, '请稍后...', 'win8_linear');
					
					$.ajax({
						type : 'POST',
						url : '/infomanage/update_duty/',
						data : {
							'id': duty_id,
							'duty': name,
							'authority': duty_authority,
							'content': content,
						},
						beforeSend: function(xhr, settings){  
							var csrftoken = $.cookie('csrftoken');  
							xhr.setRequestHeader("X-CSRFToken", csrftoken);  
						},
						success: function(data){
							console.log(data);
							display_duty("info_duty");
							element.closest('.window_main').waitMe('hide');
						},
						error: function(xhrm, data){
							element.closest('.window_main').waitMe('hide');
							alert('修改职务失败');
						}
					});
					
					setTimeout(function(){
						element.closest('.window_main').waitMe('hide');
					}, 1000);
				}
			}
		});
	 }else if(action == 'delete'){
		 var obj = element.closest('tr').children();
		 var duty_id = obj.eq(0).html(),
			 duty_name = obj.eq(2).html();
		var dlg_form = $(document.createElement('div')).appendTo($('#desktop'));
		dlg_form.addClass('dialog').attr('id', 'dlg_delete_duty').attr('title', '删除职务');
		var form_html = '<span>请问您确定要删除职务“<strong style="color:red">' + duty_name + '</strong>”？'
				+ '这可能会导致隶属于这个职务的所有员工被删除！！！</span>';
		$(form_html).appendTo(dlg_form);
		$('#dlg_delete_duty').dialog({
			modal: true,
			width: 400,
			buttons: {
				"取消": function () {
					$(this).dialog('close');
				},
				"确定": function () {                	
					 $(this).dialog('close');
					 run_waitMe(element, '请稍后...', 'win8_linear');
					 //delete
					$.ajax({
						type : 'POST',
						url : '/infomanage/delete_duty/',
						data : {
							"id": duty_id,
						},
						dataType : 'json',
						beforeSend: function(xhr, settings){  
							var csrftoken = $.cookie('csrftoken');  
							xhr.setRequestHeader("X-CSRFToken", csrftoken);  
						 },  
						success : function(data) {
							display_duty('info_duty');
							element.closest('.window_main').waitMe('hide');
						},
						error : function(xhr, state) {
							element.closest('.window_main').waitMe('hide');
							alert('Ajax delete error! Please try again!')
						}
					});
					setTimeout(function(){
						element.closest('.window_main').waitMe('hide');
					}, 200);                    
				},
				
			},
			close: function (event, ui) {
				$(this).remove();
			}
		});
	 }
 }
 

