# -*- coding: UTF-8 -*-

from django.db import models

class Information(models.Model):
    '''商品基本信息'''
    product_no = models.IntegerField()
    product_barcode = models.CharField(max_length=20)
    product_name = models.CharField(max_length=15)
    product_norms = models.CharField(max_length=100)
    product_category = models.SmallIntegerField()
    product_unit = models.SmallIntegerField()
    product_purchaseprice = models.FloatField()
    product_saleprice = models.FloatField()
    product_wholesaleprice = models.FloatField()
    product_factorydate = models.DateField()
    product_keyword = models.CharField(max_length=20)
    product_remark = models.TextField()

class Category(models.Model):
    '''商品分类管理'''
    category_name = models.CharField(max_length=50)
    desc = models.CharField(max_length=100)
    reid = models.SmallIntegerField()


class Unit(models.Model):
    '''商品单位'''
    unit_name = models.CharField(max_length=20)
    reid = models.SmallIntegerField()
