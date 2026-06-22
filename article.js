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
      freshnessEl.textContent = art.freshness || "Freshness: < 24h";
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
