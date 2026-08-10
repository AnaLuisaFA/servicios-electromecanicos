import "dotenv/config";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// =========================================
// CONFIGURACIÓN DEL CORREO
// =========================================

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },

    tls: {
        rejectUnauthorized: true
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Error de conexión con Gmail:");
        console.error(error);
    } else {
        console.log("✅ Conexión con Gmail establecida correctamente");
    }
});

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

    console.log("=================================\n");


    try {
        console.log("📤 Intentando enviar correo...");
        const info = await transporter.sendMail({

            from: `"Servicios Electromecánicos" <${process.env.EMAIL_USER}>`,

            to: process.env.EMAIL_DESTINO,

            replyTo: email,

            subject: `Nueva solicitud de contacto - ${servicio}`,

            text: `
        NUEVA SOLICITUD DE CONTACTO
        ============================

        Nombre:
        ${nombre}

        Correo:
        ${email}

        Teléfono:
        ${telefono}

        Servicio:
        ${servicio}

        Mensaje:
        ${mensaje}

        ============================
        Solicitud recibida desde el sitio web.
                    `

                });


        console.log("✅ Correo enviado correctamente");
        console.log("📨 Message ID:", info.messageId);
        console.log("📬 Respuesta SMTP:", info.response);


        res.json({
            ok: true,
            mensaje: "Solicitud enviada correctamente"
        });


    } catch (error) {

        console.error("❌ Error al enviar el correo:");
        console.error(error);


        res.status(500).json({
            ok: false,
            mensaje: "No fue posible enviar la solicitud"
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