import React from 'react';
import './Contact.css';
import CtaButton from "../components/Button.jsx";

function Contact() {
    return (
        <div className="contact-page fade-in">
            <div className="contact-container">
                {/* Informazioni di Contatto */}
                <div className="contact__info">
                    <span className="contact__label">Get in touch</span>
                    <h1 className="contact__title">Contact</h1>
                    <p className="contact__subtitle">
                        For bookings, editorial inquiries, or just to say hello.
                    </p>

                    <div className="contact__details">
                        <div className="detail-group">
                            <span className="detail-title">Email</span>
                            <a href="mailto:celia.griffa@gmail.com">celia.griffa@gmail.com</a>
                        </div>
                        <div className="detail-group">
                            <span className="detail-title">Instagram</span>
                            <a href="https://www.instagram.com/cmgriffaph/" target="_blank" rel="noreferrer">
                                @cmgriffaph
                            </a>
                        </div>
                    </div>
                </div>

                {/* Form Collegato a Formspree */}
                <form
                    className="contact__form"
                    action="https://formspree.io/f/xdaybkdk"
                    method="POST"
                >
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        {/* L'attributo 'name' è FONDAMENTALE per Formspree */}
                        <input type="text" id="name" name="name" required placeholder="Jane Doe" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required placeholder="jane@example.com" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" rows="5" required placeholder="Tell me about your project..."></textarea>
                    </div>

                    <CtaButton type="submit">Send Message</CtaButton>
                </form>
            </div>
        </div>
    );
}

export default Contact;