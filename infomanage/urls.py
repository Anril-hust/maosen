#!/usr/bin/env python
# coding=utf-8

from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'display_provider/$', views.display_provider),
    url(r'add_provider/$', views.add_provider),
    url(r'update_provider/$', views.update_provider),
    url(r'delete_provider/$', views.delete_provider),

	url(r'display_storage/$', views.display_storage),
	url(r'add_storage/$', views.add_storage),
	url(r'update_storage/$', views.update_storage),                                                                       
	url(r'delete_storage/$', views.delete_storage),

	
    url(r'display_department/$', views.display_department),
    url(r'add_department/$', views.add_department),
    url(r'update_department/$', views.update_department),
    url(r'delete_department/$', views.delete_department),
    
    url(r'display_duty/$', views.display_duty),
    url(r'add_duty/$', views.add_duty),
    url(r'update_duty/$', views.update_duty),
    url(r'delete_duty/$', views.delete_duty),

    url(r'display_staff/$', views.display_staff),
    url(r'add_staff/$', views.add_staff),
    url(r'update_staff/$', views.update_staff),
    url(r'delete_staff/$', views.delete_staff),
]
