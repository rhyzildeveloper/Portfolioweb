(function() {

  window.addEventListener('load', () => {
    setTimeout(() => { document.getElementById('preloader').classList.add('hidden'); }, 1500);
  });

  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; });
  function lerpRing() { rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(lerpRing); }
  lerpRing();
  document.querySelectorAll('a,button,.bento-card,.service-tag,.rate-table tr,.tech-badge,.social-icon').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas() { canvas.width = canvas.parentElement.offsetWidth; canvas.height = canvas.parentElement.offsetHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  for (let i = 0; i < 60; i++) {
    particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.5 + 0.3, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, a: Math.random() * 0.5 + 0.1 });
  }
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? `rgba(0,229,160,${p.a})` : `rgba(0,150,100,${p.a * 0.5})`;
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / 100) * 0.12;
          ctx.strokeStyle = isDark ? `rgba(0,229,160,${alpha})` : `rgba(0,150,100,${alpha * 0.5})`;
          ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + '%';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.animate').forEach(el => observer.observe(el));

  function animateCounter(el) {
    const target = +el.getAttribute('data-target');
    const duration = 1600;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  const hdr = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    hdr.classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('scrollTop').classList.toggle('show', window.scrollY > 400);
    const sections = ['home','trusted-tech','services','why-choose-us','process','portfolio','case-studies','testimonials','detailed-services','pricing','about','faq','contact'];
    let current = '';
    sections.forEach(id => { const sec = document.getElementById(id); if (sec && window.scrollY >= sec.offsetTop - 200) current = id; });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active-link', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  document.getElementById('scrollTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  function setTheme(t) { html.setAttribute('data-theme', t); localStorage.setItem('theme', t); themeToggle.querySelector('i').className = t==='dark' ? 'fas fa-sun' : 'fas fa-moon'; }
  setTheme(localStorage.getItem('theme') || 'dark');
  themeToggle.addEventListener('click', () => setTheme(html.getAttribute('data-theme')==='dark' ? 'light' : 'dark'));

  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');
  function openMenu() { navLinks.classList.add('show'); navOverlay.classList.add('show'); menuToggle.innerHTML = '<i class="fas fa-times"></i>'; }
  function closeMenu() { navLinks.classList.remove('show'); navOverlay.classList.remove('show'); menuToggle.innerHTML = '<i class="fas fa-bars"></i>'; }
  menuToggle.addEventListener('click', () => navLinks.classList.contains('show') ? closeMenu() : openMenu());
  navOverlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', closeMenu));

  function setupTabs(navSel, contentSel, dataAttr) {
    document.querySelectorAll(navSel).forEach(tab => {
      tab.addEventListener('click', function() {
        document.querySelectorAll(navSel).forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll(contentSel).forEach(c => { if(c) c.style.display = 'none'; });
        const target = this.getAttribute(dataAttr);
        if (target) { const el = document.getElementById(target); if(el) { el.style.display = 'block'; el.classList.remove('visible'); setTimeout(() => el.classList.add('visible'), 20); } }
      });
    });
  }
  setupTabs('#servicesTabs .tab-btn', '.service-content', 'data-tab');
  setupTabs('#rateTabs .tab-btn', '.rate-content', 'data-rate');

  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
      if (!isActive) faqItem.classList.add('active');
    });
  });

  const selectedPackageInput = document.getElementById('selectedPackage');
  const selectedPackageDisplay = document.getElementById('selectedPackageDisplay');
  const selectedPackageName = document.getElementById('selectedPackageName');
  let selectedServices = [];
  function updatePackageDisplay() {
    if (selectedServices.length === 0) { selectedPackageInput.value=''; selectedPackageName.textContent=''; selectedPackageDisplay.classList.remove('show'); }
    else { const d = selectedServices.join(' | '); selectedPackageInput.value=d; selectedPackageName.textContent='Selected: '+d; selectedPackageDisplay.classList.add('show'); }
  }
  function addService(name) { if (!selectedServices.includes(name)) { selectedServices.push(name); updatePackageDisplay(); document.getElementById('contact').scrollIntoView({behavior:'smooth'}); } }
  window.addService = addService;
  document.querySelectorAll('.clickable-service').forEach(tag => tag.addEventListener('click', function() { addService(this.getAttribute('data-service')); }));
  document.querySelectorAll('.clickable-rate').forEach(row => row.addEventListener('click', function() { addService(this.getAttribute('data-service')); }));
  document.getElementById('removePackage').addEventListener('click', () => { selectedServices=[]; updatePackageDisplay(); });

  emailjs.init("UV2MXRtD7FcyZXQ3F");
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const sendBtn = document.getElementById('sendBtn');
  let lastSubmit = 0;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (Date.now() - lastSubmit < 10000) { status.className='status-msg error'; status.textContent='Please wait 10 seconds before resubmitting.'; return; }
    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const msg = document.getElementById('senderMessage').value.trim();
    const pkg = selectedPackageInput.value;
    if (!name||!email||!msg) { status.className='status-msg error'; status.textContent='All fields are required.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { status.className='status-msg error'; status.textContent='Please enter a valid email address.'; return; }
    lastSubmit = Date.now(); sendBtn.disabled=true; sendBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending...';
    status.className='status-msg sending'; status.textContent='Sending your message...';
    let fullMsg = pkg ? 'SELECTED: '+pkg+'\n\nFROM: '+name+' ('+email+')\n\nMESSAGE:\n'+msg : 'FROM: '+name+' ('+email+')\n\nMESSAGE:\n'+msg;
    emailjs.send("service_ad1l4qy","template_mphmqzv",{from_name:name,from_email:email,message:fullMsg,reply_to:email})
    .then(() => { status.className='status-msg success'; status.textContent='Sent! I will reply within 1-2 hours.'; form.reset(); selectedServices=[]; updatePackageDisplay(); sendBtn.disabled=false; sendBtn.innerHTML='<i class="fas fa-paper-plane"></i> Send Message'; setTimeout(()=>{status.className='status-msg';status.textContent='';},7000); })
    .catch(() => { window.location.href='mailto:businessrhyziltech@gmail.com?subject=Project Inquiry&body='+encodeURIComponent(fullMsg); status.className='status-msg error'; status.innerHTML='Opening email client... <a href="mailto:businessrhyziltech@gmail.com" style="color:var(--primary);">Click here if it did not open</a>'; sendBtn.disabled=false; sendBtn.innerHTML='<i class="fas fa-paper-plane"></i> Send Message'; });
  });

  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  const fab = document.getElementById('ai-chat-fab');
  const chatWindow = document.getElementById('ai-chat-window');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatSuggestions = document.getElementById('chatSuggestions');
  const chatBadge = document.getElementById('chatBadge');
  const chatClearBtn = document.getElementById('chatClearBtn');

  let chatOpen = false;
  let isTyping = false;
  let conversationHistory = [];

  const SUGGESTIONS = [
    'What services do you offer?',
    'How much does a website cost?',
    'Tell me about your projects',
    'How do I get started?',
    'What tech stack do you use?',
    'What is the payment policy?',
  ];

  function renderSuggestions(chips) {
    chatSuggestions.innerHTML = '';
    chips.forEach(text => {
      const chip = document.createElement('button');
      chip.className = 'suggestion-chip';
      chip.textContent = text;
      chip.addEventListener('click', () => {
        chatSuggestions.innerHTML = '';
        sendMessage(text);
      });
      chatSuggestions.appendChild(chip);
    });
  }

  function addMessage(role, html, animate = true) {
    const wrapper = document.createElement('div');
    wrapper.className = `chat-msg ${role}`;
    if (!animate) wrapper.style.animation = 'none';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = html;
    wrapper.appendChild(bubble);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return wrapper;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'typing-indicator';
    el.id = 'typingIndicator';
    el.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  function mdToHtml(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n{2,}/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  function generateSmartResponse(userText) {
    const lower = userText.toLowerCase().trim();
    
    if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('how much') || lower.includes('budget') || lower.includes('fee')) {
      if (lower.includes('landing') || lower.includes('one page')) {
        return "**Landing Page Pricing: PHP 3,000 - PHP 15,000**\n\nThis includes:\n- Custom design tailored to your brand\n- Mobile-responsive layout\n- Contact form integration\n- Basic SEO optimization\n- Fast loading speed\n\nPrices vary based on complexity and features. Want a detailed quote?";
      } else if (lower.includes('business') || lower.includes('corporate')) {
        return "**Business Website Pricing: PHP 8,000 - PHP 40,000**\n\nIncludes:\n- Multi-page professional design\n- Advanced contact forms\n- Blog/CMS integration\n- Social media integration\n- SEO optimization\n- Analytics setup\n\n**50% downpayment** to start, balance upon completion.";
      } else if (lower.includes('ecommerce') || lower.includes('shop') || lower.includes('store')) {
        return "**E-Commerce Solutions: PHP 15,000 - PHP 80,000+**\n\nFeatures:\n- Product catalog and management\n- Shopping cart and checkout\n- Payment gateway integration\n- Inventory management\n- Order tracking\n- Security features\n\nScalable for any business size!";
      } else if (lower.includes('saas') || lower.includes('mvp')) {
        return "**SaaS MVP Pricing: PHP 50,000 - PHP 500,000+**\n\nThis includes:\n- User authentication system\n- Dashboard and analytics\n- Subscription management\n- API development\n- Cloud hosting setup\n- Scalable architecture\n\nInvestment depends on feature complexity.";
      } else if (lower.includes('payment') || lower.includes('down') || lower.includes('deposit')) {
        return "Our payment policy is simple:\n\n- **50% Downpayment** to begin work\n- **50% Balance** upon completion and approval\n\nWe offer:\n- 100% satisfaction guarantee\n- Milestone-based progress updates\n- Transparent pricing - no hidden fees!\n\nReady to start?";
      } else {
        return "**Our Transparent Pricing:**\n\n- **Landing Pages**: PHP 3,000 - PHP 15,000\n- **Business Websites**: PHP 8,000 - PHP 40,000\n- **E-Commerce**: PHP 15,000 - PHP 80,000+\n- **React/Next.js Apps**: PHP 10,000 - PHP 80,000+\n- **SaaS MVP**: PHP 50,000 - PHP 500,000+\n- **Security Services**: PHP 5,000 - PHP 150,000\n\n**50% downpayment** | Balance upon completion\n\nWhich service interests you?";
      }
    }
    
    else if (lower.includes('service') || lower.includes('offer') || lower.includes('provide') || lower.includes('do you do')) {
      return "**Our Services:**\n\n1. **Custom Web Development**\n   Tailored websites and web apps\n\n2. **E-Commerce Solutions**\n   Online stores that convert visitors\n\n3. **Responsive Design**\n   Perfect on all devices\n\n4. **Performance and SEO**\n   Fast, search-engine optimized\n\n5. **Security Services**\n   Penetration testing and audits\n\nWhich would you like to explore?";
    }
    
    else if (lower.includes('tech') || lower.includes('technology') || lower.includes('stack') || lower.includes('language') || lower.includes('framework')) {
      return "**Our Tech Stack:**\n\n**Front-End:**\n- HTML5, CSS3, JavaScript (ES6+)\n- React, Next.js, Vue.js\n- Bootstrap 5, Tailwind CSS\n\n**Back-End:**\n- PHP / Laravel\n- Node.js\n- REST API Development\n\n**Databases:**\n- MySQL / MariaDB\n- MongoDB\n\n**Security:**\n- RBAC, Encryption\n- Anti-injection\n- Penetration Testing\n\nWe choose the best stack for YOUR project!";
    }
    
    else if (lower.includes('project') || lower.includes('portfolio') || lower.includes('work') || lower.includes('example') || lower.includes('past')) {
      return "**Featured Projects:**\n\n1. **Automated Faculty Evaluation System**\n   - Full RBAC multi-role system\n   - Real-time analytics dashboard\n   - PDF export and reporting\n   - CHED CMO 19 s.2025 Compliant\n   **Stack**: PHP/Laravel, MySQL, Bootstrap 5\n\n2. **Rhyzil Tech Website**\n   - Dark/Light theme\n   - Particle animations\n   - AI Chatbot integration\n   **Stack**: HTML5, CSS3, Vanilla JS\n\n**5+ projects** completed with **100% commitment to quality**!";
    }
    
    else if (lower.includes('about') || lower.includes('who') || lower.includes('team') || lower.includes('founder') || lower.includes('company')) {
      return "**About Rhyzil Tech**\n\nFounded in **2019** by **Rhyzil Angelo Pabadora Jimenez**\n\n- Based in Tabango, Leyte, Philippines\n- 7+ years development experience\n- Security-first approach\n- Fast and modern development\n\nWe build secure web systems for schools and businesses!";
    }
    
    else if (lower.includes('contact') || lower.includes('reach') || lower.includes('email') || lower.includes('phone') || lower.includes('location')) {
      return "**Email**: businessrhyziltech@gmail.com\n**Phone**: +63 993 679 6302\n**Location**: Crossing Otabon, Tabango, Leyte\n\n**Response Time**: Usually within 1-2 hours!\n\nYou can also use the contact form on this page. How can we help?";
    }
    
    else if (lower.includes('start') || lower.includes('begin') || lower.includes('hire') || lower.includes('how do i') || lower.includes('process')) {
      return "**Getting Started is Easy!**\n\n1. **Tell us about your project**\n   Use the contact form or chat with me\n\n2. **Free consultation**\n   We discuss your needs and goals\n\n3. **Proposal and quote**\n   Detailed scope with transparent pricing\n\n4. **50% downpayment**\n   Secure your project start\n\n5. **Development begins**\n   Regular updates and milestone reviews\n\nReady to start your project?";
    }
    
    else if (lower.includes('how long') || lower.includes('timeline') || lower.includes('duration') || lower.includes('deadline')) {
      return "**Typical Project Timelines:**\n\n- Landing Page: **3-7 days**\n- Business Website: **1-4 weeks**\n- E-Commerce: **2-8 weeks**\n- Web Application: **4-16 weeks**\n- SaaS MVP: **8-24 weeks**\n\nTimelines vary based on complexity and features. Rush delivery available for some projects!";
    }
    
    else if (lower.includes('security') || lower.includes('secure') || lower.includes('protection') || lower.includes('encrypt')) {
      return "**Security-First Promise:**\n\n- **RBAC** - Role-Based Access Control\n- **Encryption** - Data protection at rest and in transit\n- **Anti-Injection** - SQL/XSS prevention\n- **Security Audits** - PHP 5,000 - PHP 50,000\n- **Penetration Testing** - PHP 10,000 - PHP 150,000\n- **24/7 Monitoring** - Proactive threat protection\n\nSecurity is built into EVERY project, not added as an afterthought!";
    }
    
    else if (lower.match(/^(hi|hello|hey|yo|sup|greetings|good morning|good afternoon|good evening)/) || lower.length < 10) {
      return "**Hello! I am the Rhyzil Tech AI Assistant.**\n\nI can help you with:\n- Our services and pricing\n- Technical capabilities and tech stack\n- Past projects and portfolio\n- Getting started on your project\n- Security and performance questions\n\nWhat would you like to know?";
    }
    
    else if (lower.includes('thank') || lower.includes('thanks') || lower.includes('appreciate')) {
      return "You are welcome! I am happy to help!\n\nNeed anything else? Feel free to:\n- Ask another question\n- Use our contact form for detailed inquiries\n- Reach us at **businessrhyziltech@gmail.com**\n\nWe are here to help bring your project to life!";
    }
    
    else if (lower.includes('seo') || lower.includes('search engine') || lower.includes('google') || lower.includes('ranking')) {
      return "**Performance and SEO Services:**\n\n**Speed Optimization**\n- Core Web Vitals optimization\n- Image compression and lazy loading\n- Code minification\n\n**SEO Best Practices**\n- Meta tags and schema markup\n- Mobile-first optimization\n- XML sitemaps\n- Keyword optimization\n\nWe build websites that rank!";
    }
    
    else if (lower.includes('responsive') || lower.includes('mobile') || lower.includes('tablet') || lower.includes('device')) {
      return "**Mobile-First Responsive Design:**\n\nAll our websites are:\n- Fully responsive on ALL devices\n- Tested on iOS and Android\n- Optimized for tablets and desktops\n- Touch-friendly interfaces\n- Fast loading on mobile networks\n\nWe ensure your site looks perfect everywhere!";
    }
    
    else if (lower.includes('maintenance') || lower.includes('support') || lower.includes('update') || lower.includes('after')) {
      return "**Post-Launch Support:**\n\n- **100% Satisfaction Guarantee**\n- Bug fixes included\n- Performance monitoring\n- Updates and maintenance available\n- Ongoing support packages\n\nWe stand behind our work! Ask about maintenance plans.";
    }
    
    else if (lower.includes('?')) {
      return "Great question!\n\nBased on what you are asking, I would recommend:\n\n1. **Contact us directly** for a detailed consultation\n   businessrhyziltech@gmail.com\n   +63 993 679 6302\n\n2. **Use our contact form** for a custom quote\n\n3. **Browse our services** section above\n\nWe respond within **12 hours** and offer **free consultations**! What specific help do you need?";
    }
    
    else {
      return "I understand you are interested in learning more.\n\nHere is how I can help:\n\n- **Tell me more** about your project needs\n- **Check our services** above for detailed info\n- **Get a custom quote** - email us at businessrhyziltech@gmail.com\n\nOr ask me specifically about pricing, services, tech stack, or our past projects!";
    }
  }

  async function sendMessage(userText) {
    if (!userText.trim() || isTyping) return;
    isTyping = true;
    chatSend.disabled = true;
    chatInput.value = '';
    chatInput.style.height = 'auto';
    chatSuggestions.innerHTML = '';

    addMessage('user', userText.replace(/</g,'&lt;').replace(/>/g,'&gt;'));

    conversationHistory.push({ role: 'user', content: userText });

    showTyping();

    const typingDelay = 600 + Math.random() * 1200;
    await new Promise(resolve => setTimeout(resolve, typingDelay));
    
    removeTyping();

    const reply = generateSmartResponse(userText);

    conversationHistory.push({ role: 'assistant', content: reply });
    addMessage('bot', mdToHtml(reply));

    const lower = userText.toLowerCase();
    let nextSuggestions = [];
    if (lower.includes('price') || lower.includes('cost') || lower.includes('rate')) {
      nextSuggestions = ['What is the payment policy?', 'How do I get started?', 'Tell me about your projects', 'What services do you offer?'];
    } else if (lower.includes('service') || lower.includes('offer')) {
      nextSuggestions = ['How much does a website cost?', 'What tech stack do you use?', 'Tell me about your projects'];
    } else if (lower.includes('project') || lower.includes('portfolio') || lower.includes('work')) {
      nextSuggestions = ['How much does a website cost?', 'How do I get started?', 'What services do you offer?'];
    } else if (lower.includes('tech') || lower.includes('stack')) {
      nextSuggestions = ['What services do you offer?', 'How much does a website cost?', 'Tell me about your projects'];
    } else {
      nextSuggestions = SUGGESTIONS.slice(0, 4);
    }
    setTimeout(() => renderSuggestions(nextSuggestions), 400);

    isTyping = false;
    chatSend.disabled = false;
    chatInput.focus();
  }

  function openChat() {
    chatOpen = true;
    chatWindow.classList.add('open');
    fab.classList.add('open');
    chatBadge.classList.remove('show');

    if (chatMessages.children.length === 0) {
      addMessage('bot', '<strong>Hello! I am the Rhyzil Tech AI Assistant.</strong><br><br>I am your smart guide to everything about our services, pricing, and capabilities. Ask me anything - I am here to help!<br><br><strong>Try asking:</strong><br>- "How much for a business website?"<br>- "What technologies do you use?"<br>- "Tell me about your past projects"', false);
      setTimeout(() => renderSuggestions(SUGGESTIONS.slice(0, 4)), 200);
    }

    chatInput.focus();
  }

  function closeChat() {
    chatOpen = false;
    chatWindow.classList.remove('open');
    fab.classList.remove('open');
  }

  fab.addEventListener('click', () => chatOpen ? closeChat() : openChat());

  chatSend.addEventListener('click', () => sendMessage(chatInput.value));

  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      sendMessage(chatInput.value); 
    }
  });

  chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
  });

  chatClearBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '';
    chatSuggestions.innerHTML = '';
    conversationHistory = [];
    addMessage('bot', '<strong>Chat cleared.</strong> How can I help you today?', false);
    setTimeout(() => renderSuggestions(SUGGESTIONS.slice(0, 4)), 200);
  });

  setTimeout(() => {
    if (!chatOpen) chatBadge.classList.add('show');
  }, 3000);

})3000);

})();
