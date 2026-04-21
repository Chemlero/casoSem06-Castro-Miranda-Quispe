// Cargar el sidebar dinámicamente
fetch('/components/sidebar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('sidebar').innerHTML = html;

        // Resaltar la opción activa
        const path = window.location.pathname;
        const links = document.querySelectorAll('.sidebar a');
        links.forEach(link => {
            if (path.includes(link.getAttribute('href').substring(1))) {
                link.classList.add('active');
            }
        });
    });