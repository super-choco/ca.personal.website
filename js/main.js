$(function () {

    // Header scroll effect
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 40) {
            $('.site-header').addClass('scrolled');
        } else {
            $('.site-header').removeClass('scrolled');
        }
    });

    // Mobile nav toggle
    $('#navToggle').on('click', function () {
        $('.site-nav').toggleClass('open');
        $(this).find('i').toggleClass('bi-list bi-x');
    });

    // Close mobile nav on link click
    $('.site-nav a').on('click', function () {
        $('.site-nav').removeClass('open');
        $('#navToggle i').removeClass('bi-x').addClass('bi-list');
    });

    // Smooth scroll
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

    // Años con mi mujer (desde 18 enero 2004)
    $('#years-together').text(yearsDiff(new Date(2004, 0, 18)));

    // Años casados (desde 19 noviembre 2016)
    $('#years-married').text(yearsDiff(new Date(2016, 10, 19)));

    // Años como ingeniero (desde 2006)
    $('#years-engineer').text(now.getFullYear() - 2006);

    // Años como ingeniero (desde 2008)
    $('#years-siivueling').text(now.getFullYear() - 2008);

    // Edades de los hijos
    var kid1 = ageInYears(new Date(2015, 0, 1));  // enero 2015
    var kid2 = ageInYears(new Date(2020, 5, 1));  // junio 2020
    $('#kid-ages').text(kid1 + ' y ' + kid2);

});
