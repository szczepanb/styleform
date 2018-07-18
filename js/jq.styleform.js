$.widget( "Imperial.styleForm", {
	options: {
        checkbox: {
			use: true,
			hover:false,
			disabled: false,
			wrapClass: true,
			inputClass: null,
			wrapTitle: true,
			ignoredClass:'i-ch-ignored',
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
			ignoredClass:'i-ignored-select',
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
			$this.element.find('input[type="checkbox"]').checkboxStyle(options.checkbox);
		if(options.radio.use)
			$this.element.find('input[type="radio"]').radioStyle(options.radio);
		
		if(options.select.use)
		{	
			$this.element.find('select').not('.i-s-styled').each(function()
			{
				if($(this).hasClass('i-s-initialized'))
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
//				$this.element.find('input.i-ch-styled[type="checkbox"]').checkboxStyle('update');
			}
			
			if(options.checkbox.use)
			{
				$this.element.find('input[type="checkbox"]').not('.i-ch-styled').checkboxStyle(options.checkbox);
			}
			
			if(options.radio.use)
			{
				$this.element.find('input[type="radio"]').not('.i-r-styled').radioStyle(options.radio);
			}
			
			if(options.select.use)
			{			
				$this.element.find('select').not('.i-s-styled').not("."+$this.options.select.ignoredClass).each(function()
				{
					if($(this).hasClass('i-s-initialized') && typeof($(this).data('ImperialSelectStyle')) != 'undefined')
						$(this).selectStyle('destroy');
					
					$(this).selectStyle(options.select);
				});
			}
			
			if(options.fileUploader.use)
			{
				$this.element.find('input[type="file"]').not('.i-s-styled').fileUploaderStyle(options.fileUploader);
			}
		});
		
		setInterval(function(){
			$(document).trigger('domChange.'+$this.uuid);
		}, 50);
		
		if(this.element.is('form'))
			this._initValidationAdditionalEvent(this.element);
		else
			this._initValidationAdditionalEvent(this.element.find('form'));
    },
	
	_destroy: function(){
		if(this.options.checkbox.use)
			this.element.find('input[type="checkbox"]').checkboxStyle("destroy");
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
								$(error).closest('.i-s-wrapper').addClass(validator.settings.errorClass);
							else if($(error).is(':radio'))
								$(error).closest('.i-r-wrapper').addClass(validator.settings.errorClass);
							else if($(error).is(':checkbox'))
								$(error).closest('.i-ch-wrapper').addClass(validator.settings.errorClass);
						}
						else
						{
							if($(error).is('select'))
								$(error).closest('.i-s-wrapper').removeClass(validator.settings.errorClass);
							else if($(error).is(':radio'))
								$(error).closest('.i-r-wrapper').removeClass(validator.settings.errorClass);
							else if($(error).is(':checkbox'))
								$(error).closest('.i-ch-wrapper').removeClass(validator.settings.errorClass);
						}
					});
				}
			});
		});
	},
	initValidationAdditionalEvent:function(){this._initValidationAdditionalEvent($(this).find('form'));}
});

var interval = null;
$.widget("Imperial.selectStyle", {
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
		ignoredClass:null,
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
		$this.element.addClass('i-s-initialized');
		
		var $select = $this.element;
		
		if($select.hasClass('i-s-styled'))
		{
			if($this.element.find('option').length !== $this.element.old.find('option').length && $this.element.old)
			{
				$this._refresh();
			}
		}

		if(!$select.is('select') || $select.hasClass($this.options.ignoredClass) || $select.hasClass('i-s-styled'))
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
			
		if(!$select.hasClass('i-s-styled'))
		{
			this._renderMenu();
			this._renderItem();
			
			$select.addClass('i-s-styled i-hide');
		}
		
		$this._trigger( "onCreate", null, $select);
		$this._setUpList();
		if($select.is(':disabled'))
		{
			$select.closest('.i-s-wrapper').addClass('i-s-disabled');
		}
		else	
		{
			if($this.options.isClickable)
			{
				$select.closest('.i-s-wrapper').find('p.i-s-holder').addClass('i-s-click-able');
				$select.closest('.i-s-wrapper').find('p.i-s-holder').off('click.i_select').on('click.i_select',function(event)
				{
					if($select.hasClass('i-s-list-is-open'))
						$this._close();
					else
						$this._open();
					
					event.stopPropagation();
					return false;
				});
				
				$select.closest('.i-s-wrapper').find('p.i-s-holder .i-s-button').off('click.i_select').on('click.i_select',function(event)
				{
					$(this).parent('p.i-s-holder').click();
					event.stopPropagation();
					return false;
				});
			}
			else
			{
				$select.closest('.i-s-wrapper').find('p.i-s-holder .i-s-button').off('click.i_select').on('click.i_select',function(event)
				{	
					if($select.hasClass('i-s-list-is-open'))
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
					$select.closest('.i-s-wrapper').find('p.i-s-holder').off('mouseenter.i_select').on('mouseenter.i_select', function(event)
					{
						$(this).addClass('i-s-hover');
						$this._trigger( "onEnter", event, $select);
					});

					$select.closest('.i-s-wrapper').find('p.i-s-holder').off('mouseleave.i_select').on('mouseleave.i_select', function(event)
					{
						$(this).removeClass('i-s-hover');
						$this._trigger( "onLeave", event, $select);
					});
				}
				else
				{
					$select.closest('.i-s-wrapper').find('p.i-s-holder .i-s-button').off('mouseenter.i_select').on('mouseenter.i_select', function(event)
					{
						$(this).addClass('i-s-hover');
						$this._trigger( "onEnter", event, $select);
					});

					$select.closest('.i-s-wrapper').find('p.i-s-holder .i-s-button').off('mouseleave.i_select').on('mouseleave.i_select', function(event)
					{
						$(this).removeClass('i-s-hover');
						$this._trigger( "onLeave", event, $select);
					});
				}
			}
			
			if($this.options.absolute)
				var $listWraper = $('#i-s-list-'+$this.uuid);
			else
				$listWraper = $select.closest('.i-s-wrapper');
			
			$listWraper.find('ul.i-s-list-inner li.i-s-default').each(function()
			{
				$(this).not('.i-s-option-disabled').off('mouseenter.i_select').on('mouseenter.i_select', function()
				{
					$listWraper.find('ul.i-s-list-inner li.i-s-default').removeClass('i-s-hover');
					$(this).addClass('i-s-hover');
				});

//				$(this).not('.i-s-option-disabled').off('mouseleave.i_select').on('mouseleave.i_select', function()
//				{
//					$(this).removeClass('i-s-hover');
//				});

				$(this).off('click.i_select').on('click.i_select', function(event)
				{
					if($(this).hasClass('i-s-active'))
					{
						$this._close();
					}
					else if($(this).hasClass('i-s-option-disabled'))
					{
						event.preventDefault();
						event.stopPropagation();
					}
					else
					{
						var clone = $(this).clone();
						clone.find('input[disabled]').remove();
						$this._close();
						$listWraper.find('ul.i-s-list-inner li.i-s-active').removeClass('i-s-active');
						$select.closest('.i-s-wrapper').find('p.i-s-holder a').html($.trim(clone.html().replace(/&nbsp;/g,'')));
						$(this).addClass('i-s-active');
						$select.val($(this).find('input').val()).change();
						if(typeof($select.closest('form')) != 'undefined' && $.isFunction($select.valid))
						{
							var validator = $.data($select.closest('form')[0], "validator" );
							if(validator && Object.keys(validator.submitted).length > 0)
							{
								$select.valid();
								if($select.hasClass(validator.settings.errorClass))
									$select.closest('.i-s-wrapper').addClass(validator.settings.errorClass);
								else
									$select.closest('.i-s-wrapper').removeClass(validator.settings.errorClass);
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
					$select.closest('.i-s-wrapper').find('.i-s-list').addClass('i-hide');
				});
			}
			
			$listWraper.find('.i-s-list, .scroll-element').off('click.stopProp').on('click.stopProp', function(e)
			{
				e.stopPropagation();
			});
			
			$listWraper.find('.i-s-list').addClass('i-s-list-formated');
		}
    },
	create:function(){this._create();},
	
	_destroy:function()
	{
		this.element.removeData();
		this.element.removeClass('i-s-styled');
		this.element.closest('.i-s-wrapper').replaceWith(this.element.old);
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
		var clone = $select.closest('.i-s-wrapper').clone().css('width', 'auto').appendTo('body');
		if(this.options.absolute)
		{
			list = $("#i-s-list-"+$this.uuid);
			var cloneList = list.clone().appendTo('body');
		}
		else
		{
			list = $select.closest('.i-s-wrapper');
		}
		
		var holder = clone.find('p.i-s-holder');
		
		var listElements;
		if($this.options.absolute)
		{
			listElements = cloneList.find('ul.i-s-list-inner .i-s-default, ul.i-s-list-inner .i-s-optgroup-label');
		}
		else
		{
			listElements = clone.find('ul.i-s-list-inner .i-s-default, ul.i-s-list-inner .i-s-optgroup-label');
		}
		
		clone.find('ul.i-s-list').css({width: 'auto'});
		listElements.css({position: 'absolute',width: 'auto', overflow: 'visible', fontSize: holder.find('a').css('font-size'), fontWeight: holder.find('a').css('font-weight')});
		
		if(listElements.length > 0)
		{
			listElements.each(function(index, element)
			{
				if(element.scrollWidth > minWidth)
					minWidth = element.scrollWidth+3;
			});
			
			if(listElements.closest('.i-s-list').hasClass('i-s-overflow'))
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
			
			$select.closest('.i-s-wrapper').css('width', selectWidth);
			selectWidth = $select.closest('.i-s-wrapper').outerWidth();
			if(minWidth > selectWidth)
				list.find('.i-s-list').css('width', minWidth);
		}
		else
		{
			var width = Math.ceil(holder.outerWidth(false))-Math.ceil(holder.width())+minWidth-paddingListElement;
			$select.closest('.i-s-wrapper').width(width);
		}
		
		if($select.closest('.i-s-wrapper').offset().left+minWidth > $('body').offset().left+$('body').width())
			list.find('.i-s-list').addClass('i-s-list-to-right');
		else
			list.find('.i-s-list').removeClass('i-s-list-to-right');
		
		if($this.options.absolute)
		{
			list.find('.i-s-list').css({width: minWidth+"px"});
//			list.find('.i-s-list').css({width: $select.closest('.i-s-wrapper').width()+"px"});
			cloneList.remove();
		}
		
		clone.remove();
	},
	
	_setUpList:function()
	{
		var $this = this;
		if($this.options.absolute)
		{
			var $list = $("#i-s-list-"+this.uuid);
			
			$(document).off('selectHide').on('selectHide', function()
			{
				$('.i-s-list-wrap-absolute').each(function()
				{
					var $select2 = $("#i-s-select-"+$(this).attr('id').replace('i-s-list-',''));
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
			var $list = this.element.closest('.i-s-wrapper');
		}
		
		$list.find('.i-s-list').removeClass('i-hide').removeClass('i-s-overflow').css({height: 'auto', top: 'auto'});
		
		if($list.find('.i-s-list ul.scrollbar-formated-default'))
			$list.find('.i-s-list ul.scrollbar-formated-default').css('max-height', 'none');
		
		if(Math.ceil(this.options.maxListElement) > 0)
		{
			var $lengthVisible = Math.ceil($list.find('.i-s-list .i-s-default:visible').length)+Math.ceil($list.find('.i-s-list .i-s-optgroup:visible').length);
			if($lengthVisible > Math.ceil(this.options.maxListElement))
			{
				$list.find('.i-s-list').addClass('i-s-overflow');
				$list.find('.i-s-list').height(Math.ceil(this.options.maxListElement)*$list.find('ul.i-s-list-inner li.i-s-default').outerHeight());
			}
		}
		
		if(Math.ceil(this.element.data().maxlistelement) > 0)
		{
			var $lengthVisible = Math.ceil($list.find('.i-s-list .i-s-default:visible').length)+Math.ceil($list.find('.i-s-list .i-s-optgroup:visible').length);
			if($lengthVisible > Math.ceil(this.element.data().maxlistelement))
			{
				$list.find('.i-s-list').addClass('i-s-overflow');
				$list.find('.i-s-list').height(Math.ceil(this.element.data().maxlistelement)*$list.find('ul.i-s-list-inner li.i-s-default').outerHeight());
			}
		}

		var listHeight = Math.ceil($list.find('.i-s-list').outerHeight());
		
		if(this.options.window)
		{
			var upHeight = Math.ceil(this.element.closest('.i-s-wrapper').offset().top-$(window).scrollTop());
			var downHeight = Math.ceil($(window).height()-(this.element.closest('.i-s-wrapper').offset().top+this.element.closest('.i-s-wrapper').outerHeight()-$(window).scrollTop()));
		}
		else
		{
			var upHeight = Math.ceil($list.offset().top);
			var downHeight = Math.ceil(this.element.closest('body').height()-$list.find('.i-s-list').offset().top);
		}

		if(downHeight < listHeight)
		{
            if(upHeight < listHeight)
            {
                if(upHeight > downHeight)
                {
                    var maxelement = Math.ceil(upHeight/$list.find('ul.i-s-list-inner li.i-s-default').outerHeight())-1;
					
					if(maxelement === 0)
                       maxelement = 1;
                   
				    maxelement = Math.ceil(maxelement*$list.find('ul.i-s-list-inner li.i-s-default').outerHeight());
					
                    $list.find('.i-s-list').addClass('i-s-overflow');
                    listHeight = Math.ceil($list.find('.i-s-list').css('height', maxelement).outerHeight());
					
					if($this.options.absolute)
					{
						$(document).off('selectHide').on('selectHide', function()
						{
							$list.css({
								left: $this.element.closest('.i-s-wrapper').offset().left+"px",
								top: $this.element.closest('.i-s-wrapper').offset().top+"px"
							});
						});
					}
					
					$list.addClass('i-s-to-top');
                    $list.find('.i-s-list').css('top', '-'+listHeight+'px');
                }
                else
                {
                    var maxelement = Math.ceil(downHeight/$list.find('ul.i-s-list-inner li.i-s-default').outerHeight())-1;
                    
                    if(maxelement === 0)
                       maxelement = 1;
                   
					maxelement = Math.ceil(maxelement*$list.find('ul.i-s-list-inner li.i-s-default').outerHeight());
                    $list.find('.i-s-list').addClass('i-s-overflow');
					
					$list.removeClass('i-s-to-top');
                    $list.find('.i-s-list').css('height', maxelement);
                }
            }
            else
            {
				if($this.options.absolute)
				{
					$(document).off('selectHide').on('selectHide', function()
					{
						$list.css({
							left: $this.element.closest('.i-s-wrapper').offset().left+"px",
							top: $this.element.closest('.i-s-wrapper').offset().top+"px"
						});
					});
				}
				
                $list.addClass('i-s-to-top');
                $list.find('.i-s-list').css('top', '-'+listHeight+'px');
            }
		}
		else
		{	
			$list.removeClass('i-s-to-top');
			$list.find('.i-s-list');
		}
	},
	
	
	_initSearch: function()
	{
		var $this = this;
		var $select = $this.element;
		$select.closest('.i-s-wrapper').find('.i-s-list').prepend('<div class="i-s-search-input"><input type="text" placeholder="'+$this.options.lang.placeholders.search+'"></div>');
		
		$select.closest('.i-s-wrapper').find('p.i-s-holder').off('click.search').on('click.search', function(){
			$select.closest('.i-s-wrapper').find('.i-s-search-input input').focus();
		});
		
		$select.closest('.i-s-wrapper').find('.i-s-search-input input').off('keyup.search').on('keyup.search', function()
		{
			var reg = new RegExp($(this).val(), 'i');
			
			if($(this).val().length)
			{
				$select.closest('.i-s-wrapper').find('.i-s-list .i-s-default').each(function(iterator, element)
				{
					if(reg.test($(element).text().trim()))
					{
						$(element).removeClass('i-s-element-hide');
					}
					else
					{
						$(element).addClass('i-s-element-hide');
					}
					
					if($(element).closest('.i-s-optgroup').length)
					{
						if($(element).closest('.i-s-optgroup').find('.i-s-default:not(.i-s-element-hide)').length)
						{
							$(element).closest('.i-s-optgroup').show();
						}
						else
						{
							$(element).closest('.i-s-optgroup').hide();
						}
					}
				});
				
				if($select.closest('.i-s-wrapper').find('.i-s-list .i-s-default:visible').length == 0)
				{
					if($select.closest('.i-s-wrapper').find('.i-s-list .i-s-no-results').length == 0)
						$select.closest('.i-s-wrapper').find('.i-s-list').append('<li class="i-s-no-results" style=""><input disabled="" value="" type="hidden">'+$this.options.lang.no_results+'</li>');
				}
				else {
					$select.closest('.i-s-wrapper').find('.i-s-list .i-s-no-results').remove();
				}

			}
			else {
				$select.closest('.i-s-wrapper').find('.i-s-list .i-s-default').removeClass('i-s-element-hide');
			}
			
			$this._setUpList();
		});
		
	},

	_addKeyboardEvent: function()
	{
		var $select = this.element;
		
		$select.closest('.i-s-wrapper').find('.i-s-holder a').off('focusin.keyboard').on('focusin.keyboard', function()
		{
			$select.closest('.i-s-wrapper').addClass('i-s-focus');
		}).off('focusout.keyboard').on('focusout.keyboard',function()
		{
			$select.closest('.i-s-wrapper').removeClass('i-s-focus');
		});
		
		var ar=new Array(33,34,35,36,37,38,39,40);
		$select.closest('.i-s-wrapper').find('.i-s-holder a').off('keyup.keyboard').on('keyup.keyboard', function(e)
		{
			var code = e.keyCode || e.which;
			if(code == '38' || code == '37')
			{
				var $elements = $select.closest('.i-s-wrapper').find('.i-s-list .i-s-default:not(.i-s-option-disabled)');
				$elements.each(function(i, elem)
				{
					if($(elem).hasClass('i-s-active'))
					{
						if(i-1 >= 0)
						{
							$elements[i-1].click();
							return false;
						}
					}
				});
			}
			else if(code == '40' || code == '39')
			{
				var $elements = $select.closest('.i-s-wrapper').find('.i-s-list .i-s-default:not(.i-s-option-disabled)');
				$elements.each(function(i, elem)
				{
					if($(elem).hasClass('i-s-active'))
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
		
		$select.closest('.i-s-wrapper').find('.i-s-list').off('keyup.keyboard').on('keyup.keyboard', function(e)
		{
			var code = e.keyCode || e.which;
			if(code == '38' || code == '37')
			{
				var $elements = $select.closest('.i-s-wrapper').find('.i-s-list .i-s-default:not(.i-s-option-disabled)');
				$elements.each(function(i, elem)
				{
					if($(elem).hasClass('i-s-hover'))
					{
						$elements.removeClass('i-s-hover');
						if(i-1 >= 0)
						{
							$($elements[i-1]).addClass('i-s-hover');
						}
						else
						{
							$($elements[$elements.length-1]).addClass('i-s-hover');
						}
						return false;
					}
				});
				
			}
			else if(code == '40' || code == '39')
			{
				var $elements = $select.closest('.i-s-wrapper').find('.i-s-list .i-s-default:not(.i-s-option-disabled)');
				$elements.each(function(i, elem)
				{
					if($(elem).hasClass('i-s-hover'))
					{
						$elements.removeClass('i-s-hover');
						if(i+1 < $elements.length)
						{
							$($elements[i+1]).addClass('i-s-hover');
						}
						else
						{
							$($elements[0]).addClass('i-s-hover');
						}
						return false;
					}
				});
			}
			else if(code == '13')
			{
				$select.closest('.i-s-wrapper').find('.i-s-default.i-s-hover').click();
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
					var $elements = $select.closest('.i-s-wrapper').find('.i-s-list .i-s-default:not(.i-s-option-disabled)').filter(function()
					{
						return ($(this).text().toLowerCase().match('^'+searchWord.toLowerCase()));
					});
					
					if($elements.length > 0)
					{
						var not_select = true;
						$elements.each(function(index, elem)
						{
							if($(elem).hasClass('i-s-hover'))
							{
								$select.closest('.i-s-wrapper').find('.i-s-list .i-s-hover').removeClass('i-s-hover');
								if(index == $elements.length-1)
								{
									$elements.first().addClass('i-s-hover');
									not_select = false;
									return false;
									
								}
								else
								{
									$($elements[index+1]).addClass('i-s-hover');
									not_select = false;
									return false;
								}
							}
						});
						
						if(not_select)
						{
							$select.closest('.i-s-wrapper').find('.i-s-list .i-s-hover').removeClass('i-s-hover');
							$elements.first().addClass('i-s-hover');
						}
						
						var $selected = $select.closest('.i-s-wrapper').find('.i-s-list .i-s-hover')
						
						var list;
						if(list = $select.closest('.i-s-wrapper').find('.i-s-list.i-s-overflow'))
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
		
		if($select.hasClass('i-s-list-is-open'))
			return false;
		
		$('select.i-s-styled').selectStyle('close');
		
		$('html body').on('click.i_select', function()
		{
			$this._close();
		});
		
		this._setUpList();
		
		$select.addClass('i-s-list-is-open');
		$select.closest('.i-s-wrapper').find('p.i-s-holder').addClass('i-s-list-open');
		
		var $selected;
		
		if($this.options.absolute)
		{
			$selected = $("#i-s-list-"+$this.uuid).find('.i-s-default.i-s-active');
		}
		else
		{
			$selected = $select.closest('.i-s-wrapper').find('.i-s-default.i-s-active');
		}
		
		if($selected)
		{
			var list;
			
			if($this.options.absolute)
			{
				list = $("#i-s-list-"+$this.uuid).find('.i-s-list.i-s-overflow');
			}
			else
			{
				list = $select.closest('.i-s-wrapper').find('.i-s-list.i-s-overflow');
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
			$("#i-s-list-"+$this.uuid).find('.i-s-list').removeClass('i-hide-opacity').attr('tabindex', '1');
			
			if(!isNaN(zIndex))
			{
				$("#i-s-list-"+$this.uuid).css({'zIndex': zIndex});
			}
		}
		else 
		{
			$select.closest('.i-s-wrapper').find('.i-s-list').removeClass('i-hide-opacity').attr('tabindex', '1').focus();
		}
	},
	
	_close:function()
	{
		var $this = this;
		if(!this.element.hasClass('i-s-list-is-open'))
			return false;
		
		this.element.removeClass('i-s-list-is-open');
		this.element.closest('.i-s-wrapper').find('p.i-s-holder').removeClass('i-s-list-open');
		this.element.closest('.i-s-wrapper').find('p.i-s-holder .i-s-button').removeClass('i-s-list-open');
		
		var list;
		if($this.options.absolute)
		{
			list = $("#i-s-list-"+this.uuid);
		}
		else
		{
			list = this.element.closest('.i-s-wrapper');
		}
		
		list.find('.i-s-list').addClass('i-hide-opacity').attr('tabindex', '0');
		$('html body').off('click.i_select');
	},
	close:function(){this._close();},
	
	_renderMenu:function(){
		var $this = this;
		var $select = this.element;
		
		$select.wrap('<div id="i-s-select-'+$this.uuid+'" data-id="'+$this.uuid+'" class="i-s-wrapper">');
			
		//Add class to input
		if($.type($this.options.inputClass) === "string")
			$select.addClass($this.options.inputClass).closest('.i-s-wrapper');
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
					$select.closest('.i-r-wrapper').addClass('i-s-class-'+item);
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

		$select.closest('.i-s-wrapper').addClass($class);

		//Add title to wrap or set from input
		if($.type($this.options.wrapTitle) === "boolean")
		{
			if($this.options.wrapTitle === true)
				$select.closest('.i-s-wrapper').attr('title', $select.attr('title'));
		}
		else if($.type($this.options.wrapTitle) === "string")
		{
			$select.closest('.i-s-wrapper').attr('title', $this.options.wrapTitle);
		}
		else if($.type($this.options.wrapTitle) === "null"){}
		else
		{
			console.exception('Wrong value for wrapTitle check documentation at www.agendo.pl');
		}

		$select.closest('.i-s-wrapper').append('<p class="i-s-holder">');
		$select.closest('.i-s-wrapper').find('p.i-s-holder').append('<a href="javascript:void(0)">');
		$select.closest('.i-s-wrapper').find('p.i-s-holder').append('<span class="i-s-button">');
		
//		console.log($this.uuid+' '+$this.options.absolute);
		if($this.options.absolute)
		{
			$('body').append('<div id="i-s-list-'+$this.uuid+'" class="i-s-list-wrap-absolute '+$class+'"><div class="i-s-list i-hide-opacity"><ul class="i-s-list-inner scrollbar-formated-default"></ul></div></div>');
		}
		else
		{
			$select.closest('.i-s-wrapper').append('<div class="i-s-list i-hide-opacity"><ul class="i-s-list-inner scrollbar-formated-default"></ul></div>');
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
					is_selected = ' i-s-active i-s-hover';
					$this.element.closest('.i-s-wrapper').find('p.i-s-holder a').html($.trim(html.replace(/&nbsp;/g,'')));
				}
				
				if($(this).is(':disabled'))
				{
					is_disabled = ' i-s-option-disabled';
				}
				
				if($this.options.absolute)
				{
					if(!($this.element.data().active_not_show_on_list && $(this).is(':selected')))
					{
						
						var optionAdded = $('<li class="i-s-default'+is_selected+is_disabled+'"><input type="hidden" disabled value="'+$(this).val()+'" />'+html+'</li>').appendTo($('#i-s-list-'+$this.uuid).find('ul.i-s-list-inner'));
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
						var optionAdded = $('<li class="i-s-default'+is_selected+is_disabled+'"><input type="hidden" disabled value="'+$(this).val()+'" />'+html+'</li>').appendTo($this.element.closest('.i-s-wrapper').find('ul.i-s-list-inner'));
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
				var $wrap = $('<li></li>').addClass('i-s-optgroup').append('<ul class="i-s-optgroup-list"></ul>');
				if($(this).attr('label').length > 0)
					$wrap.find('ul').append('<li><p class="i-s-optgroup-label">'+$(this).attr('label')+'</p></li>');

				$(this).find('option').each(function()
				{
					var $thisO = $(this);
					var is_selected = '', is_disabled = '';
					var html = $(this).html();
					if($(this).data().icon)
						html = $(this).data().icon+html;
					
					if($(this).is(':selected'))
					{
						is_selected = ' i-s-active i-s-hover';
						$this.element.closest('.i-s-wrapper').find('p.i-s-holder a').html(html);
					}
					
					if($(this).is(':disabled'))
					{
						is_disabled = ' i-s-option-disabled';
					}
					
					if(!($this.element.data().active_not_show_on_list && $(this).is(':selected')))
					{
						var optionAdded = $('<li class="i-s-default'+is_selected+is_disabled+'"><input type="hidden" disabled value="'+$(this).val()+'" />'+html+'</li>').appendTo($wrap.find('ul'));
						if(typeof($thisO.attr('class')) != 'undefined')
						{
							optionAdded.addClass($thisO.attr('class'));
						}
						optionAdded = null;
					}
				});

				if($this.options.absolute)
				{
					$('#i-s-list-'+$this.uuid).find('ul.i-s-list-inner').append($wrap);
				}
				else {
					$this.element.closest('.i-s-wrapper').find('ul.i-s-list-inner').append($wrap);
				}
			}
		});
	}
});

$.widget( "Imperial.radioStyle", {
	
	//defaults options for plugin
	options: {
		hover:false,
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
	
    _create: function() {
		var $this = this;
		var $input = $this.element;
		
		if($input.attr('type') !== 'radio' || $input.hasClass($this.options.ignoredClass))
			return false;
		
		if(!$input.hasClass('i-r-styled'))
		{
			if($input.parent().is('label'))
				$input.parent().wrap('<div class="i-r-wrapper">');
			else if(typeof($input.attr('id')) !== 'undefined')
			{
				var element = $('label[for="'+$input.attr('id')+'"]');
				if(element)
				{
					element.hide();
					$input.wrap('<label>').parent().append(element.html()).wrap('<div class="i-r-wrapper">');
				}
			}
			else
			{
				$input.wrap('<div class="i-r-wrapper"><label class="i-r-only-radio">');
			}
			
			//Add class to input
			if($.type($this.options.inputClass) === "string")
				$input.addClass($this.options.inputClass).closest('.i-r-wrapper');
			else if($.type($this.options.inputClass) === "null"){}
			else
				console.exception('Wrong value for inputClass is have to be string.');
			
			//Add class to wrap
			if($.type($this.options.wrapClass) === "boolean")
			{
				if($this.options.wrapClass === true)
				{
					if($input.attr('class'))
					{
						var classList = $input.attr('class').split(/\s+/);
						$.each(classList, function(index, item) {
							$input.closest('.i-r-wrapper').addClass('i-r-class-'+item);
						});
					}
				}
			}
			else if($.type($this.options.wrapClass) === "string")
				$input.closest('.i-r-wrapper').addClass($this.options.wrapClass);
			else if($.type($this.options.wrapClass) === "null"){}
			else
				console.exception('Wrong value for wrapClass is have to be string.');
			
			//Add title to wrap or set from input
			if($.type($this.options.wrapTitle) === "boolean")
			{
				if($this.options.wrapTitle === true)
					$input.closest('.i-r-wrapper').attr('title', $input.attr('title'));
			}
			else if($.type($this.options.wrapTitle) === "string")
			{
				$input.closest('.i-r-wrapper').attr('title', $this.options.wrapTitle);
			}
			else if($.type($this.options.wrapTitle) === "null"){}
			else
			{
				console.exception('Wrong value for wrapTitle check documentation at www.agendo.pl');
			}
			
			$input.attr('tabindex', '-1');
			
			if(typeof($input.attr('style')) != 'undefined')
				$input.closest('.i-r-wrapper').attr('style', $input.attr('style'));
			
			$input.closest('.i-r-wrapper label').prepend('<a href="javascript:void(0)" class="i-r-default">');
			$input.closest('.i-r-wrapper').find('a.i-r-default').append('<span>');
			$input.addClass('i-r-styled i-hide');
		}

		$this._trigger( "onCreate", null, $input);
		
		if($input.is(':checked'))
			$input.closest('.i-r-wrapper').addClass('i-r-clicked');

		if($input.is(':disabled'))
		{
			$input.closest('.i-r-wrapper').addClass('i-r-disabled');
		}
		else
		{
			$input.closest('.i-r-wrapper').find('label').off('click.i_radio').on('click.i_radio', function(event)
			{
				$this._trigger( "onClick", event, $input);
				if(!$input.is(':checked'))
				{
					$('input[name="'+$input.attr('name')+'"]').each(function()
					{
						$(this).closest('.i-r-wrapper').find('a.i-r-default').removeClass('i-r-clicked');;
					});
					
					$input.prop('checked', true);
					$input.change();
					if($input.closest('form').length && $.isFunction($input.valid))
					{
						var validator = $.data($input.closest('form')[0], "validator" );
						if(validator && Object.keys(validator.submitted).length > 0)
						{
							$input.valid();
							if($input.hasClass(validator.settings.errorClass))
								$input.closest('.i-r-wrapper').addClass(validator.settings.errorClass);
							else
								$input.closest('.i-r-wrapper').removeClass(validator.settings.errorClass);
						}
					}
					//Tego nie trzeba bo na onchange jest aktualizacja statusu przycisku wywalić jak nie będzie problemów...
//					$(this).find('a.i-r-default').toggleClass('i-r-clicked');
					$this._trigger( "onChange", null, $input);
				}
				return false;
			});
			
			$input.off('change.i-radio').on('change.i-radio', function(){
				if($(this).is(':checked') && !$(this).closest('.i-r-wrapper').find('a.i-r-default').hasClass('i-r-clicked'))
				{
					$('input[name="'+$(this).attr('name')+'"]').each(function()
					{
						$(this).closest('.i-r-wrapper').removeClass('i-r-clicked');;
					});
					$(this).closest('.i-r-wrapper').addClass('i-r-clicked');
				}
				else if(!$(this).is(':checked') && $(this).closest('.i-r-wrapper').find('a.i-r-default').hasClass('i-r-clicked'))
				{
					$('input[name="'+$(this).attr('name')+'"]').each(function()
					{
						$(this).closest('.i-r-wrapper').removeClass('i-r-clicked');;
					});
					$(this).closest('.i-r-wrapper').removeClass('i-r-clicked');
				}
			});
			
			$input.closest('.i-r-wrapper').find('label a').not('.i-r-default').off('click').on('click', function(e)
			{
				if($(this).attr('target') == '_blank')
                    window.open($(this).attr('href'));
                else
                    window.location.href = $(this).attr('href');
                    
                e.preventDefault();
				e.stopPropagation();
			});
			
			$input.closest('.i-r-wrapper').off('click.i_radio').on('click.i_radio', function(){
				$input.closest('.i-r-wrapper').find('label').click();
				return false;
			});
			
			if($input.data().hover === true || $this.options.hover)
			{
				$input.closest('.i-r-wrapper').off('mouseenter.i_radio').on('mouseenter.i_radio', function(event)
				{
					$(this).addClass('i-r-hover');
					$this._trigger( "onEnter", event, $input);
				});

				$input.closest('.i-r-wrapper').off('mouseleave.i_radio').on('mouseleave.i_radio', function(event)
				{
					$(this).removeClass('i-r-hover');
					$this._trigger( "onLeave", event, $input);
				});
			}
		}
    },
		
	_destroy:function()
	{
		this.element.removeClass('i-r-styled');
		this.element.closest('.i-r-wrapper').replaceWith(this.element);
	},
	destroy:function(){this._destroy();},
	
	_refresh:function()
	{
		this._destroy();
		this._create();
	},
	refresh:function(){this._refresh();}
});

$.widget( "Imperial.checkboxStyle", {
//	widgetEventPrefix: "imperial",
	
	//defaults options for plugin
	options: {
		hover:false,
		wrapClass: true,
		inputClass: 'i-ch-ignored',
		wrapTitle: true,
		ignoredClass:null,
		//calbacks
		onEnter:null,
		onLeave:null,
		onChange:null,
		onCreate:null,
		onClick:null
	},
	
    _create: function() {
		var $this = this;
		var $input = $this.element;
		
		if($input.attr('type') !== 'checkbox' || $input.hasClass($this.options.ignoredClass))
			return false;
	
		if(!$input.hasClass('i-ch-styled'))
		{
			if($input.parent().is('label'))
				$input.parent().wrap('<div class="i-ch-wrapper">');
			else if(typeof($input.attr('id')) !== 'undefined')
			{
				var element = $('label[for="'+$input.attr('id')+'"]')
				if(element)
				{
					element.hide();
					$input.wrap('<label>').parent().append(element.html()).wrap('<div class="i-ch-wrapper">');
				}
			}
			else
			{
				$input.wrap('<div class="i-ch-wrapper"><label class="i-ch-only-checkbox">');
			}
			
			//Add class to input
			if($.type($this.options.inputClass) === "string")
				$input.addClass($this.options.inputClass).closest('.i-ch-wrapper');
			else if($.type($this.options.inputClass) === "null"){}
			else
				console.exception('Wrong value for inputClass is have to be string.');
			
			//Add class to wrap
			if($.type($this.options.wrapClass) === "boolean")
			{
				if($this.options.wrapClass === true)
				{
					if($input.attr('class'))
					{
						var classList = $input.attr('class').split(/\s+/);
						$.each(classList, function(index, item) {
							$input.closest('.i-ch-wrapper').addClass('i-ch-class-'+item);
						});
					}
				}
			}
			else if($.type($this.options.wrapClass) === "string")	
				$input.closest('.i-ch-wrapper').addClass($this.options.wrapClass);
			else if($.type($this.options.wrapClass) === "null"){}
			else
				console.exception('Wrong value for wrapClass is have to be string.');
			
			var $class = '';
			if($input.data('class'))
			{
				$class = $input.data('class');
			}

			$input.closest('.i-ch-wrapper').addClass($class);
			
			//Add title to wrap or set from input
			if($.type($this.options.wrapTitle) === "boolean")
			{
				if($this.options.wrapTitle === true)
				{
					$input.closest('.i-ch-wrapper').attr('title', $input.attr('title'));
				}
			}
			else if($.type($this.options.wrapTitle) === "string")
			{
				$input.closest('.i-ch-wrapper').attr('title', $this.options.wrapTitle);
			}
			else if($.type($this.options.wrapTitle) === "null"){}
			else
			{
				console.exception('Wrong value for wrapTitle check documentation at www.agendo.pl');
			}
			
			$input.attr('tabindex', '-1');
			
			if(typeof($input.attr('style')) != 'undefined')
				$input.closest('.i-ch-wrapper').attr('style', $input.attr('style'));
			
			$input.closest('.i-ch-wrapper label').prepend('<a href="javascript:void(0)" class="i-ch-default">');
			$input.closest('.i-ch-wrapper').find('a.i-ch-default').append('<span>');
			$input.addClass('i-ch-styled i-hide');
		}
		
		$this._trigger( "onCreate", null, $input);

		if($input.is(':checked'))
			$input.closest('.i-ch-wrapper').addClass('i-ch-clicked');
		
		$input.closest('.i-ch-wrapper').find('label').off('click.i_checkbox').on('click.i_checkbox', function(event)
		{
			if(!$input.is(':disabled'))
			{
				$this._trigger( "onClick", event, $input);
				if($input.is(':checked'))
				{
					$input.prop('checked', false);
				}
				else
				{
					$input.prop('checked', true);
				}

				$input.closest('.i-ch-wrapper').toggleClass('i-ch-clicked');
				$input.triggerHandler("click");
				$input.change();
				if($input.closest('form').length && $.isFunction($input.valid)
					&& typeof($input.attr('name')) !== 'undefined')
				{
					var validator = $.data($input.closest('form')[0], "validator" );
					if(validator && Object.keys(validator.submitted).length > 0)
					{
						$input.valid();

						if($input.hasClass(validator.settings.errorClass))
							$input.closest('.i-ch-wrapper').addClass(validator.settings.errorClass);
						else
							$input.closest('.i-ch-wrapper').removeClass(validator.settings.errorClass);
					}
				}

				$this._trigger( "onChange", null, $input);
			}
			return false;
		});

		$input.off('change.i-checkbox').on('change.i-checkbox', function(){
			if(!$input.is(':disabled'))
			{
				if($input.is(':checked') && !$input.closest('.i-ch-wrapper').hasClass('i-ch-clicked'))
					$input.closest('.i-ch-wrapper').addClass('i-ch-clicked');
				else if(!$input.is(':checked') && $input.closest('.i-ch-wrapper').hasClass('i-ch-clicked'))
					$input.closest('.i-ch-wrapper').removeClass('i-ch-clicked');
			}
		});

		$input.closest('.i-ch-wrapper').find('label a').not('.i-ch-default').off('click').on('click', function(e)
		{
			if(!$input.is(':disabled'))
			{
				if($(this).attr('target') == '_blank')
					window.open($(this).attr('href'));
				else
					window.location.href = $(this).attr('href');
			}
			
			e.preventDefault();
			e.stopPropagation();
		});
		
		if($input.is(':disabled'))
		{
			$input.closest('.i-ch-wrapper').addClass('i-ch-disabled');
		}
		else
		{
			if($input.data().hover === true || $this.options.hover)
			{
				$input.closest('.i-ch-wrapper').off('mouseenter.i_checkbox').on('mouseenter.i_checkbox', function(event)
				{
					$(this).addClass('i-ch-hover');
					$this._trigger( "onEnter", event, $input);
				});

				$input.closest('.i-ch-wrapper').off('mouseleave.i_checkbox').on('mouseleave.i_checkbox', function(event)
				{
					$(this).removeClass('i-ch-hover');
					$this._trigger( "onLeave", event, $input);
				});
			}
		}
    },
	
	_update: function()
	{
		var $this = this;
		var $input = $this.element;
		
		if($input.is(':disabled'))
		{
			$input.closest('.i-ch-wrapper').addClass('i-ch-disabled');
		}
		else
		{
			$input.closest('.i-ch-wrapper').removeClass('i-ch-disabled');
		}
		
		if($input.is(':checked'))
		{
			$input.closest('.i-ch-wrapper').addClass('i-ch-clicked');
		}
		else
		{
			$input.closest('.i-ch-wrapper').removeClass('i-ch-clicked');
		}
		
		if($input.data().hover === true || $this.options.hover)
		{
			$input.closest('.i-ch-wrapper').off('mouseenter.i_checkbox').on('mouseenter.i_checkbox', function(event)
			{
				$(this).addClass('i-ch-hover');
				$this._trigger( "onEnter", event, $input);
			});

			$input.closest('.i-ch-wrapper').off('mouseleave.i_checkbox').on('mouseleave.i_checkbox', function(event)
			{
				$(this).removeClass('i-ch-hover');
				$this._trigger( "onLeave", event, $input);
			});
		}
	},
	
	update: function()
	{
		this._update();
	},
	
	_destroy:function()
	{
		this.element.removeClass('i-ch-styled i-hide');
		this.element.removeData('ImperialCheckboxStyle');
		this.element.closest('.i-ch-wrapper').replaceWith(this.element);
	},
	destroy:function(){this._destroy();},
	
	_refresh:function()
	{
		this._destroy();
		this._create();
	},
	refresh:function(){this._refresh();}
});

$.widget( "Imperial.fileUploaderStyle", {
	
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
		
		if($input.attr('type') !== 'file' || $input.hasClass($this.options.ignoredClass) || $input.hasClass('i-file-uploader-input'))
			return false;
		
		//Utowrzenie html dla przycisku
		this.handlers.btn =  this.element.wrap('<div class="i-file-upload"></div>').wrap('<div class="i-file-upload-btn-wrap"></div>').wrap('<a class="i-file-upload-btn-handler">'+this.options.btn.name+'</a>').parent();
		
		if($input.is(':disabled'))
			this.handlers.btn.addClass('disabled');
		
		this.handlers.wrap = this.handlers.btn.parent();
		
		this.handlers.btn.prepend(this.options.btn.icon);
		this.handlers.file = this.handlers.wrap.parent().append('<span class="i-file-upload-file-name">'+this.options.file.not_selected+'</span>').find('.i-file-upload-file-name');
		
		//Dodanie dodatkowych klas
		this.handlers.wrap.addClass(this.options.class.wrap);
		this.handlers.btn.addClass(this.options.class.btn);
		
		//Ukrycie inputa
		$input.addClass('i-file-uploader-input');
		
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
		this.element.removeClass('i-file-uploader-input');
		this.options.handlers.wrap.replaceWith(this.element);
		this.options.handlers.btn.remove();
	},
	destroy:function(){this._destroy();}
});