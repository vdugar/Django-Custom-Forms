# Summary

This is the partial implementation of a Django-based custom form builder. The full implementation was done as part of a 
[**Google Summer of Code**](http://code.google.com/soc/) project for [Learning Unlimited](learningu.org), under the mentorship of Michael Price. 

LU's complete source code is available [here](https://github.com/learning-unlimited/ESP-Website/).

Most of the Python code for the complete implementation of customforms is [here](https://github.com/learning-unlimited/ESP-Website/tree/main/esp/esp/customforms).

Most of the front-end Javascript code is at-

* https://github.com/learning-unlimited/ESP-Website/blob/main/esp/public/media/scripts/custom_form.js

* https://github.com/learning-unlimited/ESP-Website/blob/main/esp/public/media/scripts/customforms_response.js

[Here](http://minus.com/mbaSZQYcBx#1o) is a screenshot of a basic rendered form.

## Features

* Intuitive drag-n-drop GUI to build forms, add/remove form fields, add instructions for questions,
move things around etc.
* New forms can be based on older forms that a user may have created. You can also modify existing forms.
* Ability to define custom validation for fields (word/character limits, 'correct' answers for multiple choice 
questions etc.)
* Along with generic field such as TextFields and Radio Groups, the form builder provides customized fields such as
Name, Phone No., Address etc., and automatically takes care of the validation
* Supports multi-section and multi-page forms
* Forms are rendered with an attractive default style which can be modified
* Forms are validated both client-side and server-side
* In addition to creating anonymous forms (doesn't require the person filling it to be logged in), you can specify
finer viewing permissions (eg. 'Is a Student of Program XYZ')
* Responses from forms are stored in dynamically generated Django models (so every form has its own response 
table in the DB)
* Responses to non-anonymous forms are linked to the user filling them out
* Form creators can view responses to their form via a Dojo DataGrid, and can perform certain basic 
client-side queries on them (such as applying comples filters). They can also download their data as an excel file.

## Experimental

(For those not familiar with Django, it implements an ORM which abstracts over your database. So, tables in your database
are represented as Python classes, and these classes provide a number of useful methods for querying your data. Essentially,
every table has its own Python class, called a Model, which is used to perform operations on it.)

This project implements the concept of "linked fields". Say you have an existing table in your database, called 'Student',
which stores information such as Name, Phone No., Address etc. You want to build a form with lots of fields, and you
also want to include  'Name' and 'Phone No.' fields. Ideally, you'd want these fields to be pre-populated with the name
and phone no. of the person who's logged in and filling out the form. The code allows you to do exactly that.

* You can mark your Django models for use with the customforms app, and specify which fields are to be exposed to it.
* At server startup, a script introspects all your Django models, picks out the ones that you've marked and sets up a 
global cache.
* It automatically figures out how to render your database field. For instance, an IntegerField in your model is rendered
as a TextField with the appropriate validation.
* All such fields are exposed in the form builder GUI for the benefit of the person creating the form, and he can happily
add the Name and Phone No. fields. When the form is rendered and someone fills it out, these fields are prepopulated
with appropriate values from the database. If the respondent changes, say, his Phone No., it is saved to the appropriate
table.
* To avoid duplication of data and maintain integrity, the system uses foreign keys to link to existing tables. 
So, the 'Name' and 'Phone No.' fields in your form don't have corresponding columns in the response table in the database.
Instead, the response table only contains a Foreign Key to the Student table, and the system pulls/updates values 
in that table.

## Future Plans

Currently, the customforms app is integrated quite closely with LU's main project. I plan to decouple it, so that it can
be used as a generic form builder in any Django project. I also plan to decouple the front-end from the back-end,
so that the form builder GUI can be used with any backend.
