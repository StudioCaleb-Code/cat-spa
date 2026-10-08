document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.link-nav');

    // VERIFICA QUE ESTOS NOMBRES SEAN IDÉNTICOS A TUS CARPETAS EN GITHUB
    const routes = {
        inicio: {
            html: 'pages/perfil/perfil.html',
            css: 'pages/perfil/perfil.css',
            js: 'pages/perfil/perfil.js',
            iconInactive: 'bi-person',
            iconActive: 'bi-person-fill'
        },
        nosotros: {
            html: 'pages/nosotros/nosotros.html',
            css: 'pages/nosotros/nosotros.css',
            js: 'pages/nosotros/nosotros.js',
            iconInactive: 'bi-people',
            iconActive: 'bi-people-fill'
        },
        servicios: {
            html: 'pages/servicios/servicios.html',
            css: 'pages/servicios/servicios.css',
            js: 'pages/servicios/servicios.js',
            iconInactive: 'bi-gear',
            iconActive: 'bi-gear-fill'
        },
        productos: {
            html: 'pages/productos/productos.html',
            css: 'pages/productos/productos.css',
            js: 'pages/productos/productos.js',
            iconInactive: 'bi-box-seam',
            iconActive: 'bi-box-seam-fill'
        },
        contacto: {
            // Revisa si tu carpeta se llama 'contacto' o 'contactos'
            html: 'pages/contacto/contacto.html',
            css: 'pages/contacto/contacto.css',
            js: 'pages/contacto/contacto.js',
            iconInactive: 'bi-envelope',
            iconActive: 'bi-envelope-fill'
        }
    };

    async function navigateTo(routeName) {
        const route = routes[routeName];

        if (!route) {
            console.error(`La ruta "${routeName}" no existe en el objeto routes.`);
            return;
        }

        try {
            const response = await fetch(route.html);

            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status} al intentar cargar ${route.html}`);
            }

            let html = await response.text();

            if (!html.trim()) {
                html = `
                    <div class="no-fount">
                        <div class="no-fount-container">
                            <h2>Sección en construcción</h2>
                            <p>Próximamente agregaremos contenido a la vista <strong>${routeName}</strong>.</p>
                        </div>
                    </div>
                `;
            }

            mainContent.innerHTML = html;

            if (route.css) {
                let dynamicCss = document.getElementById('dynamic-css');
                if (!dynamicCss) {
                    dynamicCss = document.createElement('link');
                    dynamicCss.id = 'dynamic-css';
                    dynamicCss.rel = 'stylesheet';
                    document.head.appendChild(dynamicCss);
                }
                dynamicCss.href = route.css;
            }

            if (route.js) {
                const oldScript = document.getElementById('dynamic-js');
                if (oldScript) oldScript.remove();

                const newScript = document.createElement('script');
                newScript.id = 'dynamic-js';
                newScript.src = route.js;
                document.body.appendChild(newScript);
            }

        } catch (error) {
            console.error(`Error al cargar la ruta ${routeName}:`, error);
            mainContent.innerHTML = `
                <div class="no-fount">
                    <div class="no-fount-container">
                        <h2>No se pudo cargar la página</h2>
                        <p>Verifica que la ruta <code>${route.html}</code> exista y coincida exactamente en mayúsculas/minúsculas.</p>
                    </div>
                </div>
            `;
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetRoute = this.getAttribute('data-route');

            navLinks.forEach(item => {
                item.classList.remove('active');
                const routeKey = item.getAttribute('data-route');
                const icon = item.querySelector('i');

                if (routes[routeKey] && icon) {
                    icon.className = `bi ${routes[routeKey].iconInactive}`;
                }
            });

            this.classList.add('active');
            const activeIcon = this.querySelector('i');
            if (routes[targetRoute] && activeIcon) {
                activeIcon.className = `bi ${routes[targetRoute].iconActive}`;
            }

            navigateTo(targetRoute);
        });
    });

    const activeLink = document.querySelector('.link-nav.active');
    const initialRoute = activeLink ? activeLink.getAttribute('data-route') : 'inicio';
    navigateTo(initialRoute);
});
