document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.link-nav');

    // 1. Mapa centralizado de rutas
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
            html: 'pages/contactos/contactos.html',
            css: 'pages/contactos/contactos.css',
            js: 'pages/contactos/contactos.js',
            iconInactive: 'bi-envelope',
            iconActive: 'bi-envelope-fill'
        }
    };

    // 2. Función principal de navegación y renderizado
    async function navigateTo(routeName) {
        const route = routes[routeName];

        if (!route) {
            console.error(`La ruta "${routeName}" no existe en el objeto routes.`);
            return;
        }

        try {
            const response = await fetch(route.html);

            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
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

            // Inyectar HTML en el elemento main
            mainContent.innerHTML = html;

            // Inyectar o actualizar el CSS dinámico
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

            // Inyectar o reemplazar el JS dinámico
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
                        <p>Verifica que el archivo <code>${route.html}</code> exista en tu proyecto.</p>
                    </div>
                </div>
            `;
        }
    }

    // 3. Registrar eventos de clic y actualización de iconos
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetRoute = this.getAttribute('data-route');

            // Resetear clases e iconos en todas las pestañas
            navLinks.forEach(item => {
                item.classList.remove('active');
                const routeKey = item.getAttribute('data-route');
                const icon = item.querySelector('i');

                if (routes[routeKey] && icon) {
                    icon.className = `bi ${routes[routeKey].iconInactive}`;
                }
            });

            // Activar la pestaña seleccionada
            this.classList.add('active');
            const activeIcon = this.querySelector('i');
            if (routes[targetRoute] && activeIcon) {
                activeIcon.className = `bi ${routes[targetRoute].iconActive}`;
            }

            // Cargar la vista elegida
            navigateTo(targetRoute);
        });
    });

    // 4. Cargar la vista inicial automáticamente
    const activeLink = document.querySelector('.link-nav.active');
    const initialRoute = activeLink ? activeLink.getAttribute('data-route') : 'inicio';
    navigateTo(initialRoute);
});
