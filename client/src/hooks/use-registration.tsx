import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  occupation?: string;
  topics?: string[];
  terms: boolean;
}

export function useRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const submitRegistration = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/registration", data);
      setIsSuccess(true);
      toast({
        title: "Qeydiyyat tamamlandı",
        description: "Qeydiyyatınız uğurla tamamlandı!",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Xəta!",
        description: "Qeydiyyat zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
  };

  return {
    isSubmitting,
    isSuccess,
    submitRegistration,
    resetForm,
  };
}
