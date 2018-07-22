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
				search: "Wyszukaj"
			},
			no_results: "Brak wyników."
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
		var $this = this;
		$this.element.old = $this.element.clone();
		$this.element.addClass('sf-s-initialized');
		
		var $select = $this.element;
		
		if($select.hasClass('sf-s-styled'))
		{
			if($this.element.find('option').length !== $this.element.old.find('option').length && $this.element.old)
			{
				$this._refresh();
			}
		}

		if(!$select.is('select') || $select.hasClass($this.options.ignoredClass) || $select.hasClass('sf-s-styled'))
		{
			$this.destroy();
			return false;
		}
		
		if(typeof($this.options.onlyClass) != 'undefined')
		{	
			if($this.options.onlyClass !=  null)
			{
				if(!$select.hasClass($this.options.onlyClass))
				{
					$this._destroy();
					return false;
				}
			}
		}
			
		if(!$select.hasClass('sf-s-styled'))
		{
			this._renderMenu();
			this._renderItem();
			
			$select.addClass('sf-s-styled sf-hide');
		}
		
		$this._trigger( "onCreate", null, $select);
		$this._setUpList();
		if($select.is(':disabled'))
		{
			$select.closest('.sf-s-wrapper').addClass('sf-s-disabled');
		}
		else	
		{
			if($this.options.isClickable)
			{
				$select.closest('.sf-s-wrapper').find('p.sf-s-holder').addClass('sf-s-click-able');
				$select.closest('.sf-s-wrapper').find('p.sf-s-holder').off('click.i_select').on('click.i_select',function(event)
				{
					if($select.hasClass('sf-s-list-is-open'))
						$this._close();
					else
						$this._open();
					
					event.stopPropagation();
					return false;
				});
				
				$select.closest('.sf-s-wrapper').find('p.sf-s-holder .sf-s-button').off('click.i_select').on('click.i_select',function(event)
				{
					$(this).parent('p.sf-s-holder').click();
					event.stopPropagation();
					return false;
				});
			}
			else
			{
				$select.closest('.sf-s-wrapper').find('p.sf-s-holder .sf-s-button').off('click.i_select').on('click.i_select',function(event)
				{	
					if($select.hasClass('sf-s-list-is-open'))
						$this._close();
					else
						$this._open();
					
					event.stopPropagation();
					return false;
				});
			}

			if($this.options.hover)
			{
				if($this.options.isClickable === true)
				{
					$select.closest('.sf-s-wrapper').find('p.sf-s-holder').off('mouseenter.i_select').on('mouseenter.i_select', function(event)
					{
						$(this).addClass('sf-s-hover');
						$this._trigger( "onEnter", event, $select);
					});

					$select.closest('.sf-s-wrapper').find('p.sf-s-holder').off('mouseleave.i_select').on('mouseleave.i_select', function(event)
					{
						$(this).removeClass('sf-s-hover');
						$this._trigger( "onLeave", event, $select);
					});
				}
				else
				{
					$select.closest('.sf-s-wrapper').find('p.sf-s-holder .sf-s-button').off('mouseenter.i_select').on('mouseenter.i_select', function(event)
					{
						$(this).addClass('sf-s-hover');
						$this._trigger( "onEnter", event, $select);
					});

					$select.closest('.sf-s-wrapper').find('p.sf-s-holder .sf-s-button').off('mouseleave.i_select').on('mouseleave.i_select', function(event)
					{
						$(this).removeClass('sf-s-hover');
						$this._trigger( "onLeave", event, $select);
					});
				}
			}
			
			if($this.options.absolute)
				var $listWraper = $('#sf-s-list-'+$this.uuid);
			else
				$listWraper = $select.closest('.sf-s-wrapper');
			
			$listWraper.find('ul.sf-s-list-inner li.sf-s-default').each(function()
			{
				$(this).not('.sf-s-option-disabled').off('mouseenter.i_select').on('mouseenter.i_select', function()
				{
					$listWraper.find('ul.sf-s-list-inner li.sf-s-default').removeClass('sf-s-hover');
					$(this).addClass('sf-s-hover');
				});

//				$(this).not('.sf-s-option-disabled').off('mouseleave.i_select').on('mouseleave.i_select', function()
//				{
//					$(this).removeClass('sf-s-hover');
//				});

				$(this).off('click.i_select').on('click.i_select', function(event)
				{
					if($(this).hasClass('sf-s-active'))
					{
						$this._close();
					}
					else if($(this).hasClass('sf-s-option-disabled'))
					{
						event.preventDefault();
						event.stopPropagation();
					}
					else
					{
						var clone = $(this).clone();
						clone.find('input[disabled]').remove();
						$this._close();
						$listWraper.find('ul.sf-s-list-inner li.sf-s-active').removeClass('sf-s-active');
						$select.closest('.sf-s-wrapper').find('p.sf-s-holder a').html($.trim(clone.html().replace(/&nbsp;/g,'')));
						$(this).addClass('sf-s-active');
						$select.val($(this).find('input').val()).change();
						if(typeof($select.closest('form')) != 'undefined' && $.isFunction($select.valid))
						{
							var validator = $.data($select.closest('form')[0], "validator" );
							if(validator && Object.keys(validator.submitted).length > 0)
							{
								$select.valid();
								if($select.hasClass(validator.settings.errorClass))
									$select.closest('.sf-s-wrapper').addClass(validator.settings.errorClass);
								else
									$select.closest('.sf-s-wrapper').removeClass(validator.settings.errorClass);
							}
						}
						$this._trigger( "onChange", null, $select);
					}
					$this._trigger( "onSelect", event, $select);
				});
			});
			
			this._addKeyboardEvent();
			
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
	
	_destroy:function()
	{
		this.element.removeData();
		this.element.removeClass('sf-s-styled');
		this.element.closest('.sf-s-wrapper').replaceWith(this.element.old);
	},
	destroy:function(){this._destroy();this._super();},
	
	_setOption: function(key, value) {
        this._super( key, value );
    },
	
	_getOption: function(key) {
		return this.options[key];
    },
	
    _setOptions: function( options ) {
		this._super(options);
    },
	
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
		
		var minWidth = 0;
		var paddingListElement = 0;
		
		var list;
		var clone = $select.closest('.sf-s-wrapper').clone().css('width', 'auto').appendTo('body');
		if(this.options.absolute)
		{
			list = $("#sf-s-list-"+$this.uuid);
			var cloneList = list.clone().appendTo('body');
		}
		else
		{
			list = $select.closest('.sf-s-wrapper');
		}
		
		var holder = clone.find('p.sf-s-holder');
		
		var listElements;
		if($this.options.absolute)
		{
			listElements = cloneList.find('ul.sf-s-list-inner .sf-s-default, ul.sf-s-list-inner .sf-s-optgroup-label');
		}
		else
		{
			listElements = clone.find('ul.sf-s-list-inner .sf-s-default, ul.sf-s-list-inner .sf-s-optgroup-label');
		}
		
		clone.find('ul.sf-s-list').css({width: 'auto'});
		listElements.css({position: 'absolute',width: 'auto', overflow: 'visible', fontSize: holder.find('a').css('font-size'), fontWeight: holder.find('a').css('font-weight')});
		
		if(listElements.length > 0)
		{
			listElements.each(function(index, element)
			{
				if(element.scrollWidth > minWidth)
					minWidth = element.scrollWidth+3;
			});
			
			if(listElements.closest('.sf-s-list').hasClass('sf-s-overflow'))
					minWidth = parseInt(minWidth)+20;
		}
		paddingListElement = listElements.innerWidth()-listElements.width();
		
		if($select.prop('style').width.toString().length > 0 || $select.prop('style')['max-width'].toString().length > 0 || window.getComputedStyle($select[0]).width != 'auto')
		{
			if($select.prop('style')['max-width'].toString().length > 0)
				var selectWidth = Math.ceil(parseInt($select.prop('style')['max-width'].toString()));
			else if($select.prop('style').width.toString().length > 0)
				var selectWidth = Math.ceil(parseInt($select.prop('style').width.toString()));
			else
				var selectWidth = window.getComputedStyle($select[0]).width;
			
			$select.closest('.sf-s-wrapper').css('width', selectWidth);
			selectWidth = $select.closest('.sf-s-wrapper').outerWidth();
			if(minWidth > selectWidth)
				list.find('.sf-s-list').css('width', minWidth);
		}
		else
		{
			var width = Math.ceil(holder.outerWidth(false))-Math.ceil(holder.width())+minWidth-paddingListElement;
			$select.closest('.sf-s-wrapper').width(width);
		}
		
		if($select.closest('.sf-s-wrapper').offset().left+minWidth > $('body').offset().left+$('body').width())
			list.find('.sf-s-list').addClass('sf-s-list-to-right');
		else
			list.find('.sf-s-list').removeClass('sf-s-list-to-right');
		
		if($this.options.absolute)
		{
			list.find('.sf-s-list').css({width: minWidth+"px"});
//			list.find('.sf-s-list').css({width: $select.closest('.sf-s-wrapper').width()+"px"});
			cloneList.remove();
		}
		
		clone.remove();
	},
	
	_setUpList:function()
	{
		var $this = this;
		if($this.options.absolute)
		{
			var $list = $("#sf-s-list-"+this.uuid);
			
			$(document).off('selectHide').on('selectHide', function()
			{
				$('.sf-s-list-wrap-absolute').each(function()
				{
					var $select2 = $("#sf-s-select-"+$(this).attr('id').replace('sf-s-list-',''));
					if(typeof($select2.offset()) != 'undefined')
					{
						$(this).css({
							left: $select2.offset().left+"px",
							top: $select2.offset().top+$select2.outerHeight()+"px"
						});
					}
				});
			});

			if(interval != null)
				clearInterval(interval);
			
			var interval = setInterval(function(){
				$(document).trigger('selectHide');
			}, 1000/15);
		}
		else
		{
			var $list = this.element.closest('.sf-s-wrapper');
		}
		
		$list.find('.sf-s-list').removeClass('sf-hide').removeClass('sf-s-overflow').css({height: 'auto', top: 'auto'});
		
		if($list.find('.sf-s-list ul.scrollbar-formated-default'))
			$list.find('.sf-s-list ul.scrollbar-formated-default').css('max-height', 'none');
		
		if(Math.ceil(this.options.maxListElement) > 0)
		{
			var $lengthVisible = Math.ceil($list.find('.sf-s-list .sf-s-default:visible').length)+Math.ceil($list.find('.sf-s-list .sf-s-optgroup:visible').length);
			if($lengthVisible > Math.ceil(this.options.maxListElement))
			{
				$list.find('.sf-s-list').addClass('sf-s-overflow');
				$list.find('.sf-s-list').height(Math.ceil(this.options.maxListElement)*$list.find('ul.sf-s-list-inner li.sf-s-default').outerHeight());
			}
		}
		
		if(Math.ceil(this.element.data().maxlistelement) > 0)
		{
			var $lengthVisible = Math.ceil($list.find('.sf-s-list .sf-s-default:visible').length)+Math.ceil($list.find('.sf-s-list .sf-s-optgroup:visible').length);
			if($lengthVisible > Math.ceil(this.element.data().maxlistelement))
			{
				$list.find('.sf-s-list').addClass('sf-s-overflow');
				$list.find('.sf-s-list').height(Math.ceil(this.element.data().maxlistelement)*$list.find('ul.sf-s-list-inner li.sf-s-default').outerHeight());
			}
		}

		var listHeight = Math.ceil($list.find('.sf-s-list').outerHeight());
		
		if(this.options.window)
		{
			var upHeight = Math.ceil(this.element.closest('.sf-s-wrapper').offset().top-$(window).scrollTop());
			var downHeight = Math.ceil($(window).height()-(this.element.closest('.sf-s-wrapper').offset().top+this.element.closest('.sf-s-wrapper').outerHeight()-$(window).scrollTop()));
		}
		else
		{
			var upHeight = Math.ceil($list.offset().top);
			var downHeight = Math.ceil(this.element.closest('body').height()-$list.find('.sf-s-list').offset().top);
		}

		if(downHeight < listHeight)
		{
            if(upHeight < listHeight)
            {
                if(upHeight > downHeight)
                {
                    var maxelement = Math.ceil(upHeight/$list.find('ul.sf-s-list-inner li.sf-s-default').outerHeight())-1;
					
					if(maxelement === 0)
                       maxelement = 1;
                   
				    maxelement = Math.ceil(maxelement*$list.find('ul.sf-s-list-inner li.sf-s-default').outerHeight());
					
                    $list.find('.sf-s-list').addClass('sf-s-overflow');
                    listHeight = Math.ceil($list.find('.sf-s-list').css('height', maxelement).outerHeight());
					
					if($this.options.absolute)
					{
						$(document).off('selectHide').on('selectHide', function()
						{
							$list.css({
								left: $this.element.closest('.sf-s-wrapper').offset().left+"px",
								top: $this.element.closest('.sf-s-wrapper').offset().top+"px"
							});
						});
					}
					
					$list.addClass('sf-s-to-top');
                    $list.find('.sf-s-list').css('top', '-'+listHeight+'px');
                }
                else
                {
                    var maxelement = Math.ceil(downHeight/$list.find('ul.sf-s-list-inner li.sf-s-default').outerHeight())-1;
                    
                    if(maxelement === 0)
                       maxelement = 1;
                   
					maxelement = Math.ceil(maxelement*$list.find('ul.sf-s-list-inner li.sf-s-default').outerHeight());
                    $list.find('.sf-s-list').addClass('sf-s-overflow');
					
					$list.removeClass('sf-s-to-top');
                    $list.find('.sf-s-list').css('height', maxelement);
                }
            }
            else
            {
				if($this.options.absolute)
				{
					$(document).off('selectHide').on('selectHide', function()
					{
						$list.css({
							left: $this.element.closest('.sf-s-wrapper').offset().left+"px",
							top: $this.element.closest('.sf-s-wrapper').offset().top+"px"
						});
					});
				}
				
                $list.addClass('sf-s-to-top');
                $list.find('.sf-s-list').css('top', '-'+listHeight+'px');
            }
		}
		else
		{	
			$list.removeClass('sf-s-to-top');
			$list.find('.sf-s-list');
		}
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
		
		var $this = this;
		var $select = this.element;
		
		if($select.hasClass('sf-s-list-is-open'))
			return false;
		
		$('select.sf-s-styled').selectStyle('close');
		
		$('html body').on('click.i_select', function()
		{
			$this._close();
		});
		
		this._setUpList();
		
		$select.addClass('sf-s-list-is-open');
		$select.closest('.sf-s-wrapper').find('p.sf-s-holder').addClass('sf-s-list-open');
		
		var $selected;
		
		if($this.options.absolute)
		{
			$selected = $("#sf-s-list-"+$this.uuid).find('.sf-s-default.sf-s-active');
		}
		else
		{
			$selected = $select.closest('.sf-s-wrapper').find('.sf-s-default.sf-s-active');
		}
		
		if($selected)
		{
			var list;
			
			if($this.options.absolute)
			{
				list = $("#sf-s-list-"+$this.uuid).find('.sf-s-list.sf-s-overflow');
			}
			else
			{
				list = $select.closest('.sf-s-wrapper').find('.sf-s-list.sf-s-overflow');
			}

			if(list && $selected.length)
			{
				list.scrollTop(0);
				list.scrollTop($selected.position().top-list.height()+$select.outerHeight(true));
			}
		}
		
		if($this.options.absolute)
		{
			
			var zIndexs = [];
			$select.parents().each(function()
			{
				if(!isNaN(parseInt($(this).css('z-index'))))
				{
					zIndexs.push(parseInt($(this).css('z-index')));
				}
			});
			
			var zIndex = Math.max.apply(Math,zIndexs);;
			$("#sf-s-list-"+$this.uuid).find('.sf-s-list').removeClass('sf-hide-opacity').attr('tabindex', '1');
			
			if(!isNaN(zIndex))
			{
				$("#sf-s-list-"+$this.uuid).css({'zIndex': zIndex});
			}
		}
		else 
		{
			$select.closest('.sf-s-wrapper').find('.sf-s-list').removeClass('sf-hide-opacity').attr('tabindex', '1').focus();
		}
	},
	
	_close:function()
	{
		var $this = this;
		if(!this.element.hasClass('sf-s-list-is-open'))
			return false;
		
		this.element.removeClass('sf-s-list-is-open');
		this.element.closest('.sf-s-wrapper').find('p.sf-s-holder').removeClass('sf-s-list-open');
		this.element.closest('.sf-s-wrapper').find('p.sf-s-holder .sf-s-button').removeClass('sf-s-list-open');
		
		var list;
		if($this.options.absolute)
		{
			list = $("#sf-s-list-"+this.uuid);
		}
		else
		{
			list = this.element.closest('.sf-s-wrapper');
		}
		
		list.find('.sf-s-list').addClass('sf-hide-opacity').attr('tabindex', '0');
		$('html body').off('click.i_select');
	},
	close:function(){this._close();},
	
	_renderMenu:function(){
		var $this = this;
		var $select = this.element;
		
		$select.wrap('<div id="sf-s-select-'+$this.uuid+'" data-id="'+$this.uuid+'" class="sf-s-wrapper">');
			
		//Add class to input
		if($.type($this.options.inputClass) === "string")
			$select.addClass($this.options.inputClass).closest('.sf-s-wrapper');
		else if($.type($this.options.inputClass) === "null"){}
		else
			console.exception('Wrong value for inputClass is have to be string.');

		var $class = '';
		//Add class to wrap
		if($.type($this.options.wrapClass) === "boolean")
		{
			if($this.options.wrapClass === true)
			{
				var classList = $select.attr('class').split(/\s+/);
				$.each(classList, function(index, item) {
					$select.closest('.sf-r-wrapper').addClass('sf-s-class-'+item);
				});
			}
		}
		else if($.type($this.options.wrapClass) === "string")	
			$class = $this.options.wrapClass;
		else if($.type($this.options.wrapClass) === "null"){}
		else
			console.exception('Wrong value for wrapClass is have to be string.');

		if($select.data().class)
			$class = $select.data().class;

		$select.closest('.sf-s-wrapper').addClass($class);

		//Add title to wrap or set from input
		if($.type($this.options.wrapTitle) === "boolean")
		{
			if($this.options.wrapTitle === true)
				$select.closest('.sf-s-wrapper').attr('title', $select.attr('title'));
		}
		else if($.type($this.options.wrapTitle) === "string")
		{
			$select.closest('.sf-s-wrapper').attr('title', $this.options.wrapTitle);
		}
		else if($.type($this.options.wrapTitle) === "null"){}
		else
		{
			console.exception('Wrong value for wrapTitle check documentation at www.agendo.pl');
		}

		$select.closest('.sf-s-wrapper').append('<p class="sf-s-holder">');
		$select.closest('.sf-s-wrapper').find('p.sf-s-holder').append('<a href="javascript:void(0)">');
		$select.closest('.sf-s-wrapper').find('p.sf-s-holder').append('<span class="sf-s-button">');
		
//		console.log($this.uuid+' '+$this.options.absolute);
		if($this.options.absolute)
		{
			$('body').append('<div id="sf-s-list-'+$this.uuid+'" class="sf-s-list-wrap-absolute '+$class+'"><div class="sf-s-list sf-hide-opacity"><ul class="sf-s-list-inner scrollbar-formated-default"></ul></div></div>');
		}
		else
		{
			$select.closest('.sf-s-wrapper').append('<div class="sf-s-list sf-hide-opacity"><ul class="sf-s-list-inner scrollbar-formated-default"></ul></div>');
		}
	},
	
	_renderItem:function()
	{
		var $this = this;
		$this.element.children('option, optgroup').each(function()
		{
			var $thisO = $(this);
			if($(this).is('option'))
			{
				var is_selected = '', is_disabled = '';
				
				var clone = $(this).clone();
				clone.find('input[disabled]').remove();
				var html = clone.html();
				if($(this).data().icon)
					html = $(this).data().icon+html;
				
				if($(this).is(':selected'))
				{
					is_selected = ' sf-s-active sf-s-hover';
					$this.element.closest('.sf-s-wrapper').find('p.sf-s-holder a').html($.trim(html.replace(/&nbsp;/g,'')));
				}
				
				if($(this).is(':disabled'))
				{
					is_disabled = ' sf-s-option-disabled';
				}
				
				if($this.options.absolute)
				{
					if(!($this.element.data().active_not_show_on_list && $(this).is(':selected')))
					{
						
						var optionAdded = $('<li class="sf-s-default'+is_selected+is_disabled+'"><input type="hidden" disabled value="'+$(this).val()+'" />'+html+'</li>').appendTo($('#sf-s-list-'+$this.uuid).find('ul.sf-s-list-inner'));
						if(typeof($thisO.attr('class')) != 'undefined')
						{
							optionAdded.addClass($thisO.attr('class'));
						}
						optionAdded = null;
					}
						
				}
				else
				{
					if(!($this.element.data().active_not_show_on_list && $(this).is(':selected')))
					{	
						var optionAdded = $('<li class="sf-s-default'+is_selected+is_disabled+'"><input type="hidden" disabled value="'+$(this).val()+'" />'+html+'</li>').appendTo($this.element.closest('.sf-s-wrapper').find('ul.sf-s-list-inner'));
						if(typeof($thisO.attr('class')) != 'undefined')
						{
							optionAdded.addClass($thisO.attr('class'));
						}
						optionAdded = null;
					}
				}
			}
			else
			{
				var $wrap = $('<li></li>').addClass('sf-s-optgroup').append('<ul class="sf-s-optgroup-list"></ul>');
				if($(this).attr('label').length > 0)
					$wrap.find('ul').append('<li><p class="sf-s-optgroup-label">'+$(this).attr('label')+'</p></li>');

				$(this).find('option').each(function()
				{
					var $thisO = $(this);
					var is_selected = '', is_disabled = '';
					var html = $(this).html();
					if($(this).data().icon)
						html = $(this).data().icon+html;
					
					if($(this).is(':selected'))
					{
						is_selected = ' sf-s-active sf-s-hover';
						$this.element.closest('.sf-s-wrapper').find('p.sf-s-holder a').html(html);
					}
					
					if($(this).is(':disabled'))
					{
						is_disabled = ' sf-s-option-disabled';
					}
					
					if(!($this.element.data().active_not_show_on_list && $(this).is(':selected')))
					{
						var optionAdded = $('<li class="sf-s-default'+is_selected+is_disabled+'"><input type="hidden" disabled value="'+$(this).val()+'" />'+html+'</li>').appendTo($wrap.find('ul'));
						if(typeof($thisO.attr('class')) != 'undefined')
						{
							optionAdded.addClass($thisO.attr('class'));
						}
						optionAdded = null;
					}
				});

				if($this.options.absolute)
				{
					$('#sf-s-list-'+$this.uuid).find('ul.sf-s-list-inner').append($wrap);
				}
				else {
					$this.element.closest('.sf-s-wrapper').find('ul.sf-s-list-inner').append($wrap);
				}
			}
		});
	}
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
			$input.closest('.sf-r-wrapper').off('mouseenter.i_radio').on('mouseenter.sf_radio', function(event)
			{
				if($input.prop('disabled') != true)
				{
					$(this).addClass('sf-r-hover');
					$this._trigger( "onEnter", event, $input);
				}
			});

			$input.closest('.sf-r-wrapper').off('mouseleave.i_radio').on('mouseleave.sf_radio', function(event)
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
		this.element.removeClass('sf-r-styled');
		this.element.removeData(this.widgetFullName);
		this.element.closest('.sf-r-wrapper').replaceWith(this.element);
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
		
		$input.closest('label').find('.sf-ch-default').off('keydown.sf_radio').on('keydown.sf_radio', function(event)
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
			});

			$input.closest('.sf-ch-wrapper').off('mouseleave.sf_checkbox').on('mouseleave.sf_checkbox', function(event)
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
		
		switch (this.vars.old) {
			case 'inner':
				old = this.element.closest('label').off('click.i_checkbox');
				old.find('a').remove();
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