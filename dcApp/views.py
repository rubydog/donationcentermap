from taggit.models import Tag
from dcApp.models import Center
from django.http.response import HttpResponse
from django.shortcuts import render
from django.core.serializers import serialize

# Create your views here.
BUSINESS_HOURS = {
    "from":'Monday',
    "to":'Friday',
    "opening" : "10:00",
    "closing": "17:00"
}


def index(request):
    centers = Center.objects.all()

    context = {
        "centers": centers, 
    }
    return render(request, 'map.html', context)
    
def detailsPage(request, slug):
    center = Center.objects.get(slug = slug)
    context = {
        "center": center, 
    }
    return render(request, 'detailsPage.html', context)
    
def inputCenterPage(request):
    tags = Tag.objects.all()
    if request.method == 'POST':
        center = Center()
        center.name = request.POST.get('name')
        center.about = request.POST.get('about')
        center.website = request.POST.get('website')
        center.phone = request.POST.get('phone')
        center.email = request.POST.get('email')
        center.address = request.POST.get('address')
        center.hours_from = request.POST.get('hours_from')
        center.hours_to = request.POST.get('hours_to')
        center.hours_opening = request.POST.get('hours_opening')
        center.hours_closing = request.POST.get('hours_closing')
        center.additional_material_information = request.POST.get('additional_material_information')
        
        center.partner = (request.POST.get('partner') == '1')
        center.pickup = (request.POST.get('pickup')=='1')
        center.lat = request.POST.get('lat')
        center.lon = request.POST.get('lon')
        center.save()

        can_donate_items = request.POST.getlist('can_donate')
        can_find_items = request.POST.getlist('can_find')
        
        donate_objects = Tag.objects.filter(pk__in=can_donate_items)
        find_objects = Tag.objects.filter(pk__in=can_find_items)
        
        center.can_donate.set(*donate_objects)
        center.can_find.add(*find_objects)

        # # BUSINESS_HOURS
        # hours = BUSINESS_HOURS

        # hours['from'] = request.POST.get('hours_from')
        # hours['to'] = request.POST.get('hours_to')
        # hours['opening'] = request.POST.get('hours_opening')
        # hours['closing'] = request.POST.get('hours_closing')

        print(donate_objects)
        print(can_donate_items)
        

    context = {
        'tags': tags,
    }
    return render(request, 'inputPage.html', context)

def api_centers(request):
    all_centers = Center.objects.all()
    centers = serialize("json", all_centers)
    # print(centers)

    return HttpResponse(centers, content_type="application/json")
