var parameters =  new Array();

var settings_block = '<div class="block-settings-wrapper">\
		<div id="block_settings" class="block_settings">\
			<section>\
				<h3>HEADER STYLE</h3>\
				<ul>\
					<li class="header-index"><a href="index.html">Image Slideshow</a></li>\
					<li class="header-index-image"><a href="index-image.html">Single Image</a></li>\
					<li class="header-index-video"><a href="index-video.html">Video Background</a></li>\
				</ul>\
				<hr>\
				<h3>COLORS</h3>\
				<span class="green" title="Green" data-color="#24bca4"></span>\
				<span class="blue" title="Blue" data-color="#4e9cb5"></span>\
				<span class="red" title="Red" data-color="#f25454"></span>\
				<span class="turquoise" title="Turquoise" data-color="#46cad7"></span>\
				<span class="purple" title="Purple" data-color="#c86f98"></span>\
				<span class="orange" title="Orange" data-color="#ee8f67"></span>\
				<span class="yellow" title="Yellow" data-color="#e4d20c"></span>\
				<span class="grey" title="Grey" data-color="#6b798f"></span>\
			</section>\
			<a href="#" id="settings_close">Close</a>\
		</div>\
	</div>';

//Init color buttons
function initColor() {
	$('.block-settings-wrapper section span').click(function() {	
		var cls = $(this).attr('class');
		var color = $(this).data("color");
		
		//CSS
		$("link.colors").attr('href', 'layout/colors/'+cls+'.css');
		
		//Logo
		$('.navbar.floating .navbar-brand > img').attr('src', 'images/logo/logo-'+cls+'.png');
		
		//Icon
		$('#about .icon > img').attr('src', 'images/icon/icon-'+cls+'.png');
		
		//Google Maps
		$("#google-map").attr("data-marker", "layout/images/marker-"+cls+".png");
		$("#google-map").attr("data-color", color);

		$.Royal_Theme.mapCreate();
	});
}

//Init open/close button	
function initClose() {
	parameters.push('opened');
	
	$('#settings_close').click(function(e) {
		$('body').toggleClass('opened-settings');
		
		if(!$.cookies.get('opened')) {
			$.cookies.set('opened', 'opened-settings');
		} else {
			$.cookies.del('opened');
		}
		
		e.preventDefault();	
	});
}

//Init cookies
function initCookies() {
	for(key in parameters) {
		var name = parameters[key];
		var parameter = $.cookies.get(name);
		if(parameter) {
			$('body').addClass(parameter);
		}
	}
}

$(document).ready(function() {
	$('body').prepend(settings_block);
	initColor();	
	initClose();
	initCookies();
	
	//Activate header style
	var url = window.location.href;
	var ind = url.lastIndexOf("/");
	url = url.substr(ind+1);
	
	ind = url.indexOf(".");
	url = url.substr(0, ind);
	
	if (url=="") {url = "index";}
	
	$page = $("li.header-"+url);
	
	$page.addClass("active");
	$page.append('<i class="fas fa-check"></i>');
});