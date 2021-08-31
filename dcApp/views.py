from dcApp.models import Center
from django.http.response import HttpResponse
from django.shortcuts import render
from django.core.serializers import serialize
# Create your views here.
def index(request):
    centers = Center.objects.all()

    context = {
        "centers": centers, 
    }
    return render(request, 'map.html', context)
    
def detailsPage(request, slug):
    center = Center.objects.get(slug = slug)
    
    print(type(center.hours['monday']['available']))

    for x in center.hours:
        print(x,center.hours[x])

    context = {
        "center": center, 
    }
    return render(request, 'detailsPage.html', context)
    

def inputCenterPage(request):
    return render(request, 'inputPage.html')