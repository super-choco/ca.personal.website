// ---- THEME (se ejecuta antes del DOM ready para evitar flash) ----
(function () {
    function getTheme() {
        var saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', getTheme());
})();

$(function () {

    // Theme toggle
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        var icon = $('#themeToggle i');
        icon.removeClass('bi-moon bi-sun').addClass(theme === 'dark' ? 'bi-sun' : 'bi-moon');
        localStorage.setItem('theme', theme);
    }

    // Sincronizar icono con el tema ya aplicado
    var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    $('#themeToggle i').removeClass('bi-moon bi-sun').addClass(currentTheme === 'dark' ? 'bi-sun' : 'bi-moon');

    $('#themeToggle').on('click', function () {
        var current = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    // Header scroll effect
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 40) {
            $('.site-header').addClass('scrolled');
        } else {
            $('.site-header').removeClass('scrolled');
        }
    });

    // ---- MAPA DE LUGARES ----
    if (typeof L !== 'undefined' && typeof placesData !== 'undefined' && placesData.length > 0) {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        var tileLight = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
        var tileDark = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

        var map = L.map('placesMap', {
            scrollWheelZoom: false,
            attributionControl: false
        }).setView([42, 2], 5);

        var tileLayer = L.tileLayer(isDark ? tileDark : tileLight, {
            maxZoom: 18
        }).addTo(map);

        // Cambiar tiles al cambiar tema
        $('#themeToggle').on('click', function () {
            setTimeout(function () {
                var dark = document.documentElement.getAttribute('data-theme') === 'dark';
                tileLayer.setUrl(dark ? tileDark : tileLight);
            }, 50);
        });

        // Marcadores
        var markerIcon = L.divIcon({
            className: 'place-marker',
            iconSize: [12, 12],
            iconAnchor: [6, 6],
            popupAnchor: [0, -8]
        });

        $.each(placesData, function (i, place) {
            L.marker([place.lat, place.lng], { icon: markerIcon })
                .addTo(map)
                .bindPopup('<strong>' + place.name + '</strong>');
        });

        // Ajustar vista a todos los marcadores
        var points = [];
        $.each(placesData, function (i, p) { points.push([p.lat, p.lng]); });
        map.fitBounds(points, { padding: [40, 40] });
    }

    // ---- GALERÍA DINÁMICA ----
    var GALLERY_PER_PAGE = 6;
    var galleryPage = 0;

    // Ordenar por año descendente (más recientes primero)
    var sortedGallery = (typeof galleryData !== 'undefined' ? galleryData : []).slice().sort(function (a, b) {
        return b.year.localeCompare(a.year);
    });

    var totalPages = Math.ceil(sortedGallery.length / GALLERY_PER_PAGE);

    function renderGallery(page) {
        galleryPage = page;
        var start = page * GALLERY_PER_PAGE;
        var items = sortedGallery.slice(start, start + GALLERY_PER_PAGE);
        var $grid = $('#galleryGrid');
        $grid.empty();

        $.each(items, function (i, item) {
            var caption = item.year + ' - ' + item.name;
            var $col = $('<div class="col-6 col-lg-4 familia-item">');
            var $img = $('<img>').attr({
                src: 'images/gallery/' + item.file,
                alt: item.name,
                'data-caption': caption
            });
            $col.append($img);
            $grid.append($col);
        });

        renderPagination();
        initLightbox();
    }

    function renderPagination() {
        var $pag = $('#galleryPagination');
        $pag.empty();
        if (totalPages <= 1) return;

        var $prev = $('<button class="gallery-page-btn">').html('<i class="bi bi-chevron-left"></i>');
        $prev.prop('disabled', galleryPage === 0);
        $prev.on('click', function () { renderGallery(galleryPage - 1); });
        $pag.append($prev);

        for (var p = 0; p < totalPages; p++) {
            var $btn = $('<button class="gallery-page-btn">').text(p + 1);
            if (p === galleryPage) $btn.addClass('active');
            $btn.data('page', p);
            $btn.on('click', function () { renderGallery($(this).data('page')); });
            $pag.append($btn);
        }

        var $next = $('<button class="gallery-page-btn">').html('<i class="bi bi-chevron-right"></i>');
        $next.prop('disabled', galleryPage === totalPages - 1);
        $next.on('click', function () { renderGallery(galleryPage + 1); });
        $pag.append($next);
    }

    // ---- LIGHTBOX ----
    var lbImages = [];
    var lbCurrent = 0;
    var lbModal = new bootstrap.Modal(document.getElementById('lightboxModal'));

    function initLightbox() {
        lbImages = [];
        $('#galleryGrid .familia-item img').each(function () {
            lbImages.push({ src: $(this).attr('src'), caption: $(this).data('caption') || '' });
        });

        $('#galleryGrid .familia-item img').off('click').on('click', function () {
            var src = $(this).attr('src');
            var idx = 0;
            $.each(lbImages, function (i, img) { if (img.src === src) { idx = i; return false; } });
            lbShow(idx);
            lbModal.show();
        });
    }

    function lbShow(index) {
        lbCurrent = (index + lbImages.length) % lbImages.length;
        $('#lightboxImg').attr('src', lbImages[lbCurrent].src);
        $('#lightboxCaption').text(lbImages[lbCurrent].caption);
    }

    $('#lbPrev').on('click', function () { lbShow(lbCurrent - 1); });
    $('#lbNext').on('click', function () { lbShow(lbCurrent + 1); });

    $(document).on('keydown', function (e) {
        if (!$('#lightboxModal').hasClass('show')) return;
        if (e.key === 'ArrowLeft')  { lbShow(lbCurrent - 1); }
        if (e.key === 'ArrowRight') { lbShow(lbCurrent + 1); }
    });

    // Iniciar galería
    if (sortedGallery.length > 0) {
        renderGallery(0);
    }

    // ---- TECH CARD POPUP ----
    var techModal = new bootstrap.Modal(document.getElementById('techModal'));

    $(document).on('click keydown', '.tech-card', function (e) {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();

        var cardId = $(this).data('tech-id');
        var lang = localStorage.getItem('lang') || 'es';
        var popups = i18n.techPopups[lang] || i18n.techPopups['es'];
        var data = popups[cardId];
        if (!data) return;

        $('#techModalIcon').attr('class', 'bi ' + data.icon + ' tech-modal-icon');
        $('#techModalTitle').text($('[data-tech-id="' + cardId + '"] h3').text());
        $('#techModalPeriod').text(data.period);

        var itemsHtml = data.items.map(function (item) {
            return '<li>' + item + '</li>';
        }).join('');

        var tagsHtml = data.tags.map(function (tag) {
            return '<span class="tech-modal-tag">' + tag + '</span>';
        }).join('');

        $('#techModalBody').html(
            '<p class="tech-modal-intro">' + data.intro + '</p>' +
            '<ul class="tech-modal-list">' + itemsHtml + '</ul>' +
            '<div class="tech-modal-tags">' + tagsHtml + '</div>'
        );

        techModal.show();
    });

    // ---- MOBILE NAV TOGGLE ----
    $('#navToggle').on('click', function () {
        $('.site-nav').toggleClass('open');
        $(this).find('i').toggleClass('bi-list bi-x');
    });

    $('.site-nav a').on('click', function () {
        $('.site-nav').removeClass('open');
        $('#navToggle i').removeClass('bi-x').addClass('bi-list');
    });

    // ---- SMOOTH SCROLL ----
    $('a[href^="#"]').on('click', function (e) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, 500);
        }
    });

    // ---- AUTO-CALCULATED NUMBERS ----
    var now = new Date();

    function yearsDiff(date) {
        var diff = now - date;
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    function ageInYears(date) {
        var y = now.getFullYear() - date.getFullYear();
        var m = now.getMonth() - date.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < date.getDate())) y--;
        return y;
    }

    $('#years-together').text(yearsDiff(new Date(2004, 0, 18)));
    $('#years-married').text(yearsDiff(new Date(2016, 10, 19)));
    $('#years-engineer').text(now.getFullYear() - 2006);
    $('#years-siivueling').text(now.getFullYear() - 2008);

    var kid1 = ageInYears(new Date(2015, 0, 1));
    var kid2 = ageInYears(new Date(2020, 5, 1));
    $('#kid-ages').text(kid1 + ' y ' + kid2);

});
