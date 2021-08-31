from django.db import models
from taggit.managers import TaggableManager
from taggit.models import GenericUUIDTaggedItemBase, TaggedItemBase
from django.utils.translation import ugettext_lazy as _
from django.utils.text import slugify
import json
import uuid
# Create your models here.

class ThroughDonateTag(GenericUUIDTaggedItemBase, TaggedItemBase):
    # If you only inherit GenericUUIDTaggedItemBase, you need to define
    # a tag field. e.g.
    # tag = models.ForeignKey(Tag, related_name="uuid_tagged_items", on_delete=models.CASCADE)

    class Meta:
        verbose_name = _("Tag")
        verbose_name_plural = _("Tags")


class ThroughFindTag(GenericUUIDTaggedItemBase, TaggedItemBase):
    # If you only inherit GenericUUIDTaggedItemBase, you need to define
    # a tag field. e.g.
    # tag = models.ForeignKey(Tag, related_name="uuid_tagged_items", on_delete=models.CASCADE)

    class Meta:
        verbose_name = _("Tag")
        verbose_name_plural = _("Tags")


BUSINESS_HOURS = {
    "monday":{
        'available': True,
        "opening" : "10:00",
        "closing": "17:00"
    },
    "tuesday":{
        'available': True,
        "opening" : "10:00",
        "closing": "17:00"
    },
    "wednesday":{
        'available': True,
        "opening" : "10:00",
        "closing": "17:00"
    },
    "thursday":{
        'available': True,
        "opening" : "10:00",
        "closing": "17:00"
    },
    "friday":{
        'available': True,
        "opening" : "10:00",
        "closing": "17:00"
    },
    "saturday":{
        'available': True,
        "opening" : "10:00",
        "closing": "17:00"
    },
    "sunday":{
        'available': True,
        "opening" : "10:00",
        "closing": "17:00"
    }
}

def json_hours():
    return BUSINESS_HOURS



class Center(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)
    name = models.CharField(max_length=250, unique=True)
    slug = models.SlugField(max_length=250, null=True, blank=True, editable=False)
    about = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    phone = models.CharField(max_length=13, null=True, blank=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    joined_date = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    partner = models.BooleanField(blank=True, null=True, default=False)
    pickup = models.BooleanField(blank=True, null=True, default=False)

    # Donate and Find
    can_donate = TaggableManager(blank=True, through=ThroughDonateTag, related_name='donate_centers', verbose_name='Can Donate')
    can_find = TaggableManager(blank=True, through=ThroughFindTag, related_name='find_centers', verbose_name='Can Find')

    additional_material_information = models.TextField(blank=True, null=True)
    hours = models.JSONField(default=json_hours, null=True,blank=True)


    # Coordinate
    lon = models.FloatField(blank=True, null=True, verbose_name='Longitude')
    lat = models.FloatField(blank=True, null=True, verbose_name='Latitude')

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Center, self).save(*args, **kwargs)

