import "dotenv/config";
import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// =========================================
// CONFIGURACIÓN DE RESEND
// =========================================

const resend = new Resend(process.env.RESEND_API_KEY);

// =========================================
// PRUEBA DE API
// =========================================

app.get("/api", (req, res) => {

    res.json({
        ok: true,
        mensaje: "API de Servicios Electromecánicos funcionando correctamente"
    });

});


// =========================================
// FORMULARIO DE CONTACTO
// =========================================
app.post("/api/contacto", async (req, res) => {

    const {
        nombre,
        email,
        telefono,
        servicio,
        mensaje
    } = req.body;


    console.log("\n=================================");
    console.log("📩 NUEVA SOLICITUD DE CONTACTO");
    console.log("=================================");

    console.log("👤 Nombre:", nombre);
    console.log("📧 Correo:", email);
    console.log("📞 Teléfono:", telefono);
    console.log("🔧 Servicio:", servicio);
    console.log("📝 Mensaje:", mensaje);

    console.log("=================================");


    try {

        console.log("📤 Intentando enviar correo...");


        const { data, error } = await resend.emails.send({

            from:
                "Servicios Electromecánicos <onboarding@resend.dev>",

            to:
                [process.env.EMAIL_DESTINO],

            replyTo:
                email || undefined,

            subject:
                `Nueva solicitud de contacto - ${servicio || "Sin servicio especificado"}`,

            text: `
NUEVA SOLICITUD DE CONTACTO

Nombre:
${nombre}

Correo:
${email || "No proporcionado"}

Teléfono:
${telefono}

Servicio:
${servicio || "No especificado"}

Mensaje:
${mensaje || "Sin mensaje"}

============================

Solicitud recibida desde el sitio web.
`
        });


        if (error) {

            console.error("❌ Error de Resend:");
            console.error(error);

            throw new Error(
                "No fue posible enviar el correo"
            );
        }


        console.log("✅ Correo enviado correctamente");

        console.log(
            "📨 ID del correo:",
            data?.id
        );


        res.json({

            ok: true,

            mensaje:
                "Solicitud enviada correctamente"

        });


    } catch (error) {

        console.error(
            "❌ Error al enviar el correo:"
        );

        console.error(error);


        res.status(500).json({

            ok: false,

            mensaje:
                "No fue posible enviar la solicitud"

        });

    }

});
// =========================================
// INICIAR SERVIDOR
// =========================================

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `🚀 API ejecutándose en el puerto ${PORT}`
    );

});