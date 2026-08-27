// Shared styles
const sharedStyles = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        line-height: 1.6;
        color: #333;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
        background-size: 400% 400%;
        animation: gradientShift 15s ease infinite;
        min-height: 100vh;
        padding: 40px 20px;
        opacity: 0;
        animation: gradientShift 15s ease infinite, fadeIn 0.5s ease forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }

    body.page-transitioning {
        animation: fadeOut 0.3s ease forwards;
    }

    @keyframes gradientShift {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    body.dark-mode {
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 25%, #2c5282 50%, #1a365d 75%, #1e3a8a 100%);
        background-size: 400% 400%;
        animation: gradientShift 15s ease infinite;
        color: #e0e0e0;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
        background-color: rgba(255, 255, 255, 0.95);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        transform: translateY(0);
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    body.dark-mode .container {
        background-color: rgba(26, 26, 26, 0.85);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    /* Header */
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 60px;
        padding-bottom: 30px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    body.dark-mode header {
        border-bottom-color: rgba(255, 255, 255, 0.1);
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .logo-img {
        width: 50px;
        height: 50px;
        background-color: #ccc;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        overflow: hidden;
    }

    .logo-img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }

    .logo-text {
        font-size: 24px;
        font-weight: 600;
    }

    nav {
        display: flex;
        gap: 25px;
        align-items: center;
    }

    nav a {
        color: #666;
        text-decoration: none;
        font-size: 16px;
        transition: color 0.3s, transform 0.3s;
        display: inline-block;
    }

    nav a:hover, nav a.active {
        color: #000;
        transform: translateY(-2px);
    }

    body.dark-mode nav a {
        color: #aaa;
    }

    body.dark-mode nav a:hover, body.dark-mode nav a.active {
        color: #fff;
    }

    .header-icons {
        display: flex;
        gap: 15px;
        align-items: center;
    }

    .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 20px;
        color: #666;
        padding: 5px;
    }

    body.dark-mode .icon-btn {
        color: #aaa;
    }

    .lang-toggle {
        background: none;
        border: 2px solid #ddd;
        border-radius: 6px;
        padding: 5px 12px;
        cursor: pointer;
        font-size: 14px;
        color: #666;
        font-weight: 500;
        transition: all 0.3s;
    }

    .lang-toggle:hover {
        border-color: #2196F3;
        color: #2196F3;
    }

    body.dark-mode .lang-toggle {
        border-color: #444;
        color: #aaa;
    }

    body.dark-mode .lang-toggle:hover {
        border-color: #2196F3;
        color: #2196F3;
    }

    /* Footer */
    footer {
        margin-top: 80px;
        padding-top: 30px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    body.dark-mode footer {
        border-top-color: rgba(255, 255, 255, 0.1);
    }

    .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        flex-wrap: wrap;
        gap: 20px;
    }

    .footer-links {
        display: flex;
        gap: 25px;
        flex-wrap: wrap;
    }

    .footer-links a {
        color: #666;
        text-decoration: none;
        font-size: 15px;
        transition: color 0.3s;
    }

    .footer-links a:hover {
        color: #2196F3;
    }

    body.dark-mode .footer-links a {
        color: #aaa;
    }

    body.dark-mode .footer-links a:hover {
        color: #2196F3;
    }

    .footer-social {
        display: flex;
        gap: 20px;
    }

    .footer-social a {
        color: #666;
        font-size: 20px;
        text-decoration: none;
        transition: transform 0.3s, color 0.3s;
    }

    .footer-social a:hover {
        color: #2196F3;
        transform: translateY(-3px);
    }

    body.dark-mode .footer-social a {
        color: #aaa;
    }

    body.dark-mode .footer-social a:hover {
        color: #2196F3;
    }

    .copyright {
        text-align: center;
        color: #999;
        font-size: 14px;
        padding: 20px 0;
    }

    body.dark-mode .copyright {
        color: #666;
    }

    @media (max-width: 768px) {
        header {
            flex-direction: column;
            gap: 20px;
        }

        nav {
            flex-wrap: wrap;
            justify-content: center;
        }

        .footer-content {
            flex-direction: column;
            text-align: center;
        }

        .footer-links {
            justify-content: center;
        }
    }
`;

// Shared header HTML
const headerHTML = `
    <header>
        <div class="logo">
            <div class="logo-img">
                <img src="/images/avatar_2.jpeg" alt="Hà Văn Ri">
            </div>
            <span class="logo-text" data-vi="Hà Văn Ri" data-en="Hà Văn Ri">Hà Văn Ri</span>
        </div>
        <nav>
            <a href="/" data-page="home" data-vi="Trang chủ" data-en="Home">Trang chủ</a>
            <a href="/about" data-page="about" data-vi="Giới thiệu" data-en="About">Giới thiệu</a>
            <a href="/blog" data-page="blog" data-vi="Blog" data-en="Blog">Blog</a>
            <a href="/projects" data-page="projects" data-vi="Dự án" data-en="Projects">Dự án</a>
            <a href="https://www.youtube.com/watch?v=BO9Slf3ih-4" data-page="youtube" data-vi="Youtube" data-en="Youtube">Youtube</a>
        </nav>
        <div class="header-icons">
            <button class="lang-toggle" onclick="toggleLanguage()">EN</button>
            <button class="icon-btn" onclick="alert('Search feature')">🔍</button>
            <button class="icon-btn" onclick="toggleDarkMode()">☀️</button>
        </div>
    </header>
`;

// Shared footer HTML
const footerHTML = `
    <footer>
<!--        <div class="footer-content">-->
<!--            <div class="footer-links">-->
<!--                <a href="/" data-vi="Trang chủ" data-en="Home">Trang chủ</a>-->
<!--                <a href="/about" data-vi="Giới thiệu" data-en="About">Giới thiệu</a>-->
<!--                <a href="/blog" data-vi="Blog" data-en="Blog">Blog</a>-->
<!--                <a href="/projects" data-vi="Dự án" data-en="Projects">Dự án</a>-->
<!--                <a href="https://www.youtube.com/watch?v=BO9Slf3ih-4" data-vi="Youtube" data-en="Youtube">Youtube</a>-->
<!--            </div>-->
<!--            <div class="footer-social">-->
<!--                <a href="#" title="Twitter" aria-label="Twitter">🐦</a>-->
<!--                <a href="#" title="GitHub" aria-label="GitHub">💻</a>-->
<!--                <a href="#" title="Instagram" aria-label="Instagram">📷</a>-->
<!--                <a href="#" title="LinkedIn" aria-label="LinkedIn">💼</a>-->
<!--                <a href="#" title="Email" aria-label="Email">✉️</a>-->
<!--            </div>-->
<!--        </div>-->
        <div class="copyright">
            Copyright © 2026 Hà Văn Ri
        </div>
    </footer>
`;

// Shared functions
let currentLang = 'vi';

function toggleLanguage() {
    currentLang = currentLang === 'vi' ? 'en' : 'vi';
    const btn = document.querySelector('.lang-toggle');
    btn.textContent = currentLang === 'vi' ? 'EN' : 'VI';

    const elements = document.querySelectorAll('[data-vi][data-en]');
    elements.forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        el.innerHTML = text;
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    const btn = document.querySelector('.header-icons .icon-btn:last-child');
    btn.textContent = isDark ? '🌙' : '☀️';

    // Save preference
    localStorage.setItem('darkMode', isDark);
}

function setActiveNav(currentPage) {
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        if (link.getAttribute('data-page') === currentPage) {
            link.classList.add('active');
        }
    });
}

function loadDarkModePreference() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        const btn = document.querySelector('.header-icons .icon-btn:last-child');
        if (btn) btn.textContent = '🌙';
    }
}

// Initialize layout
function initLayout(currentPage) {
    // Add shared styles
    const styleElement = document.createElement('style');
    styleElement.textContent = sharedStyles;
    document.head.appendChild(styleElement);

    // Add header
    const container = document.querySelector('.container');
    container.insertAdjacentHTML('afterbegin', headerHTML);

    // Add footer
    container.insertAdjacentHTML('beforeend', footerHTML);

    // Set active navigation
    setActiveNav(currentPage);

    // Load dark mode preference
    loadDarkModePreference();

    // Add page transition effects
    addPageTransitions();
}

// Add smooth page transitions
function addPageTransitions() {
    const links = document.querySelectorAll('a[href^="/"], a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Don't prevent if it's the same page
            if (href && !href.startsWith('#')) {
                e.preventDefault();

                // Add transitioning class
                document.body.classList.add('page-transitioning');

                // Navigate after animation
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
}
