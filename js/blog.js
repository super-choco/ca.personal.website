(function () {

    function getSlugFromUrl() {
        var params = new URLSearchParams(window.location.search);
        return params.get('post') || '';
    }

    function formatDate(isoString) {
        var lang = localStorage.getItem('lang') || 'es';
        var localeMap = { es: 'es-ES', en: 'en-GB', ca: 'ca-ES' };
        var d = new Date(isoString + 'T00:00:00');
        return d.toLocaleDateString(localeMap[lang] || 'es-ES', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    }

    function slugToUrl(slug) {
        return 'blog.html?post=' + encodeURIComponent(slug);
    }

    // ---- LIST VIEW ----

    function renderList() {
        document.title = 'Blog | Carlos Arranz';

        var posts = (postsData || []).slice().sort(function (a, b) {
            return b.date.localeCompare(a.date);
        });

        var html = '<div class="blog-header">'
            + '<h1 class="blog-title">Blog</h1>'
            + '<p class="blog-subtitle">Reflexiones sobre tecnología, entrenamiento y vida.</p>'
            + '</div>';

        if (posts.length === 0) {
            html += '<p class="blog-empty">Aún no hay posts publicados. Vuelve pronto.</p>';
        } else {
            html += '<div class="blog-list">';
            posts.forEach(function (post) {
                var tagsHtml = (post.tags || []).map(function (t) {
                    return '<span class="blog-tag">' + t + '</span>';
                }).join('');

                var aiBadge = post.ai ? '<span class="blog-ai-badge" title="Contenido generado con IA">✦ IA</span>' : '';

                html += '<article class="blog-card">'
                    + '<div class="blog-card-meta">'
                    + '<time class="blog-card-date" datetime="' + post.date + '">' + formatDate(post.date) + '</time>'
                    + (tagsHtml ? '<div class="blog-card-tags">' + tagsHtml + '</div>' : '')
                    + aiBadge
                    + '</div>'
                    + '<h2 class="blog-card-title">'
                    + '<a href="' + slugToUrl(post.slug) + '">' + post.title + '</a>'
                    + '</h2>'
                    + '<p class="blog-card-excerpt">' + post.excerpt + '</p>'
                    + '<a href="' + slugToUrl(post.slug) + '" class="blog-read-more">Leer más <i class="bi bi-arrow-right"></i></a>'
                    + '</article>';
            });
            html += '</div>';
        }

        $('#blogContent').html(html);
    }

    // ---- POST VIEW ----

    function renderPost(slug) {
        var meta = null;
        (postsData || []).forEach(function (p) {
            if (p.slug === slug) meta = p;
        });

        $('#blogContent').html('<div class="blog-loading"><i class="bi bi-hourglass-split"></i> Cargando...</div>');

        fetch('posts/' + slug + '.md')
            .then(function (res) {
                if (!res.ok) throw new Error('404');
                return res.text();
            })
            .then(function (markdown) {
                var bodyHtml = marked.parse(markdown);

                var tagsHtml = '';
                if (meta && meta.tags && meta.tags.length) {
                    tagsHtml = '<div class="blog-post-tags">'
                        + meta.tags.map(function (t) {
                            return '<span class="blog-tag">' + t + '</span>';
                        }).join('')
                        + (meta.ai ? '<span class="blog-ai-badge" title="Contenido generado con IA">✦ IA</span>' : '')
                        + '</div>';
                }

                var dateHtml = meta
                    ? '<time class="blog-post-date" datetime="' + meta.date + '">' + formatDate(meta.date) + '</time>'
                    : '';

                var html = '<div class="blog-post-nav">'
                    + '<a href="blog.html" class="blog-back"><i class="bi bi-arrow-left"></i> Volver al blog</a>'
                    + '</div>'
                    + '<article class="blog-post">'
                    + '<header class="blog-post-header">'
                    + dateHtml
                    + tagsHtml
                    + '<h1 class="blog-post-title">' + (meta ? meta.title : slug) + '</h1>'
                    + '</header>'
                    + '<div class="blog-post-body">' + bodyHtml + '</div>'
                    + '</article>';

                document.title = (meta ? meta.title + ' | ' : '') + 'Blog · Carlos Arranz';
                $('#blogContent').html(html);
            })
            .catch(function () {
                $('#blogContent').html(
                    '<div class="blog-error">'
                    + '<p>Post no encontrado.</p>'
                    + '<a href="blog.html" class="blog-back"><i class="bi bi-arrow-left"></i> Volver al blog</a>'
                    + '</div>'
                );
            });
    }

    // ---- ROUTER ----

    $(function () {
        var slug = getSlugFromUrl();
        if (slug) {
            renderPost(slug);
        } else {
            renderList();
        }

        $(window).on('popstate', function () {
            var s = getSlugFromUrl();
            if (s) { renderPost(s); } else { renderList(); }
        });
    });

})();
