document.addEventListener('DOMContentLoaded', () => {

  // Locale-safe date parser: handles ISO "YYYY-MM-DD", US "M/D/YYYY", and EU "DD/MM/YYYY"
  function parseArticleDate(dateStr) {
    if (!dateStr) return null;

    // 1. ISO format "YYYY-MM-DD" or full ISO string
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) return d;
    }

    // 2. Slash-separated: determine if US (M/D/YYYY) or EU (DD/MM/YYYY)
    const slashParts = dateStr.split('/');
    if (slashParts.length === 3) {
      const a = parseInt(slashParts[0], 10);
      const b = parseInt(slashParts[1], 10);
      const year = parseInt(slashParts[2], 10);
      if (year > 2000) {
        if (a > 12) return new Date(year, b - 1, a);
        if (b > 12) return new Date(year, a - 1, b);
        return new Date(year, a - 1, b);
      }
    }

    // 3. Fallback
    const fallback = new Date(dateStr);
    if (!isNaN(fallback.getTime()) && fallback.getFullYear() > 2000) return fallback;
    return null;
  }

  // Compute freshness dynamically from article date
  function computeFreshness(dateStr) {
    const dateObj = parseArticleDate(dateStr);
    if (!dateObj) return 'No date';

    const now = new Date();
    const diffMs = now - dateObj;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 0) return 'Upcoming';
    if (diffHours < 2) return 'Freshness: < 2h';
    if (diffHours < 6) return 'Freshness: < 6h';
    if (diffHours < 12) return 'Freshness: < 12h';
    if (diffHours < 24) return 'Freshness: < 24h';
    if (diffDays < 3) return 'Freshness: < 3 days';
    if (diffDays < 7) return 'Freshness: < 7 days';
    if (diffDays < 14) return 'Freshness: < 2 weeks';
    if (diffDays < 30) return 'Freshness: < 1 month';
    if (diffDays < 90) return 'Freshness: < 3 months';
    return 'Archived';
  }

  function getFreshnessClass(dateStr) {
    const dateObj = parseArticleDate(dateStr);
    if (!dateObj) return 'freshness-stale';

    const diffHours = (new Date() - dateObj) / (1000 * 60 * 60);
    if (diffHours < 24) return 'freshness-hot';
    if (diffHours < 72) return 'freshness-warm';
    if (diffHours < 168) return 'freshness-cool';
    return 'freshness-stale';
  }
  // Default fallback articles if database is completely empty
  const defaultArticles = [
    {
      "id": "art-1",
      "category": "ai",
      "title": "WebMCP & Autonomous Agents: Google I/O 2026 Revolutionizes Web Automation",
      "date": "2026-05-31",
      "content": "At the recent Google I/O 2026 event, the introduction of the WebMCP (Web Model Context Protocol) standard has enabled autonomous AI agents to interact directly with web applications. Webpages can now expose client-side JavaScript tools and forms to browser-based AI models, creating a seamless bridge between static web content and active agentic execution.\n\nPrestaShop Remark: Leverage WebMCP-ready modules to prepare your cart actions for automated AI crawler buyers.",
      "status": "published"
    },
    {
      "id": "art-2",
      "category": "prestashop",
      "title": "PrestaShop 9.0 Architecture: Leading the Headless E-commerce Wave in 2026",
      "date": "2026-05-31",
      "content": "PrestaShop 9.0 is redefining modern e-commerce by introducing full native GraphQL API support and decoupled headless store configurations. Modern digital merchants are leveraging fast static frontends built on modern architectures combined with PrestaShop's robust backend engine. This decoupled approach completely bypasses heavy server overhead, unlocking sub-second page load times.\n\nPrestaShop Remark: Plan your migration to PrestaShop 9.0 to unlock sub-second headless load speeds and robust GraphQL APIs.",
      "status": "published"
    },
    {
      "id": "art-3",
      "category": "seo",
      "title": "Google Search 2026: Semantic Context and Core Web Vitals Domination",
      "date": "2026-05-31",
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

  // Master load execution
  async function loadArticle() {
    // 1. Get ID from URL query ?id=xxx
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
      redirectToHome();
      return;
    }

    // 2. Load articles database
    let articles = getArticles();
    let art = articles.find(a => a.id === articleId);

    // Fallback: If not found in localStorage, fetch from news.json server file
    if (!art) {
      try {
        const response = await fetch('news.json');
        if (response.ok) {
          const serverData = await response.ok ? await response.json() : [];
          art = serverData.find(a => a.id === articleId);
        }
      } catch (err) {
        console.error("Error loading server backup fallback:", err);
      }
    }

    // 3. If still not found, redirect back
    if (!art) {
      redirectToHome();
      return;
    }

    // 3.5 Semantic filter: Redirect if article is off-topic to protect site SEO
    const coreTopicsPattern = /\b(prestashop|seo|sxo|ecommerce|e-commerce|security|cybersecurity|ai|artificial intelligence|agentic|webmcp|llms?|google|lighthouse|core web vitals|ranking|search engine|automation)\b/i;
    const isRelevant = coreTopicsPattern.test(art.title + ' ' + (art.content || ''));
    
    if (!isRelevant) {
      console.warn('Article blocked due to semantic mismatch. Redirecting to home to preserve SEO context.');
      redirectToHome();
      return;
    }

    // 4. Update dynamic meta title and browser page title for premium SEO
    document.title = `${art.title} | Lefi Abdelmonem Tech News`;
    
    // 5. Update HTML Elements
    const badgeEl = document.getElementById('articleBadge');
    const freshnessEl = document.getElementById('articleFreshness');
    const dateEl = document.getElementById('articleDate');
    const titleEl = document.getElementById('articleTitle');
    const bodyEl = document.getElementById('articleBody');
    const dynamicOrb = document.getElementById('dynamicOrb');
    const cardEl = document.getElementById('articleCard');

    let badgeClass = "badge-seo";
    let categoryName = "SEO";
    let glowClass = "glow-seo";
    let glowColor = "var(--accent-seo)";
    
    if (art.category === 'ai') {
      badgeClass = "badge-ai";
      categoryName = "AI & Automation";
      glowClass = "glow-ai";
      glowColor = "var(--accent-ai)";
    } else if (art.category === 'prestashop') {
      badgeClass = "badge-prestashop";
      categoryName = "PrestaShop";
      glowClass = "glow-prestashop";
      glowColor = "var(--accent-dev)";
    }

    // Set category styling
    if (badgeEl) {
      badgeEl.className = `news-card-badge ${badgeClass}`;
      badgeEl.textContent = categoryName;
    }
    if (freshnessEl) {
      freshnessEl.textContent = computeFreshness(art.date);
      freshnessEl.className = `news-card-freshness ${getFreshnessClass(art.date)}`;
    }
    if (dateEl) {
      dateEl.textContent = art.date;
    }
    if (titleEl) {
      titleEl.textContent = art.title;
    }
    if (cardEl) {
      cardEl.className = `glass-card article-view-card ${glowClass}`;
    }
    if (dynamicOrb) {
      dynamicOrb.style.background = glowColor;
    }

    // 6. Render article image if available, then split contents into paragraphs
    if (bodyEl) {
      bodyEl.innerHTML = '';


      let mainContent = art.content;
      let remarkText = "";
      
      // Look for custom remark prefixes
      const remarkKeywords = ["PrestaShop Remark:", "Remarque PrestaShop:", "Prestashop Remark:", "remarque prestashop:", "prestashop remark:"];
      for (const kw of remarkKeywords) {
        if (mainContent.includes(kw)) {
          const parts = mainContent.split(kw);
          mainContent = parts[0].trim();
          remarkText = parts[1].trim();
          break;
        }
      }

      // Generate main paragraph nodes (support HTML content)
      const paragraphs = mainContent.split(/\n\s*\n/);
      paragraphs.forEach(pText => {
        if (pText.trim()) {
          const p = document.createElement('p');
          p.innerHTML = pText.trim();
          bodyEl.appendChild(p);
        }
      });

      // Highlight PrestaShop Exploitation Remark in dedicated glass sidebar
      if (remarkText) {
        const remarkBlock = document.createElement('div');
        remarkBlock.className = 'article-remark-block';
        remarkBlock.innerHTML = `💡 <strong>PrestaShop Actionable Insight:</strong> ${remarkText}`;
        bodyEl.appendChild(remarkBlock);
      }
    }

    // 7. Inject Dynamic JSON-LD NewsArticle structure to head for pristine Google indexing
    injectJsonLdSchema(art, categoryName);
  }

  function redirectToHome() {
    window.location.href = './#news';
  }

  function injectJsonLdSchema(art, categoryName) {
    let schemaScript = document.getElementById('dynamicArticleSchema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.id = 'dynamicArticleSchema';
      document.head.appendChild(schemaScript);
    }
    
    const schemaObject = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "headline": art.title,
      "datePublished": new Date().toISOString(),
      "articleSection": categoryName,
      "author": {
        "@type": "Person",
        "name": "Lefi Abdelmonem",
        "jobTitle": "PrestaShop, SEO & Web Security Expert",
        "url": "https://lefi-abdelmonem.com/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Lefi Abdelmonem",
        "logo": {
          "@type": "ImageObject",
          "url": "https://lefi-abdelmonem.com/logo.png"
        }
      },
      "description": art.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
    };

    // Add image to schema if available
    if (art.image) {
      schemaObject.image = {
        "@type": "ImageObject",
        "url": `https://lefi-abdelmonem.com/${art.image}`
      };
    }
    
    schemaScript.textContent = JSON.stringify(schemaObject);
  }

  loadArticle();

});
