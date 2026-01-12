export const headerHTML = `
    <header>
        <div class="logo">
            <div class="logo-img">
                <img src="/assets/images/FullLogo.png" alt="Hà Văn Ri">
            </div>
            <span class="logo-text" data-vi="Hà Văn Ri" data-en="Hà Văn Ri">Hà Văn Ri</span>
        </div>
        <nav>
            <a href="index.html" data-page="home" data-vi="Trang chủ" data-en="Home">Trang chủ</a>
            <a href="about.html" data-page="about" data-vi="Giới thiệu" data-en="About">Giới thiệu</a>
            <a href="blog.html" data-page="blog" data-vi="Blog" data-en="Blog">Blog</a>
            <a href="youtube.html" data-page="youtube" data-vi="Youtube" data-en="Youtube">Youtube</a>
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
