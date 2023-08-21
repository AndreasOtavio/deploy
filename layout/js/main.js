(function($) {
	
	"use strict";
	
	/* Default Variables */
	var Earthf_Options = {
		parallax:true,
		loader:true,
		animations:true,
		scrollSpeed:700,
		navigation:'sticky',
		intro:{
			animate:true,
			animateDelayFirst:500,
			animateDelay:300
		}
	};
	
	if (typeof Earthf!=='undefined') {
		$.extend(Earthf_Options, Earthf);
	}
	
	$.Earthf_Theme = {
	
		//Initialize
		init:function() {
			this.intro();
			this.navigation();
			this.portfolio();
			this.shortcodes();
			this.animations();
			this.loader();
			this.contact();
			this.map();
			this.errorPage();
			this.parallax();
			this.videos();
			this.imageSlider();
			this.contentSlider();
			this.blog();
			this.twitter();
		},
		
		//Check if tocuh device
		isTouch:function() {
			return ('ontouchstart' in document.documentElement);
		},
	
		//Page Loader
		loader:function() {
			if (Earthf_Options.loader) {
				var loaderHide = function() {
					$(window).trigger('Earthf.loaded');
					$('.page-loader .content').delay(500).fadeOut();
					
					$('.page-loader').delay(1000).fadeOut('slow', function() {
						$(window).trigger('Earthf.complete');
					});
				};
	
				//Loadsafe
				$(window).on('load', function() {
					window._loaded = true;
				});
				
				window.loadsafe = function(callback) {
					if (window._loaded) {
						callback.call();
					} else {
						$(window).on('load', function() {
							callback.call();
						});
					}
				};
	
				//Hide loader
				if ($('#intro').attr('data-type')==='video' && !this.isTouch()) {
					$(window).on('Earthf.intro-video', function() {
						window.loadsafe(function() {
							loaderHide();
						});
					});
				} else {
					$(window).on('load', function() {
						loaderHide();
					});
				}
			} else {
                $('.page-loader').remove();
                $(window).trigger('Earthf.loaded');
                
                setTimeout(function() {
                    $(window).trigger('Earthf.complete');
                }, 1);
			}
		},
	
		//Navigation
		navigation:function() {
			//Dropdown menu
			var dropdownHide = function() {
				if ($('.navbar .dropdown.open').length===0) {return;}
				
				$('.navbar .dropdown.open').each(function() {
					$(this).find('.dropdown-menu').animate({opacity:0}, {duration:150, queue:false, complete:function() {
						$(this).parent().removeClass('open');
					}});
				});
			};
			
			var dropdownShow = function($that) {
				$that.find('.dropdown-menu').css({opacity:0});
				$that.addClass('open').find('.dropdown-menu').animate({opacity:1}, {duration:150, queue:false});
			};
	
			//Collapse menu
			var collapseMenu = function() {
				if ($('.navbar-collapse.collapse.in').length>0) {
					$('.navbar-collapse.collapse.in').each(function() {
						$(this).parent().find('.navbar-toggle').click();
					});
				}
			};
	
			//Resize window
			$(window).resize(function() {
				collapseMenu();
				dropdownHide();
			}).scroll(function() {
				collapseMenu();
			});
	
			//Navbar toggle
			$('.navbar .navbar-toggle').on("click", function(e) {
				e.preventDefault();
				dropdownHide();
			});
	
			//Create floating navigation bar
			if ($('#intro').length>0 && Earthf_Options.navigation==='sticky') {
				$(window).on("scroll", function() {
					var pos = $(window).scrollTop();
					
					if (pos>=100) {
						$(".navbar").addClass("floating slide-down");
					} else {
						$(".navbar").removeClass("floating slide-down");
					}
				});
			}
			
			if ($('#intro').length===0 && Earthf_Options.navigation!=='sticky') {
				$('.navbar').addClass('fixed-top');
			}
	
			//Dropdown menu
			var dropdownTimer, dropdownExists = false;
			
			$('.dropdown').hover(function() {
				if (!$(this).parent().parent().hasClass('in') && !$(this).parent().parent().hasClass('collapsing')) {
					clearTimeout(dropdownTimer);
					if ($(this).hasClass('open')) {return;}
					if (dropdownExists) {dropdownHide();}
					dropdownExists = true;
					dropdownShow($(this));
				}
			}, function() {
				if (!$(this).parent().parent().hasClass('in')) {
					dropdownTimer = setTimeout(function() {
						dropdownHide();
						dropdownExists = false;
					}, 500);
				}
			});
			
			$(document).on('click', '.navbar-collapse.in .dropdown > a', function(e) {
				e.preventDefault();
				var $parent = $(this).parent();
				
				if (!$parent.hasClass('open')) {
					dropdownShow($parent);
				} else {
					dropdownHide();
				}
			});
	
			//Scroll to anchor links
			$('a[href^=\\#]').on("click", function(e) {
				if ($(this).attr('href')!=='#' && !$(e.target).parent().parent().is('.navbar-nav') && !$(this).attr('data-toggle')) {
					$(document).scrollTo($(this).attr('href'), Earthf_Options.scrollSpeed, {offset:{top:-85, left:0}});
					e.preventDefault();
				}
			});
	
			//Navigation
			$(document).ready(function() {
				$('.navbar-nav').onePageNav({
					currentClass:'active',
					changeHash:false,
					scrollSpeed:Earthf_Options.scrollSpeed,
					scrollOffset:85,
					scrollThreshold:0.5,
					filter:'li a[href^=\\#]',
					begin:function() {
						collapseMenu();
					}
				});
			});
	
			if (document.location.hash && Earthf_Options.loader) {
				if (!/\?/.test(document.location.hash)) {
					$(window).on('load', function() {
						$(window).scrollTo(document.location.hash, 0, {offset:{top:-85, left:0}});
					});
				}
			}
	
			//To top
			$('.footer .to-top').on("click", function() {
				$(window).scrollTo($('body'), 1500, {offset:{top:0, left:0}});
			});
		},
	
		//Intro
		intro:function() {
			if ($('#intro').length===0) {
				return;
			}
	
			var $that = $('#intro');
			var useImages = false, useVideo = false;
			var $elements;
	
			//Vertical Align Content
			var verticalAlignContent = function() {
				var contentH = $that.find('.content').outerHeight(), 
					windowH = $(window).height(), 
					value = Math.floor((windowH-contentH)/2);
					
				$that.find('.content').css({marginTop:value});
			};
	
			//Magic mouse
			var magicMouse = function() {
				var mouseOpacity = 1-$(document).scrollTop()/400;
				if (mouseOpacity<0) {mouseOpacity = 0;}
				$that.find('.mouse').css({opacity:mouseOpacity});
			};
	
			if (!Earthf_Options.intro.animate) {
				$that.find('.animate').removeClass('animate');
			}
	
			$(window).on('resize', function() {
				verticalAlignContent();
			});
	
			$(window).on('load', function() {
				verticalAlignContent();
				magicMouse();
			});
			
			$(window).on('scroll', function() {
				magicMouse();
			});
	
			//Static image
			if ($that.attr('data-type')==='single-image') {
				useImages = true;
				$elements = $that.find('.animate');
				
				if ($elements.length>0) {
					verticalAlignContent();
	
					$(window).on('Earthf.complete', function() {
						$($elements).each(function(i) {
							var $this = $(this);
							setTimeout(function() {
								$this.addClass('complete');
							}, 0+(i*Earthf_Options.intro.animateDelay));
						});
					});
				} else {
					verticalAlignContent();
				}
	
				$('<div />').addClass('slider fullscreen').prependTo('body');
				
				$('<div />').addClass('image').css({
					opacity:0,
					backgroundImage:"url('"+$that.attr('data-source')+"')",
					backgroundRepeat:'no-repeat',
					backgroundSize:'cover'
				}).appendTo('.slider');
	
				$('.slider').imagesLoaded(function() {
					$(this).find('.image').css({opacity:1});
				});
	
				if ($that.attr('data-parallax')==='true' && !this.isTouch()) {
					$(document).ready(function() {
						$('.slider').find('.image').css({backgroundRepeat:'repeat'}).parallax('50%', 0.25);
					});
				}			
			}		
			//Slideshow
			else if ($that.attr('data-type')==='slideshow') {
				useImages = true;
	
				var contentListShow = function($that, $contentList, index) {
					var $current;
					
					if (!$contentList) {
						$contentList = $('#intro');
						$current = $contentList;
					} else {
						$current = $contentList.find('> div[data-index='+index+']');
					}
					
					var $elements = $current.find('.animate');
	
					if ($elements.length>0) {
						$elements.removeClass('complete');
						$current.show();
						verticalAlignContent();
	
						$($elements).each(function(i) {
							var $this = $(this);
							setTimeout(function() {
								$this.addClass('complete');
							}, Earthf_Options.intro.animateDelayFirst+(i*Earthf_Options.intro.animateDelay));
						});
					} else {
						$current.show();
						verticalAlignContent();
					}
				};
				
				var contentListHide = function($that, $contentList, onComplete) {
					if ($contentList) {
						var $current = $contentList.find('> div:visible');
						if (typeof $current!=='undefined') {
							$contentList.find('> div').hide();
						}
					}
					if (onComplete && typeof onComplete==='function') {onComplete();}
				};
	
				var $imagesList = $that.find($that.attr('data-images')),
					$contentList = $that.attr('data-content') ? $that.find($that.attr('data-content')) : false,
					changeContent = $contentList!==false ? true : false,
					$toLeft = $that.attr('data-to-left') ? $that.find($that.attr('data-to-left')) : false,
					$toRight = $that.attr('data-to-right') ? $that.find($that.attr('data-to-right')) : false,
					delay = parseInt($that.attr('data-delay'), 10)>0 ? parseInt($that.attr('data-delay'), 10)*1000 : 7000;
	
				$imagesList.hide();
				if (changeContent) {$contentList.find('> div').hide();}
	
				var images = [];
				$imagesList.find('> img').each(function(index) {
					images.push({src:$(this).attr('src')});
					$(this).attr('data-index', index);
				});
	
				if (changeContent) {
					$contentList.find('> div').each(function(index) {
						$(this).attr('data-index', index);
					});
				}
	
				var slideshowTimeout = false, slideshowCurrent = 0, slideshowIsFirst = true;
				var tempInt = Earthf_Options.intro.animateDelayFirst;
				
				var slideshowChange = function($that, index) {
					if (index>=images.length) {index = 0;}
					else if (index<0) {index = images.length - 1;}
					
					slideshowCurrent = index;
	
					var isFirst = $that.find('.image').length===0 ? true : false;
					
					if (isFirst) {
						$('<div />').css({
							backgroundImage:"url('"+images[index].src+"')",
							backgroundRepeat:'no-repeat'
						}).addClass('image').appendTo('.slider');
					} else {
						$('<div />').css({
							backgroundImage:"url('"+images[index].src+"')",
							backgroundRepeat:'no-repeat',
							opacity:0
						}).addClass('image').appendTo('.slider');
	
						setTimeout(function() {
							$that.find('.image:last-child').css({opacity:1});
							setTimeout(function() {
								$that.find('.image:first-child').remove();
							}, 1500);
						}, 100);
					}
	
					if ($contentList || slideshowIsFirst) {
						contentListHide($that, $contentList, function() {
							if (!slideshowIsFirst) {
								if (Earthf_Options.intro.animateDelayFirst===0) {
									Earthf_Options.intro.animateDelayFirst = tempInt;
								}
								
								contentListShow($that, $contentList, index);
							} else {
								$(window).on('Earthf.complete', function() {
									Earthf_Options.intro.animateDelayFirst = 0;
									contentListShow($that, $contentList, index);
								});
							}
						});
					}
					
					slideshowIsFirst = false;
	
					clearTimeout(slideshowTimeout);
					
					slideshowTimeout = setTimeout(function() {
						slideshowNext($that);
					}, delay);
				};
				
				var slideshowCreate = function() {
					$('<div />').addClass('slider fullscreen').prependTo('body');
					
					$(window).on('Earthf.loaded', function() {
						$imagesList.imagesLoaded(function() {
							slideshowChange($('.slider'), 0);
						});
					});
				};
				
				var slideshowNext = function($slider) {
					slideshowChange($slider, slideshowCurrent+1);
				};
				
				var slideshowPrev = function($slider) {
					slideshowChange($slider, slideshowCurrent-1);
				};
	
				slideshowCreate();
	
				if ($toLeft!==false && $toRight!==false) {
					$toLeft.on("click", function(e) {
						slideshowPrev($('.slider'));
						e.preventDefault();
					});
					
					$toRight.on("click", function(e) {
						slideshowNext($('.slider'));
						e.preventDefault();
					});
				}
			}
		},
	
		//Portfolio
		portfolio:function() {
			if ($('.portfolio-item').length===0) {
				return;
			}
			
			var that = this;
	
			var calculatePortfolioItems = function() {
				var sizes = {lg:5, md:5, sm:4, xs:2}, 
                    $that = $('.portfolio-items'),
					w = $(window).width(), onLine = 0, value = 0;
	
				if ($that.attr('data-on-line-lg')>0) {sizes.lg = parseInt($that.attr('data-on-line-lg'), 10);}
				if ($that.attr('data-on-line-md')>0) {sizes.md = parseInt($that.attr('data-on-line-md'), 10);}
				if ($that.attr('data-on-line-sm')>0) {sizes.sm = parseInt($that.attr('data-on-line-sm'), 10);}
				if ($that.attr('data-on-line-xs')>0) {sizes.xs = parseInt($that.attr('data-on-line-xs'), 10);}
	
				if (w<=767) {
					onLine = sizes.xs;
				} else if (w>=768 && w<=991) {
					onLine = sizes.sm;
				} else if (w>=992 && w<=1199) {
					onLine = sizes.md;
				} else {
					onLine = sizes.lg;
				}
	
				value = Math.floor(w/onLine);
				$('.portfolio-item').css({width:value+'px', height:value+'px'});
			};
	
			$(window).resize(function() {
				calculatePortfolioItems();
			});
			
			$(document).ready(function() {
				calculatePortfolioItems();
				$('.portfolio-items').isotope({
					itemSelector:'.portfolio-item',
					layoutMode:'fitRows'
				});
			});
	
			$('.portfolio-filters a').on("click", function(e) {
				var $that = $(this);
				$('.portfolio-filters a').removeClass('active');
				$that.addClass('active');
	
				$('.portfolio-items').isotope({filter:$that.attr('data-filter')});
				e.preventDefault();
			});
	
			var closeProject = function() {
				$('#portfolio-details').parent().animate({opacity:0}, {duration:600, queue:false});
				
				$('#portfolio-details').parent().animate({height:0}, {duration:700, queue:false, complete:function() {
					$(this).find('#portfolio-details').hide().html('').removeAttr('data-current');
					$(this).css({height:'auto', opacity:1});
				}});
			};
	
			//IE < 10 Fix
			$('.portfolio-item').on("click", function(e) {
				if ($(e.target).is('.portfolio-item')) {
					$(this).find('a').click();
				}
			}).find('img').on("click", function(e) {
				if ($(e.target).is('img')) {
					$(this).parent().find('a').click();
				}
			});
	
			//Portfolio item
			$('.portfolio-item a').filter('[data-url]').on("click", function(e) {
				var $that = $(this);				
				
				if ($that.parent().find('.loading').length===0) {
					$('<div />').addClass('loading').appendTo($that.parent());
					$that.parent().addClass('active');
	
					var $loading = $(this).parent().find('.loading'),
						$container = $('#portfolio-details'), 
						$parent = $container.parent(), 
						timer = 1, projectRel;
	
					if ($container.is(':visible')) {
						closeProject();
						timer = 800;
						$loading.animate({width:'70%'}, {duration:2000, queue:false});
					}
	
					setTimeout(function() {
						$loading.stop(true, false).animate({width:'70%'}, {duration:6000, queue:false});
						
						$.get($that.attr('data-url')).done(function(response) {
							$container.html(response);
							
							$container.imagesLoaded(function() {
								$loading.stop(true, false).animate({width:'100%'}, {duration:500, queue:true});
								
								$loading.animate({opacity:0}, {duration:200, queue:true, complete:function() {
									$that.parent().removeClass('active');
									$(this).remove();
	
									$parent.css({opacity:0, height:0});
									$container.show();
	
									that.imageSlider($container, function() {
										$(document).scrollTo($container, 600, {offset:{top:-85, left:0}});
										$parent.animate({opacity:1}, {duration:700, queue:false});
										$parent.animate({height:$container.outerHeight(true)}, {duration:600, queue:false, complete:function() {
											projectRel = $that.parent().is('.portfolio-item') ? $that.parent() : $that.parent().parent();
											$(this).css({height:'auto'});
											$container.attr('data-current', projectRel.attr('rel'));
										}});
									});
								}});
							});
						}).fail(function() {
							$that.parent().removeClass('active');
							$loading.remove();
						});
					}, timer);
				}
				
				e.preventDefault();
			});
	
			$(document.body).on('click', '#portfolio-details .icon.close i', function() {
				closeProject();
			});
	
			//Anchor Links for Projects
			var dh = document.location.hash;
	
			if (/#view-/i.test(dh)) {
				var $item = $('[rel="'+dh.substr(6)+'"]');
				
				if ($item.length>0) {
					$(document).scrollTo('#portfolio', 0, {offset:{top:0, left:0}});
					$(window).on('Earthf.complete', function() {
						$item.trigger('click');
					});
				}
			}
	
			$('a[href^="#view-"]').on("click", function() {
				var $item = $('[rel="'+$(this).attr('href').substr(6)+'"]');
				
				if ($item.length>0) {
					$(document).scrollTo('#portfolio', Earthf_Options.scrollSpeed, {offset:{top:-85, left:0}, onAfter:function() {
						$item.trigger('click');
					}});
				}
			});
		},
	
		//Parallax Sections
		parallax:function() {
			if ($('.parallax').length===0) {
				return;
			}
			
			var that = this;
	
			$(window).on('load', function() {
				$('.parallax').each(function() {
					if ($(this).attr('data-image')) {
						$(this).css({backgroundImage:'url('+$(this).attr('data-image')+')'});
						if (Earthf_Options.parallax && !that.isTouch() && !/MSIE/.test(navigator.userAgent)) {
							$(this).parallax('50%', 0.5);
						}
					}
				});
			});
		},
		
	
		//Content slider
		contentSlider:function($root, element) {
			if (typeof $root==='undefined') {$root = $('body');}
			if (typeof element==='undefined') {element = 'div';}
	
			$root.find('.content-slider').each(function() {
				var $that = $(this), timeout, delay = false, process = false, $arrows;
				
				$that.css({position:'relative'}).find('> '+element).each(function(index) {
					$that.height($(this).outerHeight(true));
					$(this).attr('data-index', index);
					$(this).css({position:'relative', left:0, top:0});
					
					if (index>0) {
						$(this).hide();
					} else {
						$that.attr('data-index', 0);
					}
				});
	
				if ($that.attr('data-arrows')) {
					$arrows = $($that.attr('data-arrows'));
				} else {
					$arrows = $that.parent();
				}
	
				if ($that.attr('data-delay')) {
					delay = parseInt($that.attr('data-delay'), 10);
					timeout = setInterval(function() {
						$arrows.find('.arrow.right').click();
					}, delay);
				}
				
				if ($that.find('> '+element+'[data-index]').length<2) {
					$arrows.hide();
					clearInterval(timeout);
					delay = false;
				}
	
				$arrows.find('.arrow').on("click", function() {
					if (!process) {
						process = true;
						clearInterval(timeout);
	
						var index = parseInt($that.attr('data-index'), 10), last = parseInt($that.find('> '+element +':last-child').attr('data-index'), 10), set;
						var property;
						
						if ($(this).hasClass('left')) {
							set = index===0 ? last : index-1;
							property = [ {left:100}, {left:-100}];
						} else {
							set = index===last ? 0 : index+1;
							property = [{left:-100}, {left:100}];
						}
						
						var $current = $that.find('> '+element+'[data-index='+index+']'),
							$next = $that.find('> '+element+'[data-index='+set+']');
	
						$that.attr('data-index', set);
						$current.css({left:'auto', right:'auto'});
						$current.animate({opacity:0}, {duration:300, queue:false});
	
						$current.animate(property[0], {duration:300, queue:false, complete:function() {
							$(this).hide().css({opacity:1}).css({left:0});
	
							$that.animate({height:$next.outerHeight(true) }, {duration:(($that.outerHeight(true)===$next.outerHeight(true)) ? 0 : 200), queue:false, complete:function() {
								$next.css({opacity:0, left:'auto', right:'auto'}).css(property[1]).show();
								$next.animate({opacity:1}, {duration:300, queue:false});
	
								$next.animate({left:0}, {duration:300, queue:false, complete:function() {
									if (delay!==false) {
										timeout=setInterval(function() {
											$arrows.find('.arrow.right').click();
										}, delay);
									}
									process = false;
								}});
							}});
						}});
					}
				});
	
				$(window).resize(function() {
					$that.each(function() {
						$(this).height($(this).find('> '+element+':visible').outerHeight(true));
					});
				}).resize();
			});
		},
	
		//Contact form
		contact:function() {
			if ($('#contact').length===0) {
				return;
			}
	
			var $name = $('.field-name'), $email = $('.field-email'), $phone = $('.field-phone'),
				$text = $('.field-message'), $button = $('#contact-submit');
	
			$('.field-name, .field-email, .field-message').focus(function() {
				if ($(this).parent().find('.error').length>0) {
					$(this).parent().find('.error').fadeOut(150, function() {
						$(this).remove();
					});
				}
			});
	
			$button.removeAttr('disabled');
			
			$button.on("click", function() {
				var fieldNotice = function($that) {
					if ($that.parent().find('.error').length===0) {
						$('<span class="error"><i class="fas fa-times"></i></span>').appendTo($that.parent()).fadeIn(150);
					}
				};
	
				if ($name.val().length<1) {fieldNotice($name);}
				if ($email.val().length<1) {fieldNotice($email);}
				if ($text.val().length<1) {fieldNotice($text);}
	
				if ($('#contact').find('.field .error').length===0) {
					$(document).ajaxStart(function() {
						$button.attr('disabled', true);
					});
					
					$.post('contact.php', {
						name:$name.val(), 
						email:$email.val(),
						phone:$phone.val(), 
						message:$text.val()
					}, function(response) {
						var data = $.parseJSON(response);
						
						if (data.status==='email') {
							fieldNotice($email);
							$button.removeAttr('disabled');
						} else if (data.status==='error') {
							$button.text('Unknown Error :(');
						} else {
							$('.contact-form-holder').fadeOut(300);
							$('.contact-form-result').fadeIn(300);
						}
					});
				}
			});
		},
		
		//Center error page
		errorPage:function() {
			//Error pages
			if ($('#error-page').length>0) {
				$(window).resize(function() {
					$('#error-page').css({marginTop:-Math.ceil($('#error-page').outerHeight()/2)});
			   }).resize();
			}
		},
	
		
	
			//Circular bars
			if ($('.circular-bars').length>0) {
				$('.circular-bars input').each(function() {
					$(this).val(0).knob({
						fgColor:$(this).attr('data-color') || $('a').css('color'),
						width:'90px',
						readOnly:true,
						thickness:0.10
					});
				});

				setTimeout(function() {
					$(window).on('Earthf.complete', function() {
						$(window).scroll(function() {
							var scrollTop = $(window).scrollTop();

							$('.circular-bars input').each(function() {
								var $that = $(this), itemTop = $that.offset().top-$(window).height()+$that.height()/2;

								if (scrollTop>itemTop && $that.val()==='0') {
									$({value:0}).animate({value:$that.attr('data-value')}, {
										duration:1500,
										queue:false,
										step:function() {
											$that.val(Math.ceil(this.value)).trigger('change');
										}
									});
								}
							});
						}).scroll();
					});
				}, 1);
			}
	
			//Milestone Counters
			if ($('.milestone').length>0) {
				$('.milestone').each(function() {
					$(this).find('.counter').text('0');
				});
	
				setTimeout(function() {
					$(window).on('Earthf.complete', function() {
						$(window).scroll(function() {
							var scrollTop = $(window).scrollTop();
							
							$('.milestone').each(function() {
								var $that = $(this), $counter = $that.find('.counter'),
									itemTop = $that.offset().top-$(window).height()+$that.height()/2;
								
								if (scrollTop>itemTop && parseInt($counter.text(), 10)===0) {
									$({value:parseInt($counter.attr('data-from'), 10)}).animate({
										value:$counter.attr('data-to')
									}, {
										duration:parseInt($counter.attr('data-speed')) || 2000,
										queue:false,
										step:function() {
											$counter.text(Math.ceil(this.value));
										}
									});
								}
							});
						}).scroll();
					});
				}, 1);
			}
		},
	
		//Images Slider
		imageSlider:function($root, onComplete) {
			if (typeof $root==='undefined') {$root = $('body');}
			
			if ($root.find('.image-slider').length===0) {
				if (onComplete && typeof onComplete==='function') {onComplete();}
				return;
			}
	
			$root.find('.image-slider').each(function() {
				var $that = $(this), $arrows = $that.find('.arrows');
				var $list = $(this).find('> div').not('.arrows');
				var timeout, delay = false, process = false;
	
				var setHeight = function($that, onComplete) {
					$that.css({
						height:$that.find('> div:visible img').outerHeight(true)
					});
					
					if (onComplete && typeof onComplete==='function') {onComplete();}
				};
	
				if ($that.attr('data-delay')) {
					delay = parseInt($that.attr('data-delay'), 10);
					timeout = setInterval(function() {
						$arrows.find('.arrow.right').click();
					}, delay);
				}
	
				$(this).imagesLoaded(function() {
					$(this).css({position:'relative'});
	
					$list.hide().css({
						position:'absolute',
						top:0,
						left:0,
						zIndex:1,
						width:'100%',
						paddingLeft:15,
						paddingRight:15,
					});
	
					$list.eq(0).show();
	
					setHeight($that, onComplete);
					
					$(window).resize(function() {
						setTimeout(function() {
							setHeight($that);
						}, 1);
					});
	
					if ($list.length===1) {
						$arrows.hide();
						clearInterval(timeout);
						delay = false;
					}
				});
	
				$arrows.find('.arrow').on('click', function(e) {
					if (process) {
						e.preventDefault();
						return;
					}
					
					clearInterval(timeout);
	
					var isRight = $(this).hasClass('right');
					var $current = $that.find('> div:visible').not('.arrows'), $next;
	
					if (isRight) {
						$next = $current.next();
						if (!$next || $next.is('.arrows')) {
							$next = $list.eq(0);
						}
					} else {
						if ($current.is(':first-child')) {
							$next = $list.last();
						} else {
							$next = $current.prev();
						}
					}
	
					process = true;
					$current.css({zIndex:1});
					
					$next.css({opacity:0, zIndex:2}).show().animate({opacity:1}, {duration:300, queue:false, complete:function() {
						$current.hide().css({opacity:1});
						
						if (delay!==false) {
							timeout = setInterval(function() {
								$arrows.find('.arrow.right').click();
							}, delay);
						}
						process = false;
					}});
				});
			});
		},
	

	
		//Share functions
		share:function(network, title, image, url) {
			//Window size
			var w = 650, h = 350, params = 'width='+w+', height='+h+', resizable=1';
	
			//Title
			if (typeof title==='undefined') {
				title = $('title').text();
			} else if (typeof title==='string') {
				if ($(title).length>0) {
					title = $(title).text();
				}
			}
			
			//Image
			if (typeof image==='undefined') {
				image = '';
			} else if (typeof image==='string') {
				if (!/http/i.test(image)) {
					if ($(image).length>0) {
						if ($(image).is('img')) {
							image = $(image).attr('src');
						} else {
							image = $(image).find('img').eq(0).attr('src');
						}
					} else {
						image = '';
					}
				}
			}
			
			//Url
			if (typeof url==='undefined') {
				url = document.location.href;
			} else {
				url = document.location.protocol+'//'+document.location.host+document.location.pathname+url;
			}
			
			//Share
			if (network==='twitter') {
				return window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(title+' '+url), 'share', params);
			} else if (network==='facebook') {
				return window.open('https://www.facebook.com/sharer/sharer.php?s=100&p[url]='+encodeURIComponent(url)+'&p[title]='+encodeURIComponent(title)+'&p[images][0]='+encodeURIComponent(image), 'share', params);
			} else if (network==='pinterest') {
				return window.open('https://pinterest.com/pin/create/bookmarklet/?media='+image+'&description='+title+' '+encodeURIComponent(url), 'share', params);
			} else if (network==='google') {
				return window.open('https://plus.google.com/share?url='+encodeURIComponent(url), 'share', params);
			} else if (network==='linkedin') {
				return window.open('https://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(url)+'&title='+title, 'share', params);
			}
			
			return;
		},
	

	
		//Animations
		animations:function() {
			if (this.isTouch()) {
				Earthf_Options.animations = false;
			}
			
			if (!Earthf_Options.animations) {
				$('.animation[class*="animation-"]').removeClass('animation');
			} else {
				var animationItem = $('.animation[class*="animation-"]');
				
				if (animationItem.length) {
					var delay;
					
					animationItem.not('.active').each(function(i) {
						if (i!==0 && $(this).offset().top===$(animationItem.get(i-1)).offset().top) {
							delay++;
						} else {
							delay = 0;
						}
						
						$(this).css({
							'-webkit-transition-delay':delay*150+'ms',
							   '-moz-transition-delay':delay*150+'ms',
								 '-o-transition-delay':delay*150+'ms',
								'-ms-transition-delay':delay*150+'ms',
									'transition-delay':delay*150+'ms'
						});
					});
	
					setTimeout(function() {
						$(window).on('Earthf.complete', function() {
							$(window).scroll(function() {
								var scrollTop = $(window).scrollTop();
								
								animationItem.not('.active').each(function() {
									var $that = $(this), 
										itemTop = $that.offset().top-$(window).height()+$that.outerHeight()/2;
									
									if (scrollTop>itemTop) {
										$(this).addClass('active');
									}
								});
							}).scroll();
						});
					}, 1);
				}
			}
	
			/*** How it looks (iMacs preview) ***/
			if ($('.imacs').length>0) {
				if (!Earthf_Options.animations) {
					$('.imacs').find('.item').not('.center').addClass('complete');
					return;
				}
				
				setTimeout(function() {
					$(window).on('Earthf.complete', function() {
						$(window).scroll(function() {
							var scrollTop = $(window).scrollTop();
							
							$('.imacs').find('.item').not('.complete').each(function() {
								var $that = $(this), 
									itemTop = $that.offset().top-$(window).height()+$that.height()/2;
								
								if (scrollTop>itemTop && !$that.hasClass('center')) {
									$that.addClass('complete');
								}
							});
						}).scroll();
					});
				}, 1);
			}
		}
	};
	
	//Initialize
	$.Earthf_Theme.init();

})(jQuery);

//Share Functions
function shareTo(network, title, image, url) {
	return $.Earthf_Theme.share(network, title, image, url);
}

//Video Background for Sections
function onYouTubePlayerAPIReady() {
	$('.section.video').each(function(index) {
		var $that = $(this), currentId = 'video-background-'+index;	   	
		$('<div class="video-responsive"><div id="'+currentId+'"></div></div>').prependTo($that);

		var player = new YT.Player(currentId, {
			height:'100%',
			width:'100%',			
			playerVars:{
				'rel':0,
				'autoplay':1,
				'loop':1,
				'controls':0,
				'start':parseInt($that.attr('data-start'), 10),
				'autohide':1,
				'wmode':'opaque',
				'playlist':currentId
			},
			videoId:$that.attr('data-source'),
			events:{
				'onReady':function(evt) {
					evt.target.mute();
				},
				'onStateChange':function(evt) {
					if (evt.data===0) {evt.target.playVideo();}
				}
			}
		});

		var $control = $that.find('.video-control'),
			$selector = $that.find($control.attr('data-hide')),
			$container = $that.find('.video-container'),
			videoMode = $that.attr('data-video-mode')==='true' ? true : false;

		if ($control.length>0 && $selector.length>0) {
			$control.on("click", function() {
				if (!videoMode) {
					$that.attr('data-video-mode', 'true');
					videoMode = true;

					$that.find('.video-overlay').animate({opacity:0}, {duration:500, queue:false, complete:function() {
						$(this).hide();
					}});
					
					$selector.animate({opacity:0}, {duration:500, queue:false, complete:function() {
						player.unMute();

						$('<div />').appendTo($container).css( {
							position:'absolute',
							textAlign:'center',
							bottom:'30px',
							color:'#FFF',
							left:0,
							right:0,
							opacity:0
						}).addClass('click-to-exit');
						
						$('<h5 />').appendTo($that.find('.click-to-exit')).text('Click to exit full screen');

						setTimeout( function() {
							$that.find('.click-to-exit').animate({opacity:1}, {duration:500, queue:false, complete:function() {
								setTimeout(function( ) {
									$that.find('.click-to-exit').animate({opacity:0}, {duration:500, queue:false, complete:function() {
										$(this).remove();
									}});
								}, 1500);
							}});
						}, 500);

						$selector.hide();
					}});
				}
			});

			$that.on("click", function(evt) {
				if (videoMode && ($(evt.target).is('.video-container') || $(evt.target).parent().is('.click-to-exit'))) {
					$selector.show().animate({opacity:1}, {duration:500, queue:false});
					$that.find('.video-overlay').show( ).animate({opacity:1}, {duration:500, queue:false});

					$that.find('.click-to-exit').remove();
					$that.removeAttr('data-video-mode');
					videoMode = false;

					player.mute();
				}
			});
		}
	});
}