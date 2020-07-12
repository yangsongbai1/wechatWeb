from django.shortcuts import render


def index(request):
    return render(request, 'GiveLike/base.html')


def get_task