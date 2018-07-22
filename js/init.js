$(function()
{
	$(".sf-form").validate(
	{
		ignore: '.ignore-validation',
		errorPlacement: function(error, element)
		{
			if($(element).prop("checkbox") === true && $(element).closest('.sf-ch-wrapper'))
			{
				error.insertAfter($(element).closest('.sf-ch-wrapper'));
		    }
			else if($(element).prop("radio")  === true && $(element).closest('.sf-r-wrapper'))
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