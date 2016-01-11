/**
 * Created by Ran Li on 1/10/2016
 */
 
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
 * @param selector
 * @param effect
 */
function run_waitMe(selector, effect) {
    $(selector).waitMe({
        effect: effect,
        text: 'Please wait ...',
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
	else if(winId == '#window_settingup'){
		settingup_content(winId, win_main);
	}
	
	else if (winId.substring(0, '#window_labProject_'.length) == '#window_labProject_') {
		newWork_proj(winId, win_main);
	}else if(winId.substring(0, '#window_labTemplate_'.length) == '#window_labTemplate_'){
		newTemplate(winId, win_main);
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
							(160 * i + 20) + 'px').css('color', '#1C94C4').css(
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
		tabId : [ "product_baseinfo", "product_topCategory", "product_unit" ],
		tabName : [ "产品基本信息", "产品分类管理", "产品计量单位" ]
	};
	var buttons = null;
	
	//为窗口建立用于切换的标签
	createTabs(winId, win_main, tabs, buttons);	
	
	//开始创建产品基本信息子页面
	var table_baseinfo = $('<table class="data display " cellspacing="0" width="100%" id="tbl_product_baseinfo"></table>')
					.appendTo($("#product_baseinfo"));
	var thead_baseinfo = $(
			'<thead><tr>' + '<th class="shrink">&nbsp;</th>'
					+ '<th>ID</th>'
					+ '<th>Name</th>' + '<th>Description</th>'
					+ '<th>Shared</th>'
					+ '<th>time</th>'
					+ '<th>update</th>'
					+ '<th class="hidden">ID</th>' + '<th>Actions</th>'
					+ '</tr></thead>').appendTo(table_baseinfo);
	var tbody_baseinfo = $(document.createElement('tbody')).appendTo(table_baseinfo);
	//使用Jquery DataTable插件	
	$('#tbl_product_baseinfo').DataTable();	
	
	//开始创建产品分类管理子页面
	$('<button type="button" class="btn btn-primary add_top_category" value="add_top_category"' 
			+ ' name="新建顶级分类">新建顶级分类</button>')
			.appendTo($("#product_topCategory"));
	
	display_top_category('product_topCategory');
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
			+ ' name="新建子分类">新建子分类</button>')
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
	
	var table_topCategory = $('<table class="data display create_sub_window" cellspacing="0" width="100%" id="tbl_product_topCategory"></table>')
					.appendTo($('#' + tabID));
	var thead_topCategory = $(
			'<thead><tr>' + '<th class="shrink">&nbsp;</th>'
					+ '<th class="hidden">ID</th>'
					+ '<th>序号</th>'
					+ '<th>名称</th>'
					+ '<th>描述</th>'
					+ '<th>操作</th>'
					+ '</tr></thead>').appendTo(table_topCategory);
	var tbody_topCategory = $(document.createElement('tbody')).appendTo(
			table_topCategory);
	
	
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
					+ '<th>名称</th>'
					+ '<th>描述</th>'
					+ '<th>操作</th>'
					+ '</tr></thead>').appendTo(table_subCategory);
	var tbody_subCategory = $(document.createElement('tbody')).appendTo(
			table_subCategory);
			
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
					'<td>' + item.desc + '</td>' +		
					'<td class="dropdown"><a class="btn btn-default subCategory-menu actionMenu"' + 
					' data-toggle="dropdown" href="#">更多 <i class="fa fa-sort-down"></i></a></td>' +
					'</tr>';			
				$(html_subCategory).appendTo(tbody_subCategory);				
			});
		}
	}, 'json');
	
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
	var eid = element.attr("id");
	if(element.hasClass('add_top_category')){
		product_category_action(element, 'add', 'top_category');
	}else if(element.hasClass('add_sub_category')){
		product_category_action(element, 'add', 'sub_category');
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
		var form_html = '<form method="post" class="contact_form" id="form_add_top_category" style="width:400px">' +
				'<ul><li><h2>&nbsp;</h2>' +
				'<span class="required_notification">* 必填</span></li>' +
				'<li><label for="top_category_name">顶级分类名:</label>' +
				'<input type="text" name="top_category_name" id="top_category_name" value="' + category_name + '" required="true" /></il>' +
				'<li><label for="top_category_desc">描述:</label>' +
				'<textarea name="top_category_desc" id="top_category_desc" cols="40" rows="6">' + category_desc + '</textarea></li>' +
				'</ul></form>' +
				'<div id="result_top_category"></div>';
		
		if(action == 'add'){
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
						category_desc = (!category_desc) ? " " : category_desc;
						if (!category_name.trim()) {
							alert('顶级分类名不能为空！');
						}else {
							element.closest('.window_main').waitMe({
								effect: 'win8_linear',
								text: 'Please wait...',
								bg: 'rgba(255,255,255,0.7)',
								color:'#000',
								sizeW:'',
								sizeH:''
							});
							$.ajax({
								type : 'POST',
								url : '/product/add_category/',
								data : {
									"category_name": category_name,
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

							element.closest('.dialog').dialog('close');                		
						}
					},					
				},
				close: function (event, ui) {
					$(this).remove();
				}
			});
		}// end of add top_category
		else if(action == 'update'){
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
						category_desc = (!category_desc) ? " " : category_desc;
						if (!category_name.trim()) {
							alert('顶级分类名不能为空！');
						}else {
							/*
							element.closest('.window_main').waitMe({
								effect: 'win8_linear',
								text: 'Please wait...',
								bg: 'rgba(255,255,255,0.7)',
								color:'#000',
								sizeW:'',
								sizeH:''
							});
							*/
							$.ajax({
								type : 'POST',
								url : '/product/update_category/',
								data : {
									"category_id": category_id,
									"category_name": category_name,
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
			var form_html = '<span>请问您确定要删除分类“' + category_name + '”？<br>这将删除其下所有子分类！</span>';
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
						 /*
						 element.closest('.window_main').waitMe({
							effect: 'win8_linear',
							text: '正在删除...',
							bg: 'rgba(255,255,255,0.7)',
							color:'#000',
							sizeW:'',
							sizeH:''
						 });
						 */
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
				'<ul><li><h2>您正在为“' + top_category_name + '”添加子分类</h2>' +
				'<span class="required_notification">* 必填</span></li>' +
				'<li><label for="sub_category_name">子分类名:</label>' +
				'<input type="text" name="sub_category_name" id="sub_category_name" value="" required="true" /></il>' +
				'<li><label for="sub_category_desc">描述:</label>' +
				'<textarea name="sub_category_desc" id="sub_category_desc" cols="40" rows="6"></textarea></li>' +
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
						category_desc = (!category_desc) ? " " : category_desc;
						if (!category_name.trim()) {
							alert('分类名不能为空！');
						}else {
							/*
							element.closest('.window_main').waitMe({
								effect: 'win8_linear',
								text: 'Please wait...',
								bg: 'rgba(255,255,255,0.7)',
								color:'#000',
								sizeW:'',
								sizeH:''
							});
							*/
							$.ajax({
								type : 'POST',
								url : '/product/add_category/',
								data : {
									"category_name": category_name,
									"category_desc": category_desc,
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
			var category_name = element.closest('tr').children().eq(3).html() || '';
			var category_desc = element.closest('tr').children().eq(4).html() || '';
			var category_id = element.closest('tr').children().eq(1).html();
			var top_category_id = element.closest('div.window').attr('id').substring('window_product_topCategory_'.length);
			var form_html = '<form method="post" class="contact_form" id="form_add_sub_category" style="width:400px">' +
				'<ul><li><h2>您正在修改“' + category_name + '”分类</h2>' +
				'<span class="required_notification">* 必填</span></li>' +
				'<li><label for="sub_category_name">分类名:</label>' +
				'<input type="text" name="sub_category_name" id="sub_category_name" value="' + category_name + '" required="true" /></il>' +
				'<li><label for="sub_category_desc">描述:</label>' +
				'<textarea name="sub_category_desc" id="sub_category_desc" cols="40" rows="6">' + category_desc + '</textarea></li>' +
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
						var category_desc = dlg_form.find('#sub_category_desc').val();
						category_desc = (!category_desc) ? " " : category_desc;
						if (!category_name.trim()) {
							alert('分类名不能为空！');
						}else {
							/*
							element.closest('.window_main').waitMe({
								effect: 'win8_linear',
								text: 'Please wait...',
								bg: 'rgba(255,255,255,0.7)',
								color:'#000',
								sizeW:'',
								sizeH:''
							});
							*/
							$.ajax({
								type : 'POST',
								url : '/product/update_category/',
								data : {
									"category_id": category_id,
									"category_name": category_name,
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
			var form_html = '<span>请问您确定要删除分类“' + category_name + '”？</span>';
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
						 /*
						 element.closest('.window_main').waitMe({
							effect: 'win8_linear',
							text: 'Deleting...',
							bg: 'rgba(255,255,255,0.7)',
							color:'#000',
							sizeW:'',
							sizeH:''
						 });
						 */
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

