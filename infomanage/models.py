#!/usr/bin/env python
# coding=utf-8

from django.db import models

class Provider(models.Model):
    '''供应商信息'''
    name = models.CharField(max_length=70)
    people = models.CharField(max_length=20)
    addr = models.CharField(max_length=150)
    phone = models.CharField(max_length=60)
    qq = models.CharField(max_length=20)
    weixin = models.CharField(max_length=25)

class Department(models.Model):
    '''部门管理'''
    name = models.CharField(max_length=30)
    leader = models.CharField(max_length=20)    # 部门领导或负责人
    remark = models.TextField()                 # 部门描述或备注

class Userduty(models.Model):
    '''用户职务管理'''
    duty = models.CharField(max_length=30)  # 职务名称
    authority = models.IntegerField()       # 职务的权限
    content = models.TextField()            # 职务的内容

class Staff(models.Model):
    '''员工管理'''
    name = models.CharField(max_length=20)
    addr = models.CharField(max_length=100)
    phone = models.CharField(max_length=30)
    department = models.ForeignKey(Department)  # 员工隶属于那个部门，作为外键引用部门的id
    duty = models.ForeignKey(Userduty)          # 员工职务，作为外键引用用户职务的id
    bonusmethod = models.CharField(max_length=6) # 员工提成方式
    bonusrate = models.FloatField()             # 员工提成比例

class Storage(models.Model):
    '''仓库管理'''
    name = models.CharField(max_length=50)
    city = models.CharField(max_length=30)
    adminer = models.CharField(max_length=30)        # 仓库负责人
    default = models.SmallIntegerField()    # 标记是否为默认仓库

