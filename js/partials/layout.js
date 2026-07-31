export const headerHTML = `
    <header>
        <div class="logo">
            <div class="logo-img">
                <img src="/assets/images/FullLogo.png" alt="Hà Văn Ri">
            </div>
            <span class="logo-text" data-i18n="header.logo">Hà Văn Ri</span>
        </div>
        <nav>
            <a href="/" data-page="home" data-i18n="header.home">Trang chủ</a>
            <a href="/about" data-page="about" data-i18n="header.about">Giới thiệu</a>
            <a href="/blog" data-page="blog" data-i18n="header.blog">Blog</a>
            <a href="/projects" data-page="projects" data-i18n="header.projects">Dự án</a>
            <a target="_blank" href="https://www.youtube.com/" data-page="youtube" data-i18n="header.youtube">Youtube</a>
        </nav>
        <div class="header-icons">
            <button class="lang-toggle" onclick="toggleLanguage()">EN</button>
            <button class="icon-btn" onclick="alert('Search feature')">🔍</button>
            <button class="icon-btn" onclick="toggleDarkMode()">☀️</button>
        </div>
    </header>
`;

export const footerHTML = `
    <footer>
        <div class="copyright">
            Copyright © 2026 Hà Văn Ri
        </div>
    </footer>
`;
