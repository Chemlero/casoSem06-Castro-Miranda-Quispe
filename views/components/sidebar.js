document.addEventListener("DOMContentLoaded", () => {
    const sidebarContainer = document.getElementById("sidebar");

    fetch("/components/sidebar.html")
        .then(response => response.text())
        .then(data => {
            sidebarContainer.innerHTML = data;
            activarLink();
        })
        .catch(error => console.error("Error cargando sidebar:", error));
});

function activarLink() {
    const links = document.querySelectorAll(".sidebar a");
    const current = window.location.pathname;

    links.forEach(link => {
        if (link.getAttribute("href") === current) {
            link.classList.add("active");
        }
    });
}