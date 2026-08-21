export const headerHTML = `
    <header class="site-header">
        <a class="logo" href="/" aria-label="Hà Văn Ri — home">
            <span class="logo-mark" aria-hidden="true">HVR</span>
            <span class="logo-text" data-i18n="header.logo">Hà Văn Ri</span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">
            <span aria-hidden="true">Menu</span>
            <span class="sr-only">Open navigation</span>
        </button>
        <nav id="primary-navigation" class="primary-nav" aria-label="Primary navigation">
            <a href="/" data-page="home" data-i18n="header.home">Trang chủ</a>
            <a href="/about" data-page="about" data-i18n="header.about">Giới thiệu</a>
            <a href="/blog" data-page="blog" data-i18n="header.blog">Blog</a>
            <a href="/projects" data-page="projects" data-i18n="header.projects">Dự án</a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/" data-page="youtube" data-i18n="header.youtube">Youtube</a>
        </nav>
        <div class="header-tools" aria-label="Display settings">
            <button class="lang-toggle" type="button" onclick="toggleLanguage()">EN</button>
            <button class="icon-btn theme-toggle" type="button" aria-label="Toggle color theme" onclick="toggleDarkMode()">◐</button>
        </div>
    </header>
`;

export const footerHTML = `
    <footer class="site-footer">
        <p class="footer-statement">Open to thoughtful engineering conversations.</p>
        <div class="footer-meta">
            <a href="mailto:havanri.1707@gmail.com">havanri.1707@gmail.com</a>
            <span>Hanoi, Vietnam</span>
            <span>© 2026 Hà Văn Ri</span>
        </div>
    </footer>
`;
