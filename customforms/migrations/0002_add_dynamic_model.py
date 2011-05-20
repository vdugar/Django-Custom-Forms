# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'Response_form_1'
        db.create_table('customforms_response_form_1', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('ques_1', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('ques_2', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('ques_3', self.gf('django.db.models.fields.CharField')(max_length=255)),
        ))
        db.send_create_signal('customforms', ['Response_form_1'])


    def backwards(self, orm):
        
        # Deleting model 'Response_form_1'
        db.delete_table('customforms_response_form_1')


    models = {
        'customforms.form': {
            'Meta': {'object_name': 'Form'},
            'active': ('django.db.models.fields.IntegerField', [], {'default': '1', 'max_length': '2'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'default': "'Form'", 'max_length': '30'})
        },
        'customforms.myuser': {
            'Meta': {'object_name': 'MyUser'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'default': "'User'", 'max_length': '15'})
        },
        'customforms.option': {
            'Meta': {'object_name': 'Option'},
            'form': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['customforms.Form']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'opt': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'question': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['customforms.Question']"})
        },
        'customforms.question': {
            'Meta': {'object_name': 'Question'},
            'form': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['customforms.Form']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ques_type': ('django.db.models.fields.CharField', [], {'max_length': '15'}),
            'question': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'required': ('django.db.models.fields.CharField', [], {'max_length': '2'})
        },
        'customforms.response_form_1': {
            'Meta': {'object_name': 'Response_form_1'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ques_1': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'ques_2': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'ques_3': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        'customforms.responses': {
            'Meta': {'object_name': 'Responses'},
            'form': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['customforms.Form']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'myuser': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['customforms.MyUser']"}),
            'question': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['customforms.Question']"}),
            'resp': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['customforms']
