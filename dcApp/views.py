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
    center = Center.objects.filter(slug = slug)
    return render(request, 'detailsPage.html')
    # center_json = serialize("json", center)
    # # print(projects)

    # return HttpResponse(center_json, content_type="application/json")


def inputCenterPage(request):
    return render(request, 'inputPage.html')