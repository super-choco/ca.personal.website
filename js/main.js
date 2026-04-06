$(function () {

    // Header scroll effect
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 40) {
            $('.site-header').addClass('scrolled');
        } else {
            $('.site-header').removeClass('scrolled');
        }
    });

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
