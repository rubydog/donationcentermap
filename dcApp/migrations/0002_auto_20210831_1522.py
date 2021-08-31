# Generated by Django 3.2.6 on 2021-08-31 09:52

from django.db import migrations, models
import taggit.managers


class Migration(migrations.Migration):

    dependencies = [
        ('taggit', '0003_taggeditem_add_unique_index'),
        ('dcApp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='center',
            name='joined_date',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='center',
            name='can_donate',
            field=taggit.managers.TaggableManager(blank=True, help_text='A comma-separated list of tags.', related_name='donate_centers', through='dcApp.ThroughDonateTag', to='taggit.Tag', verbose_name='Can Donate'),
        ),
        migrations.AlterField(
            model_name='center',
            name='can_find',
            field=taggit.managers.TaggableManager(blank=True, help_text='A comma-separated list of tags.', related_name='find_centers', through='dcApp.ThroughFindTag', to='taggit.Tag', verbose_name='Can Find'),
        ),
        migrations.AlterField(
            model_name='center',
            name='lat',
            field=models.FloatField(blank=True, null=True, verbose_name='Latitude'),
        ),
        migrations.AlterField(
            model_name='center',
            name='lon',
            field=models.FloatField(blank=True, null=True, verbose_name='Longitude'),
        ),
    ]