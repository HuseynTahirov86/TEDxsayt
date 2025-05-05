import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function useContact() {
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/contact", contactForm);
      setIsSuccess(true);
      toast({
        title: "Mesaj göndərildi!",
        description: "Mesajınız uğurla göndərildi. Tezliklə sizinlə əlaqə saxlanılacaq.",
      });
      
      // Reset form after successful submission
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      
      // Reset success status after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "Xəta!",
        description: "Mesajınız göndərilə bilmədi. Zəhmət olmasa yenidən cəhd edin.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = (form: ContactFormData) => {
    setContactForm(form);
  };

  return {
    contactForm,
    isSubmitting,
    isSuccess,
    handleContact,
    resetForm,
  };
}
