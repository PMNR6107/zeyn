/**
 * ZEYN — Company Website JavaScript
 * Pure Vanilla JavaScript: Robust, fast, and accessible.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Mobile Navigation Toggle
    // -------------------------------------------------------------------------
    const menuButton = document.getElementById('menuButton');
    const mobileDrawer = document.getElementById('mobileDrawer');

    if (menuButton && mobileDrawer) {
        const toggleMenu = (open) => {
            const shouldOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
            mobileDrawer.classList.toggle('open', shouldOpen);
            menuButton.classList.toggle('is-active', shouldOpen);
            menuButton.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
            document.body.classList.toggle('modal-open', shouldOpen);
        };

        menuButton.addEventListener('click', () => toggleMenu());

        // Close mobile drawer when clicking any nav link
        mobileDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // -------------------------------------------------------------------------
    // 2. Smooth Navigation & Active Link Highlighting
    // -------------------------------------------------------------------------
    const navLinks = document.querySelectorAll('.nav-desktop .nav-link');
    const sections = document.querySelectorAll('main section[id]');

    // IntersectionObserver for active section in navbar
    if ('IntersectionObserver' in window && sections.length > 0) {
        const sectionObserverOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${id}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, sectionObserverOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // -------------------------------------------------------------------------
    // 3. ZEYN CAMPUS Product Modal
    // -------------------------------------------------------------------------
    const openCampusBtn = document.getElementById('openCampusModalBtn');
    const closeCampusBtn = document.getElementById('closeCampusModalBtn');
    const campusModal = document.getElementById('campusModal');

    if (openCampusBtn && closeCampusBtn && campusModal) {
        const toggleCampusModal = (show) => {
            campusModal.classList.toggle('open', show);
            document.body.classList.toggle('modal-open', show);
            if (show) {
                closeCampusBtn.focus();
            } else {
                openCampusBtn.focus();
            }
        };

        openCampusBtn.addEventListener('click', () => toggleCampusModal(true));
        closeCampusBtn.addEventListener('click', () => toggleCampusModal(false));

        campusModal.addEventListener('click', (e) => {
            if (e.target === campusModal) {
                toggleCampusModal(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && campusModal.classList.contains('open')) {
                toggleCampusModal(false);
            }
        });
    }

    // -------------------------------------------------------------------------
    // 4. Copy Email Functionality
    // -------------------------------------------------------------------------
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const copyBtnText = document.getElementById('copyBtnText');
    const emailToCopy = 'manju.papasani@gmail.com';

    if (copyEmailBtn && copyBtnText) {
        copyEmailBtn.addEventListener('click', async () => {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(emailToCopy);
                } else {
                    // Fallback for non-https / legacy environments
                    const textarea = document.createElement('textarea');
                    textarea.value = emailToCopy;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                }

                copyBtnText.textContent = 'Copied!';
                copyEmailBtn.style.color = '#10b981';
                copyEmailBtn.style.borderColor = '#10b981';

                setTimeout(() => {
                    copyBtnText.textContent = 'Copy';
                    copyEmailBtn.style.color = '';
                    copyEmailBtn.style.borderColor = '';
                }, 2200);
            } catch (err) {
                console.warn('Clipboard copy failed: ', err);
            }
        });
    }

    // -------------------------------------------------------------------------
    // 5. Contact Form Handler (Direct Email Pre-population)
    // -------------------------------------------------------------------------
    const projectForm = document.getElementById('projectInquiryForm');

    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('clientName').value.trim();
            const email = document.getElementById('clientEmail').value.trim();
            const projectType = document.getElementById('projectType').value;
            const message = document.getElementById('projectMessage').value.trim();

            const plainBody = 
                `Hi ZEYN Team,\n\n` +
                `I would like to discuss a project with you:\n\n` +
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Service Needed: ${projectType}\n\n` +
                `Project Details:\n${message}\n\n` +
                `Best regards,\n${name}`;

            const subject = encodeURIComponent(`Project Inquiry: ${projectType} — ${name}`);
            const body = encodeURIComponent(plainBody);
            const mailtoUri = `mailto:manju.papasani@gmail.com?subject=${subject}&body=${body}`;

            // 1. Attempt to launch the user's default email client
            window.location.href = mailtoUri;

            // 2. Display immediate in-form confirmation feedback
            const feedbackNotice = document.getElementById('formFeedbackNotice');
            if (feedbackNotice) {
                feedbackNotice.innerHTML = `
                    <div class="feedback-status-badge">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M3 8.5l3.5 3.5 6.5-7"/>
                        </svg>
                        <span>Inquiry Prepared</span>
                    </div>
                    <p class="feedback-msg">
                        Your email client has been launched with your inquiry addressed to <strong>manju.papasani@gmail.com</strong>.
                    </p>
                    <div class="feedback-action-row">
                        <a href="${mailtoUri}" class="btn btn-primary btn-sm">Re-open Email App</a>
                        <a href="https://wa.me/919281162822?text=${encodeURIComponent('Hi ZEYN Team,\n\nProject Inquiry from: ' + name + '\nService: ' + projectType + '\nEmail: ' + email + '\n\nDetails:\n' + message)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="color: #15803d; border-color: #bbf7d0;">Chat on WhatsApp</a>
                        <button type="button" class="btn btn-secondary btn-sm" id="copyInquiryDetailsBtn">Copy Details</button>
                    </div>
                `;
                feedbackNotice.style.display = 'block';

                const copyInquiryBtn = document.getElementById('copyInquiryDetailsBtn');
                if (copyInquiryBtn) {
                    copyInquiryBtn.addEventListener('click', async () => {
                        try {
                            if (navigator.clipboard && window.isSecureContext) {
                                await navigator.clipboard.writeText(`To: manju.papasani@gmail.com\nSubject: Project Inquiry: ${projectType} — ${name}\n\n${plainBody}`);
                            } else {
                                const ta = document.createElement('textarea');
                                ta.value = `To: manju.papasani@gmail.com\nSubject: Project Inquiry: ${projectType} — ${name}\n\n${plainBody}`;
                                document.body.appendChild(ta);
                                ta.select();
                                document.execCommand('copy');
                                document.body.removeChild(ta);
                            }
                            copyInquiryBtn.textContent = 'Copied to Clipboard!';
                            setTimeout(() => {
                                copyInquiryBtn.textContent = 'Copy Details';
                            }, 2000);
                        } catch (err) {
                            console.warn('Copy failed:', err);
                        }
                    });
                }
            }

            // 3. Provide button visual feedback
            const submitBtn = projectForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <span>Inquiry Drafted</span>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 8.5l3.5 3.5 6.5-7"/>
                </svg>
            `;
            submitBtn.style.backgroundColor = '#16a34a';

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        });
    }

    // -------------------------------------------------------------------------
    // 6. Scroll Reveal Micro-Animations (500–700ms smooth reveal)
    // -------------------------------------------------------------------------
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // If reduced motion requested or no IntersectionObserver, display directly
        revealElements.forEach(el => el.classList.add('is-visible'));
    }

    // -------------------------------------------------------------------------
    // 7. Approach Section Progressive Connecting Line
    // -------------------------------------------------------------------------
    const processWrapper = document.querySelector('.process-wrapper');
    if (processWrapper && !prefersReducedMotion && 'IntersectionObserver' in window) {
        const processObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        processObserver.observe(processWrapper);
    } else if (processWrapper) {
        processWrapper.classList.add('is-visible');
    }

    // -------------------------------------------------------------------------
    // 8. Hero Vertically Complete Floating Small Dots Wave (Soft Slate Theme)
    // -------------------------------------------------------------------------
    const dotsCanvas = document.getElementById('heroDotsCanvas');

    if (dotsCanvas && !prefersReducedMotion) {
        const ctx = dotsCanvas.getContext('2d');
        let width = 0;
        let height = 0;
        let animId = null;

        let cols = 68;
        let rows = 46;
        let stepX = 28;
        let stepY = 22;
        const focalLength = 520;

        let mouseX = 0;
        let mouseY = 0;
        let currentTiltX = 0;
        let currentTiltY = 0;

        let textBounds = null;
        const updateTextBounds = () => {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent && dotsCanvas) {
                const cRect = heroContent.getBoundingClientRect();
                const canvasRect = dotsCanvas.getBoundingClientRect();
                textBounds = {
                    cx: cRect.left - canvasRect.left + cRect.width * 0.45,
                    cy: cRect.top - canvasRect.top + cRect.height * 0.5,
                    rx: cRect.width * 0.60,
                    ry: cRect.height * 0.58
                };
            }
        };

        const resize = () => {
            const rect = dotsCanvas.parentElement.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            dotsCanvas.width = width * dpr;
            dotsCanvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Calculate grid counts to ensure complete vertical and horizontal coverage
            cols = Math.min(76, Math.max(48, Math.round(width / 24)));
            rows = Math.min(52, Math.max(36, Math.round(height / 18)));
            stepX = (width * 1.32) / cols;
            stepY = (height * 1.32) / rows;

            updateTextBounds();
        };

        resize();
        window.addEventListener('resize', resize);

        window.addEventListener('mousemove', (e) => {
            const rect = dotsCanvas.getBoundingClientRect();
            if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                const nx = (e.clientX - (rect.left + width / 2)) / (width / 2);
                const ny = (e.clientY - (rect.top + height / 2)) / (height / 2);
                mouseX = nx * 0.08;
                mouseY = ny * 0.06;
            }
        });

        let t = 0;
        const render = () => {
            t += 0.014; // Smooth, gentle floating wave motion

            // Smooth mouse tilt interpolation
            currentTiltX += (mouseY - currentTiltX) * 0.05;
            currentTiltY += (mouseX - currentTiltY) * 0.05;

            ctx.clearRect(0, 0, width, height);

            const centerX = width * 0.5;
            const centerY = height * 0.5;

            // Vertically complete 3D floating field
            for (let j = 0; j < rows; j++) {
                const origY = (j - rows / 2) * stepY;

                for (let i = 0; i < cols; i++) {
                    const origX = (i - cols / 2) * stepX;

                    // Multi-harmonic 3D wave undulation across both X and Y
                    const waveZ = Math.sin(origX * 0.0032 + t * 0.85) * Math.cos(origY * 0.0038 + t * 0.7) * 80 +
                                  Math.sin((origX + origY) * 0.0025 + t * 0.55) * 40;
                    const z = 360 + waveZ;

                    // Subtle vertical floating motion
                    const driftY = Math.sin(origX * 0.002 + origY * 0.0015 + t * 0.6) * 12;

                    // 3D perspective projection spanning complete vertical canvas
                    const scale = focalLength / (focalLength + z);
                    const projX = centerX + (origX + currentTiltY * 50) * scale;
                    const projY = centerY + (origY + driftY + currentTiltX * 40) * scale;

                    if (projX >= -10 && projX <= width + 10 && projY >= -10 && projY <= height + 10) {
                        // Small, delicate dots
                        const radius = Math.max(0.65, 1.28 * scale);
                        let alpha = Math.min(0.28, Math.max(0.06, scale * 0.38));

                        // Text protection: smoothly fade dots near hero headline & text for 100% legibility
                        if (textBounds) {
                            const dx = (projX - textBounds.cx) / textBounds.rx;
                            const dy = (projY - textBounds.cy) / textBounds.ry;
                            const distSq = dx * dx + dy * dy;
                            if (distSq < 1.0) {
                                alpha *= Math.max(0.02, Math.pow(distSq, 1.8) * 0.18);
                            }
                        }

                        if (alpha > 0.02) {
                            ctx.beginPath();
                            ctx.arc(projX, projY, radius, 0, Math.PI * 2);
                            // Soft, elegant slate gray (not harsh black)
                            ctx.fillStyle = `rgba(100, 116, 139, ${alpha.toFixed(3)})`;
                            ctx.fill();
                        }
                    }
                }
            }

            animId = requestAnimationFrame(render);
        };

        render();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animId);
            } else {
                updateTextBounds();
                render();
            }
        });
    }
});