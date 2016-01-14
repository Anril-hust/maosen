#!/usr/bin/env python
# coding=utf-8

from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'display_top_category/$', views.display_top_category, name='display_top_category'),
    url(r'display_sub_category/$', views.display_sub_category, name='display_sub_category'),
    url(r'add_category/$', views.add_category, name='add_category'),
    url(r'update_category/$', views.update_category, name='update_category'),
    url(r'delete_category/$', views.delete_category, name='delete_category')
]
