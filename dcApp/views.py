from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'map.html')
def detailsPage(request):
    return render(request, 'detailsPage.html')