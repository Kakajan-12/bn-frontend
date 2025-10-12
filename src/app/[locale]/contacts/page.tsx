import ContactForm from "@/components/Contacts/ContactForm";
import ContactDetails from "@/components/Contacts/ContactDetails";


const Contact = () => {
    return (
        <div className="pt-24">
            <div className="container mx-auto px-4">
                <ContactForm/>
                <ContactDetails/>
            </div>
        </div>

    )
}
export default Contact