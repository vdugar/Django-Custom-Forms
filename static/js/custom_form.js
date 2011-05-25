//Defining the master 'list' for form elements
var formElements={
	'Generic':{
		textField:{'disp_name':'Single Line Text - Short','ques':''},
		longTextField:{'disp_name':'Single Line Text - Long','ques':''},
		longAns:{'disp_name':'Long Answer','ques':''},
		reallyLongAns:{'disp_name':'Really Long Answer','ques':''},
		radio:{'disp_name':'Radio Button Group','ques':'Pick an option'},
		dropdown:{'disp_name':'Dropdown List','ques':'Pick an option'},
		numeric:{'disp_name':'Numeric Field','ques':''},
		date:{'disp_name':'Date','ques':''},
		time:{'disp_name':'Time','ques':''},
		file:{'disp_name':'File Upload','ques':''}
	},
	'Personal':{
		name:{'disp_name':'Name','ques':'Your name'},
		gender:{'disp_name':'Gender','ques':'Gender'},
		phone:{'disp_name':'Phone no.','ques':'Phone no.'},
		email:{'disp_name':'Email','ques':'Email'},
		address:{'disp_name':'Address','ques':'Address'},
		state:{'disp_name':'State','ques':'State'},
		city:{'disp_name':'City','ques':'City'}
	},
	'Program':{}
};

var elemTypes = {
	// Stores the available types of form objects, and their number in the form
	'textField':0,
	'longTextField':0,
	'longAns':0,
	'reallyLongAns':0,
	'radio':0,
	'dropdown':0,
	'numeric':0,
	'date':0,
	'time':0,
	'file':0,
	'name':0,
	'gender':0,
	'phone':0,
	'email':0,
	'address':0,
	'state':0,
	'city':0
};

var covenience = {
	//A list of convenience methods
	
};

var currElemType, currElemIndex, optionCount=1, formTitle="Form",currCategory='',$prevField, $currField;

$(document).ready(function() {
    $('#button_add').click(function(){addElement($('#elem_selector').attr('value'),$prevField)});
	$('#sbmt').click(submit);
	$('#button_title').click(updateTitle);
	
	//'Initializing' the UI
	onSelectCategory('Generic');
	onSelectElem('textField');
	
	$('html').ajaxSend(function(event, xhr, settings) {
	    function getCookie(name) {
	        var cookieValue = null;
	        if (document.cookie && document.cookie != '') {
	            var cookies = document.cookie.split(';');
	            for (var i = 0; i < cookies.length; i++) {
	                var cookie = jQuery.trim(cookies[i]);
	                // Does this cookie string begin with the name we want?
	                if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
	                    break;
	                }
	            }
	        }
	        return cookieValue;
	    }
	    if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
	        // Only send the token to relative URLs i.e. locally.
	        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
	    }
	});
});



var cleanLabel=function(labeltext) {
	// Strips the * sign from the label text, if present
	
	var return_val;
	if(labeltext.indexOf('*')== -1)
		return_val = labeltext;
	else return_val= labeltext.substr(0,labeltext.length-1);	
	return return_val;
};

var createLabel=function(labeltext, required) {
	//Returns an HTML-formatted label, with a red * if the question is required
	
	labeltext=$.trim(labeltext);
	if(!required)
		return '<p>'+labeltext+'</p>';
	else return '<p>'+labeltext+'<span class="asterisk">'+'*'+'</span></p>';	
};

var removeField = function() {
	//removes the selected element from the form by performing .remove() on the wrapper div
	
	$(this).parent().remove();
};

var updateElement=function() {
	// updates the selected form element
	var $lab_text=$('#id_question').attr('value');
	if($('#id_required').attr('checked'))
		$lab_text+="*";
	$('#label_'+currElemType+'_'+currElemIndex).html($lab_text);
};

var onClickLabel=function(event) {
	// Allows realtime updating of form
	
	var $radio_options;
	var $curr_label=$(event.target);
	currElemType=$curr_label.attr('id').split('_')['1'];
	if(currElemType!='radio')
		$('#multi_options').children().each(function(idx,el) {$(el).remove()});
	currElemIndex=$curr_label.attr('id').split('_')['2'];
	$('#id_question').attr('value',cleanLabel($curr_label.html()));
	if($curr_label.html().indexOf('*')== -1)
		$('#id_required').attr('checked','');
	else $('#id_required').attr('checked','on')	;
};

var addOption=function(option_text) {
	//adds an option in the form toolbox
	
	var $option,$wrap_option;
	$wrap_option=$('<div></div>').addClass('option_element');
	$option=$('<input/>', {
		type:"text",
		value:option_text,
	});
	$option.appendTo($wrap_option);
	$('<input/>',{type:'button',value:'+'}).click(function(){addOption('')}).appendTo($wrap_option);
	$('<input/>',{type:'button',value:'-'}).click(removeOption).appendTo($wrap_option);
	$wrap_option.appendTo($('#multi_options'));
};

var removeOption=function() {
	//removes an option from the radio group
	
	$(this).parent().remove();
};

var generateOptions=function() {
	//Generates the options input fields for multi-select form fields
	
	for(i=1;i<=3;i++) {
		addOption('');
	}
};	

var getFirst=function(category){
	//returns the first item corresponding to category
	
	if(category=='Generic')
		return 'textField';
	else if(category=='Personal')
		return 'name';
	else return '';	
};

var onSelectCategory=function(category) {
	//Populates the Field selector with the appropriate form fields
	
	fields_list=formElements[category];
	currCategory=category;
	//Generating Options list
	options_html="";
	$.each(fields_list, function(index,elem){
		options_html+="<option value="+index+">"+elem['disp_name']+"</option>";
	});
	//Populating options for the Field Selector
	$("#elem_selector").html(options_html);
	
	//'Initializing' form builder with first field element
	onSelectElem(getFirst(category));
};

var clearSpecificOptions=function() {
	//Removes previous field-specific options, if any
	
	var $multi_options=$('#multi_options'),$other_options=$('#other_options');
	if($multi_options.children().length!=0)
		$multi_options.empty();
	if($other_options.children().length!=0)
		$other_options.empty();
}

var onSelectElem = function(item) {
	//Generates the properties fields when a form item is selected from the list
	
	//Remove previous field-specific options, if any
	clearSpecificOptions();
	$('#id_instructions').attr('value','');
	$('#id_required').attr('checked','');
	
	$('div.field_selected').removeClass('field_selected');
		
	var $option,$wrap_option,i, question_text=formElements[currCategory][item]['ques'], $button=$('#button_add');;
	
	//Defining actions for generic elements
	if(item=="radio") 
		generateOptions();
	else if(item=="dropdown")
		generateOptions();
	else if(item=="numeric") {
		var $range_div=$('<div></div>').addClass('toolboxText');
		$minInput=$('<input/>', {
			type:"text",
			value:"0",
			name:"minVal",
			id:"id_minVal"
		});
		$maxInput=$('<input/>', {
			type:"text",
			value:"0",
			name:"maxVal",
			id:"id_maxVal"
		});
		
		$range_div.append($('<span>Min</span>')).append($minInput).append('&nbsp;&nbsp;').append($('<span>Max</span>')).append($maxInput);
		$range_div.appendTo($('#other_options'));
	}
	
	//Defining actions for 'personal' fields
	
	//Defining actions for custom fields	
	
	$('#id_question').attr('value',question_text);
	$prevField=$('div.form_preview :last-child').filter('div.field_wrapper');
	if($button.attr('value')!='Add to Form')
		$button.attr('value','Add to Form').unbind('click').click(function(){addElement($('#elem_selector').attr('value'),$prevField)});
};

var updateField=function() {
	var curr_field_type=$.data($currField[0],'data').field_type;
	$prevField=$currField.prev();
	$currField.remove();
	$currField=addElement(curr_field_type,$prevField);
	$currField.addClass('field_selected');
};

var onSelectField=function() {
	//Handles clicks on field wrappers
	
	clearSpecificOptions();
	//De-selecting any previously selected field
	$('div.field_selected').removeClass('field_selected');
	
	var $wrap=$(this), $button=$('#button_add');;
	$wrap.removeClass('field_hover').addClass('field_selected');
	$wrap.find('.wrapper_button').removeClass('wrapper_button_hover');
	var field_data=$.data($wrap[0],'data'), question_text=$wrap.find("p").eq(0).text(), $options;
	$currField=$wrap;
	
	if(question_text.indexOf("*")!=-1)
		$("#id_required").attr('checked','checked');
	$("#id_question").attr('value',cleanLabel(question_text));
	$("#id_instructions").attr('value',field_data.help_text);
	
	//Adding in field-specific options
	if(field_data.field_type=='radio'){
		$options=$wrap.find('div').children().filter('p');
		$options.each(function(idx,el) {
			addOption($(el).text());
		})
	}
	else if(field_data.field_type=='dropdown'){
		$options=$wrap.find('select').children();
		$options.each(function(idx,el){
			addOption($(el).html());
		})
	}
	else if(field_data.field_type=='numeric'){
		var $range_div=$('<div></div>').addClass('toolboxText');
		$minInput=$('<input/>', {
			type:"text",
			value:field_data.min,
			name:"minVal",
			id:"id_minVal"
		});
		$maxInput=$('<input/>', {
			type:"text",
			value:field_data.max,
			name:"maxVal",
			id:"id_maxVal"
		});
		
		$range_div.append($('<span>Min</span>')).append($minInput).append('&nbsp;&nbsp;').append($('<span>Max</span>')).append($maxInput);
		$range_div.appendTo($('#other_options'));
	}
	if($button.attr('value')=='Add to Form')
		$button.attr('value','Update').unbind('click').click(updateField);
		
};

var addElement = function(item,$prevField) {
	
	// This function adds the selected field to the form. Data like help-text is stored in the wrapper div using jQuery's $.data
	
	var i,$new_elem,$new_elem_label, 
		$wrap=$('<div></div>').addClass('field_wrapper').hover(function() {
			if($(this).hasClass('field_selected'))
				return;
			$(this).toggleClass('field_hover');
			$(this).find(".wrapper_button").toggleClass("wrapper_button_hover");
		}).click(onSelectField),
		label_text=$('#id_question').attr('value'),
		help_text=$.trim($('#id_instructions').attr('value')),
		html_name=item+"_"+elemTypes[item], html_id="id_"+item+"_"+elemTypes[item],
		data={};
	
	$new_elem_label=$(createLabel(label_text,$('#id_required').attr('checked'))).appendTo($wrap);
	$('<input/>',{type:'button',value:'X'}).click(removeField).addClass("wrapper_button").appendTo($wrap);
	data.help_text=help_text;
	data.field_type=item;
	
	//Generic fields first
	if(item=="textField"){
		$new_elem=$('<input/>', {
			type:"text",
			name:html_name,
			id:html_id,
			size:"30"
		});
	}
	else if(item=="longTextField"){
		$new_elem=$('<input/>', {
			type:"text",
			name:html_name,
			id:html_id,
			size:"60"
		});
	}
	else if(item=="longAns") {
		$new_elem=$('<textarea>', {
			name:html_name,
			id:html_id,
			rows:"8",
			cols:"50"
		});
	}
	else if(item=="reallyLongAns") {
		$new_elem=$('<textarea>', {
			name:html_name,
			id:html_id,
			rows:"14",
			cols:"70"
		});
	}
	else if(item=="radio") {
		var $text_inputs=$('#multi_options input:text'), $one_option;
		$new_elem=$("<div>", {
			id:html_id
		});
		$text_inputs.each(function(idx,el) {
				$one_option=$('<input>', {
						type:"radio",
						name:html_name,
						value:$(el).attr('value')
				});	
				$new_elem.append($("<p>").append($one_option).append($("<span>"+$(el).attr('value')+"</span>")));
		});
	}
	else if(item=="dropdown") {
		$new_elem=$('<select>',{
			name:html_name,
			id:html_id
		});
		var $text_inputs=$('#multi_options input:text'), $one_option;
		$text_inputs.each(function(idx,el) {
				$one_option=$('<option>', {
						value:$(el).attr('value')
				});	
				$one_option.html($(el).attr('value'));
				$new_elem.append($one_option);
		});
	}
	else if(item=="numeric"){
		$new_elem=$('<input/>', {
			type:"text",
			name:html_name,
			id:html_id,
			size:"20"
		});
		data.min=$('#id_minVal').attr('value');
		data.max=$('#id_maxVal').attr('value');
	}
	else if(item=="file"){
		$new_elem=$('<input/>', {
			type:"file",
			name:html_name,
			id:html_id,
			size:"40"
		});
	}
	else if(item=="name"){
		$new_elem=$('<input/>', {
			type:"text",
			name:html_name,
			id:html_id
		});
		
		$new_elem.appendTo($wrap);
		$('<br />').appendTo($wrap);
	}
	
	else if(item=="phone"){
		$new_elem=$('<input/>', {
			type:"text",
			name:"phone_"+elemTypes['phone']
		});
		$new_elem.attr('id',"id_phone_"+elemTypes['phone']);
		$new_elem_label=$('<label>'+label_text+'</label>');
		$new_elem_label.attr({
			'for':$new_elem.attr('id'),
			id:'label_phone_'+elemTypes['phone']++
		});
		$new_elem_label.click(onClickLabel);
		$new_elem_label.appendTo($wrap);
		$('<br />').appendTo($wrap);
		$new_elem.appendTo($wrap);
		$('<br />').appendTo($wrap);
	}
	
	else if(item=="gender"){
		$('<label>'+label_text+'</label>').click(onClickLabel).appendTo($wrap).attr('id','label_gender_'+elemTypes['gender']);
		$('<br />').appendTo($wrap);
		$new_elem=$('<input/>', {
			type:"radio",
			name:"gender_"+elemTypes['gender'],
			value:"Male"
		});
		$new_elem_label=$('<label>Male<label>');
		$new_elem_label.appendTo($wrap);
		$new_elem.appendTo($wrap);
		
		$new_elem=$('<input/>', {
		type:"radio",
		name:"gender_"+elemTypes['gender']++,
		value:"Female"
		});
		$new_elem_label=$('<label>Female<label>');
		$new_elem_label.appendTo($wrap);
		$new_elem.appendTo($wrap);
		$('<br />').appendTo($wrap);
	}
	
	elemTypes[item]++;
	$new_elem.appendTo($wrap);
	$.data($wrap[0],'data',data);
	if($prevField.length==0)
		$wrap.prependTo($('div.form_preview'));
	else
		$wrap.insertAfter($prevField);
	return $wrap;
};

var submit=function() {
	//submits the created form to the server
	
	
	var ellem,i,options,j,options_string="";
	var form={"title":formTitle,"types":[]};
	for (ellem in elemTypes) {
		
	    if (!elemTypes.hasOwnProperty(ellem)) {
	        //The current property is not a direct property of elemTypes
	        
			continue;
	    }
		
	    for(i=0;i<elemTypes[ellem];i++) {
			if(ellem=='radio') {
				$('input[name=radio_'+i+']').each(function(idx,el) {
					
					options_string+=$(el).attr('value')+',';
				});
				
				form['types'].push({typ:ellem, question:$('#label_'+ellem+'_'+i).html(),opts:options_string});
				
			}
			else
				form['types'].push({typ:ellem, question:$('#label_'+ellem+'_'+i).html()});
		}
	}
	
	
	/*$.post("/submit/", form,
		   function(data) {
		        alert(data);
		   } 
	);*/
	query=JSON.stringify(form);
	$.ajax({
		url:'submit/',
		data:query,
		type:'POST',
		success: function(value) {
			if(value=='OK') {
				alert("Created!");
				window.location='/list/';
			}
		}
	});
	$('#sbmt').attr("disabled","true")
	
};

var updateTitle = function(){
	//Updates the title for the form
	
	formTitle=$("#input_title").attr('value');
	$("#form_title").html(formTitle);
};

