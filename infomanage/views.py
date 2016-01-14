#!/usr/bin/env python
# coding=utf-8

# from django.shortcuts import render
from django.http import HttpResponse

import json

from .models import *

def display_provider(request):
	'''显示供应商列表'''
	provider_list = dict()

	for p in Provider.objects.all():
		provider_list[p.id] = dict()
		provider_list[p.id]['name'] = p.name
		provider_list[p.id]['people'] = p.people
		provider_list[p.id]['addr'] = p.addr
		provider_list[p.id]['phone'] = p.phone
		provider_list[p.id]['qq'] = p.qq
		provider_list[p.id]['weixin'] = p.weixin
		
	return HttpResponse(json.dumps(provider_list))

def add_provider(request):
	'''添加供应商'''
	p_name = request.POST.get('name')
	p_people = request.POST.get('people')
	p_addr = request.POST.get('addr')
	p_phone = request.POST.get('phone')
	p_qq = request.POST.get('qq')
	p_weixin = request.POST.get('weixin')
	
	result = dict()
	#print p_name, ' ', p_phone
	try:
		providers = Provider(
			name = p_name,
			people = p_people,
			addr = p_addr,
			phone = p_phone,
			qq = p_qq,
			weixin = p_weixin
		)
		providers.save()
		result['status'] = 1
		result['info'] = 'Error'
	except BaseException, e: 
		print 'Appear error when add provider: ', e
		result['status'] = 0
		result['info'] = 'Failto add provider'
	
	return HttpResponse(json.dumps(result))

def update_provider(request):
	'''修改供应商'''
	p_id = request.POST.get('id')
	p_name = request.POST.get('name')
	p_people = request.POST.get('people')
	p_addr = request.POST.get('addr')
	p_phone = request.POST.get('phone')
	p_qq = request.POST.get('qq')
	p_weixin = request.POST.get('weixin')
	
	result = dict()
	print p_name
	try:
		providers = Provider.objects.get(id = p_id)
		providers.name = p_name
		providers.people = p_people
		providers.addr = p_addr
		providers.phone = p_phone
		providers.qq = p_qq
		providers.weixin = p_weixin
		providers.save()
		
		result['status'] = 1
		result['info'] = 'Successfully'
	except BaseException, e:
		print 'Appear error when update provider: ', e
		result['status'] = 0
		result['info'] = 'Failto update provider'
	
	return HttpResponse(json.dumps(result))
	
def delete_provider(request):
	'''删除供应商'''
	p_id = request.POST.get('id')
	result = dict()
	
	try:
		provider = Provider.objects.get(id = p_id)
		provider.delete()
		result['status'] = 1
		result['info'] = 'Successfully'
	except BaseException, e:
		print 'Appear error when delete provider: ', e
		result['status'] = 0
		result['info'] = 'Fail to delete the provider'
		
	return HttpResponse(json.dumps(result))
	

def display_department(request):
	'''显示部门列表'''
	d_list = dict()

	for d in Department.objects.all():
		d_list[d.id] = dict()
		d_list[d.id]['name'] = d.name
		d_list[d.id]['leader'] = d.leader
		d_list[d.id]['remark'] = d.remark		
		
	return HttpResponse(json.dumps(d_list))

def add_department(request):
	'''添加部门'''
	d_name = request.POST.get('name')
	d_leader = request.POST.get('leader')
	d_remark = request.POST.get('remark')
	
	result = dict()
	
	try:
		d_obj = Department(
			name = d_name,
			leader = d_leader,
			remark = d_remark,			
		)
		d_obj.save()
		result['status'] = 1
		result['info'] = 'Successfully'
	except BaseException, e: 
		print 'Appear error when add department: ', e
		result['status'] = 0
		result['info'] = 'Failto add department'
	
	return HttpResponse(json.dumps(result))

def update_department(request):
	'''修改部门'''
	d_id = request.POST.get('id')
	d_name = request.POST.get('name')
	d_leader = request.POST.get('leader')
	d_remark = request.POST.get('remark')	
	
	result = dict()
	#print d_id
	try:
		d_obj = Department.objects.get(id = d_id)
		d_obj.name = d_name
		d_obj.leader = d_leader
		d_obj.remark = d_remark
		d_obj.save()
		
		result['status'] = 1
		result['info'] = 'Successfully'
	except BaseException, e:
		print 'Appear error when update department: ', e
		result['status'] = 0
		result['info'] = 'Failto update department'
	
	return HttpResponse(json.dumps(result))
	
def delete_department(request):
	'''删除部门'''
	d_id = request.POST.get('id')
	result = dict()
	
	try:
		d_obj = Department.objects.get(id = d_id)
		d_obj.delete()
		result['status'] = 1
		result['info'] = 'Successfully'
	except BaseException, e:
		print 'Appear error when delete department: ', e
		result['status'] = 0
		result['info'] = 'Fail to delete the department'
		
	return HttpResponse(json.dumps(result))
	

def display_duty(request):
	'''显示职务列表'''
	d_list = dict()

	for d in Userduty.objects.all():
		d_list[d.id] = dict()
		d_list[d.id]['duty'] = d.duty
		d_list[d.id]['authority'] = d.authority
		d_list[d.id]['content'] = d.content		
		
	return HttpResponse(json.dumps(d_list))

def add_duty(request):
	'''添加职务'''
	d_duty = request.POST.get('duty')
	d_authority = request.POST.get('authority')
	d_content = request.POST.get('content')
	
	result = dict()
	
	try:
		d_obj = Userduty(
			duty = d_duty,
			authority = d_authority,
			content = d_content,			
		)
		d_obj.save()
		result['status'] = 1
		result['info'] = 'Successfully'
	except BaseException, e: 
		print 'Appear error when add duty: ', e
		result['status'] = 0
		result['info'] = 'Failto add duty'
	
	return HttpResponse(json.dumps(result))

def update_duty(request):
	'''修改职务'''
	d_id = request.POST.get('id')
	d_duty = request.POST.get('duty')
	d_authority = request.POST.get('authority')
	d_content = request.POST.get('content')	
	
	result = dict()
	#print d_id
	try:
		d_obj = Userduty.objects.get(id = d_id)
		d_obj.duty = d_duty
		d_obj.authority = d_authority
		d_obj.content = d_content
		d_obj.save()
		
		result['status'] = 1
		result['info'] = 'Successfully'
	except BaseException, e:
		print 'Appear error when update duty: ', e
		result['status'] = 0
		result['info'] = 'Failto update duty'
	
	return HttpResponse(json.dumps(result))
	
def delete_duty(request):
	'''删除职务'''
	d_id = request.POST.get('id')
	result = dict()
	
	try:
		d_obj = Userduty.objects.get(id = d_id)
		d_obj.delete()
		result['status'] = 1
		result['info'] = 'Successfully'
	except BaseException, e:
		print 'Appear error when delete duty: ', e
		result['status'] = 0
		result['info'] = 'Fail to delete the duty'
		
	return HttpResponse(json.dumps(result))
	

def display_staff(request):
	'''显示员工列表'''
	d_list = dict()

	for d in Staff.objects.all():
		d_list[d.id] = dict()
		d_list[d.id]['name'] = d.name
		d_list[d.id]['addr'] = d.addr
		d_list[d.id]['phone'] = d.phone
		d_list[d.id]['method'] = d.bonusmethod
		d_list[d.id]['rate'] = d.bonusrate
		d_list[d.id]['department_id'] = d.department_id
		d_list[d.id]['duty_id'] = d.duty_id
		
	return HttpResponse(json.dumps(d_list))

def add_staff(request):
	'''添加员工'''
	s_name = request.POST.get('name')
	s_addr = request.POST.get('addr')
	s_phone = request.POST.get('phone')
	s_method = request.POST.get('method')
	s_rate = request.POST.get('rate')
	s_department_id = request.POST.get('department_id')
	s_duty_id = request.POST.get('duty_id')
	
	result = dict()
	
	try:
		s_obj = Staff(
			name = s_name,
			addr = s_addr,
			phone = s_phone,
			bonusmethod = s_method,
			bonusrate = s_rate,
			department_id = s_department_id,
			duty_id = s_duty_id,
		)
		s_obj.save()
		result['status'] = 1
		result['info'] = 'Successfully'
	except BaseException, e: 
		print 'Appear error when add staff: ', e
		result['status'] = 0
		result['info'] = 'Failto add staff'
	
	return HttpResponse(json.dumps(result))

def update_staff(request):
	'''修改员工'''
	s_id = request.POST.get('staff_id')
	s_name = request.POST.get('name')
	s_addr = request.POST.get('addr')
	s_phone = request.POST.get('phone')
	s_method = request.POST.get('method')
	s_rate = request.POST.get('rate')
	s_department_id = request.POST.get('department_id')
	s_duty_id = request.POST.get('duty_id')	
	
	result = dict()
	
	try:
		s_obj = Staff.objects.get(id = s_id)
		s_obj.name = s_name
		s_obj.addr = s_addr
		s_obj.phone = s_phone
		s_obj.bonusmethod = s_method
		s_obj.bonusrate = s_rate
		s_obj.department_id = s_department_id
		s_obj.duty_id = s_duty_id
		s_obj.save()
		
		result['status'] = 1
		result['info'] = 'Successfully'
	except BaseException, e:
		print 'Appear error when update staff: ', e
		result['status'] = 0
		result['info'] = 'Failto update staff'
	
	return HttpResponse(json.dumps(result))
	
def delete_staff(request):
	'''删除员工'''
	s_id = request.POST.get('id')
	result = dict()
	
	try:
		s_obj = Staff.objects.get(id = s_id)
		s_obj.delete()
		result['status'] = 1
		result['info'] = 'Successfully'
	except BaseException, e:
		print 'Appear error when delete staff: ', e
		result['status'] = 0
		result['info'] = 'Fail to delete the staff'
		
	return HttpResponse(json.dumps(result))