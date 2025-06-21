document.addEventListener('DOMContentLoaded', function () {
    const toggleSearchBtn = document.getElementById('toggleSearchBtn');
    const searchBarWrapper = document.getElementById('searchBarWrapper');
    const offcanvas = document.getElementById('offcanvasDarkNavbar');

    toggleSearchBtn.addEventListener('click', () => {
        if (!offcanvas.classList.contains('show')) {
            searchBarWrapper.classList.toggle('show');
        }
    });

    // Hide search bar when offcanvas closes
    offcanvas.addEventListener('hidden.bs.offcanvas', () => {
        searchBarWrapper.classList.remove('show');
    });
    // Hide search bar when offcanvas opens
    offcanvas.addEventListener('shown.bs.offcanvas', () => {
        searchBarWrapper.classList.toggle('show');
    });
});