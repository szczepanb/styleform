$.widget( "SuperForm.superform", {
	options: {
        checkbox: {
			use: true,
			hover:false,
			wrapClass: true,
			inputClass: null,
			wrapTitle: true,
			ignoredClass:'sf-ch-ignored',
			//calbacks
			onEnter:null,
			onLeave:null,
			onChange:null,
			onCreate:null,
			onClick:null
		},
        radio: {
			use: true,
			hover:false,
			disabled: false,
			wrapClass: null,
			inputClass: null,
			wrapTitle: null,
			ignoredClass:null,
			//calbacks
			onEnter:null,
			onLeave:null,
			onChange:null,
			onCreate:null,
			onClick:null
		},
        select: {
			use: true,
			search: true,//czy pokazać wyszukiwarkę w select
			lang:
			{
				placeholders:{
					search: "Wyszukaj"
				},
				no_results: "Brak wyników."
			},
			//default select options
			hover:false,
			isClickable: true,
			disabled: false,
			wrapClass: null,
			inputClass: null,
			wrapTitle: null,
			onlyClass: null,
			ignoredClass:'sf-ignored-select',
			minWidth: true,
			maxListElement: 12,
			absolute: false,
			//calbacks
			onEnter:null,
			onLeave:null,
			onChange:null,
			onCreate:null,
			onClick:null
		},
        fileUploader: {
			use: true,
			class:{
				wrap:"",
				btn:""
			},
			handlers:
			{
				wrap:null,
				btn:null
			}
		}
    },
	
    _create: function() {
		var $this = this;
		
		var options = JSON.parse(JSON.stringify($this.options));
		
		if(options.checkbox.use)
			$this.element.find('input[type="checkbox"]').superCheckbox(options.checkbox);
		if(options.radio.use)
			$this.element.find('input[type="radio"]').radioStyle(options.radio);
		
		if(options.select.use)
		{	
			$this.element.find('select').not('.sf-s-styled').each(function()
			{
				if($(this).hasClass('sf-s-initialized'))
				{
					$(this).selectStyle('destroy');
				}

				$(this).selectStyle(options.select);
			});
		}
		
		if(options.fileUploader.use)
			$this.element.find('input[type="file"]').fileUploaderStyle(options.fileUploader);
		
		//To powinno być lepsze rozwiązanie dla 
		$(document).off('domChange.'+$this.uuid).on('domChange.'+$this.uuid, function()
		{
			if(options.checkbox.use)
			{
//				$this.element.find('input.sf-ch-styled[type="checkbox"]').superCheckbox('update');
			}
			
			if(options.checkbox.use)
			{
				$this.element.find('input[type="checkbox"]').not('.sf-ch-styled').superCheckbox(options.checkbox);
			}
			
			if(options.radio.use)
			{
				$this.element.find('input[type="radio"]').not('.sf-r-styled').radioStyle(options.radio);
			}
			
			if(options.select.use)
			{			
				$this.element.find('select').not('.sf-s-styled').not("."+$this.options.select.ignoredClass).each(function()
				{
					if($(this).hasClass('sf-s-initialized') && typeof($(this).data('SuperFormSelectStyle')) != 'undefined')
						$(this).selectStyle('destroy');
					
					$(this).selectStyle(options.select);
				});
			}
			
			if(options.fileUploader.use)
			{
				$this.element.find('input[type="file"]').not('.sf-s-styled').fileUploaderStyle(options.fileUploader);
			}
		});
		
//		setInterval(function(){
//			$(document).trigger('domChange.'+$this.uuid);
//		}, 50);
		
		if(this.element.is('form'))
			this._initValidationAdditionalEvent(this.element);
		else
			this._initValidationAdditionalEvent(this.element.find('form'));
    },
	
	_destroy: function(){
		if(this.options.checkbox.use)
			this.element.find('input[type="checkbox"]').superCheckbox("destroy");
		if(this.options.radio.use)
			this.element.find('input[type="radio"]').radioStyle("destroy");
		if(this.options.select.use)
			this.element.find('select').selectStyle("destroy");
		if(this.options.fileUploader.use)
			this.element.find('input[type="file"]').fileUploaderStyle("destroy");
	},
	destroy:function(){this._destroy();this._super();},
	_initValidationAdditionalEvent:function(form)
	{
		form.each(function()
		{
			$(this).off('submit.styleform').on('submit.styleform', function(){
				var validator = $.data(this, "validator" );
				
				if(typeof validator !== "undefined")
				{
					$.each(validator.currentForm, function(i, error)
					{
						if($(error).hasClass(validator.settings.errorClass))
						{
							if($(error).is('select'))
								$(error).closest('.sf-s-wrapper').addClass(validator.settings.errorClass);
							else if($(error).is(':radio'))
								$(error).closest('.sf-r-wrapper').addClass(validator.settings.errorClass);
							else if($(error).is(':checkbox'))
								$(error).closest('.sf-ch-wrapper').addClass(validator.settings.errorClass);
						}
						else
						{
							if($(error).is('select'))
								$(error).closest('.sf-s-wrapper').removeClass(validator.settings.errorClass);
							else if($(error).is(':radio'))
								$(error).closest('.sf-r-wrapper').removeClass(validator.settings.errorClass);
							else if($(error).is(':checkbox'))
								$(error).closest('.sf-ch-wrapper').removeClass(validator.settings.errorClass);
						}
					});
				}
			});
		});
	},
	initValidationAdditionalEvent:function(){this._initValidationAdditionalEvent($(this).find('form'));}
});

var interval = null;
$.widget("SuperForm.superSelect", {
	options: {
		hover:false,
		search: false,
		lang:
		{
			placeholders:
			{
				search: "Search"
			},
			no_results: "No results."
		},
		initFrom: 11,
		onlyClass: null,
		isClickable: true,
		wrapClass: null,
		inputClass: null,
		wrapTitle: null,
		ignoredClass: 'sf-s-ignore',
		minWidth: true,
		maxListElement: null,
		absolute: false,
		window: true,
		//calbacks
		onEnter:null,
		onLeave:null,
		onChange:null,
		onCreate:null,
		onClick:null
	},
	
    _create: function() {
    	this.vars = 
    	{
			wrapper: null,
    		menu: null,
    		menuUlWrap: null,
    		menuUl: null
    	}
    	
		var $this = this;
		var $select = $this.element;

		if(!$select.prop('tagName') == 'select' || $select.hasClass($this.options.ignoredClass) || $select.hasClass('sf-s-styled'))
		{
			return false;
		}
		
		$this._renderSelect();
		$this._initAtributes();
		$this._renderMenu();
		$this._initEvents();
		$this._setMinWidth();
		$this._initObserver();
		$this._update();
		
		$this._trigger( "onCreate", null, $select);
		
		if($select.prop('disabled'))
		{
			$select.closest('.sf-s-wrapper').addClass('sf-s-disabled');
		}
		else	
		{
						
			if($this.options.absolute)
				var $listWraper = $('#sf-s-list-'+$this.uuid);
			else
				$listWraper = $select.closest('.sf-s-wrapper');
			
						
			if($this.options.search && !($this.element.find('option').length < $this.options.initFrom))
        			this._initSearch();
			
			if($this.options.minWidth)
			{
				$this._setMinWidth();
				$(window).on('load', function()
				{
					$this._setMinWidth();
					$select.closest('.sf-s-wrapper').find('.sf-s-list').addClass('sf-hide');
				});
			}
			
			$listWraper.find('.sf-s-list, .scroll-element').off('click.stopProp').on('click.stopProp', function(e)
			{
				e.stopPropagation();
			});
			
			$listWraper.find('.sf-s-list').addClass('sf-s-list-formated');
		}
    },
	create:function(){this._create();},
	
	_renderSelect: function()
	{
		var $this = this;
		var $select = $this.element;
		
		$select.addClass('sf-hide').wrap('<div class="sf-s-wrapper">');
		$this.vars.wrapper = $select.closest('.sf-s-wrapper'); 
		
		if($select.prop('multiple') == true)
		{
			selected = $select.find('option:selected');
			
			$this.vars.wrapper.append('<div class="sf-s-multi-holder">').find('div.sf-s-multi-holder');
		}
		else
		{
			selected = $select.find('option:selected');
			html = selected.html();
			if(selected.data('icon'))
				html = selected.data('icon')+html;
			
			$this.vars.wrapper.append('<p class="sf-s-holder">').find('p.sf-s-holder')
				.append('<span class="sf-s-selected"></span><span class="sf-s-button"></span>').find('.sf-s-selected').html($.trim(html.replace(/&nbsp;/g,'')));
		}
	},
	
	_renderMenu:function()
	{
		var $this = this;
		$this.element = this.element;
		
		$this.vars.menu = $('<div id="sf-s-list-'+$this.uuid+'" class="sf-s-list-wrap-absolute"><div class="sf-s-list sf-hide-opacity"><ul class="sf-s-list-inner scrollbar-formated-default"></ul></div></div>').appendTo($('body'));
		$this.vars.menuUlWrap = $this.vars.menu.find('.sf-s-list');
		$this.vars.menuUl = $this.vars.menu.find('ul.sf-s-list-inner');
		
		$this.element.children('option, optgroup').each(function(iteration, element)
		{
			var $thisO = $(this);
			if($thisO.prop('tagName') == 'OPTION')
			{
				var is_selected = '', is_disabled = '';
				
				var html = $(this).html();
				if($thisO.data().icon)
					html = $thisO.data().icon+html;
				
				if($thisO.prop('selected') == true)
				{
					is_selected = ' sf-s-active sf-s-hover';
					$this.vars.wrapper.find('p.sf-s-holder .sf-s-selected').html($.trim(html.replace(/&nbsp;/g,'')));
				}
				
				if($thisO.prop('disabled'))
				{
					is_disabled = ' sf-s-option-disabled';
				}
				
				var optionAdded = $('<li class="sf-s-default'+is_selected+is_disabled+'" data-value="'+$thisO.val()+'">'+html+'</li>').appendTo($this.vars.menuUl);
				if(typeof($thisO.attr('class')) != 'undefined')
				{
					optionAdded.addClass($thisO.attr('class'));
				}
				optionAdded = null;
			}
			else
			{
				var $wrap = $('<li class="sf-s-optgroup" data-index="'+$thisO.index()+'"><ul class="sf-s-optgroup-list"></ul></li>');
				if($thisO.attr('label').length > 0)
				{
					$groupDisabled = $thisO.prop('disabled');
					
					if($groupDisabled == true)
					{
						is_disabled = ' sf-s-opt-group-disabled';
					}
					
					$wrap.addClass(is_disabled).find('ul').append('<li><p class="sf-s-optgroup-label">'+$thisO.attr('label')+'</p></li>');
				}
					

				$thisO.find('option').each(function()
				{
					var $thisOI = $(this);
					var is_selected = '', is_disabled = '';
					var html = $thisOI.html();
					if($thisOI.data().icon)
						html = $thisOI.data().icon+html;
					
					if($thisOI.prop('selected') == true)
					{
						is_selected = ' sf-s-active sf-s-hover';
						$this.element.closest('.sf-s-wrapper').find('p.sf-s-holder .sf-s-selected').html($.trim(html.replace(/&nbsp;/g,'')));
					}
					
					if($thisOI.prop('disabled') == true || $thisO.prop('disabled') == true)
					{
						is_disabled = ' sf-s-option-disabled';
					}
					
					var optionAdded = $('<li class="sf-s-default'+is_selected+is_disabled+'" data-value="'+$thisOI.val()+'">'+html+'</li>').appendTo($wrap.find('ul.sf-s-optgroup-list'));
					if(typeof($thisOI.attr('class')) != 'undefined')
					{
						optionAdded.addClass($thisOI.attr('class'));
					}
					optionAdded = null;
				});

				$this.vars.menuUl.append($wrap);
			}
		});
	},
	
	_initAtributes:function()
	{
		var $this = this;
		var $select = $this.element;
		
		var $class = '';
		//Add class to wrap
		if($.type($this.options.wrapClass) === "boolean")
		{
			if($this.options.wrapClass === true)
			{
				var classList = $select.attr('class').split(/\s+/);
				$.each(classList, function(index, item) {
					$this.vars.wrapper.addClass('sf-s-class-'+item);
				});
			}
		}
		else if($.type($this.options.wrapClass) === "string")	
			$class = $this.options.wrapClass;
		else if($.type($this.options.wrapClass) === "null"){}
		else
			console.exception('Wrong value for wrapClass is have to be string.');
		
		//Add title to wrap or set from input
		if($.type($this.options.wrapTitle) === "boolean")
		{
			if($this.options.wrapTitle === true)
				$this.vars.wrapper.attr('title', $select.attr('title'));
		}
		else if($.type($this.options.wrapTitle) === "string")
		{
			$this.vars.wrapper.attr('title', $this.options.wrapTitle);
		}
		else if($.type($this.options.wrapTitle) === "null"){}
		else
		{
			console.exception('Wrong value for wrapTitle check documentation at www.agendo.pl');
		}
	},
	
	_initEvents: function()
	{
		var $this = this;
		var $select = $this.element;
		
		if($select.prop('disabled') != true)
		{
			$this.vars.wrapper.find('p.sf-s-holder,div.sf-s-multi-holder').off('click.sf_select').on('click.sf_select',function(event)
			{
				if($select.hasClass('sf-s-list-is-open'))
					$this._close();
				else
					$this._open();
				
				event.stopPropagation();
				return false;
			});
			
			$this.vars.menuUl.find('.sf-s-default').each(function()
			{
				$(this).off('mouseenter.sf_select').on('mouseenter.sf_select', function()
				{
					if($(this).hasClass('sf-s-option-disabled'))
						return false;
					
					$this.vars.menuUl.find('li.sf-s-default.sf-s-hover').removeClass('sf-s-hover');
					$(this).addClass('sf-s-hover');
				})
				.off('mouseleave.sf_select').on('mouseleave.sf_select', function(event)
				{
					$(this).removeClass('sf-s-hover');
				});


				$(this).off('click.sf_select').on('click.sf_select', function(event)
				{
					
					if($(this).hasClass('sf-s-option-disabled'))
					{
						event.preventDefault();
						event.stopPropagation();
						return false;
					}
					else
					{	
						if($this._isMultiple())
						{
							var option = $select.find('option[value="'+$(this).data('value')+'"]');
							if(option.prop('selected') == false)
								option.prop('selected', true);
							else
								option.prop('selected', false);
							
						}
						else
						{
							if($(this).hasClass('sf-s-active'))
							{
								$this._close();
								return;
							}
							
							$select.find('option[value="'+$(this).data('value')+'"]').prop('selected', true);
						}
						
						$this._change();
						$this._close();
						$select.trigger('change');
						$this._trigger( "onChange", null, $select);
					}
					$this._trigger( "onSelect", event, $select);
					event.stopPropagation();
					return false;
				});
			});
					
			this._addKeyboardEvent();

			
			if($this.options.hover)
			{
				$this.vars.wrapper.find('p.sf-s-holder').off('mouseenter.sf_select').on('mouseenter.sf_select', function(event)
				{
					if($select.prop('disabled') == true)
						return false;
					
					$(this).addClass('sf-s-hover');
					$this._trigger( "onEnter", event, $select);
				})
				.off('mouseleave.sf_select').on('mouseleave.sf_select', function(event)
				{
					$(this).removeClass('sf-s-hover');
					$this._trigger( "onLeave", event, $select);
				});
			}
		}
	},
	
	_initObserver: function()
    {
    	var $this = this;
		var $select = $this.element;
    	
    	callback = function(mutationList, observer)
    	{
    		if(['multiple', 'value'].indexOf(mutationList[0]['attributeName']) > -1 || mutationList[0]['type'] == 'childList')
    		{
    			$this._destroy();
    			$this.element.superSelect($this.options);
    		}
    		
    		$this._update();
    	};
    	
    	var observerOptions = {
		  childList: true,
		  attributes: true,
		  subtree: true
		}
    	
    	$this.vars.observer = new MutationObserver(callback);
    	$this.vars.observer.observe($this.element[0], observerOptions);
    },
	
	_update: function()
	{
		var $this = this;
		var $select = $this.element;
		
		$this._initAtributes();
		
		if($select.prop('disabled') == true)
		{
			$this.vars.wrapper.addClass('sf-s-disabled').prop("tabindex", "-1");
			
		}
		else
		{
			$this.vars.wrapper.removeClass('sf-s-disabled').prop("tabindex", "0");
		}
		
		$select.find('optgroup').each(function()
		{
			$group = $this.vars.menuUl.find('.sf-s-optgroup[data-index="'+$(this).index()+'"]');
			
			if($(this).prop('disabled') == true)
			{
				$group.addClass('sf-s-opt-group-disabled').find('.sf-s-default').addClass('sf-s-option-disabled');
			}
			else
			{
				$group.removeClass('sf-s-opt-group-disabled').find('.sf-s-default').removeClass('sf-s-option-disabled');
			}
			
		});
		
		$select.find('option').each(function()
		{
			$option = $this.vars.menuUl.find('.sf-s-default[data-value="'+$(this).val()+'"]');
			
			if($(this).prop('disabled') == true || $(this).closest('optgroup:disabled').length > 0)
			{
				$option.addClass('sf-s-option-disabled');
			}
			else
			{
				$option.removeClass('sf-s-option-disabled');
			}
			
		});
		
		if($select.prop('autofocus') == true)
		{
			$this.vars.wrapper.focus();
			
		}
		
		$this._change();
		
		if($select.hasClass($this.options.errorClass))
		{
			$this.vars.wrapper.addClass($this.options.errorClass);
		}
		else
		{
			$this.vars.wrapper.removeClass($this.options.errorClass);
		}
	},
	
	_isMultiple: function()
	{
		return this.element.prop('multiple') == true;
	},
	
	_change: function()
	{
		var $this = this;
		var $select = $this.element;
		
		if($this._isMultiple())
		{
			$selectedValues = $this.vars.menuUl.data('selected');
			$values = $select.val();
			
			$.each($values, function(iteration, element)
			{
				if(typeof $selectedValues !== 'undefined' && $selectedValues.length)
				{
					index = $selectedValues.indexOf(element)
					if(index < 0)
					{
						$selected = $this.vars.menuUl.find('.sf-s-default[data-value="'+element+'"]').addClass('sf-s-active');
						$content = $('<div class="sf-s-multi-element" data-value="'+element+'"><span class="sf-s-multi-element-remover"></span><span class="sf-s-multi-element-content">'+$.trim($selected.html().replace(/&nbsp;/g,''))+'</span></div>');
						if(iteration == 0)
						{
							$this.vars.wrapper.find('.sf-s-multi-holder .sf-s-multi-element').eq(iteration).before($content);
						}
						else
						{
							$this.vars.wrapper.find('.sf-s-multi-holder .sf-s-multi-element').eq(iteration-1).after($content);
						}
							
						
						$this._initRemoveMultipleSelectedOpt($content);
					}
					else
						$selectedValues.splice(index, 1);
				}
				else
				{
					
					$selected = $this.vars.menuUl.find('.sf-s-default[data-value="'+element+'"]').addClass('sf-s-active');
					$content = $('<div class="sf-s-multi-element" data-value="'+element+'"><span class="sf-s-multi-element-remover"></span><span class="sf-s-multi-element-content">'+$.trim($selected.html().replace(/&nbsp;/g,''))+'</span></div>');
					$this.vars.wrapper.find('.sf-s-multi-holder').append($content);
					$this._initRemoveMultipleSelectedOpt($content);
				}
			});
			
			$.each($selectedValues, function(iteration, element)
			{
				$this.vars.menuUl.find('.sf-s-default[data-value="'+element+'"]').removeClass('sf-s-active');
				$this.vars.wrapper.find('.sf-s-multi-holder .sf-s-multi-element[data-value="'+element+'"]').remove();
			});			
			
			
			$this.vars.menuUl.data('selected', $values);
		}
		else
		{
			$value = $select.val();
			$this.vars.menuUl.find('.sf-s-default.sf-s-active').removeClass('sf-s-active');
			$selected = $this.vars.menuUl.find('.sf-s-default[data-value="'+$value+'"]').addClass('sf-s-active');
			$this.vars.wrapper.find('p.sf-s-holder .sf-s-selected').html($.trim($selected.html().replace(/&nbsp;/g,'')));
		}
	},
	
	_initRemoveMultipleSelectedOpt: function(element)
	{
		var $this = this;
		var $select = $this.element;
		
		element.find('.sf-s-multi-element-remover').off('click.sf_select').on('click.sf_select', function(event)
		{
			$this._close();
			$value = element.data('value');
			$select.find('option[value="'+$value+'"]').prop('selected', false);
			$this.vars.menuUl.find('.sf-s-default[data-value="'+$value+'"]').removeClass('sf-s-active');
			element.remove();
			$this.vars.menuUl.data('selected', $select.val());
			event.stopPropagation();
			return false;
		});
	},
	
	_destroy:function()
	{
		if(this.vars.observer)
			this.vars.observer.disconnect();
		
		this.element.removeClass('sf-hide');
		this.element.removeData(this.widgetFullName);
		this.element.off('.sf_select');
		this.vars.menu.remove();
		this.element.closest('.sf-s-wrapper').replaceWith(this.element);
	},
	destroy:function(){this._destroy();this._super();},
	
	_refresh:function()
	{
		this._destroy();
		this._create();
	},
	refresh:function(){this._refresh();},
	
	_setMinWidth:function()
	{
		var $this = this;
		var $select = this.element;
		
		if($select.prop('multiple'))
		{
			$this.vars.menuUlWrap.css('width', 'auto');
			
			holder = $this.vars.wrapper.find('.sf-s-multi-holder');
			holderText = holder.append('<div class="sf-s-multi-element helper"><span class="sf-s-multi-element-remover"></span><span class="sf-s-multi-element-content"></span></div>').find('.sf-s-multi-element.helper');
			propStyle = holderText.prop('style');
			
			propStyle = new Map(propStyle);
			propStyle.delete('length');
			
			listElements = $this.vars.menuUl.find('.sf-s-default, .sf-s-optgroup-label').css(propStyle);
			
			minWidth = Math.max.apply( null, listElements.map( function () {
			    return this.scrollWidth;
			}).get())-3;
			
			if(typeof(oldStyle) != 'undefined')
				listElements.css(oldStyle);
			else
				listElements.removeAttr('style');
			
			paddingListElement = listElements.innerWidth()-listElements.width();
			
			minWidthList = Math.max.apply( null, listElements.map( function () {
			    return this.scrollWidth;
			}).get());
			
			if($select.prop('style').width.toString().length > 0 || $select.prop('style')['max-width'].toString().length > 0 || window.getComputedStyle($select[0]).width != 'auto')
			{
				if($select.prop('style')['max-width'].toString().length > 0)
					var selectWidth = $select.prop('style')['max-width'].toString();
				else if($select.prop('style').width.toString().length > 0)
					var selectWidth = $select.prop('style').width.toString();
				else
					var selectWidth = window.getComputedStyle($select[0]).width;
				
				$this.vars.wrapper.css('width', selectWidth);
				selectWidth = $this.vars.wrapper.outerWidth();
				
			}
			else
			{
				var selectWidth = Math.ceil(holderText.outerWidth(false))+minWidth-paddingListElement;
				$this.vars.wrapper.width(selectWidth);
			}
			
			holderText.remove();
			
			if(minWidthList > selectWidth)
				$this.vars.menuUlWrap.css('width', minWidthList);
			else
				$this.vars.menuUlWrap.css('width', selectWidth);
		}
		else
		{
			$this.vars.menuUlWrap.css('width', 'auto');
			
			holder = $this.vars.wrapper.find('.sf-s-holder');
			holderText = $this.vars.wrapper.find('.sf-s-selected');
			oldStyle = holderText.attr('style');
			propStyle = holderText.prop('style');
		
			propStyle = new Map(propStyle);
			propStyle.delete('length');
			
			listElements = $this.vars.menuUl.find('.sf-s-default, .sf-s-optgroup-label').css(propStyle);
			
			minWidth = Math.max.apply( null, listElements.map( function () {
			    return this.scrollWidth;
			}).get())+5;
			
			if(typeof(oldStyle) != 'undefined')
				listElements.css(oldStyle);
			else
				listElements.removeAttr('style');
			
			paddingListElement = listElements.innerWidth()-listElements.width();
			
			minWidthList = Math.max.apply( null, listElements.map( function () {
			    return this.scrollWidth;
			}).get())+5;
			
			if($select.prop('style').width.toString().length > 0 || $select.prop('style')['max-width'].toString().length > 0 || window.getComputedStyle($select[0]).width != 'auto')
			{
				if($select.prop('style')['max-width'].toString().length > 0)
				{
					var selectWidth = $select.prop('style')['max-width'].toString();
				}
				else if($select.prop('style').width.toString().length > 0)
				{
					var selectWidth = $select.prop('style').width.toString();
				}
				else
				{					
					var selectWidth = window.getComputedStyle($select[0]).width;
				}
									
				$this.vars.wrapper.css('width', selectWidth);
				selectWidth = $this.vars.wrapper.outerWidth();
			}
			else
			{
				var selectWidth = Math.ceil(holder.outerWidth(false))-Math.ceil(holder.width())+minWidth-paddingListElement;
				$this.vars.wrapper.width(selectWidth);
			}
			
			if(minWidthList > selectWidth)
				$this.vars.menuUlWrap.css('width', minWidthList);
			else
				$this.vars.menuUlWrap.css('width', selectWidth);
		}
	},
	
	_setUpList:function()
	{
		var $this = this;
		var $select = $this.element;
		
		$this.vars.menu.css({height: 'auto', top: 'auto'});
		$this.vars.menuUlWrap.removeClass('sf-s-overflow').css({height: 'auto', top: 'auto'});
		
		if($select.prop('size').length && Math.ceil($this.vars.menuUl.find('.sf-s-default:visible').length)+Math.ceil($this.vars.menuUl.find('.sf-s-optgroup:visible').length))
		{
			$this.vars.menuUlWrap.addClass('sf-s-overflow').height(Math.ceil($select.prop('size'))*$this.vars.menuUlWrap.find('li.sf-s-default').outerHeight());
		}
		
		$this.vars.menuUlWrap.addClass('sf-show-visible');
		var listHeight = Math.ceil($this.vars.menuUlWrap.outerHeight());
		
		if(this.options.window)
		{
			var upHeight = Math.ceil($this.vars.wrapper.offset().top-$(window).scrollTop());
			var downHeight = Math.ceil($(window).height()-($this.vars.wrapper.offset().top+$this.vars.wrapper.outerHeight()-$(window).scrollTop()));
		}
		else
		{
			var upHeight = Math.ceil($this.vars.wrapper.offset().top);
			var downHeight = Math.ceil($('body').height()-$this.vars.wrapper.offset().top);
		}
		
		var positionClass = "";
		if($this.vars.menu.offset().left+$this.vars.menu.outerWidth(true) > $('body').width())
		{
			horizontalAlign = "right";
			positionClass += 'sf-s-to-right';
		}
		else
			horizontalAlign = "left";
		
		console.log("Down height "+downHeight);
		console.log("Up height "+upHeight);
		console.log("listHeight "+listHeight);
		
		console.log("Window Scroll Top "+window.pageYOffset);
		console.log("Wrapper offset Top "+$this.vars.wrapper.offset().top);
		
		if(downHeight < listHeight)
		{
            if(upHeight < listHeight)
            {
            	var singleHeight = $this.vars.menuUl.find('li.sf-s-default').outerHeight();
                if(upHeight > downHeight)
                {
                	var maxelement = Math.ceil(upHeight/singleHeight)-1;
					
					if(maxelement === 0)
                       maxelement = 1;
                   
				    var maxHeight = Math.ceil(maxelement*singleHeight);
					
				    $this.vars.menuUlWrap.height(maxHeight).addClass('sf-s-overflow');
				    $this.vars.menu.height(maxHeight);
				    
				    verticalAlignMy = 'bottom';
				    verticalAlignAt = 'top';
				    positionClass += ' sf-s-to-top';
                }
                else
                {	
                	var maxelement = Math.ceil(downHeight/singleHeight)-1;
                    
                    if(maxelement === 0)
                       maxelement = 1;
                   
                    var maxHeight = Math.ceil(maxelement*singleHeight);

    				$this.vars.menuUlWrap.height(maxHeight).addClass('sf-s-overflow');
    				$this.vars.menu.height(maxHeight);
                	
					verticalAlignMy = 'bottom';
				    verticalAlignAt = 'top';
				    positionClass += ' sf-s-to-top';
                }
            }
            else
            {            	
            	verticalAlignMy = 'bottom';
			    verticalAlignAt = 'top';
			    positionClass += ' sf-s-to-top';
            }
		}
		else
		{
			verticalAlignMy = 'top';
		    verticalAlignAt = 'bottom';
		}
		
		$this.vars.menu.position({
			'my': horizontalAlign+" "+verticalAlignMy,
			'at': horizontalAlign+" "+verticalAlignAt,
			'of': $this.vars.wrapper
		}).addClass(positionClass);
		
		zIndex = $this.vars.menu.css('z-index');
		if(zIndex == 'auto')
			zIndex = 0;
		
		$this.vars.wrapper.css('z-index', zIndex+1).addClass(positionClass);
		
		$this.vars.menuUlWrap.removeClass('sf-show-visible');
	},
	
	
	_initSearch: function()
	{
		var $this = this;
		var $select = $this.element;
		$select.closest('.sf-s-wrapper').find('.sf-s-list').prepend('<div class="sf-s-search-input"><input type="text" placeholder="'+$this.options.lang.placeholders.search+'"></div>');
		
		$select.closest('.sf-s-wrapper').find('p.sf-s-holder').off('click.search').on('click.search', function(){
			$select.closest('.sf-s-wrapper').find('.sf-s-search-input input').focus();
		});
		
		$select.closest('.sf-s-wrapper').find('.sf-s-search-input input').off('keyup.search').on('keyup.search', function()
		{
			var reg = new RegExp($(this).val(), 'i');
			
			if($(this).val().length)
			{
				$select.closest('.sf-s-wrapper').find('.sf-s-list .sf-s-default').each(function(iterator, element)
				{
					if(reg.test($(element).text().trim()))
					{
						$(element).removeClass('sf-s-element-hide');
					}
					else
					{
						$(element).addClass('sf-s-element-hide');
					}
					
					if($(element).closest('.sf-s-optgroup').length)
					{
						if($(element).closest('.sf-s-optgroup').find('.sf-s-default:not(.sf-s-element-hide)').length)
						{
							$(element).closest('.sf-s-optgroup').show();
						}
						else
						{
							$(element).closest('.sf-s-optgroup').hide();
						}
					}
				});
				
				if($select.closest('.sf-s-wrapper').find('.sf-s-list .sf-s-default:visible').length == 0)
				{
					if($select.closest('.sf-s-wrapper').find('.sf-s-list .sf-s-no-results').length == 0)
						$select.closest('.sf-s-wrapper').find('.sf-s-list').append('<li class="sf-s-no-results" style=""><input disabled="" value="" type="hidden">'+$this.options.lang.no_results+'</li>');
				}
				else {
					$select.closest('.sf-s-wrapper').find('.sf-s-list .sf-s-no-results').remove();
				}

			}
			else {
				$select.closest('.sf-s-wrapper').find('.sf-s-list .sf-s-default').removeClass('sf-s-element-hide');
			}
			
			$this._setUpList();
		});
		
	},

	_addKeyboardEvent: function()
	{
		var $select = this.element;
		
		$select.closest('.sf-s-wrapper').find('.sf-s-holder a').off('focusin.keyboard').on('focusin.keyboard', function()
		{
			$select.closest('.sf-s-wrapper').addClass('sf-s-focus');
		}).off('focusout.keyboard').on('focusout.keyboard',function()
		{
			$select.closest('.sf-s-wrapper').removeClass('sf-s-focus');
		});
		
		var ar=new Array(33,34,35,36,37,38,39,40);
		$select.closest('.sf-s-wrapper').find('.sf-s-holder a').off('keyup.keyboard').on('keyup.keyboard', function(e)
		{
			var code = e.keyCode || e.which;
			if(code == '38' || code == '37')
			{
				var $elements = $select.closest('.sf-s-wrapper').find('.sf-s-list .sf-s-default:not(.sf-s-option-disabled)');
				$elements.each(function(i, elem)
				{
					if($(elem).hasClass('sf-s-active'))
					{
						if(sf-1 >= 0)
						{
							$elements[sf-1].click();
							return false;
						}
					}
				});
			}
			else if(code == '40' || code == '39')
			{
				var $elements = $select.closest('.sf-s-wrapper').find('.sf-s-list .sf-s-default:not(.sf-s-option-disabled)');
				$elements.each(function(i, elem)
				{
					if($(elem).hasClass('sf-s-active'))
					{
						if(i+1 <= $elements.length)
						{
							$elements[i+1].click();
							return false;
						}
							
					}
				});
			}
			
			e.preventDefault();
		}).off('keydown.keyboard').on('keydown.keyboard', function(e)
		{
			var code = e.keyCode || e.which;
			if($.inArray(code,ar) > -1) {
				e.preventDefault();
				return false;}
		});
		
		var searchWord = '';
		var timeType = null;
		
		$select.closest('.sf-s-wrapper').find('.sf-s-list').off('keyup.keyboard').on('keyup.keyboard', function(e)
		{
			var code = e.keyCode || e.which;
			if(code == '38' || code == '37')
			{
				var $elements = $select.closest('.sf-s-wrapper').find('.sf-s-list .sf-s-default:not(.sf-s-option-disabled)');
				$elements.each(function(i, elem)
				{
					if($(elem).hasClass('sf-s-hover'))
					{
						$elements.removeClass('sf-s-hover');
						if(sf-1 >= 0)
						{
							$($elements[sf-1]).addClass('sf-s-hover');
						}
						else
						{
							$($elements[$elements.length-1]).addClass('sf-s-hover');
						}
						return false;
					}
				});
				
			}
			else if(code == '40' || code == '39')
			{
				var $elements = $select.closest('.sf-s-wrapper').find('.sf-s-list .sf-s-default:not(.sf-s-option-disabled)');
				$elements.each(function(i, elem)
				{
					if($(elem).hasClass('sf-s-hover'))
					{
						$elements.removeClass('sf-s-hover');
						if(i+1 < $elements.length)
						{
							$($elements[i+1]).addClass('sf-s-hover');
						}
						else
						{
							$($elements[0]).addClass('sf-s-hover');
						}
						return false;
					}
				});
			}
			else if(code == '13')
			{
				$select.closest('.sf-s-wrapper').find('.sf-s-default.sf-s-hover').click();
			}
			else
			{
				if(timeType !== null)
				 clearTimeout(timeType);
				
				if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 65 && e.keyCode <= 90)
				{
					searchWord += e.key;
				}
				
				timeType = setTimeout(function()
				{
					var $elements = $select.closest('.sf-s-wrapper').find('.sf-s-list .sf-s-default:not(.sf-s-option-disabled)').filter(function()
					{
						return ($(this).text().toLowerCase().match('^'+searchWord.toLowerCase()));
					});
					
					if($elements.length > 0)
					{
						var not_select = true;
						$elements.each(function(index, elem)
						{
							if($(elem).hasClass('sf-s-hover'))
							{
								$select.closest('.sf-s-wrapper').find('.sf-s-list .sf-s-hover').removeClass('sf-s-hover');
								if(index == $elements.length-1)
								{
									$elements.first().addClass('sf-s-hover');
									not_select = false;
									return false;
									
								}
								else
								{
									$($elements[index+1]).addClass('sf-s-hover');
									not_select = false;
									return false;
								}
							}
						});
						
						if(not_select)
						{
							$select.closest('.sf-s-wrapper').find('.sf-s-list .sf-s-hover').removeClass('sf-s-hover');
							$elements.first().addClass('sf-s-hover');
						}
						
						var $selected = $select.closest('.sf-s-wrapper').find('.sf-s-list .sf-s-hover')
						
						var list;
						if(list = $select.closest('.sf-s-wrapper').find('.sf-s-list.sf-s-overflow'))
						{
							list.scrollTop(0);
							list.scrollTop($selected.position().top-list.height()+$selected.outerHeight(true));
						}
					}
					
					searchWord = '';
				}, 200);
			}
			
			e.preventDefault();
		}).off('keydown.keyboard').on('keydown.keyboard', function(e)
		{
			var code = e.keyCode || e.which;
			if($.inArray(code, ar) > -1) {
				e.preventDefault();
				return false;}
		});
	},
	
	_open:function(){
		$('html').trigger('click.sf_select');
		
		var $this = this;
		var $select = this.element;
		
		if($select.hasClass('sf-s-list-is-open') || $select.prop('disabled') == true)
			return false;
		
		$('select.sf-s-styled').superSelect('close');
		
		this._setUpList();
		
		$select.addClass('sf-s-list-is-open');
		
		$this.vars.wrapper.find('p.sf-s-holder').addClass('sf-s-list-open');
		
		var $selected;
		$selected = $this.vars.menuUl.find('.sf-s-default.sf-s-active').first();
		
		if($selected.length > 0)
		{
			$this.vars.menuUlWrap.scrollTop(0).scrollTop($selected.position().top-$this.vars.menuUl.height()+$select.outerHeight(true));
		}
			
		var zIndexs = [];
		$select.parents().each(function()
		{
			if(!isNaN(parseInt($(this).css('z-index'))))
			{
				zIndexs.push(parseInt($(this).css('z-index')));
			}
		});
		
		var zIndex = Math.max.apply(Math,zIndexs)-1;
		
		$this.vars.menuUlWrap.removeClass('sf-hide-opacity').attr('tabindex', '1');
		
		if(!isNaN(zIndex))
		{
			$this.vars.menu.css({'zIndex': zIndex});
		}
		
		$('html').on('click.sf_select', function()
		{
			$this._close();
		})
		
		$(this).addClass('sf-s-hover');
		
		$(window).on('scroll.sf_select', function(event)
		{
			if($('body').outerHeight()-$(window).outerHeight() - $(window).scrollTop() > 1)
			{
				//This is better for users but worst for performance
//				$this._setUpList();
				
				//This is the default bahaviour of select
				$this._close();
			}
			
		}).on('resize.sf_select', function(event)
		{
			$this._close();
		});
	},
	
	_close:function(caller)
	{
		$('html').off('click.sf_select').off('mouseenter.sf_select');
		$(window).off('scroll.sf_select').off('resize.sf_select');
		var $this = this;
		if(!$this.element.hasClass('sf-s-list-is-open'))
			return false;
		
		$this.element.removeClass('sf-s-list-is-open');
		$this.vars.wrapper.css('z-index', '0').find('p.sf-s-holder').removeClass('sf-s-list-open').find('.sf-s-button').removeClass('sf-s-list-open');

		$this.vars.menuUlWrap.addClass('sf-hide-opacity').attr('tabindex', '0');
		
	},
	close:function(){this._close();},
});

$.widget("SuperForm.superRadio", {
	
	//defaults options for plugin
	options: {
		hover:false,
		wrapClass: null,
		wrapTitle: null,
		ignoredClass: 'sf-r-ignored',
		errorClass: 'error',
		//calbacks
		onEnter:null,
		onLeave:null,
		onChange:null,
		onCreate:null,
		onClick:null
	},
	
    _create: function() {
    	this.vars = {
			old: null,
			observer: null
    	};
    	
		var $this = this;
		var $input = $this.element;
		
		if($input.attr('type') !== 'radio' || $input.hasClass($this.options.ignoredClass))
		{
			return false;
		}
		
		$this._renderRadio();
		$this._initAtributes();
		$this._initEvents();
		$this._initObserver();
		$this._update();

		$this._trigger( "onCreate", null, $input);
    },
	
    
    _renderRadio: function()
    {
    	var $this = this;
		var $input = $this.element;
		
		if(!$input.hasClass('sf-r-styled'))
		{
			if($input.parent('label').length)
			{
				$this.vars.old = 'inner';
				$input.parent().wrap('<div class="sf-r-wrapper">');
			}
			else if(typeof($input.attr('id')) !== 'undefined')
			{
				var element = $('label[for="'+$input.attr('id')+'"]');
				if(element)
				{
					$this.vars.old = 'outside';
					element.addClass('sf-hide');
					$input.wrap('<label>').parent().append(element.html()).wrap('<div class="sf-r-wrapper">');
				}
			}
			else
			{
				$this.vars.old = 'empty'
				$input.wrap('<div class="sf-r-wrapper"><label class="sf-r-only-radio">');
			}
			
			if(typeof($input.attr('style')) != 'undefined')
				$input.closest('.sf-r-wrapper').attr('style', $input.attr('style'));
			
			$input.closest('.sf-r-wrapper label').prepend('<span tabindex="0" class="sf-r-default"><span></span></span>');
			$input.addClass('sf-r-styled sf-hide');
		}
    },
    
    _initAtributes: function()
    {
    	var $this = this;
		var $input = $this.element;
		
		//Add class to wrap
		if($.type($this.options.wrapClass) === "boolean")
		{
			if($this.options.wrapClass === true)
				if($input.data('class'))
					$input.closest('.sf-r-wrapper').addClass($input.data('class'));
		}
		else if($.type($this.options.wrapClass) === "string")	
			$input.closest('.sf-r-wrapper').addClass($this.options.wrapClass);
		else if($.type($this.options.wrapClass) === "null"){}
		else
			console.exception('Wrong value for param wrapClass is have to be string or boolean.');
    	
    	//Add title to wrap or set from input
		if($.type($this.options.wrapTitle) === "boolean")
		{
			if($this.options.wrapTitle === true)
			{
				$input.closest('.sf-r-wrapper').attr('title', $input.attr('title'));
			}
		}
		else if($.type($this.options.wrapTitle) === "string")
		{
			$input.closest('.sf-r-wrapper').attr('title', $this.options.wrapTitle);
		}
		else if($.type($this.options.wrapTitle) === "null"){}
		else
		{
			console.exception('Wrong value for wrapTitle is have to be string or boolean');
		}
    },
    
    _initEvents: function()
    {
    	var $this = this;
		var $input = $this.element;
		
		$input.off('change.sf-radio').on('change.sf-radio', function(){
			if($input.prop('disabled') !== true)
			{
				$this._trigger( "onClick", null, $input);
				$this._change();
				$this._trigger( "onChange", null, $input);
			}
		});
		
		$input.closest('label').find('.sf-r-default').off('keydown.sf_radio').on('keydown.sf_radio', function(event)
		{
			if(this === document.activeElement)
			{
				switch ( event.keyCode ) {
				case 32:	
				
						$(this).closest('label').click();
						return false;
						break;
				case 13:	
					if($(this).closest('form').length)
						$(this).closest('form').submit();
					return false;
					break;
				default: break;
				}
			}
		});
		
		$input.closest('label').find('a').off('click.sf_radio').on('click.sf_radio', function(e)
		{
			if($input.prop('disabled') !== true)
			{
				if($(this).attr('target') == '_blank')
                    window.open($(this).attr('href'));
                else
                    window.location.href = $(this).attr('href');
			}
			
            e.preventDefault();
			e.stopPropagation();
		});
		
		if($input.data().hover === true || $this.options.hover)
		{
			$input.closest('.sf-r-wrapper').off('mouseenter.sf_radio').on('mouseenter.sf_radio', function(event)
			{
				if($input.prop('disabled') != true)
				{
					$(this).addClass('sf-r-hover');
					$this._trigger( "onEnter", event, $input);
				}
			}).off('mouseleave.sf_radio').on('mouseleave.sf_radio', function(event)
			{
				if($input.prop('disabled') != true)
				{
					$(this).removeClass('sf-r-hover');
					$this._trigger( "onLeave", event, $input);
				}
			});
		}
    },
    
    _initObserver: function()
    {
    	var $this = this;
		var $input = $this.element;
    	
    	callback = function(mutationList, observer)
    	{
    		$this._update();
    	};
    	
    	var observerOptions = {
		  childList: true,
		  attributes: true,
		  subtree: true
		}
    	
    	$this.vars.observer = new MutationObserver(callback);
    	$this.vars.observer.observe($this.element[0], observerOptions);
    },
    
    _update: function()
	{
		var $this = this;
		var $input = $this.element;
		
		$this._initAtributes();
		
		if($input.prop('disabled') == true)
		{
			$input.closest('.sf-r-wrapper').addClass('sf-r-disabled').find('.sf-r-default').prop("tabindex", "-1");
			
		}
		else
		{
			$input.closest('.sf-r-wrapper').removeClass('sf-r-disabled').find('.sf-r-default').prop("tabindex", "0");
		}
		
		$this._change();
		
		if($input.hasClass($this.options.errorClass))
		{
			$input.closest('.sf-r-wrapper').addClass($this.options.errorClass);
		}
		else
		{
			$input.closest('.sf-r-wrapper').removeClass($this.options.errorClass);
		}
	},
	
	_change: function()
	{
		var $this = this;
		var $input = $this.element;
		
		if($input.prop('checked') == true)
		{
			$('input.sf-ri-clicked[name="'+$input.attr('name')+'"]').closest('.sf-r-wrapper').removeClass('sf-r-clicked')
			$input.addClass('sf-ri-clicked').closest('.sf-r-wrapper').addClass('sf-r-clicked');
		}
		else
		{
			$input.removeClass('sf-ri-clicked').closest('.sf-r-wrapper').removeClass('sf-r-clicked');
		}
	},
	
	update: function()
	{
		this._update();
	},
    
	_destroy:function()
	{
		if(this.vars.observer)
			this.vars.observer.disconnect();
		
		this.element.removeClass('sf-r-styled sf-hide');
		this.element.removeData(this.widgetFullName);
		this.element.off('change.sf-radio');
		
		switch (this.vars.old) {
			case 'inner':
				old = this.element.closest('label').off('keydown.sf_radio');
				old.find('.sf-r-default').remove();
				break;
			case 'outside':
				$('label[for="'+this.element.attr('id')+'"]').removeClass('sf-hide');
				old = this.element;
				break;
			default:
				old = this.element;
				break;
		}
		
		this.element.closest('.sf-r-wrapper').replaceWith(old);
	},
	destroy:function(){this._destroy();},
	
	_refresh:function()
	{
		this._destroy();
		this._create();
	},
	refresh:function(){this._refresh();}
});

$.widget("SuperForm.superCheckbox", {
//	widgetEventPrefix: "imperial",
	
	//defaults options for plugin
	options: {
		hover:false,
		wrapClass: true,
		wrapTitle: true,
		ignoredClass: "sf-ch-ignored",
		errorClass: "error",
		//calbacks
		onEnter:null,
		onLeave:null,
		onChange:null,
		onCreate:null,
		onClick:null,
		proxy: null
	},
	
    _create: function() {
    	this.vars = {
			old: null,
			observer: null
    	};
    	
		var $this = this;
		var $input = $this.element;
		
		if($input.attr('type') !== 'checkbox' || $input.hasClass($this.options.ignoredClass))
			return false;
	
		$this._renderCheckbox();
		$this._initAtributes();
		$this._initEvents();
		$this._initObserver();
		$this._update();
		
		$this._trigger( "onCreate", null, $input);
		
		return 'test';
    },
	
    _renderCheckbox: function()
    {
    	var $this = this;
    	var $input = $this.element;
    	
    	if(!$input.hasClass('sf-ch-styled'))
		{
			if($input.parent().is('label'))
			{
				$this.vars.old = 'inner';
				$input.parent().wrap('<div class="sf-ch-wrapper">');
			}
			else if(typeof($input.attr('id')) !== 'undefined')
			{
				var element = $('label[for="'+$input.attr('id')+'"]')
				if(element)
				{
					$this.vars.old = 'outside';
					element.addClass('sf-hide');
					$input.wrap('<label>').parent().append(element.html()).wrap('<div class="sf-ch-wrapper">');
				}
			}
			else
			{
				$this.vars.old = 'empty'
				$input.wrap('<div class="sf-ch-wrapper"><label class="sf-ch-only-checkbox">');
			}
			
			$input;
			
			if(typeof($input.attr('style')) != 'undefined')
				$input.closest('.sf-ch-wrapper').attr('style', $input.attr('style'));
			
			$input.closest('.sf-ch-wrapper label').prepend('<span tabindex="0" class="sf-ch-default">');
			$input.closest('.sf-ch-wrapper').find('.sf-ch-default').append('<span>');
			$input.addClass('sf-ch-styled sf-hide');
		}
    },
    
    _initAtributes: function()
    {
    	var $this = this;
		var $input = $this.element;
		
		//Add class to wrap
		if($.type($this.options.wrapClass) === "boolean")
		{
			if($this.options.wrapClass === true)
				if($input.data('class'))
					$input.closest('.sf-ch-wrapper').addClass($input.data('class'));
		}
		else if($.type($this.options.wrapClass) === "string")	
			$input.closest('.sf-ch-wrapper').addClass($this.options.wrapClass);
		else if($.type($this.options.wrapClass) === "null"){}
		else
			console.exception('Wrong value for param wrapClass is have to be string or boolean.');
    	
    	//Add title to wrap or set from input
		if($.type($this.options.wrapTitle) === "boolean")
		{
			if($this.options.wrapTitle === true)
			{
				$input.closest('.sf-ch-wrapper').attr('title', $input.attr('title'));
			}
		}
		else if($.type($this.options.wrapTitle) === "string")
		{
			$input.closest('.sf-ch-wrapper').attr('title', $this.options.wrapTitle);
		}
		else if($.type($this.options.wrapTitle) === "null"){}
		else
		{
			console.exception('Wrong value for wrapTitle is have to be string or boolean');
		}
    },
    
    _initEvents: function()
    {
    	var $this = this;
		var $input = $this.element;

		$input.off('change.sf-checkbox').on('change.sf-checkbox', function(){
			if($input.prop('disabled') !== true)
			{
				$this._trigger( "onClick", null, $input);
				$this._change();
				$this._trigger( "onChange", null, $input);
			}
		});

		$input.closest('.label').find('a').off('click.sf_anchors_checkbox').on('click.sf_anchors_checkbox', function(e)
		{
			if(!$input.prop('disabled') !== true)
			{
				if($(this).attr('target') == '_blank')
					window.open($(this).attr('href'));
				else
					window.location.href = $(this).attr('href');
			}
			
			e.preventDefault();
			e.stopPropagation();
		});
		
		$input.closest('label').find('.sf-ch-default').off('keydown.sf_checkbox').on('keydown.sf_checkbox', function(event)
		{
			if(this === document.activeElement)
			{
				switch ( event.keyCode ) {
				case 32:	
						$(this).closest('label').click();
						event.preventDefault();
						break;
				case 13:	
					if($(this).closest('form').length)
						$(this).closest('form').submit();
					return false;
					break;
				default: break;
				}
			}
		});
		
		if($input.data().hover === true || $this.options.hover)
		{
			$input.closest('.sf-ch-wrapper').off('mouseenter.sf_checkbox').on('mouseenter.sf_checkbox', function(event)
			{
				if($input.prop('disabled') !== true)
				{
					$(this).addClass('sf-ch-hover');
					$this._trigger( "onEnter", event, $input);
				}
			})
			.off('mouseleave.sf_checkbox').on('mouseleave.sf_checkbox', function(event)
			{
				if($input.prop('disabled') !== true)
				{
					$(this).removeClass('sf-ch-hover');
					$this._trigger( "onLeave", event, $input);
				}
			});
		}
    },
    
    _initObserver: function()
    {
    	var $this = this;
		var $input = $this.element;
    	
    	callback = function(mutationList, observer)
    	{
    		$this._update();
    	};
    	
    	var observerOptions = {
		  childList: true,
		  attributes: true,
		  subtree: true
		}
    	
    	$this.vars.observer = new MutationObserver(callback);
    	$this.vars.observer.observe($this.element[0], observerOptions);
    },
    
	_update: function()
	{
		var $this = this;
		var $input = $this.element;
		
		$this._initAtributes();
		
		if($input.prop('disabled') === true)
		{
			$input.closest('.sf-ch-wrapper').addClass('sf-ch-disabled');
		}
		else
		{
			$input.closest('.sf-ch-wrapper').removeClass('sf-ch-disabled');
		}
		
		$this._change();

		if($input.hasClass($this.options.errorClass))
		{
			$input.closest('.sf-ch-wrapper').addClass($this.options.errorClass);
		}
		else
		{
			$input.closest('.sf-ch-wrapper').removeClass($this.options.errorClass);
		}
	},
	
	_change: function()
	{
		var $this = this;
		var $input = $this.element;
		
		if($input.prop('checked') === true)
		{
			$input.addClass('sf-ich-clicked').closest('.sf-ch-wrapper').addClass('sf-ch-clicked');
		}
		else
		{
			$input.removeClass('sf-ich-clicked').closest('.sf-ch-wrapper').removeClass('sf-ch-clicked');
		}
		
	},
	
	update: function()
	{
		this._update();
	},
	
	_destroy:function()
	{
		if(this.vars.observer)
			this.vars.observer.disconnect();
		
		this.element.removeClass('sf-ch-styled sf-hide');
		this.element.removeData(this.widgetFullName);
		this.element.off('change.sf-checkbox');
		
		switch (this.vars.old) {
			case 'inner':
				old = this.element.closest('label').off('keydown.sf-checkbox');
				old.find('.sf-ch-default').remove();
				break;
			case 'outside':
				$('label[for="'+this.element.attr('id')+'"]').removeClass('sf-hide');
				old = this.element;
				break;
			default:
				old = this.element;
				break;
		}
		
		this.element.closest('.sf-ch-wrapper').replaceWith(old);
	},
	destroy:function(){this._destroy();},
	
	_refresh:function()
	{
		this._destroy();
		this._create();
	},
	refresh:function(){this._refresh();}
});

$.widget( "SuperForm.fileUploaderStyle", {
	
	options: {
		ignoredClass:null,
		class:{
			wrap:"",
			btn:""
		},
		btn:{
			name: "Dodaj plik",
			icon: ""
		},
		file:
		{
			not_selected: "Nie wybrano pliku"
		}
    },
	
    _create: function() {
		var $this = this;
		var $input = $this.element;
		this.handlers = {};
		
		if($input.attr('type') !== 'file' || $input.hasClass($this.options.ignoredClass) || $input.hasClass('sf-file-uploader-input'))
			return false;
		
		//Utowrzenie html dla przycisku
		this.handlers.btn =  this.element.wrap('<div class="sf-file-upload"></div>').wrap('<div class="sf-file-upload-btn-wrap"></div>').wrap('<a class="sf-file-upload-btn-handler">'+this.options.btn.name+'</a>').parent();
		
		if($input.is(':disabled'))
			this.handlers.btn.addClass('disabled');
		
		this.handlers.wrap = this.handlers.btn.parent();
		
		this.handlers.btn.prepend(this.options.btn.icon);
		this.handlers.file = this.handlers.wrap.parent().append('<span class="sf-file-upload-file-name">'+this.options.file.not_selected+'</span>').find('.sf-file-upload-file-name');
		
		//Dodanie dodatkowych klas
		this.handlers.wrap.addClass(this.options.class.wrap);
		this.handlers.btn.addClass(this.options.class.btn);
		
		//Ukrycie inputa
		$input.addClass('sf-file-uploader-input');
		
		//Ustawienie tab indexu żeby nie obowiązywał
		$input.attr('tabindex', -1);
		
		this._handleFileChange();
		this._setOptions(this.options);
	},
	
	_handleFileChange: function()
	{
		var $this = this;
		$this.element.off('change.fileUploadBtn').on('change.fileUploadBtn', function()
		{
			$this.handlers.file.html($(this).val());
		});
	},
	
	_destroy: function(){
		this.element.removeClass('sf-file-uploader-input');
		this.options.handlers.wrap.replaceWith(this.element);
		this.options.handlers.btn.remove();
	},
	destroy:function(){this._destroy();}
});