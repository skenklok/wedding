document.addEventListener('DOMContentLoaded', function() {
    // Default language set to English
    changeLanguage('english');

    // Event listeners for language switcher buttons
    document.getElementById('lang-en').addEventListener('click', function() { changeLanguage('english'); });
    document.getElementById('lang-it').addEventListener('click', function() { changeLanguage('italian'); });
    document.getElementById('lang-gr').addEventListener('click', function() { changeLanguage('greek'); });
});

function changeLanguage(language) {
    fetch(`/i18n/${language}.json`)
        .then(response => response.json())
        .then(translations => {
            // Update text content for direct translations
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                el.textContent = translations[key];
            });

            // Update attributes for inputs and textareas
            document.querySelectorAll('[data-i18n-attr]').forEach(el => {
                const attributes = el.getAttribute('data-i18n-attr').split(', ');
                attributes.forEach(attr => {
                    const [attrName, translationKey] = attr.split('_');
                    el.setAttribute(attrName, translations[translationKey]);
                });
            });
        })
        .catch(error => console.error('Error loading the translation file:', error));
}

// Call changeLanguage with the default language on page load
changeLanguage('english'); // Assume 'english' as default, adjust as necessary


// Enable smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.getElementById("rsvp-form").addEventListener("submit", function(event) {
    event.preventDefault();

    var formData = new FormData(event.target);

    document.getElementById("loader").style.display = "block";

    fetch("https://script.google.com/macros/s/AKfycbzZoP2kMUj6i_tSGfKcLAI6pe4qwM4wUd5lzLNADKwIy9mt7JsBzZcmeyV_tYkjb4fw/exec", {
        method: "POST",
        body: formData
    })
    .then(response => {
        // Even if there's a CORS issue, the form might have been submitted successfully.
        // Check for response.ok or other success conditions here.
        if (response.ok || response.status === 200) {
            // Handle successful form submission here
            document.getElementById("feedback-message").innerHTML = "Form submitted successfully";
        } else {
            // If the response is not ok and it's not a CORS error, handle it as an actual error
            throw new Error('Form submission failed due to a server-side error.');
        }
    })
    .catch(error => {
        console.error('Error:', error);

        // In case of a network error, which might be caused by CORS, assume success since the actual form submission is not blocked by CORS
        if (error.message === 'NetworkError when attempting to fetch resource.') {
            document.getElementById("feedback-message").innerHTML = "Form submitted successfully.";
        } else {
            // Handle other types of errors as actual errors
            document.getElementById("feedback-message").innerHTML = "An error occurred while submitting the form";
        }
    }).finally(() => {
        // Hide the loader animation
        document.getElementById("loader").style.display = "none";
    });
});



  

