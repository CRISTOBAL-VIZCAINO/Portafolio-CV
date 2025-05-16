const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// Configuración de CORS
app.use(cors());
app.use(express.json());

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'cristobaljulian123456@gmail.com', // Reemplaza con tu correo
        pass: 'pvoh fbro tfna nlyy' // Reemplaza con tu contraseña
    }
});

// Ruta para enviar el correo
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Configuración del correo
        const mailOptions = {
            from: email,
            to: 'cristobaljulian123456@gmail.com', // Reemplaza con tu correo
            subject: `Nuevo mensaje de ${name}`,
            text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Mensaje enviado exitosamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ error: 'Error al enviar el mensaje' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
