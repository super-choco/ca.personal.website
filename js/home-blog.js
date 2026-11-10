(function () {
    var labels = {
        es: { read: 'Leer reflexión' },
        en: { read: 'Read article' },
        ca: { read: 'Llegir reflexió' }
    };

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function formatDate(date, lang) {
        var locales = { es: 'es-ES', en: 'en-GB', ca: 'ca-ES' };
        return new Date(date + 'T00:00:00').toLocaleDateString(locales[lang] || locales.es, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    function postUrl(slug) {
        return 'blog.html?post=' + encodeURIComponent(slug);
    }

    function render() {
        var $grid = $('#homeBlogGrid');
        if (!$grid.length || typeof postsData === 'undefined') return;

        var lang = localStorage.getItem('lang') || 'es';
        var copy = labels[lang] || labels.es;
        var posts = postsData.slice().sort(function (a, b) {
            return b.date.localeCompare(a.date);
        }).slice(0, 2);

        var html = '';
        posts.forEach(function (post, index) {
            var tags = (post.tags || []).map(function (tag) {
                return '<span class="home-blog-card-tag">' + escapeHtml(tag) + '</span>';
            }).join('');
            var url = postUrl(post.slug);

            html += '<article class="home-blog-card' + (index === 0 ? ' home-blog-card-featured' : '') + '">'
                + '<div class="home-blog-card-meta">'
                + '<time class="home-blog-card-date" datetime="' + escapeHtml(post.date) + '">'
                + escapeHtml(formatDate(post.date, lang))
                + '</time>'
                + tags
                + '</div>'
                + '<h3 class="home-blog-card-title"><a href="' + url + '">'
                + escapeHtml(post.title)
                + '</a></h3>'
                + '<p class="home-blog-card-excerpt">' + escapeHtml(post.excerpt) + '</p>'
                + '<a class="home-blog-card-link" href="' + url + '">'
                + escapeHtml(copy.read)
                + ' <i class="bi bi-arrow-right"></i></a>'
                + '</article>';
        });

        $grid.html(html);
    }

    $(function () {
        render();
        $(document).on('click', '.lang-btn', function () {
            window.setTimeout(render, 0);
        });
    });
})();
