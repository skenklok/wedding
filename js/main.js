; (function () {

	'use strict';

	// iPad and iPod detection	
	var isiPad = function () {
		return (navigator.platform.indexOf("iPad") != -1);
	};

	var isiPhone = function () {
		return (
			(navigator.platform.indexOf("iPhone") != -1) ||
			(navigator.platform.indexOf("iPod") != -1)
		);
	};

	// Main Menu Superfish
	var mainMenu = function () {
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
	var parallax = function () {
		if (!isiPad() || !isiPhone()) {
			$(window).stellar();
		}
	};

	var offcanvas = function () {

		// Remove any existing offcanvas menu
		$('#offcanvas-menu').remove();

		var $clone = $('#fh5co-menu-wrap').clone();
		$clone.attr({
			'id': 'offcanvas-menu'
		});

		// Preserve the original structure and classes
		$clone.find('ul.sf-menu').attr('class', 'menu-list').attr('id', '');

		$('body').append($clone);


		$('.js-fh5co-nav-toggle').on('click', function (e) {
			e.preventDefault();
			var $body = $('body');
			var $offcanvasMenu = $('#offcanvas-menu');

			$body.toggleClass('fh5co-offcanvas');

			if ($body.hasClass('fh5co-offcanvas')) {
				$offcanvasMenu.css('right', '0');
			} else {
				$offcanvasMenu.css('right', '-240px');
			}
		});

	}

	var mobileMenuOutsideClick = function () {
		$(document).on('click', function (e) {
			var container = $("#offcanvas-menu, .offcanvas-toggle");
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				if ($('body').hasClass('fh5co-offcanvas')) {
					$('body').removeClass('fh5co-offcanvas');
					$('#offcanvas-menu').css('right', '-240px');
				}
			}
		});
	};

	// Animations
	var contentWayPoint = function () {
		var i = 0;
		$('.animate-box').waypoint(function (direction) {
			if (direction === 'down' && !$(this.element).hasClass('animated')) {
				i++;
				$(this.element).addClass('item-animate');
				setTimeout(function () {
					$('body .animate-box.item-animate').each(function (k) {
						var el = $(this);
						setTimeout(function () {
							el.addClass('fadeInUp animated');
							el.removeClass('item-animate');
						}, k * 50, 'easeInOutExpo');
					});
				}, 100);
			}
		}, { offset: '85%' });
	};

	var stickyBanner = function () {
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
	var x = setInterval(function () {
		// Get todays date and time
		var now = new Date().getTime();

		// Find the distance between now an the count down date
		var distance = countDownDate - now;

		// Time calculations for days, hours, minutes and seconds
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		if (document.getElementById("days") && document.getElementById("hours") &&
			document.getElementById("minutes") && document.getElementById("seconds")) {
			document.getElementById("days").innerHTML = days + " <small>days</small>";
			document.getElementById("hours").innerHTML = hours + " <small>hours</small> ";
			document.getElementById("minutes").innerHTML = minutes + " <small>minutes</small> ";
			document.getElementById("seconds").innerHTML = seconds + " <small>seconds</small> ";
		}

		// If the count down is finished, write some text 
		if (distance < 0) {
			clearInterval(x);
			document.getElementById("demo").innerHTML = "The Wedding Ceremony is Over";
		}
	}, 1000);

	function initializeRSVPForm() {
		const form = document.getElementById('rsvp-form');
		const addGuestButton = document.getElementById('add-guest');
		const additionalGuestsContainer = document.getElementById('additional-guests');
		const spinner = document.getElementById('loading-spinner');
		const responseMessage = document.getElementById('form-response-message');

		let guestCount = 0;
		const MAX_GUESTS = 3;

		if (addGuestButton) {
			addGuestButton.addEventListener('click', addGuestSection);
		}

		if (form) {
			form.addEventListener('submit', validateAndSubmitForm);
		}

		function validateAndSubmitForm(event) {
			event.preventDefault();
			event.stopPropagation();

			if (validateForm()) {
				submitForm();
			}
		}

		function validateForm() {
			let isValid = true;

			// Validate name
			const nameInput = document.getElementById('your-name');
			if (!nameInput.value.trim()) {
				showError(nameInput, 'Name is required');
				isValid = false;
			} else {
				clearError(nameInput);
			}

			// Validate email
			const emailInput = document.getElementById('your-email');
			if (!emailInput.value.trim()) {
				showError(emailInput, 'Email is required');
				isValid = false;
			} else if (!isValidEmail(emailInput.value)) {
				showError(emailInput, 'Please enter a valid email address');
				isValid = false;
			} else {
				clearError(emailInput);
			}

			// Validate attending radio buttons
			const attendingRadios = document.getElementsByName('attending');
			let attendingChecked = false;
			for (let radio of attendingRadios) {
				if (radio.checked) {
					attendingChecked = true;
					break;
				}
			}
			if (!attendingChecked) {
				showError(attendingRadios[0], 'Please select whether you are attending');
				isValid = false;
			} else {
				clearError(attendingRadios[0]);
			}

			// Validate guest fields
			const guestFields = document.querySelectorAll('.guest-fields');
			guestFields.forEach((field, index) => {
				const guestName = field.querySelector(`[name^="guest-name-"]`);
				if (!guestName.value.trim()) {
					showError(guestName, 'Guest name is required');
					isValid = false;
				} else {
					clearError(guestName);
				}
			});

			return isValid;
		}

		function showError(input, message) {
			let errorElement = input.parentElement.querySelector('.error-message');
			if (!errorElement) {
				errorElement = document.createElement('div');
				errorElement.className = 'error-message';
				input.parentElement.appendChild(errorElement);
			}
			errorElement.textContent = message;
			errorElement.style.display = 'block';
			input.classList.add('error-input');
		}

		function clearError(input) {
			const errorElement = input.parentElement.querySelector('.error-message');
			if (errorElement) {
				errorElement.textContent = '';
				errorElement.style.display = 'none';
			}
			input.classList.remove('error-input');
		}

		function isValidEmail(email) {
			const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

		function addGuestSection() {
			if (guestCount >= MAX_GUESTS) {
				alert('Maximum number of additional guests reached.');
				return;
			}

			guestCount++;
			const guestFields = document.createElement('div');
			guestFields.classList.add('guest-fields');
			guestFields.dataset.guestId = guestCount;
			guestFields.innerHTML = `
				<h4>Guest ${guestCount}</h4>
				<div class="form-group">
					<input type="text" class="form-control" placeholder="Guest Name" name="guest-name-${guestCount}">
				</div>
				<div class="form-group">
					<textarea class="form-control" placeholder="Any Intolerances" name="guest-intolerances-${guestCount}"></textarea>
				</div>
				<div class="form-group">
					<label>
						<input type="checkbox" name="guest-is-kid-${guestCount}"> This guest is a kid
					</label>
				</div>
				<button type="button" class="btn btn-danger remove-guest" data-guest-id="${guestCount}">Remove Guest</button>
			`;
			additionalGuestsContainer.appendChild(guestFields);

			const removeButton = guestFields.querySelector('.remove-guest');
			removeButton.addEventListener('click', function () {
				removeGuestSection(this.dataset.guestId);
			});

			if (guestCount === MAX_GUESTS) {
				addGuestButton.style.display = 'none';
			}
		}

		function removeGuestSection(guestId) {
			const guestSection = document.querySelector(`.guest-fields[data-guest-id="${guestId}"]`);
			if (guestSection) {
				guestSection.remove();
				guestCount--;
				if (guestCount < MAX_GUESTS) {
					addGuestButton.style.display = 'block';
				}
			}
		}

		function submitForm() {
			spinner.style.display = 'block';
			responseMessage.style.display = 'none';
		
			var formData = new FormData(form);
			formData.append('attending', form.querySelector('input[name="attending"]:checked').value);
		
			// Add guest information
			var guestFields = form.querySelectorAll('.guest-fields');
			guestFields.forEach(function(field, index) {
				var guestIndex = index + 1;
				formData.append('guest-name-' + guestIndex, field.querySelector('[name^="guest-name-"]').value);
				formData.append('guest-intolerances-' + guestIndex, field.querySelector('[name^="guest-intolerances-"]').value);
				formData.append('guest_is_kid_' + guestIndex, field.querySelector('[name^="guest-is-kid-"]').checked ? 'on' : 'off');
			});
		
			fetch('https://script.google.com/macros/s/AKfycbyeBF_baU98qX7dfZiCWkf2EHczJsSi_xP74WXjMIELOAt8qnvb0bvEIKPnT1RxpXeR/exec', {
				method: 'POST',
				mode: 'no-cors',
				body: formData
			})
			.then(response => {
				showResponseMessage('success', 'Thank You!', 'Your RSVP has been successfully submitted. We look forward to celebrating with you!');
			})
			.catch(error => {
				console.error('Error:', error);
				showResponseMessage('error', 'Oops!', 'There was an error submitting the form. Please try again or contact us directly.');
			})
			.finally(() => {
				spinner.style.display = 'none';
				form.reset();
				additionalGuestsContainer.innerHTML = '';
				guestCount = 0;
				addGuestButton.style.display = 'block';
				scrollToElement(responseMessage);
			});
		}
		
		function showResponseMessage(type, title, message) {
			responseMessage.className = 'form-response-message ' + type + ' animated';
			responseMessage.querySelector('.response-title').textContent = title;
			responseMessage.querySelector('.response-text').textContent = message;
			responseMessage.style.display = 'block';
		}
		
		function scrollToElement(element) {
			element.scrollIntoView({behavior: 'smooth', block: 'center'});
		}

			
	}

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
				updateContent(lang);
			})
			.catch(error => {
				console.error(`Could not load ${lang} translations:`, error);
			});
	}

	function loadHeader() {
		fetch('header.html')
			.then(response => response.text())
			.then(data => {
				const targetElement = document.querySelector('.fh5co-hero');
				if (targetElement) {
					targetElement.insertAdjacentHTML('afterend', data);
					offcanvas(); // Re-initialize offcanvas menu after header is loaded
				} else {
					console.error('Target element for header insertion not found');
				}
			})
			.catch(error => console.error('Error loading header:', error));
	}


	function updateContent(lang) {
		var elements = document.querySelectorAll('[data-i18n]');
		elements.forEach(element => {
			var keys = element.getAttribute('data-i18n').split('.');
			var translation = keys.reduce((obj, key) => obj && obj[key], translations[lang]);

			if (translation) {
				if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
					element.placeholder = translation;
				} else {
					element.textContent = translation;
				}
			} else {
				if (keys[0] === '[placeholder]') {
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

	// Document on load.
	$(function () {
		mainMenu();
		parallax();
		loadHeader();
		offcanvas();
		mobileMenuOutsideClick();
		contentWayPoint();
		stickyBanner();

		// Initialize translations
		loadTranslation('en');
		document.getElementById('lang-en').addEventListener('click', () => loadTranslation('en'));
		document.getElementById('lang-el').addEventListener('click', () => loadTranslation('el'));
		document.getElementById('lang-it').addEventListener('click', () => loadTranslation('it'));

		// Fetch and initialize RSVP form
		fetch('rsvp-form.html')
			.then(response => response.text())
			.then(data => {
				document.getElementById('form-container').innerHTML = data;
				initializeRSVPForm();
			})
			.catch(error => console.error('Error loading form:', error));
	});

}());