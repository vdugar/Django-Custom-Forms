var elemTypes = {
	// Stores the available types of form objects, and their number in the form
	
	'name':0,
	'gender':0,
	'phone':0,
	'textField':0,
	'radio':0
};

var currElemType;
var currElemIndex;
var optionCount=1;
var formTitle="Form";

$(document).ready(function() {
    $('#button_remove').toggle();		//Hide remove button when page loads
	$('#button_add').click(function(){addElement($('#elem_selector').attr('value'))});
	$('#button_remove').click(removeElement);
	$('#sbmt').click(submit);
	$('#button_title').click(updateTitle);
	
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
	// Strips the * sign from the label text
	var return_val;
	if(labeltext.indexOf('*')== -1)
		return_val = labeltext;
	else return_val= labeltext.substr(0,labeltext.length-1);	
	return return_val;
}

var removeElement = function() {
	//removes the selected element from the form by performing .remove() on the wrapper div
	
	$currLabelId="label_"+currElemType+"_"+currElemIndex;
	$currLabel=$('#'+$currLabelId);
	$currLabel.parent().remove();
	$("#id_question").attr('value','');
	currElemType=currElemIndex=0;
}

var updateElement=function() {
	// updates the selected form element
	var $lab_text=$('#id_question').attr('value');
	if($('#id_required').attr('checked'))
		$lab_text+="*";
	$('#label_'+currElemType+'_'+currElemIndex).html($lab_text);
}

var toggleButtons=function() {
	// toggles the visibility of the remove button, and changes the behaviour of the add button to "update"
	
	$button_remove=$('#button_remove');
	$button_add=$('#button_add');
	$button_add.unbind('click');
	if ($button_remove.is(":visible")) {
		$button_add.attr('value','Add to Form');
		$button_add.click(function(){addElement($('#elem_selector').attr('value'))});
	}
	else {
		$button_add.attr('value','Update');
		$button_add.click(updateElement);
	}
	$button_remove.toggle();
}

var onClickLabel=function(event) {
	// Allows realtime updating of form
	
	var $radio_options;
	if (!($('#button_remove').is(":visible")))
		toggleButtons();
	
	var $curr_label=$(event.target);
	currElemType=$curr_label.attr('id').split('_')['1'];
	if(currElemType!='radio')
		$('#radio_options').children().each(function(idx,el) {$(el).remove()});
	currElemIndex=$curr_label.attr('id').split('_')['2'];
	$('#id_question').attr('value',cleanLabel($curr_label.html()));
	if($curr_label.html().indexOf('*')== -1)
		$('#id_required').attr('checked','');
	else $('#id_required').attr('checked','on')	;
}

var addOption=function(event) {
	//adds an option to the radio group 
	
	var $option,$wrap_option;
	var curr_add_id=$(event.target).attr('id');
	var curr_add_index=curr_add_id.split('_')[1];
	$wrap_option=$('<div></div>');
	$wrap_option.addClass('option_element');
	$wrap_option.insertAfter($('#id_option_'+curr_add_index).parent());
	$option=$('<input/>', {
		type:"text",
		value:"Option",
		name:"option_"+optionCount,
		id:"id_option_"+optionCount
	});
	$option.appendTo($wrap_option);
	$('<input/>',{type:'button',value:'+',id:'add_'+optionCount}).click(addOption).appendTo($wrap_option);
	$('<input/>',{type:'button',value:'-',id:'remove_'+optionCount}).click(removeOption).appendTo($wrap_option);
	optionCount++;
	$('<br />').appendTo($wrap_option);
}

var removeOption=function(event) {
	//removes an option from the radio group
	
	$(event.target).parent().remove();
}

var onSelect = function(item) {
	//Populates the properties fields when a form item is selected from the list
	
	$('#radio_options').children().each(function(idx,el) {$(el).remove()});
	var $option,$wrap_option;
	var i;
	if (($('#button_remove').is(":visible")))
		toggleButtons();
	var question_text="";
	if(item=="Name")
		question_text="Name";
	else if(item=="Gender")
		question_text="Gender";
	else if(item=="Phone")
		question_text="Phone";
	else if(item=="Radio"){
		question_text="Radio";
		for(i=1;i<=2;i++) {
			$wrap_option=$('<div></div>');
			$wrap_option.addClass('option_element');
			$wrap_option.appendTo('#radio_options');
			$option=$('<input/>', {
				type:"text",
				value:"Option",
				name:"option_"+optionCount,
				id:"id_option_"+optionCount
			});
			$option.appendTo($wrap_option);
			$('<input/>',{type:'button',value:'+',id:'add_'+optionCount}).click(addOption).appendTo($wrap_option);
			$('<input/>',{type:'button',value:'-',id:'remove_'+optionCount}).click(removeOption).appendTo($wrap_option);
			optionCount++;
			$('<br />').appendTo($wrap_option);
		}
	}
	$('#id_question').attr('value',question_text);
}

var addElement = function(item) {
	
	// This function adds the selected item to the form
	
	var i,$new_elem,$new_elem_label;
	var $wrap=$('<div></div>');  		// The wrapper div for each form element
	$wrap.addClass('form_element');
	$wrap.appendTo('#preview_form');
	var label_text=$('#id_question').attr('value');
	if($('#id_required').attr('checked'))
		label_text+="*";
	
	if(item=="Name"){
		$new_elem=$('<input/>', {
			type:"text",
			name:"name_"+elemTypes['name'],
			id:"id_name_"+elemTypes['name']
		});
		//$new_elem.attr('id',"id_name"+elemTypes['name']);	// IDs and names are given in a way so as to enable easy selection through regular expressions
		$new_elem_label=$('<label>'+label_text+'</label>');
		$new_elem_label.attr({
			'for':$new_elem.attr('id'),
			id:'label_name_'+elemTypes['name']++,
		});
		$new_elem_label.click(onClickLabel);
		$new_elem_label.appendTo($wrap);
		$('<br />').appendTo($wrap);
		$new_elem.appendTo($wrap);
		$('<br />').appendTo($wrap);
	}
	
	else if(item=="Phone"){
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
	
	else if(item=="Gender"){
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
	
	else if(item=="TextField"){
		$new_elem=$('<input/>', {
			type:"text",
			name:"textField_"+elemTypes['textField'],
			id:'id_textField_'+elemTypes['textField']
		});
		$new_elem_label=$('<label>'+label_text+'</label>');
		$new_elem_label.attr({
			'for':$new_elem.attr('id'),
			id:'label_textField_'+elemTypes['textField']++
		});
		$new_elem_label.click(onClickLabel);
		$new_elem_label.appendTo($wrap);
		$('<br />').appendTo($wrap);
		$new_elem.appendTo($wrap);
		$('<br />').appendTo($wrap);
	}
	
	else if(item=="Radio") {
		var $text_inputs=$('#elem_properties :text');
		$('<label>'+label_text+'</label>').click(onClickLabel).appendTo($wrap).attr('id','label_radio_'+elemTypes['radio']);
		$('<br />').appendTo($wrap);
		$text_inputs.each(function(idx,el) {
			if($(el).attr('id')!='id_question') {
				$new_elem=$('<input/>', {
						type:"radio",
						name:"radio_"+elemTypes['radio'],
						value:$(el).attr('value')
				});	
				$new_elem_label=$('<label>'+$(el).attr('value')+'</label>');
				$new_elem_label.appendTo($wrap);
				$new_elem.appendTo($wrap);
			}
			
		});
		elemTypes['radio']++;
		$('<br />').appendTo($wrap);
	}
	
}

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
	
}

var updateTitle = function(){
	//Updates the title for the form
	
	formTitle=$("#input_title").attr('value');
	$("#form_title").html(formTitle);
}

