// Registering Service Worker
if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('js/sw.js');
};

$(function()
{
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
		    else {
		        error.insertAfter(element);
		    }
		}
	})
	
	$(".styleform input[type='checkbox']").superCheckbox();
	$(".styleform input[type='radio']").superRadio();
	
	//$(".styleform input[type='checkbox']").superCheckbox('destroy')
	
	//$(".styleform").superform();
})
