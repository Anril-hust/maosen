# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('category_name', models.CharField(max_length=50)),
                ('unit', models.CharField(max_length=10)),
                ('desc', models.CharField(max_length=100)),
                ('reid', models.SmallIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Information',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('product_no', models.IntegerField()),
                ('product_barcode', models.CharField(max_length=20)),
                ('product_name', models.CharField(max_length=15)),
                ('product_norms', models.CharField(max_length=100)),
                ('product_category', models.SmallIntegerField()),
                ('product_unit', models.SmallIntegerField()),
                ('product_purchaseprice', models.FloatField()),
                ('product_saleprice', models.FloatField()),
                ('product_wholesaleprice', models.FloatField()),
                ('product_factorydate', models.DateField()),
                ('product_keyword', models.CharField(max_length=20)),
                ('product_remark', models.TextField()),
            ],
        ),
    ]
