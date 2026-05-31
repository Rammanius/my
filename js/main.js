const anchorLinks = document.querySelectorAll('a[href^="#"]');
const navLinks = document.querySelectorAll('.header-nav a[href^="#"]');
const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzStsjkM4O38BZTskZE3Bn7LYo4DFqH2MEx5Ael6ff90LyMfLVGT6RaMk4Of23jWXMM/exec';

function setFormStatus(statusElement, message, type) {
    if (!statusElement) {
        return;
    }

    statusElement.textContent = message;
    statusElement.classList.remove('is-success', 'is-error');
    statusElement.classList.add('is-visible', `is-${type}`);
}

document.querySelectorAll('[data-google-sheets-form]').forEach(form => {
    const statusElement = form.querySelector('[data-form-status]');
    const submitButton = form.querySelector('button[type="submit"]');
    const defaultButtonText = submitButton ? submitButton.textContent : '';

    form.addEventListener('submit', async event => {
        event.preventDefault();

        if (!GOOGLE_SHEETS_WEB_APP_URL) {
            setFormStatus(statusElement, 'Форма готова. Добавьте URL Google Apps Script в js/main.js.', 'error');
            return;
        }

        const formData = new FormData(form);
        const body = new URLSearchParams(formData);
        body.append('submitted_at', new Date().toISOString());
        body.append('page_url', window.location.href);
        body.append('user_agent', navigator.userAgent);

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Отправляем...';
        }

        try {
            await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
                body
            });

            form.reset();
            setFormStatus(statusElement, 'Заявка отправлена. Спасибо, я свяжусь с вами в ближайшее время.', 'success');
        } catch (error) {
            setFormStatus(statusElement, 'Не удалось отправить заявку. Попробуйте написать напрямую на email или в мессенджер.', 'error');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = defaultButtonText;
            }
        }
    });
});

anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); 
        
        const targetId = this.getAttribute('href').substring(1);
        if (!targetId) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    });
});

const sectionTargets = Array.from(navLinks)
    .map(link => document.getElementById(link.getAttribute('href').substring(1)))
    .filter(Boolean);

function setActiveNavLink() {
    let activeId = sectionTargets.length ? sectionTargets[0].id : '';

    sectionTargets.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 140) {
            activeId = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });
}

const revealItems = document.querySelectorAll('.card, .case-card, .software-card, .faq-item, .product-value-card, .module-card, .outcome-card, .purchase-card, .featured-article, .article-card');
revealItems.forEach(item => item.classList.add('reveal'));

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach(item => revealObserver.observe(item));
} else {
    revealItems.forEach(item => item.classList.add('is-visible'));
}

window.addEventListener('scroll', setActiveNavLink, { passive: true });
setActiveNavLink();
