# -*- coding: utf-8 -*-

from django.http import HttpResponse

from .models import Information
from .models import Category
from .models import Unit

import json

def display_top_category(request):	
	'''负责产品顶级分类页面显示'''
	
	typelist = dict()
	
	# 先取得顶级分类
	for t in Category.objects.filter(reid = 0):
		typelist[t.id] = dict()
		typelist[t.id]['id'] = t.id
		typelist[t.id]['category'] = t.category_name
		typelist[t.id]['desc'] = t.desc

	return HttpResponse(json.dumps(typelist))
	
def display_sub_category(request):	
	'''负责产品每个顶级分类的子分类页面显示'''
	
	typelist = dict()

	# 先取得顶级分类
	top_category_id = request.GET.get('top_category_id')
	
	for st in Category.objects.filter(reid = top_category_id):
		typelist[st.id] = dict()
		typelist[st.id]['id'] = st.id
		typelist[st.id]['category'] = st.category_name
		typelist[st.id]['desc'] = st.desc

	return HttpResponse(json.dumps(typelist))

def add_category(request):
	'''响应产品分类管理页面的添加顶级和子分类的请求'''	
	c_reid = request.POST.get('category_reid')
	c_name = request.POST.get('category_name')
	c_desc = request.POST.get('category_desc')
	
	info = 'Insert successfully'
	result = {}
	try:
		categories = Category(category_name = c_name, desc = c_desc, reid = c_reid)
		categories.save()
		result['message'] = info
		result['name'] = c_name
		result['desc'] = c_desc
		result['reid'] = c_reid
	except:
		result['message'] = 'Fail to insert database'
	
	return HttpResponse(json.dumps(result))

def update_category(request):
	'''响应产品分类管理页面的修改顶级分类和子分类的请求'''
	c_id = int(request.POST.get('category_id'))
	c_name = request.POST.get('category_name')
	c_desc = request.POST.get('category_desc')
	
	info = 'Insert successfully'
	result = {}
	try:
		categories = Category.objects.get(id = c_id)
		categories.category = c_name;
		categories.desc = c_desc
		categories.save()
		result['message'] = info
		result['name'] = c_name
		result['id'] = c_id
	except:
		result['message'] = 'Fail to insert database'

	return HttpResponse(json.dumps(result))

def delete_category(request):
	'''响应产品分类管理页面的删除顶级分类和子分类的请求'''
	#print request.POST.get('category_id')
	c_id = int(request.POST.get('category_id'))
	is_top_category = int(request.POST.get('is_top_category'))
	
	info = 'Insert successfully'
	result = {}
	if is_top_category == 0 : #删除的是子分类
		try:
			subcategories = Category.objects.get(id = c_id)
			subcategories.delete()
			result['message'] = info
			result['name'] = name
			result['id'] = c_id
		except:
			result['message'] = 'Fail to delete the subtype'
	else: #删除的顶级分类，此时需要将其下的所有子分类都删除
		try:
			Category.objects.filter(reid=c_id).delete() #先删除该顶级分类的所有子分类
			Category.objects.get(id=c_id).delete()	#删除该顶级分类
		except:
			result['message'] = 'Fail to delete the type'

	return HttpResponse(json.dumps(result))