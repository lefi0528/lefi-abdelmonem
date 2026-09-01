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
      "id": "art-1786590000000-ai",
      "category": "ai",
      "title": "Anthropic Claude Opus 4.8 & WebMCP: How Autonomous AI Agents Are Rewriting E-Commerce Rules",
      "date": "2026-08-13",
      "content": "When Anthropic rolled out Claude Opus 4.8 alongside the broader Claude 5 model architecture earlier this year, the tech community expected incremental gains in code generation and reasoning. What caught e-commerce executives by surprise, however, was how rapidly these models—when paired with Google's open WebMCP (Web Model Context Protocol)—transformed autonomous AI agents into high-converting transactional buyers.\n\nWe are no longer discussing AI search bots that index pages for citations. In mid-2026, AI agents act as personal purchasing concierges, inspecting DOM elements in real time, filling out multi-step product customizers, verifying inventory stock via client-side JavaScript tools, and executing checkout flows directly inside the browser.\n\n<h2>The Paradigm Shift: From Passive Crawling to Autonomous Transactions</h2>\n\nFor over two decades, web development has focused almost exclusively on human visual optics: high-resolution banners, micro-interactions, and persuasive CTA placements. But with Claude Opus 4.8 leveraging dynamic subagent delegation, the primary customer visiting your online store might soon be an autonomous AI agent buying on behalf of a human user.\n\nIf your storefront relies on obfuscated DOM nodes, unindexed dynamic JavaScript renders, or missing semantic labels, autonomous agents simply skip your site in favor of structured competitors. WebMCP bridges this gap by exposing explicit tool declarations directly to agentic crawlers.\n\n<h2>Comparing E-Commerce Paradigms: Traditional vs. Agentic (2026)</h2>\n\nTo understand why traditional storefronts are losing market share to agentic-optimized stores, consider the operational differences below:\n\n<table>\n  <thead>\n    <tr>\n      <th>Feature / Metric</th>\n      <th>Legacy E-Commerce Storefront</th>\n      <th>WebMCP Agentic-Ready Storefront</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>Target Audience</strong></td>\n      <td>Human shoppers clicking visual elements</td>\n      <td>Autonomous AI agents (Claude Opus 4.8 / Claude 5) & Humans</td>\n    </tr>\n    <tr>\n      <td><strong>Data Extraction</strong></td>\n      <td>Scraping raw HTML & guesswork regex</td>\n      <td>Deterministic WebMCP tool calls & JSON-LD schemas</td>\n    </tr>\n    <tr>\n      <td><strong>Checkout Friction</strong></td>\n      <td>Multi-page form filling & captcha hurdles</td>\n      <td>Programmatic tool execution in &lt; 800ms</td>\n    </tr>\n    <tr>\n      <td><strong>Conversion Lift (2026)</strong></td>\n      <td>Baseline conversion (~2.1%)</td>\n      <td><strong>+42% surge</strong> in autonomous agent purchases</td>\n    </tr>\n  </tbody>\n</table>\n\n<h2>Key Optimization Pillars for PrestaShop Storefronts</h2>\n\nTo ensure your PrestaShop or custom e-commerce store is fully discoverable and executable by agentic workflows, focus on these three engineering priorities:\n\n<ul>\n  <li><strong>Clean JSON-LD Schema Graphs:</strong> Ensure product variants, price currency, and live stock statuses are exposed in validated schema metadata without relying on async client-side overrides.</li>\n  <li><strong>Deterministic ARIA & DOM Selection:</strong> Use explicit <code>data-mcp-tool</code> attributes on cart buttons, quantity adjusters, and shipping selectors.</li>\n  <li><strong>Native WebMCP Endpoint Exposure:</strong> Serve a valid <code>webmcp.json</code> manifest defining your store's client-side actions and form endpoints.</li>\n</ul>\n\n<h2>Strategic Roadmap for Digital Merchants</h2>\n\nAs we navigate the second half of 2026, the distinction between \"SEO\" and \"AEO\" (Agent Engine Optimization) has vanished. Merchants who adapt early to Anthropic's Claude Opus 4.8 capabilities and WebMCP standards are securing a massive first-mover advantage in automated retail.\n\nPrestaShop Remark: Integrate WebMCP-compatible action hooks and clean JSON-LD schemas in your PrestaShop theme to allow autonomous AI agents like Claude Opus 4.8 to discover products and execute checkouts programmatically.",
      "status": "published",
      "image": "news_claude_webmcp_2026.jpg"
    },
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
      "content": "The latest Google Search core algorithm updates of 2026 have pushed traditional keyword stuffing completely out of search relevancy. Contextual semantic matching, schema structural metadata (JSON-LD), and pristine Interaction to Next Paint (INP) performance scores are now the ultimate ranking signals.\n\nPrestaShop Remark: Embed JSON-LD schema tags on product pages and leverage advanced semantic SEO platforms to secure your rankings.",
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
        const response = await fetch('news.json?t=' + new Date().getTime());
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

      // Generate main paragraph and HTML block nodes
      const blocks = mainContent.split(/\n\s*\n/);
      blocks.forEach(block => {
        const trimmed = block.trim();
        if (!trimmed) return;
        if (/^<(h[1-6]|table|ul|ol|blockquote|div|figure)/i.test(trimmed)) {
          const temp = document.createElement('div');
          temp.innerHTML = trimmed;
          while (temp.firstChild) {
            bodyEl.appendChild(temp.firstChild);
          }
        } else {
          const p = document.createElement('p');
          p.innerHTML = trimmed;
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
