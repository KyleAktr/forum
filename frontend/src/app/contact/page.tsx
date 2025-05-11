"use client";
import { useState } from "react";
import { toast } from "react-toastify"; // For notifications
import emailjs from "@emailjs/browser";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function ContactForm() {
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
    const userID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

    if (!serviceID || !templateID || !userID) {
      throw new Error("Missing required environment variables for EmailJS.");
    }

    try {
      const emailParams = {
        name: userInput.name,
        email: userInput.email,
        message: userInput.message,
      };

      const res = await emailjs.send(
        serviceID,
        templateID,
        emailParams,
        userID
      );

      if (res.status === 200) {
        toast.success("Message sent successfully!");
        setUserInput({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="contact">
        <h1>CONTACT</h1>
        <p>
          Une question, une suggestion, une remarque ? <br />
          N’hésite pas à nous écrire via ce formulaire. On te répondra au plus
          vite. <br />
          Cet espace est ouvert à toutes les idées, retours ou envies de
          collaboration.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="name">
            <label>Nom et prénom</label>
            <input
              type="text"
              name="name"
              value={userInput.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="email">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={userInput.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="message">
            <label>Message</label>
            <textarea
              name="message"
              value={userInput.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Send Message</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ContactForm;
