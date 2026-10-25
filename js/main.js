// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

function setMenuOpen(open) {
  mainNav.classList.toggle('show', open);
  menuToggle.textContent = open ? '✕' : '☰';
  menuToggle.setAttribute('aria-expanded', open);
}

if (menuToggle && mainNav) {
  menuToggle.setAttribute('aria-expanded', 'false');

  menuToggle.addEventListener('click', () => {
    setMenuOpen(!mainNav.classList.contains('show'));
  });

  // Reset the mobile menu when the screen is widened to desktop size
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mainNav.classList.contains('show')) {
      setMenuOpen(false);
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => menu.classList.remove('show'));
    }
  });
}

// Floating contact toggle
const floatingMain = document.getElementById('floatingMain');
const floatingContact = document.querySelector('.floating-contact');

if (floatingMain && floatingContact) {
  floatingMain.addEventListener('click', () => {
    floatingContact.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!floatingContact.contains(e.target)) {
      floatingContact.classList.remove('active');
    }
  });
}

// Dropdowns on mobile / touch screens: first tap opens the submenu,
// second tap follows the link (e.g. to the Products page)
document.querySelectorAll('.dropdown > a').forEach(link => {
  link.addEventListener('click', function (e) {
    const isTouchOrMobile = window.innerWidth <= 768 || !window.matchMedia('(hover: hover)').matches;
    const submenu = this.nextElementSibling;
    if (isTouchOrMobile && !submenu.classList.contains('show')) {
      e.preventDefault();
      submenu.classList.add('show');
    }
  });
});

// Close open dropdowns when tapping elsewhere on the page
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => menu.classList.remove('show'));
  }
});

// Banner slider
(function () {
  const slides   = document.querySelectorAll('.slide');
  const dots     = document.querySelectorAll('.dot');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const slider   = document.getElementById('bannerSlider');

  if (!slides.length || !slider) return;

  let current    = 0;
  let timer      = null;
  const INTERVAL = 8000; // ms between auto-advances

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function startAuto() {
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index));
      resetAuto();
    });
  });

  // Pause on hover
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', startAuto);

  // Swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  });

  startAuto();
})();

// Image Modal Functionality for Product Pages
(function() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    const modalImg = document.getElementById('modalImage');
    const closeBtn = modal.querySelector('.modal-close');
    
    // Add click handlers to all view sketch/dimension links
    document.querySelectorAll('.view-sketch, .view-dimension').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const imagePath = this.getAttribute('data-image');
            if (imagePath && modalImg) {
                modalImg.src = imagePath;
                modal.style.display = 'flex';
            }
        });
    });
    
    // Close modal when clicking X
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close modal with the Esc key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') modal.style.display = 'none';
    });
})();

// Contact form validation and submission (Web3Forms)
(function () {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = form.querySelector('.send-btn');
    const captchaError = form.querySelector('.captcha-error');
    const fields = form.querySelectorAll('.input-icon input, .input-icon textarea');

    // Pop-up message
    const popup = document.getElementById('formPopup');
    const popupIcon = popup.querySelector('.popup-icon i');
    const popupTitle = popup.querySelector('#popupTitle');
    const popupMessage = popup.querySelector('.popup-message');
    const popupList = popup.querySelector('.popup-list');
    const popupClose = popup.querySelector('.popup-close');
    let focusAfterClose = null;

    function showPopup(type, title, message, items = []) {
        popup.className = 'form-popup ' + type;
        popupIcon.className = type === 'success' ? 'fas fa-check' : 'fas fa-exclamation';
        popupTitle.textContent = title;
        popupMessage.textContent = message;
        popupList.innerHTML = '';
        items.forEach(text => {
            const li = document.createElement('li');
            li.textContent = text;
            popupList.appendChild(li);
        });
        popup.hidden = false;
        popupClose.focus();
    }

    function closePopup() {
        popup.hidden = true;
        if (focusAfterClose) focusAfterClose.focus();
        focusAfterClose = null;
    }

    popupClose.addEventListener('click', closePopup);
    popup.addEventListener('click', (e) => { if (e.target === popup) closePopup(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !popup.hidden) closePopup(); });

    function fieldLabel(field) {
        return field.closest('.form-group').querySelector('label').firstChild.textContent.trim();
    }

    function fieldMessage(field) {
        if (field.validity.valueMissing) return 'Please fill out this field.';
        if (field.validity.typeMismatch) return 'Please enter a valid email address.';
        if (field.validity.patternMismatch) return 'Please enter a valid phone number.';
        return '';
    }

    function validateField(field) {
        const message = fieldMessage(field);
        field.classList.toggle('invalid', message !== '');
        field.closest('.form-group').querySelector('.field-error').textContent = message;
        return message === '';
    }

    fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        captchaError.textContent = '';

        const problems = [];
        let firstInvalid = null;
        fields.forEach(field => {
            if (!validateField(field)) {
                const label = fieldLabel(field);
                problems.push(field.validity.valueMissing ? label + ' is required' : label + ' is not valid');
                firstInvalid = firstInvalid || field;
            }
        });

        const formData = new FormData(form);
        if (!formData.get('h-captcha-response')) {
            captchaError.textContent = 'Please complete the captcha.';
            problems.push('Please tick the captcha (I am human)');
        }

        if (problems.length) {
            focusAfterClose = firstInvalid;
            showPopup('error', 'Missing or invalid fields', 'Please check the following and try again:', problems);
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                form.reset();
                showPopup('success', 'Enquiry sent!', 'Thank you for your enquiry. Our team will get back to you soon.');
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            showPopup('error', 'Message not sent', 'Sorry, your enquiry could not be sent. Please try again later or contact us via WhatsApp at +60 16-323 0248.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    });

    // Reset button: also clear error messages and the captcha
    form.addEventListener('reset', () => {
        fields.forEach(field => field.classList.remove('invalid'));
        form.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
        if (window.hcaptcha) window.hcaptcha.reset();
    });
})();

// Bonfiglioli range: product type cards switch which panel of items is shown.
// Links like bonfiglioli.html#right-angle or #a-series open the matching type.
(function () {
    const cards = document.querySelectorAll('.bf-type-card');
    if (!cards.length) return;

    function activate(type, scroll) {
        cards.forEach(card => {
            const on = card.dataset.type === type;
            card.classList.toggle('active', on);
            card.setAttribute('aria-selected', on);
            document.getElementById('panel-' + card.dataset.type).hidden = !on;
        });
        if (scroll) document.getElementById('panel-' + type).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            activate(card.dataset.type, false);
            history.replaceState(null, '', '#' + card.dataset.type);
        });
    });

    // Open the type named in the URL (a type id, or an item id inside a type)
    function fromHash() {
        const id = decodeURIComponent(location.hash.slice(1));
        if (!id) return;
        const card = document.querySelector(`.bf-type-card[data-type="${CSS.escape(id)}"]`);
        const item = document.getElementById(id);
        const panel = card ? null : item && item.closest('.bf-type-panel');
        if (card) activate(id, true);
        else if (panel) {
            activate(panel.id.replace('panel-', ''), false);
            item.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    fromHash();
    window.addEventListener('hashchange', fromHash);
})();

// Product photo galleries (Bonfiglioli pages): auto-advance every 5s,
// thumbnails jump to a photo, drag/swipe the photo to change it,
// hovering pauses the slideshow. Photos that don't exist yet are skipped.
document.querySelectorAll('.bf-gallery').forEach(gallery => {
    const mainBox = gallery.querySelector('.bf-gallery-main');
    const mainImg = mainBox.querySelector('img');
    const thumbBar = gallery.querySelector('.bf-gallery-thumbs');
    const thumbs = [...gallery.querySelectorAll('.bf-gallery-thumbs button')];
    const PLACEHOLDER = '../images/logo/default-placeholder.png';
    const INTERVAL = 5000;  // ms between photos
    const SWIPE_MIN = 50;   // px a drag must travel to change photo
    let current = thumbs.find(t => t.classList.contains('active')) || thumbs[0];
    let timer = null;

    // Only photos that loaded take part in the slideshow
    const available = () => thumbs.filter(t => !t.hidden);

    function show(step) {
        const list = available();
        if (list.length < 2) return;
        const next = list[(list.indexOf(current) + step + list.length) % list.length];
        select(next);
    }

    function select(thumb) {
        if (thumb === current) return;
        current.classList.remove('active');
        thumb.classList.add('active');
        current = thumb;

        mainImg.classList.add('fading');
        setTimeout(() => {
            mainImg.src = thumb.dataset.src;
            mainImg.classList.remove('fading');
        }, 200);
    }

    function start() {
        stop();
        if (available().length > 1) timer = setInterval(() => show(1), INTERVAL);
    }

    function stop() {
        clearInterval(timer);
    }

    // Missing photo files: hide that thumbnail; show a placeholder if none load.
    // Images may have failed before this script ran, so check both now and later.
    const failed = img => img.complete && img.naturalWidth === 0;

    function hideThumb(thumb) {
        thumb.hidden = true;
        // A strip with one (or no) thumbnail adds nothing, so hide it
        if (available().length < 2) thumbBar.hidden = true;
    }

    // The main photo failed: switch to a photo that did load, else the placeholder
    function mainFailed() {
        const loaded = available().find(t => t !== current && t.querySelector('img').naturalWidth > 0);
        if (loaded) select(loaded);
        else if (!mainImg.src.endsWith(PLACEHOLDER.replace('..', ''))) {
            mainImg.src = PLACEHOLDER;
            gallery.classList.add('bf-gallery--empty');
        }
    }

    thumbs.forEach(thumb => {
        const img = thumb.querySelector('img');
        if (failed(img)) hideThumb(thumb);
        else img.addEventListener('error', () => hideThumb(thumb));
    });

    mainImg.addEventListener('error', mainFailed);
    if (failed(mainImg)) mainFailed();

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            select(thumb);
            start(); // restart the countdown from the chosen photo
        });
    });

    gallery.addEventListener('mouseenter', stop);
    gallery.addEventListener('mouseleave', start);

    // Drag with the mouse or swipe with a finger: left = next, right = previous
    let dragStartX = null;
    let dragX = 0;

    mainImg.draggable = false; // stop the browser's own image drag

    // Tap / click (without dragging) opens the photo full-size in the image modal
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');

    function openZoom() {
        if (!modal || mainImg.src.endsWith(PLACEHOLDER.replace('..', ''))) return;
        modalImg.src = mainImg.src;
        modalImg.alt = mainImg.alt;
        modal.classList.add('zoom-photo');
        modal.style.display = 'flex';
        stop();
    }

    if (modal) {
        const hint = document.createElement('span');
        hint.className = 'bf-zoom-hint';
        hint.innerHTML = '<i class="fas fa-magnifying-glass-plus"></i>';
        mainBox.appendChild(hint);
    }

    mainBox.addEventListener('pointerdown', (e) => {
        dragStartX = e.clientX;
        dragX = 0;
        mainBox.setPointerCapture(e.pointerId);
        mainBox.classList.add('dragging');
        stop();
    });

    mainBox.addEventListener('pointermove', (e) => {
        if (dragStartX === null) return;
        dragX = e.clientX - dragStartX;
        mainImg.style.transform = `translateX(${dragX}px)`; // photo follows the pointer
    });

    function endDrag(e) {
        if (dragStartX === null) return;
        dragStartX = null;
        mainBox.classList.remove('dragging');
        mainImg.style.transform = ''; // springs back to the centre

        if (Math.abs(dragX) > SWIPE_MIN) show(dragX < 0 ? 1 : -1);
        else if (e.type === 'pointerup' && Math.abs(dragX) < 6) return openZoom(); // a tap, not a drag
        // A mouse is still over the gallery (paused); touch has no hover, so resume
        if (e.pointerType !== 'mouse') start();
    }

    mainBox.addEventListener('pointerup', endDrag);
    mainBox.addEventListener('pointercancel', endDrag);

    // Respect visitors who turn off animations in their system settings
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        start();
    }
});
