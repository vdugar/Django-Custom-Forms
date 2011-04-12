from django.conf.urls.defaults import patterns, include, url
from customforms.views import *
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'LU_customforms.views.home', name='home'),
    # url(r'^LU_customforms/', include('LU_customforms.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
	(r'^$',landing),
	(r'^submit/$',onSubmit),
	(r'^list/$',formList),
	(r'^clear/$',clearTables),
	(r'^success/(\d{1,10})/$',onSuccess),
	(r'^display/(\d{1,10})/$', displayForm),
	(r'^results/(\d{1,10})/$', showResults),
)
