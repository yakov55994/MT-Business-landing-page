// קוד JavaScript לטיפול בטופס צור קשר באמצעות EmailJS
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // אתחול EmailJS
        // יש להחליף את [YOUR_PUBLIC_KEY] בקוד הציבורי שלך מהחשבון ב-EmailJS
        emailjs.init("lMSMFWaEKujVoJs7B");

        // וולידציה וטיפול בשליחה
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            let isValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const phoneInput = document.getElementById('phone');
            const businessTypeInput = document.getElementById('business-type');
            const serviceInput = document.getElementById('service');
            const budgetInput = document.getElementById('budget');

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

            if (isValid) {
                // הצג אינדיקציה לשליחה
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> שולח...';
                submitBtn.disabled = true;
            
                // הכנת הפרמטרים לשליחה
                const templateParams = {
                    name: nameInput.value,
                    email: emailInput.value,
                    phone: phoneInput.value || 'לא צוין',
                    business_type: businessTypeInput.value || 'לא צוין',
                    service: serviceInput.value || 'לא צוין',
                    budget: budgetInput.value || 'לא צוין',
                    message: messageInput.value
                };
            
                // שליחה באמצעות EmailJS לך (בעל האתר)
                emailjs.send('service_dv42uhs', 'template_5r8219s', templateParams)
                    .then(function(response) {
                        console.log('SUCCESS - Notification to owner!', response.status, response.text);
                        
                        // לאחר שליחה מוצלחת לבעל האתר, שלח תשובה אוטומטית ללקוח
                        return emailjs.send('service_dv42uhs', 'template_yre4m7t', {
                            name: nameInput.value,
                            email: emailInput.value,
                            reply_to: 'madetomorrow10@gmail.com' // כתובת המייל שלך למענה
                        });
                    })
                    .then(function(response) {
                        if (response) {
                            console.log('SUCCESS - Auto-reply to customer!', response.status, response.text);
                        }
                        
                        // הצגת הודעת הצלחה
                        showSuccessMessage();
                        
                        // איפוס הטופס
                        contactForm.reset();
                    })
                    .catch(function(error) {
                        console.log('FAILED...', error);
                        
                        // הצגת הודעת שגיאה
                        showErrorMessage();
                    })
                    .finally(function() {
                        // החזרת כפתור השליחה למצב רגיל
                        submitBtn.innerHTML = 'קבל ייעוץ תדמית ללא עלות';
                        submitBtn.disabled = false;
                    });
            }
        });

        // הוספת אפשרות שליחה לוואטסאפ
        const whatsappLink = document.querySelector('.whatsapp-link');
        if (whatsappLink) {
            whatsappLink.addEventListener('click', function (e) {
                // כבר מוגדר בקישור עצמו, לא צריך לשנות
            });
        }
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

    function showSuccessMessage() {
        // יצירת אלמנט הודעת הצלחה
        const successMessage = document.createElement('div');
        successMessage.className = 'form-message success-message';
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> הפנייה נשלחה בהצלחה! נחזור אליך בהקדם.';
        
        // הוספת ההודעה לטופס
        const formContainer = contactForm.parentElement;
        formContainer.insertBefore(successMessage, contactForm);
        
        // הסתרת ההודעה אחרי 5 שניות
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    function showErrorMessage() {
        // יצירת אלמנט הודעת שגיאה
        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-message error-message';
        errorMessage.innerHTML = '<i class="fas fa-times-circle"></i> אירעה שגיאה בשליחת הפנייה. אנא נסה שוב או צור קשר בטלפון.';
        
        // הוספת ההודעה לטופס
        const formContainer = contactForm.parentElement;
        formContainer.insertBefore(errorMessage, contactForm);
        
        // הסתרת ההודעה אחרי 5 שניות
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }
});