
import './style.css';
//import './style_azul_industrial.css';
//import './style_industrial_premium.css';
//import './style_amarillo_industrial_claro.css';
//import './style_claro_industrial.css';
//import './style_amarillo_grafito_combinado.css';
//import './style_amarillo_fondo_claro_tarjetas_sutiles.css';

import { services } from './data/services.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const path = window.location.pathname;

if (path.startsWith('/servicios/')) {
  renderServicePage();
}


function renderServicePage() {

  const path = window.location.pathname;

  const logoLink = document.querySelector('.navbar .logo');
  if (logoLink) {
    logoLink.href = '/#inicio';
  }

  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  navLinks.forEach(link => {
    link.href = `/${link.getAttribute('href')}`;
    link.removeAttribute('aria-current');
  });

  document
    .querySelector('.nav-menu a[href="/#servicios"]')
    ?.setAttribute('aria-current', 'location');

  const slug = path
    .split('/servicios/')[1]
    ?.split('/')[0];

  const service = services[slug];

  if (!service) {
    console.error('Servicio no encontrado:', slug);
    return;
  }

  const main = document.querySelector('main');

  if (!main) {
    console.error('No se encontró el elemento <main>');
    return;
  }

  main.innerHTML = `

    <section class="service-detail">

      <div class="section-container">

        <a href="/#servicios" class="back-link">
          ← Volver a servicios
        </a>

        <div class="service-detail-header">

          <span class="section-tag">
            SERVICIO ESPECIALIZADO
          </span>

          <h1>
            ${service.title}
          </h1>

          <p>
            ${service.shortDescription}
          </p>

        </div>

        <div class="service-detail-content">

          <div class="service-detail-description">

            <h2>
              Sobre este servicio
            </h2>

            <p>
              ${service.description}
            </p>

            ${
              service.descriptionItems?.length
                ? `
                  ${service.descriptionItemsTitle
                    ? `<h3 class="service-detail-description-list-title">${service.descriptionItemsTitle}</h3>`
                    : ''}
                  <ul class="service-detail-description-list">
                    ${service.descriptionItems
                      .map(item => `<li>${item}</li>`)
                      .join('')}
                  </ul>
                `
                : ''
            }

          </div>

          <div class="service-detail-activities">

            <h2>
              Trabajos que realizamos
            </h2>

            <ul>

              ${service.activities
                .map(activity => `<li>${activity}</li>`)
                .join('')}

            </ul>

          </div>

        </div>

        <div class="service-gallery">

          <h2>
            Trabajos realizados
          </h2>

          ${
            service.images && service.images.length > 0
              ? `
                <div class="service-gallery-grid">

                  ${service.images
                    .map(image => `
                      <img
                        src="${image}"
                        alt="${service.title}"
                        class="service-gallery-image"
                      />
                    `)
                    .join('')}

                </div>
              `
              : `
                <p class="gallery-placeholder">
                  Próximamente agregaremos fotografías reales
                  de los trabajos realizados.
                </p>
              `
          }

        </div>

        <div class="service-detail-action">

          <a
            href="/#contacto"
            class="button button-primary"
          >
            Solicitar servicio →
          </a>

        </div>

      </div>

    </section>

  `;
}

function initSectionNavigation() {
  const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  const sections = navLinks
    .map(link => document.getElementById(link.hash.slice(1)))
    .filter(section => section instanceof HTMLElement);

  if (!navLinks.length || !sections.length) {
    return;
  }

  let updateScheduled = false;

  const updateActiveSection = () => {
    updateScheduled = false;

    const navbar = document.querySelector('.navbar');
    const readingPosition = window.scrollY + (navbar?.offsetHeight ?? 0) + 1;
    let activeSection = sections[0];

    sections.forEach(section => {
      if (section.getBoundingClientRect().top + window.scrollY <= readingPosition) {
        activeSection = section;
      }
    });

    const lastSection = sections[sections.length - 1];
    const lastSectionBounds = lastSection.getBoundingClientRect();
    const isAtPageBottom =
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;

    if (
      isAtPageBottom &&
      lastSectionBounds.top < window.innerHeight &&
      lastSectionBounds.bottom > (navbar?.offsetHeight ?? 0)
    ) {
      activeSection = lastSection;
    }

    navLinks.forEach(link => {
      if (link.hash === `#${activeSection.id}`) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const scheduleUpdate = () => {
    if (!updateScheduled) {
      updateScheduled = true;
      window.requestAnimationFrame(updateActiveSection);
    }
  };

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  updateActiveSection();
}

function initSectionReveal() {
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !('IntersectionObserver' in window)
  ) {
    return;
  }

  const revealTargets = document.querySelectorAll([
    'main > section:not(.hero) .section-header',
    'main > section:not(.hero) .services-engineering',
    'main > section:not(.hero) .service-card',
    'main > section:not(.hero) .learn-card',
    'main > section:not(.hero) .client-sector',
    'main > #instalaciones .workshop-content > *',
    'main > #contacto .contact-intro > .button'
  ].join(', '));

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -32px 0px'
  });

  revealTargets.forEach(target => {
    const cardSiblings = [...target.parentElement.children]
      .filter(sibling => sibling.matches('.service-card, .learn-card, .client-sector'));
    const cardIndex = cardSiblings.indexOf(target);

    if (cardIndex >= 0) {
      target.style.setProperty(
        '--reveal-delay',
        `${Math.min(cardIndex, 4) * 160}ms`
      );
    }

    target.classList.add('scroll-reveal');
    observer.observe(target);
  });
}

function initWorkshopMap() {

  const mapElement = document.getElementById('workshop-map');

  if (!mapElement) {
    return;
  }

  const latitude = 19.2472043;
  const longitude = -98.1808268;

  const map = L.map('workshop-map').setView(
    [latitude, longitude],
    17
  );

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors'
    }
  ).addTo(map);

  const marker = L.marker([
    latitude,
    longitude
  ]).addTo(map);

  marker.bindPopup(`
    <strong>
      Reparación de Motores Eléctricos
    </strong>
    <br>
    Taller electromecánico
  `);

  marker.openPopup();
}

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow
});
initWorkshopMap();
initSectionNavigation();
initSectionReveal();

// =========================================
// FORMULARIO DE CONTACTO
// =========================================
// =========================================
// FORMULARIO DE CONTACTO
// =========================================

const contactForm =
  document.getElementById("contact-form");

if (contactForm) {

  // =========================================
  // MOSTRAR / OCULTAR FORMULARIO
  // =========================================

  const contactIntro =
    document.getElementById("contact-intro");

  const contactFormWrapper =
    document.getElementById("contact-form-wrapper");

  const showContactForm =
    document.getElementById("show-contact-form");

  const hideContactForm =
    document.getElementById("hide-contact-form");


  if (
    contactIntro &&
    contactFormWrapper &&
    showContactForm &&
    hideContactForm
  ) {

    // Mostrar formulario

    showContactForm.addEventListener(
      "click",
      () => {

        contactIntro.classList.add("hide");

        contactFormWrapper.classList.add("show");

      }
    );


    // Ocultar formulario

    hideContactForm.addEventListener(
      "click",
      () => {

        contactFormWrapper.classList.remove("show");

        contactIntro.classList.remove("hide");

      }
    );

  }


  // =========================================
  // ELEMENTOS DEL FORMULARIO
  // =========================================

  const submitButton =
    document.getElementById("submit-button");

  const alertBox =
    document.getElementById("form-alert");

  const alertIcon =
    document.getElementById("form-alert-icon");

  const alertTitle =
    document.getElementById("form-alert-title");

  const alertMessage =
    document.getElementById("form-alert-message");

  const alertClose =
    document.getElementById("form-alert-close");


  // =========================================
  // MOSTRAR ALERTA
  // =========================================

  function mostrarAlerta(
    tipo,
    titulo,
    mensaje,
    icono
  ) {

    alertBox.className =
      `form-alert ${tipo}`;

    alertIcon.textContent =
      icono;

    alertTitle.textContent =
      titulo;

    alertMessage.textContent =
      mensaje;

    alertBox.classList.add("show");

  }


  // =========================================
  // OCULTAR ALERTA
  // =========================================

  function ocultarAlerta() {

    alertBox.classList.remove("show");

  }


  // =========================================
  // BOTÓN CERRAR ALERTA
  // =========================================

  alertClose.addEventListener(
    "click",
    ocultarAlerta
  );


  // =========================================
  // ENVÍO DEL FORMULARIO
  // =========================================

  contactForm.addEventListener(
    "submit",
    async (event) => {

      // Evitar recarga de página
      event.preventDefault();


      // =====================================
      // MOSTRAR ESTADO "ENVIANDO"
      // =====================================

      submitButton.disabled =
        true;

      submitButton.textContent =
        "Enviando...";


      mostrarAlerta(

        "success",

        "Estamos enviando tu solicitud",

        "Esto puede tomar hasta un minuto. Por favor, no cierres esta ventana. Después de ser enviada, te contactaremos.",

        "📩"

      );


      // =====================================
      // OBTENER DATOS DEL FORMULARIO
      // =====================================

      const formData =
        new FormData(contactForm);


      const datos = {

        nombre:
          formData.get("nombre"),

        email:
          formData.get("email"),

        telefono:
          formData.get("telefono"),

        servicio:
          formData.get("servicio"),

        mensaje:
          formData.get("mensaje")

      };


      // =====================================
      // ENVIAR DATOS A LA API
      // =====================================

      try {

        // ===================================
        // URL DE LA API
        // ===================================
        const API_URL = "https://servicios-electromecanicos-kdxk.onrender.com";


        // ===================================
        // ENVIAR DATOS A LA API
        // ===================================

        const response =
          await fetch(
            `${API_URL}/api/contacto`,
            {

              method: "POST",

              headers: {
                "Content-Type": "application/json"
              },

              body:
                JSON.stringify(datos)

            }
          );


        // ===================================
        // LEER RESPUESTA DEL SERVIDOR
        // ===================================

        const resultado =
          await response.json();


        // ===================================
        // VALIDAR RESPUESTA
        // ===================================

        if (
          !response.ok ||
          !resultado.ok
        ) {

          throw new Error(

            resultado.mensaje ||

            "No fue posible enviar la solicitud."

          );

        }


        // ===================================
        // ENVÍO CORRECTO
        // ===================================

        mostrarAlerta(

          "success",

          "¡Solicitud enviada correctamente!",

          "Hemos recibido tu información. Nos pondremos en contacto contigo próximamente.",

          "✓"

        );


        // ===================================
        // LIMPIAR FORMULARIO
        // ===================================

        contactForm.reset();


        // ===================================
        // RESTAURAR BOTÓN
        // ===================================

        submitButton.disabled =
          false;

        submitButton.textContent =
          "Enviar Solicitud";


        // ===================================
        // CERRAR FORMULARIO
        // =====================================

        setTimeout(() => {

          contactFormWrapper.classList.remove(
            "show"
          );

          contactIntro.classList.remove(
            "hide"
          );

        }, 2500);


      } catch (error) {

        // ===================================
        // ERROR
        // ===================================

        console.error(
          "Error al enviar formulario:",
          error
        );


        mostrarAlerta(

          "error",

          "No pudimos enviar tu solicitud",

          "Ocurrió un problema al enviar la información. Por favor, inténtalo nuevamente.",

          "!"

        );


        // ===================================
        // RESTAURAR BOTÓN
        // ===================================

        submitButton.disabled =
          false;

        submitButton.textContent =
          "Intentar nuevamente";

      }

    }
  );

}

// =========================================
// APRENDE CON NOSOTROS
// =========================================

const learnCards =
  document.querySelectorAll(".learn-card");


learnCards.forEach(card => {

  card.addEventListener("click", () => {

    const isAlreadyFlipped =
      card.classList.contains("flipped");


    // Cerrar todas las tarjetas
    learnCards.forEach(otherCard => {

      otherCard.classList.remove("flipped");

    });


    // Si la tarjeta no estaba abierta,
    // abrirla
    if (!isAlreadyFlipped) {

      card.classList.add("flipped");

    }

  });

});