from django.shortcuts import redirect, render_to_response, HttpResponse
from django.http import Http404,HttpResponseRedirect
from forms import CustomForm
from django.utils import simplejson as json
from customforms.models import *

def isRequired(text):
	#Checks whether a question is required or not
	
	if(text[len(text)-1])=='*':
		return'Y'
	else: 
		return 'N'

def onSubmit(request):
	#Stores the form structure in the database
	
	if request.is_ajax():
		if request.method == 'POST':
			elems=json.loads(request.raw_post_data)	
	
		form=Form.objects.create(title=elems['title'])

	for elem in elems['types']:
		question=Question.objects.create(form=form,question=elem['question'],ques_type=elem['typ'],required=isRequired(elem['question']))
		if elem['typ']=='radio':
			options=elem['opts'].split(',')
			for i in options:
				if i!='':
					Option.objects.create(question=question,opt=i)
	
	return HttpResponse('OK')
	
def formList(request):
	#Lists all created forms
	
	return render_to_response('list.html',{'forms':Form.objects.order_by('-id')})	
	
def clearTables(request):
	#Clears all database tables
	
	Responses.objects.all().delete()
	Option.objects.all().delete()
	Question.objects.all().delete()
	Form.objects.all().delete()		
	
def displayForm(request,form_id):
	#Displays the required form and handles submission
	
	try:
		form_id=int(form_id)
	except ValueError:
		raise Http404	
	
	frm=Form.objects.get(id=form_id)
	questions=Question.objects.filter(form=frm).order_by('id').values()
	options=[]
	properties=[]	
	for question in questions:
		if question['ques_type']=='radio':
			ques=Question.objects.get(id=question['id'])
			for option in Option.objects.filter(question=ques).order_by('id').values():
				options.append([option['opt'],option['opt']])
		properties.append({'ques':question['question'],'ques_type':question['ques_type'],'required':question['required'],'opts':options,'id':question['id']})	
	
	form=CustomForm(request.POST or None, properties=properties)
	if form.is_valid():
		response=form.cleaned_data
		usr=MyUser.objects.create()
		for key in response:
			ques=Question.objects.get(id=int(key))
			Responses.objects.create(form=frm, question=ques, resp=response[key],myuser=usr)
		return HttpResponseRedirect('/success/'+str(form_id))
	return render_to_response('form.html',{'form':form})
	
def onSuccess(request, form_id):
	#Successful form submission
	try:
		form_id=int(form_id)
	except ValueError:
		raise Http404
	
	return render_to_response('success.html',{'form_id':form_id})
	
def showResults(request,form_id):
	#Shows the results for a particular form
	try:
		form_id=int(form_id)
	except ValueError:
		raise Http404
	
	form=Form.objects.get(id=form_id)
	questions=Question.objects.filter(form=form).order_by('id').values_list('question',flat=True)
	all_responses=Responses.objects.filter(form=form).order_by('myuser_id','question_id').values_list('resp',flat=True)
	title=form.title
	#Grouping complete responses together (not the best way, though)
	responses=[]
	splitsize=len(all_responses) / len(questions)
	for i in range(splitsize):
		responses.append(all_responses[(i*len(questions)):(i*len(questions)+len(questions))])
	return render_to_response('results.html',{'questions':questions,'responses':responses,'title':title})
	
	
	
	


	
	
		
	