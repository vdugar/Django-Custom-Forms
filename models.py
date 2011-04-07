from django.db import models

class Form(models.Model):
	title=models.CharField(max_length=30)
	
class Question(models.Model):
	form=models.ForeignKey(Form)
	question=models.CharField(max_length=60)
	ques_type=models.CharField(max_length=15)
	required=models.CharField(max_length=2)
	
class Option(models.Model):
	question=models.ForeignKey(Question)
	opt=models.CharField(max_length=30)
	
class Response(models.Model):
	form=models.ForeignKey(Form)
	question=models.ForeignKey(Question)
	resp=models.CharField(max_length=30)	
	user=models.CharField(max_length=15)
		
		
