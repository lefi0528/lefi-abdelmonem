/* ----------------------------------------------------
   LEFI ABDELMONEM - PREMIUM INTERACTIVE APPLICATION
   Script logic: Particle Network, Real-Time SEO Tools, 
   Scroll Observers, Carousel, Plan Connector, Mobile Nav
   ---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================
     1. MOBILE NAVIGATION & BURGER MENU
     =================================================== */
  const burgerMenu = document.getElementById('burgerMenu');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mainHeader = document.getElementById('mainHeader');

  // Toggle mobile menu
  burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      burgerMenu.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Scroll header effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });


  /* ===================================================
     2. DYNAMIC PARTICLES CANVAS (INTERACTIVE BACKGROUND)
     =================================================== */
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');

  let particlesArray = [];
  const maxDistance = 110; // Max line distance
  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  // Adjust canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse moves
  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  // Mouse leaves
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Blueprint
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    // Draw particle
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    // Move particle & handle boundary bounces
    update() {
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Mouse interactive push/pull
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          // Slow push away
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * 0.8;
          let directionY = forceDirectionY * force * 0.8;
          
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  // Initialize Particle population
  function initParticles() {
    particlesArray = [];
    let numberOfParticles = Math.floor((canvas.width * canvas.height) / 11000);
    // Cap to maintain super fluid performance
    numberOfParticles = Math.min(numberOfParticles, 120);

    const colors = ['#00F0FF', '#AD00FF', '#00FF85', '#FF007A']; // Accent colors matching pillars

    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 2) + 1;
      let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
      let directionX = (Math.random() * 0.4) - 0.2;
      let directionY = (Math.random() * 0.4) - 0.2;
      let color = colors[Math.floor(Math.random() * colors.length)];

      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  // Draw lines linking particles
  function connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          opacityValue = 1 - (distance / maxDistance);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.08})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation frame loop
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // Re-init on resize to keep density proportional
  window.addEventListener('resize', () => {
    initParticles();
  });


  /* ===================================================
     3. STATS COUNTER (SIMPLE & RELIABLE)
     =================================================== */
  function animateStatCounters() {
    var statEls = document.querySelectorAll('.stat-number');
    var plusTargets = [198, 427, 35];

    statEls.forEach(function(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var hasSuffix = plusTargets.indexOf(target) !== -1;
      var duration = 1600;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var current = Math.floor(progress * target);
        el.textContent = current.toLocaleString() + (hasSuffix ? '+' : '');
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString() + (hasSuffix ? '+' : '');
        }
      }
      requestAnimationFrame(step);
    });
  }

  // Launch after full page load
  if (document.readyState === 'complete') {
    setTimeout(animateStatCounters, 300);
  } else {
    window.addEventListener('load', function() {
      setTimeout(animateStatCounters, 300);
    });
  }




  /* ===================================================
     4. INTERACTIVE SEO AUDIT & SNIPPET BUILDER
     =================================================== */
  const titleInput = document.getElementById('seoTitleInput');
  const urlInput = document.getElementById('seoUrlInput');
  const descInput = document.getElementById('seoDescInput');
  const keywordInput = document.getElementById('seoKeywordInput');
  const contentInput = document.getElementById('seoContentInput');

  const serpTitleText = document.getElementById('serpTitleText');
  const serpUrlText = document.getElementById('serpUrlText');
  const serpDescText = document.getElementById('serpDescText');

  const titleCharCount = document.getElementById('titleCharCount');
  const descCharCount = document.getElementById('descCharCount');

  const titleLengthBar = document.getElementById('titleLengthBar');
  const descLengthBar = document.getElementById('descLengthBar');

  const titleStatusLabel = document.getElementById('titleStatusLabel');
  const descStatusLabel = document.getElementById('descStatusLabel');

  const densityCircle = document.getElementById('densityCircle');
  const densityFeedback = document.getElementById('densityFeedback');

  const btnDeviceDesktop = document.getElementById('btnDeviceDesktop');
  const btnDeviceMobile = document.getElementById('btnDeviceMobile');
  const serpBox = document.getElementById('serpBox');

  // Toggle desktop/mobile Google mock
  btnDeviceDesktop.addEventListener('click', () => {
    btnDeviceDesktop.classList.add('active');
    btnDeviceMobile.classList.remove('active');
    serpBox.classList.remove('mobile-mode');
  });

  btnDeviceMobile.addEventListener('click', () => {
    btnDeviceMobile.classList.add('active');
    btnDeviceDesktop.classList.remove('active');
    serpBox.classList.add('mobile-mode');
  });

  // Escaping regex characters
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Highlight Keyword search match in the snippet
  function highlightMatches(text, keyword) {
    if (!keyword || keyword.trim() === "") return text;
    try {
      const regex = new RegExp(`\\b(${escapeRegExp(keyword)})\\b`, 'gi');
      return text.replace(regex, '<span class="bold-match">$1</span>');
    } catch(e) {
      return text;
    }
  }

  // Perform the SEO check Calculations
  function runSeoAudit() {
    const titleVal = titleInput.value;
    const urlVal = urlInput.value;
    const descVal = descInput.value;
    const keywordVal = keywordInput.value;
    const contentVal = contentInput.value;

    // 1. Update text displays in Google SERP mock
    serpTitleText.innerHTML = highlightMatches(titleVal || "Please enter a title...", keywordVal);
    serpUrlText.textContent = urlVal || "https://lefi-abdelmonem.com";
    serpDescText.innerHTML = highlightMatches(descVal || "Please enter a description...", keywordVal);

    // 2. Character counts
    const titleLen = titleVal.length;
    const descLen = descVal.length;

    titleCharCount.textContent = titleLen;
    descCharCount.textContent = descLen;

    // 3. Title bar evaluation
    const titlePercentage = Math.min((titleLen / 60) * 100, 100);
    titleLengthBar.style.width = `${titlePercentage}%`;

    if (titleLen === 0) {
      titleStatusLabel.textContent = "Empty";
      titleStatusLabel.style.color = '#EF4444';
      titleLengthBar.className = "indicator-bar warning";
    } else if (titleLen < 40) {
      titleStatusLabel.textContent = "Too Short";
      titleStatusLabel.style.color = 'var(--accent-seo)';
      titleLengthBar.className = "indicator-bar";
    } else if (titleLen <= 60) {
      titleStatusLabel.textContent = "Optimal";
      titleStatusLabel.style.color = 'var(--accent-sec)';
      titleLengthBar.className = "indicator-bar optimal";
    } else {
      titleStatusLabel.textContent = "Too Long (Truncated)";
      titleStatusLabel.style.color = '#EF4444';
      titleLengthBar.className = "indicator-bar warning";
      // Truncate in mock
      serpTitleText.innerHTML = highlightMatches(titleVal.substring(0, 57) + "...", keywordVal);
    }

    // 4. Description bar evaluation
    const descPercentage = Math.min((descLen / 160) * 100, 100);
    descLengthBar.style.width = `${descPercentage}%`;

    if (descLen === 0) {
      descStatusLabel.textContent = "Empty";
      descStatusLabel.style.color = '#EF4444';
      descLengthBar.className = "indicator-bar warning";
    } else if (descLen < 110) {
      descStatusLabel.textContent = "Too Short";
      descStatusLabel.style.color = 'var(--accent-seo)';
      descLengthBar.className = "indicator-bar";
    } else if (descLen <= 160) {
      descStatusLabel.textContent = "Optimal";
      descStatusLabel.style.color = 'var(--accent-sec)';
      descLengthBar.className = "indicator-bar optimal";
    } else {
      descStatusLabel.textContent = "Too Long (Truncated)";
      descStatusLabel.style.color = '#EF4444';
      descLengthBar.className = "indicator-bar warning";
      // Truncate in mock
      serpDescText.innerHTML = highlightMatches(descVal.substring(0, 157) + "...", keywordVal);
    }

    // 5. Keyword Density calculation
    if (!keywordVal || keywordVal.trim() === "" || !contentVal || contentVal.trim() === "") {
      densityCircle.textContent = "0%";
      densityCircle.className = "density-score-circle";
      densityFeedback.textContent = "Enter a keyword and write text to analyze key phrase density.";
      densityFeedback.style.color = 'var(--text-secondary)';
      return;
    }

    const words = contentVal.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").split(/\s+/).filter(w => w.length > 0);
    const totalWords = words.length;
    
    if (totalWords === 0) {
      densityCircle.textContent = "0%";
      densityCircle.className = "density-score-circle";
      densityFeedback.textContent = "Enter some content in the content area.";
      return;
    }

    const escapedKw = keywordVal.toLowerCase().trim();
    let kwCount = 0;
    words.forEach(word => {
      if (word === escapedKw) kwCount++;
    });

    const density = ((kwCount / totalWords) * 100).toFixed(1);
    densityCircle.textContent = `${density}%`;

    // Density visual scoring
    if (density === 0.0) {
      densityCircle.className = "density-score-circle";
      densityCircle.style.borderColor = 'var(--border-color)';
      densityCircle.style.color = 'var(--text-primary)';
      densityFeedback.textContent = `The keyword "${keywordVal}" was not found in your content paragraph.`;
      densityFeedback.style.color = 'var(--text-secondary)';
    } else if (density < 1.0) {
      densityCircle.className = "density-score-circle";
      densityCircle.style.borderColor = 'var(--accent-seo)';
      densityCircle.style.color = 'var(--accent-seo)';
      densityFeedback.textContent = `Low density (${density}%). Try to include the keyword slightly more for higher relevance.`;
      densityFeedback.style.color = 'var(--accent-seo)';
    } else if (density <= 2.5) {
      densityCircle.className = "density-score-circle optimal";
      densityCircle.removeAttribute('style'); // Use css definitions
      densityFeedback.textContent = `Excellent! Optimal density (${density}%). This matches organic search standards without stuffing.`;
      densityFeedback.style.color = 'var(--accent-sec)';
    } else {
      densityCircle.className = "density-score-circle";
      densityCircle.style.borderColor = '#EF4444';
      densityCircle.style.color = '#EF4444';
      densityFeedback.textContent = `Warning: high density (${density}%). This may trigger Google's keyword stuffing spam filters!`;
      densityFeedback.style.color = '#EF4444';
    }
  }

  // Bind live updates
  [titleInput, urlInput, descInput, keywordInput, contentInput].forEach(elem => {
    elem.addEventListener('input', runSeoAudit);
  });

  /* ===================================================
     4b. ON-DEVICE CHROME AI (GEMINI NANO & PROMPT API)
     =================================================== */
  const btnAiOptimize = document.getElementById('btnAiOptimize');
  const aiModalFeedback = document.getElementById('aiModalFeedback');

  if (btnAiOptimize) {
    btnAiOptimize.addEventListener('click', async () => {
      // Clear previous feedback
      aiModalFeedback.style.display = 'none';
      aiModalFeedback.textContent = '';
      aiModalFeedback.className = '';

      const titleVal = titleInput.value.trim();
      const descVal = descInput.value.trim();
      const keywordVal = keywordInput.value.trim();

      if (!keywordVal) {
        aiModalFeedback.style.display = 'block';
        aiModalFeedback.style.color = '#EF4444';
        aiModalFeedback.style.border = '1px solid rgba(239, 68, 68, 0.2)';
        aiModalFeedback.style.background = 'rgba(239, 68, 68, 0.02)';
        aiModalFeedback.textContent = 'Please enter a target keyword first so that local AI has a focus topic.';
        return;
      }

      btnAiOptimize.disabled = true;
      const originalBtnText = btnAiOptimize.innerHTML;
      btnAiOptimize.innerHTML = '<span>⚡ Activating local browser Gemini Nano...</span>';
      btnAiOptimize.style.opacity = '0.7';

      try {
        // 1. Check if window.ai and the Prompt API are available
        const hasBuiltInAi = window.ai && window.ai.languageModel;

        if (!hasBuiltInAi) {
          throw new Error("NOT_SUPPORTED");
        }

        // 2. Query model availability
        const capabilities = await window.ai.languageModel.capabilities();
        if (capabilities.available === 'no') {
          throw new Error("MODEL_NOT_AVAILABLE");
        }

        // 3. Create active session
        aiModalFeedback.style.display = 'block';
        aiModalFeedback.style.color = 'var(--accent-seo)';
        aiModalFeedback.style.border = '1px solid rgba(0, 240, 255, 0.2)';
        aiModalFeedback.style.background = 'rgba(0, 240, 255, 0.01)';
        aiModalFeedback.textContent = 'Model loaded. Processing SEO optimizations locally...';

        const session = await window.ai.languageModel.create({
          systemPrompt: "You are an expert e-commerce SEO optimizer. Optimize titles and meta descriptions for target keywords. Keep response structured as JSON format with keys 'title' and 'description'."
        });

        const prompt = `Optimize the following metadata for the e-commerce keyword "${keywordVal}".
        Current Title: "${titleVal || "None"}"
        Current Meta Description: "${descVal || "None"}"
        
        Requirements:
        1. Title must be under 60 characters and contain the keyword.
        2. Meta description must be under 160 characters, highly converting, and contain the keyword.
        3. Output MUST be ONLY a raw JSON string like: {"title": "optimized title", "description": "optimized description"}`;

        const aiResponseText = await session.prompt(prompt);
        session.destroy();

        // 4. Parse output
        let cleanJsonStr = aiResponseText.trim();
        // Remove markdown wrappers if any
        if (cleanJsonStr.startsWith('```json')) {
          cleanJsonStr = cleanJsonStr.substring(7, cleanJsonStr.length - 3).trim();
        } else if (cleanJsonStr.startsWith('```')) {
          cleanJsonStr = cleanJsonStr.substring(3, cleanJsonStr.length - 3).trim();
        }

        const data = JSON.parse(cleanJsonStr);

        if (data.title && data.description) {
          titleInput.value = data.title;
          descInput.value = data.description;
          
          // Trigger updates
          runSeoAudit();

          aiModalFeedback.style.color = 'var(--accent-sec)';
          aiModalFeedback.style.border = '1px solid rgba(0, 255, 133, 0.2)';
          aiModalFeedback.style.background = 'rgba(0, 255, 133, 0.01)';
          aiModalFeedback.textContent = '🚀 SEO tags optimized successfully in local by your browser\'s built-in Gemini Nano model! (0 server cost, 0 latency)';
        } else {
          throw new Error("INVALID_JSON_STRUCTURE");
        }

      } catch (error) {
        console.error(error);
        aiModalFeedback.style.display = 'block';
        aiModalFeedback.style.color = 'var(--accent-ai)';
        aiModalFeedback.style.border = '1px solid rgba(255, 0, 122, 0.2)';
        aiModalFeedback.style.background = 'rgba(255, 0, 122, 0.01)';

        if (error.message === "NOT_SUPPORTED" || error.message === "MODEL_NOT_AVAILABLE") {
          aiModalFeedback.innerHTML = `⚠️ <strong>On-Device Chrome AI (Gemini Nano) not detected in your browser.</strong><br><br>
          To experience zero-server-cost local AI, please do the following in Google Chrome 148+:<br>
          1. Enable <strong>Prompt API</strong> in <code>chrome://flags/#optimization-guide-on-device-model</code>.<br>
          2. Restart Chrome and wait for the Gemini model to download in <code>chrome://components</code> (Optimization Guide On Device Model).`;
        } else {
          // Fallback simulation if model isn't active but user clicked to see what it does
          // We can simulate an outstanding local AI optimization based on the keyword to show off Lefi's coding capabilities!
          setTimeout(() => {
            const simulatedTitle = `Expert ${keywordVal.charAt(0).toUpperCase() + keywordVal.slice(1)} & E-commerce Speed Optimization | Lefi`;
            const simulatedDesc = `Certified FranceNum consultant specializing in ${keywordVal.toLowerCase()} and IT security audits. Boost your online store performance and traffic.`;
            
            titleInput.value = simulatedTitle;
            descInput.value = simulatedDesc;
            runSeoAudit();

            aiModalFeedback.style.color = 'var(--accent-sec)';
            aiModalFeedback.style.border = '1px solid rgba(0, 255, 133, 0.2)';
            aiModalFeedback.style.background = 'rgba(0, 255, 133, 0.01)';
            aiModalFeedback.innerHTML = `🤖 <strong>[Local AI Simulation Mode]</strong> To enable real zero-server-cost local AI, activate Gemini Nano in your Chrome browser!<br>
            • Optimized Title: <em>"${simulatedTitle}"</em><br>
            • Optimized Description: <em>"${simulatedDesc}"</em>`;
          }, 1200);
        }
      } finally {
        setTimeout(() => {
          btnAiOptimize.disabled = false;
          btnAiOptimize.innerHTML = originalBtnText;
          btnAiOptimize.style.opacity = '1';
        }, 1200);
      }
    });
  }

  // Run initial on-load audit
  runSeoAudit();


  /* ===================================================
     5. MAINTENANCE PLANS CONNECT TO CONTACT FORM
     =================================================== */
  const planButtons = document.querySelectorAll('.plan-btn');
  const contactSubject = document.getElementById('contactSubject');
  const contactMessage = document.getElementById('contactMessage');
  const contactFormCard = document.querySelector('.contact-form-card');

  planButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan');
      
      // Select appropriate subject option
      let optionValue = "";
      if (planName === "Standard Care") optionValue = "Standard Care Maintenance Plan";
      else if (planName === "Professional Care") optionValue = "Professional Care Maintenance Plan";
      else if (planName === "Enterprise Care") optionValue = "Enterprise Care Maintenance Plan";

      // Match select element options
      for (let i = 0; i < contactSubject.options.length; i++) {
        if (contactSubject.options[i].value.includes(optionValue)) {
          contactSubject.selectedIndex = i;
          break;
        }
      }

      // Pre-populate message
      contactMessage.value = `Hello Abdelmonem,\n\nI am interested in your "${planName}" maintenance plan to safeguard and optimize my e-commerce storefront. Please contact me back to initiate details.`;

      // Smooth scroll to contact
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });

      // Highlight contact card visually
      setTimeout(() => {
        contactMessage.focus();
        contactFormCard.style.boxShadow = `0 0 25px rgba(173, 0, 255, 0.25)`;
        contactFormCard.style.borderColor = `var(--accent-dev)`;
        
        setTimeout(() => {
          contactFormCard.style.boxShadow = 'none';
          contactFormCard.style.borderColor = 'var(--border-color)';
        }, 1500);
      }, 800);
    });
  });


  /* ===================================================
     6. TESTIMONIAL REVIEWS SLIDER (CAROUSEL)
     =================================================== */
  const slides = document.querySelectorAll('.review-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const btnPrev = document.getElementById('btnPrevReview');
  const btnNext = document.getElementById('btnNextReview');
  
  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    // Wrap around boundaries
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    // Toggle active slide
    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Toggle active dot
    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Button navigations
  btnPrev.addEventListener('click', () => {
    showSlide(currentSlide - 1);
    resetAutoPlay();
  });

  btnNext.addEventListener('click', () => {
    showSlide(currentSlide + 1);
    resetAutoPlay();
  });

  // Dot navigations
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'));
      showSlide(idx);
      resetAutoPlay();
    });
  });

  // Auto-play loop
  function startAutoPlay() {
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 7000);
  }

  function resetAutoPlay() {
    clearInterval(slideInterval);
    startAutoPlay();
  }

  startAutoPlay();


  /* ===================================================
     7. SECURE MOCK CONTACT FORM SUBMISSION (WEB3FORMS REAL EMAIL)
     =================================================== */
  const contactForm = document.getElementById('contactForm');
  const btnSubmit = document.getElementById('btnSubmitForm');
  const formFeedback = document.getElementById('formFeedback');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Verification check
    const nameVal = document.getElementById('contactName').value;
    const emailVal = document.getElementById('contactEmail').value;
    const subjectVal = contactSubject.value;
    const msgVal = contactMessage.value;

    if (!nameVal || !emailVal || !msgVal) return;

    // Visual button load
    btnSubmit.disabled = true;
    const origText = btnSubmit.textContent;
    btnSubmit.textContent = "Sending Message...";
    btnSubmit.style.opacity = '0.7';

    // Prepare Web3Forms payload
    const payload = {
      access_key: "b10327db-e4bb-4ec1-bfea-d34a17792644",
      name: nameVal,
      email: emailVal,
      subject: `[Portfolio Contact] ${subjectVal}`,
      message: msgVal,
      from_name: "Lefi Abdelmonem Portfolio"
    };

    // Perform API call
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        // Success feedback
        formFeedback.className = "form-feedback-message success";
        formFeedback.textContent = `Thank you, ${nameVal}! Your message has been sent successfully. I will get back to you shortly.`;
        formFeedback.style.display = 'block';
        contactForm.reset();
      } else {
        // Error fallback
        console.log(response);
        formFeedback.className = "form-feedback-message error";
        formFeedback.style.display = 'block';
        formFeedback.textContent = json.message || "Something went wrong. Please try again or email me directly.";
      }
    })
    .catch((error) => {
      console.log(error);
      formFeedback.className = "form-feedback-message error";
      formFeedback.style.display = 'block';
      formFeedback.textContent = "Network error. Please try again or email me directly.";
    })
    .finally(() => {
      btnSubmit.disabled = false;
      btnSubmit.textContent = origText;
      btnSubmit.style.opacity = '1';

      setTimeout(() => {
        formFeedback.style.display = 'none';
      }, 8000);
    });
  });

  /* ===================================================
     8. AI CORE SIMULATION TYPEWRITER
     =================================================== */
  const aiSimText = document.getElementById('aiSimText');
  const aiStatuses = [
    "[AI] Analyzing server log schemas...",
    "[Agent] Mapping data flow graphs...",
    "[Flow] Syncing PrestaShop APIs...",
    "[AI] Running predictive sales loops...",
    "[System] Workflow automation optimized!"
  ];
  let aiStatusIdx = 0;

  function cycleAiStatus() {
    if (!aiSimText) return;
    aiStatusIdx = (aiStatusIdx + 1) % aiStatuses.length;
    aiSimText.textContent = aiStatuses[aiStatusIdx];
  }
  
  // Cycle every 3.5 seconds
  setInterval(cycleAiStatus, 3500);


  /* ===================================================
     8b. DYNAMIC AUTOMATED NEWS FEED & SECURE BACKOFFICE
     =================================================== */
  // Initial demo news in English (highly structured e-commerce tech articles)
  const defaultArticles = [
    {
      id: "art-1",
      category: "ai",
      title: "WebMCP & Autonomous Agents: Google I/O 2026 Revolutionizes Web Automation",
      date: new Date().toLocaleDateString('en-US'),
      freshness: "Freshness: < 24h",
      content: "At the recent Google I/O 2026 event, the introduction of the WebMCP (Web Model Context Protocol) standard has enabled autonomous AI agents to interact directly with web applications. Webpages can now expose client-side JavaScript tools and forms to browser-based AI models, creating a seamless bridge between static web content and active agentic execution. Websites optimized for the WebMCP standard are currently experiencing massive jumps in autonomous user conversions as AI crawlers begin handling checkouts, contact forms, and audits programmatically."
    },
    {
      id: "art-2",
      category: "prestashop",
      title: "PrestaShop 9.0 Architecture: Leading the Headless E-commerce Wave in 2026",
      date: new Date().toLocaleDateString('en-US'),
      freshness: "Freshness: < 24h",
      content: "PrestaShop 9.0 is redefining modern e-commerce by introducing full native GraphQL API support and decoupled headless store configurations. Modern digital merchants are leveraging fast static frontends built on modern architectures combined with PrestaShop's robust backend engine. This decoupled approach completely bypasses heavy server overhead, unlocking sub-second page load times, perfect 100/100 mobile Lighthouse performance scores, and enhanced protection against database threat vectors."
    },
    {
      id: "art-3",
      category: "seo",
      title: "Google Search 2026: Semantic Context and Core Web Vitals Domination",
      date: new Date().toLocaleDateString('en-US'),
      freshness: "Freshness: < 24h",
      content: "The latest Google Search core algorithm updates of 2026 have pushed traditional keyword stuffing completely out of search relevancy. Contextual semantic matching, schema structural metadata (JSON-LD), and pristine Interaction to Next Paint (INP) performance scores are now the ultimate ranking signals. To rank high in AI Overviews, experts highly recommend leveraging advanced AI-driven semantic suites like FexaAI to automatically compile perfectly optimized metadata and structured category taxonomy."
    }
  ];

  // Get articles from localStorage or set defaults
  function getArticles() {
    const stored = localStorage.getItem('lefi_news_articles');
    if (!stored) {
      localStorage.setItem('lefi_news_articles', JSON.stringify(defaultArticles));
      return defaultArticles;
    }
    return JSON.parse(stored);
  }

  async function loadArticlesFromServer() {
    try {
      const response = await fetch('news.json');
      if (response.ok) {
        const serverData = await response.json();
        let localData = getArticles();
        
        // Merge: Local edits win, but new server articles are added
        const localMap = new Map(localData.map(a => [a.id, a]));
        serverData.forEach(serverArt => {
          if (!localMap.has(serverArt.id)) {
             localData.push(serverArt);
          }
        });
        
        localData.sort((a, b) => {
          const tA = parseInt(a.id.split('-')[1]) || 0;
          const tB = parseInt(b.id.split('-')[1]) || 0;
          return tB - tA;
        });
        
        saveArticles(localData);
        renderNews('all');
        if (document.getElementById('backofficeDashboardSection').style.display === 'block') {
          renderAdminDashboard();
        }
      }
    } catch(e) {
      console.log('Using cached articles');
    }
  }

  // Save articles back to localStorage
  function saveArticles(articles) {
    localStorage.setItem('lefi_news_articles', JSON.stringify(articles));
  }

  const newsGrid = document.getElementById('newsGrid');
  const newsFilters = document.querySelectorAll('.news-filter-btn');

  // Render card grid based on category filter
  function renderNews(filterCategory = 'all') {
    if (!newsGrid) return;
    newsGrid.innerHTML = '';
    const articles = getArticles();

    const coreTopics = ['prestashop', 'seo', 'sxo', 'ecommerce', 'e-commerce', 'security', 'cybersecurity', 'ai', 'artificial intelligence', 'agentic', 'webmcp', 'llm', 'google', 'lighthouse', 'core web vitals', 'ranking', 'search engine', 'automation'];

    const filtered = articles.filter(art => {
      if (art.status === 'draft') return false;
      
      // Semantic filter: Only render articles matching core topics to preserve site SEO
      const articleText = (art.title + ' ' + (art.content || '')).toLowerCase();
      const isRelevant = coreTopics.some(topic => articleText.includes(topic));
      if (!isRelevant) return false;

      if (filterCategory === 'all') return true;
      return art.category === filterCategory;
    });

    if (filtered.length === 0) {
      newsGrid.innerHTML = `
        <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
          <p>No articles available for this category.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(art => {
      let badgeClass = "badge-seo";
      let categoryName = "SEO";
      let cardHoverClass = "card-seo";
      
      if (art.category === 'ai') {
        badgeClass = "badge-ai";
        categoryName = "AI & Automation";
        cardHoverClass = "card-ai";
      } else if (art.category === 'prestashop') {
        badgeClass = "badge-prestashop";
        categoryName = "PrestaShop";
        cardHoverClass = "card-prestashop";
      }

      const card = document.createElement('div');
      card.className = `glass-card news-card ${cardHoverClass}`;
      card.innerHTML = `
        ${art.image ? `<div class="news-card-image-wrapper" style="width:100%; height:180px; overflow:hidden; border-radius: var(--border-radius-sm) var(--border-radius-sm) 0 0; margin: -24px -24px 20px -24px; width: calc(100% + 48px);">
          <img src="${art.image}" alt="${art.title}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">
        </div>` : ''}
        <div class="news-card-meta">
          <span class="news-card-badge ${badgeClass}">${categoryName}</span>
          <span class="news-card-freshness">${art.freshness || 'Freshness: < 24h'}</span>
          <span>📅 ${art.date}</span>
        </div>
        <h3 class="news-card-title">${art.title}</h3>
        <p class="news-card-excerpt">${art.content.replace(/<[^>]*>/g, '').substring(0, 200)}${art.content.length > 200 ? '...' : ''}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
          <a href="article.html?id=${art.id}" class="news-card-readmore">
            Read Article &rarr;
          </a>
        </div>
      `;
      newsGrid.appendChild(card);
    });

    // Generate dynamic JSON-LD Schema for rendered news articles
    let schemaScript = document.getElementById('dynamicNewsSchema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.id = 'dynamicNewsSchema';
      document.head.appendChild(schemaScript);
    }
    
    const schemaObjects = filtered.map(art => ({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": art.title,
      "datePublished": new Date().toISOString(),
      "articleSection": art.category.toUpperCase(),
      "author": {
        "@type": "Organization",
        "name": art.sourceName || "Lefi Abdelmonem Veille"
      }
    }));
    
    schemaScript.textContent = JSON.stringify(schemaObjects);
  }

  // Filter clicks
  if (newsFilters) {
    newsFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        newsFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-category');
        renderNews(cat);
      });
    });
  }

  // Modal Backoffice logic
  // Load and render initially
  renderNews('all');
  loadArticlesFromServer();


  /* ===================================================
     9. WebMCP STANDARD EXPOSURE FOR AI AGENTS
     =================================================== */
  window.webMcp = {
    tools: {
      submitContactForm: async (args) => {
        try {
          const payload = {
            access_key: "b10327db-e4bb-4ec1-bfea-d34a17792644",
            name: args.name,
            email: args.email,
            subject: `[WebMCP AI Agent Inquiry] ${args.subject || 'Autonomous Agent Session'}`,
            message: args.message,
            from_name: "WebMCP AI Agent"
          };
          const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify(payload)
          });
          const json = await response.json();
          if (response.status === 200) {
            return { success: true, message: `Inquiry submitted successfully on behalf of ${args.name}.` };
          } else {
            return { success: false, error: json.message || "Submission failed." };
          }
        } catch (err) {
          return { success: false, error: err.message };
        }
      },
      analyzeSeoMetadata: async (args) => {
        try {
          const titleVal = args.title || "";
          const descVal = args.description || "";
          const keywordVal = args.keyword || "";
          const contentVal = args.content || "";
          
          const titleLen = titleVal.length;
          const descLen = descVal.length;
          
          let titleStatus = "Optimal";
          if (titleLen === 0) titleStatus = "Empty";
          else if (titleLen < 40) titleStatus = "Too Short";
          else if (titleLen > 60) titleStatus = "Too Long";
          
          let descStatus = "Optimal";
          if (descLen === 0) descStatus = "Empty";
          else if (descLen < 110) descStatus = "Too Short";
          else if (descLen > 160) descStatus = "Too Long";
          
          // Density
          let density = "0.0";
          if (keywordVal && contentVal) {
            const words = contentVal.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").split(/\s+/).filter(w => w.length > 0);
            const totalWords = words.length;
            if (totalWords > 0) {
              const escapedKw = keywordVal.toLowerCase().trim();
              let kwCount = 0;
              words.forEach(word => {
                if (word === escapedKw) kwCount++;
              });
              density = ((kwCount / totalWords) * 100).toFixed(1);
            }
          }
          
          return {
            success: true,
            titleLength: titleLen,
            titleStatus: titleStatus,
            descriptionLength: descLen,
            descriptionStatus: descStatus,
            keywordDensity: `${density}%`,
            keywordMatches: parseFloat(density) > 0
          };
        } catch (err) {
          return { success: false, error: err.message };
        }
      }
    }
  };

  /* ===================================================
     8c. FAQ ACCORDION LOGIC (VOICE SEARCH OPTIMIZATION)
     =================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');
    
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close all other FAQ items for clean UX
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
        otherItem.querySelector('.faq-icon').textContent = '+';
      });
      
      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + "px";
        icon.textContent = '−';
      }
    });
  });

});
