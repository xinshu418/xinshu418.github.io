(() => {
    'use strict';

    const CONFIG_URL = 'config.yml';
    const researchColors = ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-orange-600'];
    const socialDefinitions = {
        github: { label: 'GitHub', icon: 'fab fa-github' },
        google_scholar: { label: 'Google Scholar', icon: 'fas fa-graduation-cap' },
        linkedin: { label: 'LinkedIn', icon: 'fab fa-linkedin' },
        twitter: { label: 'Twitter', icon: 'fab fa-twitter' }
    };

    const byId = (id) => document.getElementById(id);

    function escapeHtml(value = '') {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function safeUrl(value, { allowHash = false } = {}) {
        if (typeof value !== 'string') return '';
        const url = value.trim();
        if (!url || url === '#') return '';
        if (/your(username|linkedin|twitter|id)|example\.com/i.test(url)) return '';
        if (allowHash && /^#[A-Za-z][\w-]*$/.test(url)) return url;
        if (/^(https?:\/\/|mailto:|\/|\.\/)/i.test(url)) return url;
        return '';
    }

    function externalAttributes(url) {
        return /^https?:\/\//i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
    }

    function renderSite(config) {
        const site = config.site || {};
        const title = site.title || config.hero?.name || '个人学术主页';
        const description = site.description || config.hero?.subtitle || '';

        document.title = description ? `${title} - ${description}` : title;
        byId('site-name').textContent = title;
        byId('meta-description').setAttribute('content', description || title);

        const canonicalUrl = safeUrl(site.url);
        const canonical = byId('canonical-link');
        if (canonicalUrl) canonical.href = canonicalUrl;
        else canonical.remove();

        const appearance = config.appearance || {};
        const rootStyle = document.documentElement.style;
        if (/^#[0-9a-f]{6}$/i.test(appearance.gradient_start || '')) rootStyle.setProperty('--gradient-start', appearance.gradient_start);
        if (/^#[0-9a-f]{6}$/i.test(appearance.gradient_end || '')) rootStyle.setProperty('--gradient-end', appearance.gradient_end);
        if (/^#[0-9a-f]{6}$/i.test(appearance.accent || '')) rootStyle.setProperty('--accent', appearance.accent);
    }

    function renderNavigation(config) {
        const visibleSections = config.show || {};
        const items = Array.isArray(config.nav) ? config.nav : [];
        byId('nav-links').innerHTML = items
            .filter((item) => {
                const href = safeUrl(item.href, { allowHash: true });
                return href && visibleSections[href.slice(1)] !== false;
            })
            .map((item) => {
                const href = safeUrl(item.href, { allowHash: true });
                return `<a href="${escapeHtml(href)}" class="nav-link text-gray-600 transition-colors hover:text-blue-600">${escapeHtml(item.label)}</a>`;
            })
            .join('');
    }

    function renderHero(hero = {}) {
        const avatar = safeUrl(hero.avatar);
        const buttons = Array.isArray(hero.buttons) ? hero.buttons : [];
        const buttonHtml = buttons.map((button) => {
            const url = safeUrl(button.url);
            if (!url) return '';
            const primary = button.style === 'primary';
            const classes = primary
                ? 'bg-white text-blue-600 hover:bg-gray-100'
                : 'border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600';
            const icon = url.startsWith('mailto:') ? 'fas fa-envelope' : url.includes('github.com') ? 'fab fa-github' : 'fas fa-link';
            return `<a href="${escapeHtml(url)}" class="rounded-full px-6 py-2 font-semibold transition-colors ${classes}"${externalAttributes(url)}><i class="${icon} mr-2" aria-hidden="true"></i>${escapeHtml(button.label)}</a>`;
        }).join('');

        byId('hero-content').innerHTML = `
            ${avatar ? `<img src="${escapeHtml(avatar)}" alt="${escapeHtml(hero.name || '个人')}的头像" width="128" height="128" class="mx-auto mb-6 h-32 w-32 rounded-full border-4 border-white object-cover">` : ''}
            <h1 class="mb-4 text-4xl font-bold md:text-5xl">${escapeHtml(hero.name)}</h1>
            <p class="mb-2 text-xl md:text-2xl">${escapeHtml(hero.title)}</p>
            ${hero.subtitle ? `<p class="mb-6 text-base text-white/80">${escapeHtml(hero.subtitle)}</p>` : '<div class="mb-6"></div>'}
            ${buttonHtml ? `<div class="flex flex-wrap justify-center gap-4">${buttonHtml}</div>` : ''}
        `;
    }

    function renderAbout(about = {}) {
        const stack = Array.isArray(about.tech_stack) ? about.tech_stack : [];
        const education = Array.isArray(about.education) ? about.education : [];
        byId('about-content').innerHTML = `
            <div>
                <p class="whitespace-pre-line leading-relaxed text-gray-600">${escapeHtml(about.description).trim()}</p>
                ${stack.length ? `<div class="mt-6"><h3 class="mb-4 text-xl font-semibold">技术栈</h3><div class="flex flex-wrap gap-2">${stack.map((item) => `<span class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">${escapeHtml(item)}</span>`).join('')}</div></div>` : ''}
            </div>
            <div class="rounded-lg bg-gray-50 p-6">
                <h3 class="mb-4 text-xl font-semibold">教育背景</h3>
                <div class="space-y-4">${education.map((item) => `
                    <article>
                        <h4 class="font-semibold text-gray-700">${escapeHtml(item.degree)}</h4>
                        <p class="text-sm text-gray-600">${escapeHtml(item.institution)}${item.period ? `，${escapeHtml(item.period)}` : ''}</p>
                    </article>
                `).join('')}</div>
            </div>
        `;
    }

    function renderResearch(items = []) {
        byId('research-content').innerHTML = (Array.isArray(items) ? items : []).map((item, index) => `
            <article class="card-hover rounded-lg bg-white p-6 shadow-sm">
                <div class="mb-4 ${researchColors[index % researchColors.length]}"><i class="fas ${escapeHtml(item.icon || 'fa-flask')} text-2xl" aria-hidden="true"></i></div>
                <h3 class="mb-3 text-xl font-semibold">${escapeHtml(item.title)}</h3>
                <p class="text-gray-600">${escapeHtml(item.description)}</p>
            </article>
        `).join('');
    }

    function renderPublications(items = []) {
        byId('publications-content').innerHTML = (Array.isArray(items) ? items : []).map((item) => {
            const pdf = safeUrl(item.pdf);
            const code = safeUrl(item.code);
            return `
                <article class="card-hover rounded-lg bg-gray-50 p-6">
                    <h3 class="mb-2 text-xl font-semibold">${escapeHtml(item.title)}</h3>
                    <p class="mb-1 text-gray-700">${escapeHtml(item.authors)}</p>
                    <p class="mb-3 text-sm text-gray-600">${escapeHtml(item.venue)}${item.year ? `，${escapeHtml(item.year)}` : ''}</p>
                    ${(pdf || code) ? `<div class="flex gap-4">${pdf ? `<a href="${escapeHtml(pdf)}" class="text-sm text-blue-600 hover:text-blue-800"${externalAttributes(pdf)}><i class="fas fa-file-pdf mr-1" aria-hidden="true"></i>PDF</a>` : ''}${code ? `<a href="${escapeHtml(code)}" class="text-sm text-blue-600 hover:text-blue-800"${externalAttributes(code)}><i class="fas fa-code mr-1" aria-hidden="true"></i>代码</a>` : ''}</div>` : ''}
                </article>
            `;
        }).join('');
    }

    function renderProjects(items = []) {
        byId('projects-content').innerHTML = (Array.isArray(items) ? items : []).map((item) => `
            <article class="card-hover rounded-lg bg-white p-6 shadow-sm">
                <h3 class="mb-2 text-lg font-semibold">${escapeHtml(item.title)}</h3>
                <p class="text-gray-600">${escapeHtml(item.description)}</p>
                ${item.period ? `<p class="mt-3 text-sm text-gray-500">${escapeHtml(item.period)}</p>` : ''}
            </article>
        `).join('');
    }

    function renderContact(contact = {}) {
        const email = typeof contact.email === 'string' ? contact.email.trim() : '';
        const social = contact.social && typeof contact.social === 'object' ? contact.social : {};
        const socialLinks = Object.entries(socialDefinitions).map(([key, definition]) => {
            const url = safeUrl(social[key]);
            if (!url) return '';
            return `<a href="${escapeHtml(url)}" class="text-gray-700 hover:text-blue-600" aria-label="${definition.label}"${externalAttributes(url)}><i class="${definition.icon} text-2xl" aria-hidden="true"></i></a>`;
        }).join('');

        byId('contact-content').innerHTML = `
            <div class="space-y-4">
                ${email ? `<div class="flex items-center"><i class="fas fa-envelope mr-3 text-blue-600" aria-hidden="true"></i><a class="text-gray-700 hover:text-blue-600" href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>` : ''}
                ${contact.address ? `<div class="flex items-center"><i class="fas fa-map-marker-alt mr-3 text-red-600" aria-hidden="true"></i><span class="text-gray-700">${escapeHtml(contact.address)}</span></div>` : ''}
            </div>
            <div class="rounded-lg bg-gray-50 p-6">
                <h3 class="mb-4 text-xl font-semibold">关注我</h3>
                ${socialLinks ? `<div class="flex gap-5">${socialLinks}</div>` : '<p class="text-sm text-gray-500">社交主页链接待添加</p>'}
            </div>
        `;
    }

    function applyVisibility(show = {}) {
        document.querySelectorAll('[data-section]').forEach((section) => {
            section.hidden = show[section.dataset.section] === false;
        });
    }

    function setupInteractions() {
        const toggle = byId('nav-toggle');
        const links = byId('nav-links');
        toggle.addEventListener('click', () => {
            const open = links.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
        });

        links.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                links.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', '打开导航菜单');
            }
        });

        const sections = [...document.querySelectorAll('main section[id]:not([hidden])')];
        const navLinks = [...document.querySelectorAll('.nav-link')];
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!visible) return;
            navLinks.forEach((link) => {
                const active = link.getAttribute('href') === `#${visible.target.id}`;
                if (active) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
            });
        }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.1, 0.5] });
        sections.forEach((section) => observer.observe(section));
    }

    async function loadConfig() {
        const response = await fetch(CONFIG_URL, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`无法读取 ${CONFIG_URL}（HTTP ${response.status}）`);
        if (!window.jsyaml) throw new Error('YAML 解析库加载失败');
        const config = window.jsyaml.load(await response.text());
        if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error('配置文件根节点必须是对象');
        return config;
    }

    async function initialize() {
        const status = byId('config-status');
        try {
            const config = await loadConfig();
            renderSite(config);
            applyVisibility(config.show);
            renderNavigation(config);
            renderHero(config.hero);
            renderAbout(config.about);
            renderResearch(config.research);
            renderPublications(config.publications);
            renderProjects(config.projects);
            renderContact(config.contact);
            byId('footer-copyright').textContent = config.footer?.copyright || '';
            setupInteractions();
            status.remove();
        } catch (error) {
            console.error(error);
            status.className = 'bg-red-50 px-4 py-3 text-center text-sm text-red-800';
            if (window.location.protocol === 'file:') {
                status.innerHTML = '浏览器不允许本地文件直接读取 <code>config.yml</code>。请双击项目中的 <strong>preview.bat</strong> 启动本地预览。';
            } else {
                status.textContent = `页面配置加载失败：${error.message}。请检查 config.yml。`;
            }
        }
    }

    initialize();
})();
