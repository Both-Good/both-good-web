// Mailing list signup (MailerLite form "Both Good Mailing List").
// Our own plain form posts straight to MailerLite's endpoint, so we skip their
// styled widget + jQuery. The MailerLite form has reCAPTCHA turned on, so we
// render Google's checkbox (dark theme) inside each form.

const ML_ACTION = 'https://assets.mailerlite.com/jsonp/1327539/forms/204511100450899014/subscribe';
const ML_VIEW_PING = 'https://assets.mailerlite.com/jsonp/1327539/forms/204511100450899014/takel';
const RECAPTCHA_SITEKEY = '6Lf1KHQUAAAAAFNKEX1hdSWCS3mRMv4FlFaNslaD'; // MailerLite's key, from their embed

// reCAPTCHA calls this once its script has loaded
function bgRecaptchaReady() {
    document.querySelectorAll('form.signup .captcha-slot').forEach(slot => {
        const id = grecaptcha.render(slot, {
            sitekey: RECAPTCHA_SITEKEY,
            theme: 'dark',
            size: window.innerWidth < 400 ? 'compact' : 'normal',
        });
        slot.closest('form').dataset.captchaId = id;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form.signup');
    if (!forms.length) return;

    // counts a form view in MailerLite's stats, same as their embed does
    fetch(ML_VIEW_PING).catch(() => {});

    const s = document.createElement('script');
    s.src = 'https://www.google.com/recaptcha/api.js?onload=bgRecaptchaReady&render=explicit';
    s.async = true;
    document.head.appendChild(s);

    forms.forEach(form => {
        const status = form.querySelector('.signup-status');
        const button = form.querySelector('button');
        const email = form.querySelector('input[type="email"]');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = form.dataset.captchaId;
            const token = (window.grecaptcha && id !== undefined) ? grecaptcha.getResponse(Number(id)) : '';
            if (!token) {
                status.textContent = 'tick the "I\'m not a robot" box first';
                return;
            }

            const data = new FormData();
            data.append('fields[email]', email.value);
            data.append('g-recaptcha-response', token);
            data.append('ml-submit', '1');
            data.append('anticsrf', 'true');

            button.disabled = true;
            status.textContent = 'sending...';
            try {
                const res = await fetch(ML_ACTION, { method: 'POST', body: data });
                const json = await res.json().catch(() => ({}));
                if (res.ok && json.success) {
                    form.querySelectorAll('input, button, .captcha-slot').forEach(el => el.style.display = 'none');
                    status.textContent = 'you\'re on the list. thanks!';
                } else {
                    status.textContent = 'hmm, that didn\'t work. check the email and try again?';
                    grecaptcha.reset(Number(id));
                }
            } catch (err) {
                status.textContent = 'hmm, that didn\'t go through. try again?';
            } finally {
                button.disabled = false;
            }
        });
    });
});
