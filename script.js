/* =========================================================
   HerCareer — script.js
   Vanilla JavaScript. Shared across index.html and login.html.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Static job data ---------- */
  var jobs = [
    { title: 'Senior Frontend Developer', company: 'Brightwave Tech', location: 'Remote', type: 'Full-time', logo: 'B', color: 'linear-gradient(135deg,#2f7be0,#2cc7e6)' },
    { title: 'Product Manager', company: 'Lumina Labs', location: 'Bengaluru, IN', type: 'Full-time', logo: 'L', color: 'linear-gradient(135deg,#ec3f8c,#ff6b3d)' },
    { title: 'UX Designer', company: 'Nimbus Studio', location: 'Remote', type: 'Contract', logo: 'N', color: 'linear-gradient(135deg,#f5a623,#ff6b3d)' },
    { title: 'Data Analyst', company: 'Pinecrest Data', location: 'Toronto, CA', type: 'Full-time', logo: 'P', color: 'linear-gradient(135deg,#34c77b,#14a098)' },
    { title: 'Marketing Lead', company: 'Verdant Co.', location: 'London, UK', type: 'Full-time', logo: 'V', color: 'linear-gradient(135deg,#14a098,#2cc7e6)' },
    { title: 'Backend Engineer', company: 'Stratosphere', location: 'Remote', type: 'Full-time', logo: 'S', color: 'linear-gradient(135deg,#2f7be0,#ec3f8c)' }
  ];

  /* ---------- DOM ready ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initMobileNav();
    initActiveNav();
    initReveal();
    renderJobs();
    initContactForm();
    initAuth();
    setYear();
  });

  /* ---------- Header shadow on scroll ---------- */
  function initHeader() {
    var header = document.getElementById('header');
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile hamburger menu ---------- */
  function initMobileNav() {
    var toggle = document.getElementById('hamburger');
    var menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    var closeMenu = function () {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close when a link is clicked
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  }

  /* ---------- Highlight active nav link on scroll ---------- */
  function initActiveNav() {
    var links = document.querySelectorAll('.nav-link');
    if (!links.length) return;
    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute('href');
      if (id && id.charAt(0) === '#' && id.length > 1) {
        var sec = document.querySelector(id);
        if (sec) sections.push({ link: link, el: sec });
      }
    });
    if (!sections.length) return;

    var onScroll = function () {
      var pos = window.scrollY + 100;
      var current = null;
      sections.forEach(function (s) {
        if (s.el.offsetTop <= pos) current = s;
      });
      sections.forEach(function (s) { s.link.classList.remove('active'); });
      if (current) current.link.classList.add('active');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Reveal-on-scroll animations ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Render job cards ---------- */
  function renderJobs() {
    var grid = document.getElementById('jobsGrid');
    if (!grid) return;

    var html = jobs.map(function (job) {
      var remote = job.location.toLowerCase() === 'remote' ? 'job-tag remote' : 'job-tag';
      return (
        '<article class="job-card reveal">' +
          '<div class="job-top">' +
            '<div class="job-logo" style="background:' + job.color + '">' + job.logo + '</div>' +
            '<div>' +
              '<p class="job-company">' + job.company + '</p>' +
            '</div>' +
          '</div>' +
          '<h3 class="job-title">' + job.title + '</h3>' +
          '<div class="job-meta">' +
            '<span class="' + remote + '">' + job.location + '</span>' +
            '<span class="job-tag fulltime">' + job.type + '</span>' +
          '</div>' +
          '<a href="#" class="job-apply" data-job="' + job.title + '">' +
            'Apply now <span class="arrow" aria-hidden="true">&rarr;</span>' +
          '</a>' +
        '</article>'
      );
    }).join('');

    grid.innerHTML = html;

    // Re-observe newly injected reveal elements
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    grid.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    // Apply button feedback (frontend only)
    grid.querySelectorAll('.job-apply').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var title = btn.getAttribute('data-job');
        var original = btn.innerHTML;
        btn.innerHTML = 'Opening application…';
        btn.style.pointerEvents = 'none';
        setTimeout(function () {
          btn.innerHTML = '✓ Applied for ' + title;
          setTimeout(function () {
            btn.innerHTML = original;
            btn.style.pointerEvents = '';
          }, 2200);
        }, 700);
      });
    });
  }

  /* ---------- Validation helpers ---------- */
  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }
  function showError(id, msg) {
    var el = document.getElementById(id);
    if (el) el.textContent = msg || '';
  }
  function clearErrors(prefix) {
    document.querySelectorAll('.error').forEach(function (e) {
      if (!prefix || e.id.indexOf(prefix) === 0) e.textContent = '';
    });
  }

  /* ---------- Contact form ---------- */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors();

      var name = document.getElementById('cName');
      var email = document.getElementById('cEmail');
      var message = document.getElementById('cMessage');
      var ok = true;

      if (!name.value.trim()) { showError('cNameErr', 'Please enter your name.'); ok = false; }
      if (!email.value.trim()) { showError('cEmailErr', 'Please enter your email.'); ok = false; }
      else if (!isEmail(email.value.trim())) { showError('cEmailErr', 'Please enter a valid email.'); ok = false; }
      if (!message.value.trim()) { showError('cMessageErr', 'Please enter a message.'); ok = false; }
      else if (message.value.trim().length < 10) { showError('cMessageErr', 'Message should be at least 10 characters.'); ok = false; }

      if (!ok) return;

      var success = document.getElementById('contactSuccess');
      success.textContent = 'Thank you, ' + name.value.trim().split(' ')[0] + '! Your message has been sent.';
      form.reset();
      setTimeout(function () { success.textContent = ''; }, 5000);
    });
  }

  /* ---------- Auth (login/signup) page ---------- */
  function initAuth() {
    var tabLogin = document.getElementById('tabLogin');
    var tabSignup = document.getElementById('tabSignup');
    var loginPanel = document.getElementById('loginPanel');
    var signupPanel = document.getElementById('signupPanel');
    if (!tabLogin || !tabSignup) return;

    function show(panel, tab, otherPanel, otherTab) {
      panel.classList.remove('hidden');
      otherPanel.classList.add('hidden');
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      otherTab.classList.remove('active');
      otherTab.setAttribute('aria-selected', 'false');
      clearErrors();
      var s = document.getElementById('loginSuccess'); if (s) s.textContent = '';
      var s2 = document.getElementById('signupSuccess'); if (s2) s2.textContent = '';
    }

    tabLogin.addEventListener('click', function () {
      show(loginPanel, tabLogin, signupPanel, tabSignup);
    });
    tabSignup.addEventListener('click', function () {
      show(signupPanel, tabSignup, loginPanel, tabLogin);
    });

    var switchToSignup = document.getElementById('switchToSignup');
    var switchToLogin = document.getElementById('switchToLogin');
    if (switchToSignup) switchToSignup.addEventListener('click', function () { tabSignup.click(); });
    if (switchToLogin) switchToLogin.addEventListener('click', function () { tabLogin.click(); });

    // Login validation
    if (loginPanel) {
      loginPanel.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors('login');
        var email = document.getElementById('loginEmail');
        var pass = document.getElementById('loginPassword');
        var ok = true;
        if (!email.value.trim()) { showError('loginEmailErr', 'Email is required.'); ok = false; }
        else if (!isEmail(email.value.trim())) { showError('loginEmailErr', 'Enter a valid email.'); ok = false; }
        if (!pass.value) { showError('loginPasswordErr', 'Password is required.'); ok = false; }
        else if (pass.value.length < 6) { showError('loginPasswordErr', 'Password must be at least 6 characters.'); ok = false; }
        if (!ok) return;
        var s = document.getElementById('loginSuccess');
        s.textContent = 'Welcome back! Redirecting to your dashboard…';
        loginPanel.reset();
        setTimeout(function () { s.textContent = ''; }, 5000);
      });
    }

    // Signup validation
    if (signupPanel) {
      signupPanel.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors('su');
        var name = document.getElementById('suName');
        var email = document.getElementById('suEmail');
        var pass = document.getElementById('suPassword');
        var ok = true;
        if (!name.value.trim()) { showError('suNameErr', 'Please enter your name.'); ok = false; }
        if (!email.value.trim()) { showError('suEmailErr', 'Email is required.'); ok = false; }
        else if (!isEmail(email.value.trim())) { showError('suEmailErr', 'Enter a valid email.'); ok = false; }
        if (!pass.value) { showError('suPasswordErr', 'Password is required.'); ok = false; }
        else if (pass.value.length < 6) { showError('suPasswordErr', 'Use at least 6 characters.'); ok = false; }
        if (!ok) return;
        var s = document.getElementById('signupSuccess');
        s.textContent = 'Account created! Welcome to HerCareer, ' + name.value.trim().split(' ')[0] + '.';
        signupPanel.reset();
        setTimeout(function () { s.textContent = ''; }, 5000);
      });
    }
  }

  /* ---------- Footer year ---------- */
  function setYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

})();
