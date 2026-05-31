document.addEventListener('DOMContentLoaded', () => {

  // Default fallback articles if database is completely empty
  const defaultArticles = [
    {
      "id": "art-1",
      "category": "ai",
      "title": "WebMCP & Autonomous Agents: Google I/O 2026 Revolutionizes Web Automation",
      "date": "31/05/2026",
      "freshness": "Freshness: < 24h",
      "content": "At the recent Google I/O 2026 event, the introduction of the WebMCP (Web Model Context Protocol) standard has enabled autonomous AI agents to interact directly with web applications. Webpages can now expose client-side JavaScript tools and forms to browser-based AI models, creating a seamless bridge between static web content and active agentic execution.\n\nPrestaShop Remark: Leverage WebMCP-ready modules to prepare your cart actions for automated AI crawler buyers.",
      "status": "published"
    },
    {
      "id": "art-2",
      "category": "prestashop",
      "title": "PrestaShop 9.0 Architecture: Leading the Headless E-commerce Wave in 2026",
      "date": "31/05/2026",
      "freshness": "Freshness: < 24h",
      "content": "PrestaShop 9.0 is redefining modern e-commerce by introducing full native GraphQL API support and decoupled headless store configurations. Modern digital merchants are leveraging fast static frontends built on modern architectures combined with PrestaShop's robust backend engine. This decoupled approach completely bypasses heavy server overhead, unlocking sub-second page load times.\n\nPrestaShop Remark: Plan your migration to PrestaShop 9.0 to unlock sub-second headless load speeds and robust GraphQL APIs.",
      "status": "published"
    },
    {
      "id": "art-3",
      "category": "seo",
      "title": "Google Search 2026: Semantic Context and Core Web Vitals Domination",
      "date": "31/05/2026",
      "freshness": "Freshness: < 24h",
      "content": "The latest Google Search core algorithm updates of 2026 have pushed traditional keyword stuffing completely out of search relevancy. Contextual semantic matching, schema structural metadata (JSON-LD), and pristine Interaction to Next Paint (INP) performance scores are now the ultimate ranking signals.\n\nPrestaShop Remark: Embed JSON-LD schema tags on product pages and integrate with semantic platforms like FexaAI to secure your rankings.",
      "status": "published"
    }
  ];

  // Get articles database from localStorage
  function getArticles() {
    const stored = localStorage.getItem('lefi_news_articles');
    if (!stored) {
      localStorage.setItem('lefi_news_articles', JSON.stringify(defaultArticles));
      return defaultArticles;
    }
    return JSON.parse(stored);
  }

  // Save articles back to localStorage
  function saveArticles(articles) {
    localStorage.setItem('lefi_news_articles', JSON.stringify(articles));
  }

  // UI Screens query selectors
  const loginScreen = document.getElementById('loginScreen');
  const dashboardScreen = document.getElementById('dashboardScreen');
  const formScreen = document.getElementById('formScreen');
  
  // Forms & Feedbacks
  const loginForm = document.getElementById('loginForm');
  const adminPasswordInput = document.getElementById('adminPassword');
  const loginFeedback = document.getElementById('loginFeedback');
  const articleForm = document.getElementById('articleForm');
  const editArticleIdInput = document.getElementById('editArticleId');
  const articleCategorySelect = document.getElementById('articleCategory');
  const articleTitleInput = document.getElementById('articleTitle');
  const articleContentTextarea = document.getElementById('articleContent');
  const articleFormTitle = document.getElementById('articleFormTitle');
  
  // Buttons
  const btnLogout = document.getElementById('btnLogout');
  const btnAdminAddArticle = document.getElementById('btnAdminAddArticle');
  const btnAdminTriggerVeille = document.getElementById('btnAdminTriggerVeille');
  const btnArticleFormCancel = document.getElementById('btnArticleFormCancel');
  
  // Table Body
  const adminArticlesTableBody = document.getElementById('adminArticlesTableBody');

  // Check login session storage on load
  if (sessionStorage.getItem('lefi_admin_authenticated') === 'true') {
    showDashboard();
  }

  // Submit Password Form
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pwd = adminPasswordInput.value.trim();
      
      if (pwd === 'lefi2026') {
        sessionStorage.setItem('lefi_admin_authenticated', 'true');
        showDashboard();
      } else {
        loginFeedback.style.display = 'block';
        loginFeedback.className = "form-feedback-message error";
        loginFeedback.textContent = "Incorrect password. Please try again.";
      }
    });
  }

  // Logout trigger
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem('lefi_admin_authenticated');
      window.location.reload();
    });
  }

  // Display screens helper
  function showDashboard() {
    loginScreen.style.display = 'none';
    formScreen.style.display = 'none';
    dashboardScreen.style.display = 'block';
    renderAdminDashboard();
  }

  // Render articles inside dashboard table
  function renderAdminDashboard() {
    if (!adminArticlesTableBody) return;
    adminArticlesTableBody.innerHTML = '';
    const articles = getArticles();

    if (articles.length === 0) {
      adminArticlesTableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; color: var(--text-secondary); padding: 30px;">
            No articles present in the database.
          </td>
        </tr>
      `;
      return;
    }

    articles.forEach(art => {
      const isDraft = art.status === 'draft';
      const statusBadge = isDraft 
        ? `<span style="background: rgba(239, 68, 68, 0.15); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">Draft</span>`
        : `<span style="background: rgba(0, 255, 133, 0.15); color: var(--accent-sec); border: 1px solid rgba(0, 255, 133, 0.3); padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">Published</span>`;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="white-space: nowrap;">${art.date}<br style="margin-bottom: 6px;">${statusBadge}</td>
        <td><span class="news-card-badge badge-${art.category}">${art.category.toUpperCase()}</span></td>
        <td style="font-weight: 500; color: var(--text-primary);">${art.title}</td>
        <td style="white-space: nowrap;">
          <button class="btn-admin-edit" onclick="togglePublish('${art.id}')" title="${isDraft ? 'Publish online' : 'Set as draft'}">${isDraft ? '👁️ Publish' : '🙈 Draft'}</button>
          <button class="btn-admin-edit" onclick="editArticle('${art.id}')" style="border-color: var(--accent-dev); color: #D8B4FE;">✏️ Edit</button>
          <button class="btn-admin-delete" onclick="deleteArticle('${art.id}')">🗑️ Delete</button>
        </td>
      `;
      adminArticlesTableBody.appendChild(row);
    });
  }

  // Toggles drafts/published globally
  window.togglePublish = function(id) {
    let articles = getArticles();
    const art = articles.find(a => a.id === id);
    if (art) {
      art.status = art.status === 'draft' ? 'published' : 'draft';
      saveArticles(articles);
      renderAdminDashboard();
    }
  };

  // Open Edit article screen
  window.editArticle = function(id) {
    const articles = getArticles();
    const art = articles.find(a => a.id === id);
    if (!art) return;

    dashboardScreen.style.display = 'none';
    formScreen.style.display = 'block';
    
    articleFormTitle.textContent = "Edit Article";
    editArticleIdInput.value = art.id;
    articleCategorySelect.value = art.category;
    articleTitleInput.value = art.title;
    articleContentTextarea.value = art.content;
  };

  // Trigger Delete article
  window.deleteArticle = function(id) {
    if (confirm("Do you really want to permanently delete this watch article?")) {
      let articles = getArticles();
      articles = articles.filter(a => a.id !== id);
      saveArticles(articles);
      renderAdminDashboard();
    }
  };

  // Click handler to open Create manual article screen
  if (btnAdminAddArticle) {
    btnAdminAddArticle.addEventListener('click', () => {
      dashboardScreen.style.display = 'none';
      formScreen.style.display = 'block';
      articleForm.reset();
      editArticleIdInput.value = '';
      articleFormTitle.textContent = "Add Manual Article";
    });
  }

  // Cancel Form button handler
  if (btnArticleFormCancel) {
    btnArticleFormCancel.addEventListener('click', () => {
      formScreen.style.display = 'none';
      dashboardScreen.style.display = 'block';
    });
  }

  // Form submit handler (both edit and create)
  if (articleForm) {
    articleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = editArticleIdInput.value;
      const category = articleCategorySelect.value;
      const title = articleTitleInput.value.trim();
      const content = articleContentTextarea.value.trim();
      
      const articles = getArticles();

      if (id) {
        // Edit mode
        const art = articles.find(a => a.id === id);
        if (art) {
          art.category = category;
          art.title = title;
          art.content = content;
        }
      } else {
        // Create manual mode (published directly)
        const newArt = {
          id: 'art-' + Date.now() + '-' + category,
          category: category,
          title: title,
          date: new Date().toLocaleDateString('en-US'),
          freshness: "Freshness: Manual",
          content: content,
          status: "published"
        };
        articles.unshift(newArt);
      }

      saveArticles(articles);
      formScreen.style.display = 'none';
      dashboardScreen.style.display = 'block';
      renderAdminDashboard();
    });
  }

  // Trigger Automatic AI News Crawler simulation
  if (btnAdminTriggerVeille) {
    btnAdminTriggerVeille.addEventListener('click', () => {
      btnAdminTriggerVeille.disabled = true;
      const originalText = btnAdminTriggerVeille.innerHTML;
      btnAdminTriggerVeille.innerHTML = '<span class="spin-loader">🔄</span> Scraping global feeds & running AI compile...';
      btnAdminTriggerVeille.style.opacity = '0.7';

      setTimeout(() => {
        // Mock new aggregated AI articles with the requested PrestaShop Remarks
        const aiTitles = [
          "Google I/O 2026 standardizes WebMCP: AI Agent Automation Revolution",
          "Web Security Alert: Critical XSS Attacks Surge on E-commerce Storefronts",
          "Voice SEO 2026: Optimizing E-commerce Product Catalogs Semantically"
        ];
        const aiContents = [
          "The WebMCP protocol is officially validated, allowing AI agents to buy directly from the web. Stores must restructure checkout forms so that crawlers can securely execute transactions.\n\nPrestaShop Remark: Integrate modules compatible with the WebMCP protocol to prepare your purchase funnels for autonomous ordering by AI agents.",
          "Web security experts report zero-day vulnerabilities affecting older payment modules. Immediate verification of databases and updating firewalls is strongly advised.\n\nPrestaShop Remark: Run an immediate security audit of your legacy modules and update your Core system to avoid injections.",
          "Voice queries represent over 45% of global internet traffic in 2026. Google Search indexing is now entirely based on robust semantic matching and flawless structured markup (JSON-LD).\n\nPrestaShop Remark: Enrich your structured product microdata in PrestaShop and sync your catalog with FexaAI to maximize voice search visibility."
        ];
        const aiCategories = ["ai", "prestashop", "seo"];

        // Select randomly
        const pickIdx = Math.floor(Math.random() * aiTitles.length);
        const newArt = {
          id: 'art-' + Date.now() + '-' + aiCategories[pickIdx],
          category: aiCategories[pickIdx],
          title: aiTitles[pickIdx],
          date: new Date().toLocaleDateString('en-US'),
          freshness: "Freshness: < 24h",
          content: aiContents[pickIdx],
          status: "draft" // Automatic articles drafted as brouillon
        };

        const articles = getArticles();
        articles.unshift(newArt);
        saveArticles(articles);

        btnAdminTriggerVeille.disabled = false;
        btnAdminTriggerVeille.innerHTML = originalText;
        btnAdminTriggerVeille.style.opacity = '1';

        alert(`🤖 [AI TECH WATCH COMPLETED]\n\nA new hot watch article has been compiled as a Draft! Check it in the table below and click on 👁️ Publish to make it live.`);
        renderAdminDashboard();
      }, 3000);
    });
  }

});
