import SplitCard from "./SplitCard";
import ContactForm from "../contact/ContactForm";
import ContactIllustration from "../contact/ContactIllustration";
import "./ContactPage.css";

const ContactPage = () => {
  return (
    <div className="contact-page">
      <SplitCard
        leftContent={<ContactForm />}
        rightContent={<ContactIllustration />}
      />
    </div>
  );
};

export default ContactPage;

