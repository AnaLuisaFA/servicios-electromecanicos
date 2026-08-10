
import './style.css';
import { services } from './data/services.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const path = window.location.pathname;

if (path.startsWith('/servicios/')) {
  renderServicePage();
}


function renderServicePage() {

  const slug = path
    .replace('/servicios/', '')
    .replace('/', '');

  const service = services[slug];

  if (!service) {
    return;
  }

  const main = document.querySelector('main');

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
            service.images.length > 0
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

initWorkshopMap();

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

        const response =
          await fetch(
            "http://localhost:3000/api/contacto",
            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json"

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