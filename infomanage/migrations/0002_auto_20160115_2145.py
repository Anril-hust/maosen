# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('infomanage', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='storage',
            name='admin',
        ),
        migrations.AddField(
            model_name='storage',
            name='adminer',
            field=models.CharField(default='', max_length=30),
            preserve_default=False,
        ),
    ]
