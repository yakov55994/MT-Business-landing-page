// הוסף קוד זה לקובץ script.js או צור קובץ חדש contact-form.js
// החלק הראשון עובד עם FormSubmit.co - שירות חינמי לשליחת טפסים במייל

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // הגדר את כתובת השליחה ל-FormSubmit
        contactForm.setAttribute('action', 'https://formsubmit.co/mmmtweb2@gmail.com');
        contactForm.setAttribute('method', 'POST');

        // הוסף שדות נסתרים לקונפיגורציה
        const hiddenFields = [
            { name: '_subject', value: 'פנייה חדשה מהאתר Made Tomorrow' },
            { name: '_template', value: 'table' },
            { name: '_captcha', value: 'false' }, // הסר את זה אם אתה רוצה אבטחת captcha
            { name: '_next', value: window.location.origin + '/thank-you.html' } // דף תודה לאחר השליחה
        ];

        hiddenFields.forEach(field => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field.name;
            input.value = field.value;
            contactForm.appendChild(input);
        });

        // הוסף וולידציה וטיפול בשליחה
        contactForm.addEventListener('submit', function (e) {
            let isValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            // וולידציה בסיסית
            if (!nameInput.value.trim()) {
                showError(nameInput, 'אנא הזן את שמך');
                isValid = false;
            }

            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                showError(emailInput, 'אנא הזן כתובת מייל תקינה');
                isValid = false;
            }

            if (!messageInput.value.trim()) {
                showError(messageInput, 'אנא הזן הודעה');
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            } else {
                // הצג אינדיקציה לשליחה
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> שולח...';
                submitBtn.disabled = true;
            }
        });
    }

    // אפשרות שניה - שליחה לוואטסאפ
    const whatsappBtn = document.querySelector('.whatsapp-contact');

    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value || '';
            const email = document.getElementById('email').value || '';
            const phone = document.getElementById('phone').value || '';
            const service = document.getElementById('service')?.value || '';
            const message = document.getElementById('message').value || '';

            // בנה את ההודעה לוואטסאפ
            let whatsappMessage = `שלום, אני ${name}. `;

            if (email) whatsappMessage += `המייל שלי: ${email}. `;
            if (phone) whatsappMessage += `הטלפון שלי: ${phone}. `;
            if (service) whatsappMessage += `אני מתעניין בשירות: ${service}. `;
            if (message) whatsappMessage += `הודעה: ${message}`;

            // החלף PHONE_NUMBER עם המספר שלך בפורמט בינלאומי (ללא + או מקפים)
            const whatsappUrl = `https://wa.me/16465358055?text=${encodeURIComponent(whatsappMessage)}`;

            window.open(whatsappUrl, '_blank');
        });
    }

    // פונקציות עזר
    function showError(input, message) {
        const formGroup = input.parentElement;
        let errorDiv = formGroup.querySelector('.error-message');

        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            formGroup.appendChild(errorDiv);
        }

        errorDiv.textContent = message;
        input.classList.add('input-error');

        input.addEventListener('input', function () {
            errorDiv.textContent = '';
            input.classList.remove('input-error');
        }, { once: true });
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});