;(function () {
	
	'use strict';

	// iPad and iPod detection	
	var isiPad = function(){
		return (navigator.platform.indexOf("iPad") != -1);
	};


	var isiPhone = function(){
	    return (
			(navigator.platform.indexOf("iPhone") != -1) || 
			(navigator.platform.indexOf("iPod") != -1)
	    );
	};

	// Main Menu Superfish
	var mainMenu = function() {

		$('#fh5co-primary-menu').superfish({
			delay: 0,
			animation: {
				opacity: 'show'
			},
			speed: 'fast',
			cssArrows: true,
			disableHI: true
		});

	};

	// Parallax
	var parallax = function() {
		if ( !isiPad() || !isiPhone() ) {
			$(window).stellar();
		}
	};


	
	
	

	// Click outside of the Mobile Menu
	var mobileMenuOutsideClick = function() {
		$(document).click(function (e) {
	    var container = $("#offcanvas-menu, .js-fh5co-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	      if ( $('body').hasClass('fh5co-offcanvas') ) {
				$('body').removeClass('fh5co-offcanvas');
			}
	    }
		});
	};


	// Animations

	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							el.addClass('fadeInUp animated');
							el.removeClass('item-animate');
						},  k * 50, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '85%' } );
	};
	
	var stickyBanner = function() {
		var $stickyElement = $('.sticky-banner');
		var sticky;
		if ($stickyElement.length) {
		  sticky = new Waypoint.Sticky({
		      element: $stickyElement[0],
		      offset: 0
		  })
		}
	};

	// Set the date we're counting down to
	var countDownDate = new Date("Jun 28, 2025 12:30:00").getTime();

	// Update the count down every 1 second
	var x = setInterval(function() {

	// Get todays date and time
	var now = new Date().getTime();

	// Find the distance between now an the count down date
	var distance = countDownDate - now;

	// Time calculations for days, hours, minutes and seconds
	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	// Display the result in an element with id="demo"
	// document.getElementById("demo").innerHTML = days + "Days " + hours + "Hours "
	// + minutes + "Minutes " + seconds + "Seconds ";

	// Display the result in an element with id="demo"
	document.getElementById("days").innerHTML = days +" <small>days</small>";
	document.getElementById("hours").innerHTML = hours + " <small>hours</small> ";
	document.getElementById("minutes").innerHTML = minutes + " <small>minutes</small> ";
	document.getElementById("seconds").innerHTML = seconds + " <small>seconds</small> ";

	// If the count down is finished, write some text 
	if (distance < 0) {
	 clearInterval(x);
	 document.getElementById("demo").innerHTML = "The Wedding Ceremony is Over";
	}
	}, 1000);

	// Document on load.

	$(function(){
		mainMenu();
		parallax();
		offcanvas();
		mobileMenuOutsideClick();
		contentWayPoint();
		stickyBanner();
	});

	document.addEventListener('DOMContentLoaded', function() {
		var form = document.getElementById('rsvp-form');
		var spinner = document.getElementById('loading-spinner'); // Get the spinner
		var responseMessage = document.getElementById('form-response-message');
	  
		form.addEventListener('submit', function(event) {;
		  event.preventDefault();
		  event.stopPropagation();
		  spinner.style.display = 'block'; // Show the spinner
		  responseMessage.innerText = ''; // Clear previous messages
	  
		  var formData = new FormData(form);
		  formData.append('not_attending', form.querySelector('#attending').checked ? 'yes' : 'no');
	  
		  fetch('https://script.google.com/macros/s/AKfycbwbl80QlDMziY4CqsmX1jg_grcXLzznQstWCzrjdqF4ess2ARkPrBk0CO5PvaE1dzjz/exec', {
			method: 'POST',
			mode: 'no-cors', // prevent the CORS error
			body: formData
		  })
		  .then(response => {
			// If response is opaque due to 'no-cors', handle accordingly
			responseMessage.innerText = 'Form submitted successfully!';
		  })
		  .catch(error => {
			console.error('Error:', error);
			responseMessage.innerText = 'There was an error submitting the form.';
		  })
		  .finally(() => {
			spinner.style.display = 'none'; // Hide the spinner regardless of outcome
			form.reset(); // Reset the form to prevent duplicate submissions
		  });
		});
	  });

	  var translations = {};

	  function loadTranslation(lang) {
		  fetch(`i18n/${lang}.json`)
			  .then(response => {
				  if (!response.ok) {
					  throw new Error(`HTTP error! Status: ${response.status}`);
				  }
				  return response.json();
			  })
			  .then(json => {
				  translations[lang] = json;
				  console.log(`Loaded translations for ${lang}:`, translations[lang]); // Debugging line
				  updateContent(lang);
			  })
			  .catch(error => {
				  console.error(`Could not load ${lang} translations:`, error);
			  });
	  }

	  function updateContent(lang) {
		var elements = document.querySelectorAll('[data-i18n]');
		elements.forEach(element => {
			var keys = element.getAttribute('data-i18n').split('.');
			var translation = keys.reduce((obj, key) => obj && obj[key], translations[lang]);
	
			if (translation) {
				if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
					element.placeholder = translation; // For input placeholders
				} else {
					element.textContent = translation; // For other elements
				}
			} else {
				// Check if the key is meant for a placeholder
				if (keys[0] === '[placeholder]') {
					// Attempt to find the placeholder translation without the prefix
					var placeholderKey = keys.slice(1).join('.');
					var placeholderTranslation = translations[lang][placeholderKey];
					if (placeholderTranslation) {
						element.placeholder = placeholderTranslation;
					} else {
						console.warn(`Missing translation for placeholder: ${placeholderKey} in language: ${lang}`);
					}
				} else {
					console.warn(`Missing translation for: ${keys.join('.')} in language: ${lang}`);
				}
			}
		});
	}

	document.addEventListener('DOMContentLoaded', () => {
		loadTranslation('en'); // Load default language on DOMContentLoaded
	
		// Event listeners for language switch
		document.getElementById('lang-en').addEventListener('click', () => loadTranslation('en'));
		document.getElementById('lang-el').addEventListener('click', () => loadTranslation('el'));
		document.getElementById('lang-it').addEventListener('click', () => loadTranslation('it')); 
		// Add similar event listener for other languages if available
	});


}());