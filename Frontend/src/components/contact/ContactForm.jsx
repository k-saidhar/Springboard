import "./ContactForm.css";

const ContactForm = () => {
  return (
    <form className="contact-form">
      <h2>Contact Us</h2>

      <input type="text" placeholder="Username" />
      <input type="email" placeholder="Email" />
      <textarea placeholder="Message"></textarea>

      <button type="submit">Send Message</button>
    </form>
  );
};

export default ContactForm;
