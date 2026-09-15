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
    const emailToCopy = 'zeyncompany@gmail.com';

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
            const mailtoUri = `mailto:zeyncompany@gmail.com?subject=${subject}&body=${body}`;

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
                        Your email client has been launched with your inquiry addressed to <strong>zeyncompany@gmail.com</strong>.
                    </p>
                    <div class="feedback-action-row">
                        <a href="${mailtoUri}" class="btn btn-primary btn-sm">Re-open Email App</a>
                        <button type="button" class="btn btn-secondary btn-sm" id="copyInquiryDetailsBtn">Copy Details</button>
                    </div>
                `;
                feedbackNotice.style.display = 'block';

                const copyInquiryBtn = document.getElementById('copyInquiryDetailsBtn');
                if (copyInquiryBtn) {
                    copyInquiryBtn.addEventListener('click', async () => {
                        try {
                            if (navigator.clipboard && window.isSecureContext) {
                                await navigator.clipboard.writeText(`To: zeyncompany@gmail.com\nSubject: Project Inquiry: ${projectType} — ${name}\n\n${plainBody}`);
                            } else {
                                const ta = document.createElement('textarea');
                                ta.value = `To: zeyncompany@gmail.com\nSubject: Project Inquiry: ${projectType} — ${name}\n\n${plainBody}`;
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
    // 8. Hero 3D Floating Black Dots Particle Wave (Floating Perspective Mesh)
    // -------------------------------------------------------------------------
    const dotsCanvas = document.getElementById('heroDotsCanvas');

    if (dotsCanvas && !prefersReducedMotion) {
        const ctx = dotsCanvas.getContext('2d');
        let width = 0;
        let height = 0;
        let animId = null;

        const cols = 70;
        const rows = 46;
        const stepX = 35;
        const stepZ = 45;
        const focalLength = 520;

        let mouseX = 0;
        let mouseY = 0;
        let currentTiltX = 0;
        let currentTiltY = 0;

        const resize = () => {
            const rect = dotsCanvas.parentElement.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            dotsCanvas.width = width * dpr;
            dotsCanvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
            t += 0.015; // Smooth floating wave motion

            // Smooth mouse tilt interpolation
            currentTiltX += (mouseY - currentTiltX) * 0.05;
            currentTiltY += (mouseX - currentTiltY) * 0.05;

            ctx.clearRect(0, 0, width, height);

            const centerX = width * 0.5;
            const horizonY = height * 0.44;

            // Render 3D points from back to front for depth sorting
            for (let j = rows - 1; j >= 0; j--) {
                const z = (j + 1) * stepZ + 140;

                for (let i = 0; i < cols; i++) {
                    const origX = (i - cols / 2) * stepX;

                    // Wave calculation + parabolic arch
                    const arch = -Math.exp(-((origX / 680) ** 2)) * 125;
                    const wave = Math.sin(origX * 0.0032 + t * 0.9) * Math.cos(z * 0.0028 + t * 0.7) * 58 +
                                 Math.sin((origX + z) * 0.002 + t * 0.6) * 32;
                    const y = wave + arch;

                    // 3D rotation with gentle mouse tilt
                    const rotX = origX * Math.cos(currentTiltY) - z * Math.sin(currentTiltY);
                    const rotZ = origX * Math.sin(currentTiltY) + z * Math.cos(currentTiltY);

                    // Perspective projection
                    const scale = focalLength / (focalLength + rotZ);
                    const projX = centerX + rotX * scale;
                    const projY = horizonY + (y + 260 + rotZ * currentTiltX) * scale;

                    if (projX >= -20 && projX <= width + 20 && projY >= -20 && projY <= height + 20) {
                        const radius = Math.max(0.75, 2.35 * scale);
                        const alpha = Math.min(0.85, Math.max(0.08, scale * 1.25));

                        ctx.beginPath();
                        ctx.arc(projX, projY, radius, 0, Math.PI * 2);
                        // Clean floating black dots on light background
                        ctx.fillStyle = `rgba(18, 18, 24, ${alpha.toFixed(3)})`;
                        ctx.fill();
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
                render();
            }
        });
    }
});