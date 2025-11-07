// Scroll animation for sections on inicio.html
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.hero, .features, #novedades, #investigacion');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});
