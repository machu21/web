// assets/script.js
// Specialized Virtual Deals - Main Script
document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. General Page Functionality (Header & Scrolling) --- */
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor =>  {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                if (targetId === '#terms') {
                    toggleTerms(true);
                } else {
                    window.scrollTo({
                        top: targetEl.offsetTop - (header ? header.offsetHeight : 0),
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    /* --- 2. Terms & Conditions Toggle --- */
    const termsSection = document.getElementById('terms');
    const closeTermsBtn = document.getElementById('closeTermsBtn');

    const toggleTerms = (show) => {
        if (termsSection) {
            termsSection.style.display = show ? 'block' : 'none';
            if (show) {
                termsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    if (closeTermsBtn) {
        closeTermsBtn.addEventListener('click', () => toggleTerms(false));
    }

    /* --- 3. Detailed Services Carousel --- */
    const servicesContainer = document.querySelector('.detailed-services .carousel-container');
    if (servicesContainer) {
        const track = document.getElementById('carouselTrack');
        const dots = servicesContainer.querySelectorAll('.carousel-nav .nav-dot');
        const progressBar = document.getElementById('progressBar');
        const totalSlides = dots.length;
        let currentSlide = 0;
        let progressInterval;

        const updateCarousel = () => {
            if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));
        };

        const resetAutoPlay = () => {
            clearInterval(progressInterval);
            let progress = 0;
            if (progressBar) progressBar.style.width = '0%';
            progressInterval = setInterval(() => {
                progress += 0.5;
                if (progressBar) progressBar.style.width = `${progress}%`;
                if (progress >= 100) nextSlide();
            }, 25);
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
            resetAutoPlay();
        };

        const previousSlide = () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
            resetAutoPlay();
        };

        const goToSlide = (index) => {
            currentSlide = index;
            updateCarousel();
            resetAutoPlay();
        };

        window.nextSlide = nextSlide;
        window.previousSlide = previousSlide;
        window.goToSlide = goToSlide;

        updateCarousel();
        resetAutoPlay();
        servicesContainer.addEventListener('mouseenter', () => clearInterval(progressInterval));
        servicesContainer.addEventListener('mouseleave', resetAutoPlay);
    }

    /* --- 4. Features Carousel --- */
    const featuresContainer = document.getElementById('featuresCarouselContainer');
    if (featuresContainer) {
        const track = document.getElementById('featuresCarouselTrack');
        const nav = document.getElementById('featuresCarouselNav');
        const progressBar = document.getElementById('featuresProgressBar');
        const slides = track.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        let currentSlide = 0;
        let progressInterval;

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('nav-dot');
            dot.onclick = () => goToFeatureSlide(i);
            nav.appendChild(dot);
        }
        const dots = nav.querySelectorAll('.nav-dot');

        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));
        };

        const resetAutoPlay = () => {
            clearInterval(progressInterval);
            let progress = 0;
            if (progressBar) progressBar.style.width = '0%';
            progressInterval = setInterval(() => {
                progress += 0.5;
                if (progressBar) progressBar.style.width = `${progress}%`;
                if (progress >= 100) nextFeatureSlide();
            }, 25);
        };

        const nextFeatureSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
            resetAutoPlay();
        };

        const previousFeatureSlide = () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
            resetAutoPlay();
        };

        const goToFeatureSlide = (index) => {
            currentSlide = index;
            updateCarousel();
            resetAutoPlay();
        };

        window.nextFeatureSlide = nextFeatureSlide;
        window.previousFeatureSlide = previousFeatureSlide;
        window.goToFeatureSlide = goToFeatureSlide;

        updateCarousel();
        resetAutoPlay();
        featuresContainer.addEventListener('mouseenter', () => clearInterval(progressInterval));
        featuresContainer.addEventListener('mouseleave', resetAutoPlay);
    }

    /* --- 5. Chatbot Functionality --- */
    const chatIcon = document.getElementById('chatIcon');
    const chatbox = document.getElementById('chatbox');
    const closeBtn = document.getElementById('closeBtn');
    const questionsList = document.getElementById('questionsList');
    const answerSections = document.querySelectorAll('.answer-section');
    const questionBtns = document.querySelectorAll('.question-btn');
    const backBtns = document.querySelectorAll('.back-btn');
    const contactFooter = document.querySelector('.contact-footer');

    function showChatView(viewToShow) {
        const isQuestions = viewToShow === questionsList;
        questionsList.classList.toggle('active', isQuestions);
        answerSections.forEach(section => section.classList.remove('active'));
        if (!isQuestions) viewToShow.classList.add('active');
        if (contactFooter) contactFooter.style.display = isQuestions ? 'block' : 'none';

        requestAnimationFrame(() => {
            const chatMainView = document.querySelector('.chat-main-view');
            if (chatMainView) chatMainView.scrollTop = 0;
        });
    }

    chatIcon.addEventListener('click', () => {
        chatbox.classList.toggle('active');
        const dot = chatIcon.querySelector('.notification-dot');
        if (dot) dot.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        chatbox.classList.remove('active');
    });

    questionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const answerId = `answer-${btn.dataset.answer}`;
            const answerSection = document.getElementById(answerId);
            if (answerSection) showChatView(answerSection);
        });
    });

    backBtns.forEach(btn => {
        btn.addEventListener('click', () => showChatView(questionsList));
    });

    document.addEventListener('click', (event) => {
        if (!chatbox.contains(event.target) && !chatIcon.contains(event.target)) {
            chatbox.classList.remove('active');
        }
    });

    /* --- 6. Chatbot Email Form Submission --- */
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    const PROXY_ENDPOINT = 'https://specialized-virtual-deals-form.matthew-patacsil021.workers.dev';

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (emailForm) {
        emailForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = emailInput.value.trim();

            if (!validateEmail(email)) {
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.style.color = '#e74c3c';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formMessage.textContent = '';

            try {
                const res = await fetch(PROXY_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                        
                    },
                    body: JSON.stringify({ email })
                });

                const data = await res.json();

                if (data.result === 'success') {
                    formMessage.textContent = 'Thank you! We will be in touch shortly.';
                    formMessage.style.color = '#27ae60';
                    emailInput.value = '';
                    submitBtn.textContent = 'Submitted!';
                } else {
                    throw new Error(data.message || 'Something went wrong. Try again.');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                formMessage.textContent = error.message || 'Failed to send. Please try again.';
                formMessage.style.color = '#e74c3c';
                submitBtn.textContent = 'Get a Free Consultation';
            } finally {
                submitBtn.disabled = false;
            }
        });
    }
});
