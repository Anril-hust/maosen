# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=30)),
                ('leader', models.CharField(max_length=20)),
                ('remark', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Provider',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=70)),
                ('people', models.CharField(max_length=20)),
                ('addr', models.CharField(max_length=150)),
                ('phone', models.CharField(max_length=60)),
                ('qq', models.CharField(max_length=20)),
                ('weixin', models.CharField(max_length=25)),
            ],
        ),
        migrations.CreateModel(
            name='Staff',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=20)),
                ('addr', models.CharField(max_length=100)),
                ('phone', models.CharField(max_length=30)),
                ('bonusmethod', models.CharField(max_length=6)),
                ('bonusrate', models.FloatField()),
                ('department', models.ForeignKey(to='infomanage.Department')),
            ],
        ),
        migrations.CreateModel(
            name='Storage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50)),
                ('city', models.CharField(max_length=30)),
                ('default', models.SmallIntegerField()),
                ('admin', models.ForeignKey(to='infomanage.Staff')),
            ],
        ),
        migrations.CreateModel(
            name='Userduty',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('duty', models.CharField(max_length=30)),
                ('authority', models.IntegerField()),
                ('content', models.TextField()),
            ],
        ),
        migrations.AddField(
            model_name='staff',
            name='duty',
            field=models.ForeignKey(to='infomanage.Userduty'),
        ),
    ]
