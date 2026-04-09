import { useState } from "react";
import "./contact.css";

export default function Contact() {

    const [form, setForm] = useState({
        nom: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        alert("Message envoyé !");
    };

    return (
        <div className="contact-container">
            <h2>Contactez-nous</h2>

            <form onSubmit={handleSubmit} className="contact-form">

                <input
                    type="text"
                    name="nom"
                    placeholder="Votre nom"
                    value={form.nom}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Votre email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="message"
                    placeholder="Votre message"
                    value={form.message}
                    onChange={handleChange}
                    required
                ></textarea>

                <button type="submit">Envoyer</button>

            </form>
        </div>
    );
}