$(function()
{
	$('.to-top').off('click.totop').on('click.totop', function()
	{
		window.scroll({
			top: 0, 
			left: 0, 
			behavior: 'smooth' 
		});
	});
	
	$(".sf-form").validate(
	{
		ignore: '.ignore-validation',
		errorPlacement: function(error, element)
		{
			if($(element).prop("type") === 'checkbox' && $(element).closest('.sf-ch-wrapper'))
			{
				error.insertAfter($(element).closest('.sf-ch-wrapper'));
		    }
			else if($(element).prop("type") === "radio"  === true && $(element).closest('.sf-r-wrapper'))
			{
				 error.insertAfter($("input[name='"+element.attr('name')+"']").last().closest('.sf-r-wrapper'));
		    }
			else if($(element).prop('tagName') === "SELECT"  === true && $(element).closest('.sf-s-wrapper'))
			{
				 error.insertAfter($(element).closest('.sf-s-wrapper'));
		    }
		    else {
		        error.insertAfter(element);
		    }
		}
	})
	
//	totalEventsInit($(".styleform input[type='radio']"));
	$(".styleform").superForm();
	
//	$(".styleform input[type='checkbox']").superCheckbox();
//	$(".styleform input[type='radio']").superRadio();
//	$(".styleform select").superSelect();
//	$(".styleform select.destroy").superSelect('destroy');
	
	
	
	
	//$(".styleform input[type='checkbox']").superCheckbox('destroy')
	//$(".styleform input[type='checkbox']").superCheckbox('destroy')
	
	//$(".styleform").superform();
})


totalEventsInit= function(element)
{
	events = [
		'blur',
		'change',
		'contextmenu',
		'focus',
		'input',
		'invalid',
		'reset',
		'search',
		'select',
		'submit',
		'keydown',
		'keyup',
		'keypress',
		'click',
		'dblclick',
//		'mousedown',
//		'mousemove',
//		'mouseout',
//		'mouseenter',
//		'mouseleave',
//		'mouseover',
//		'wheel',
	];
	
	events = events.join(' ');
	element.off(events).on(events, function(e){console.log(e.type)});
}