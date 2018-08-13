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
			else if($(element).prop('tagName') === "SELECT"  === true && $(element).closest('.sf-s-wrapper'))
			{
				 error.insertAfter($(element).closest('.sf-s-wrapper'));
		    }
		    else {
		        error.insertAfter(element);
		    }
		}
	})
	
	$(".styleform input[type='checkbox']").superCheckbox();
	$(".styleform input[type='radio']").superRadio();
	console.log($(".styleform select"));
	$(".styleform select").superSelect();
	$(".styleform select.destroy").superSelect('destroy');
	
	//$(".styleform input[type='checkbox']").superCheckbox('destroy')
	//$(".styleform input[type='checkbox']").superCheckbox('destroy')
	
	//$(".styleform").superform();
})
