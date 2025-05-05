import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useRegistration } from "@/hooks/use-registration";
import { useTranslation } from "react-i18next";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const registrationSchema = z.object({
  firstName: z.string().min(2, "Ad ən azı 2 simvol olmalıdır"),
  lastName: z.string().min(2, "Soyad ən azı 2 simvol olmalıdır"),
  email: z.string().email("Düzgün e-poçt ünvanı daxil edin"),
  phone: z
    .string()
    .min(10, "Telefon nömrəsi ən azı 10 simvol olmalıdır")
    .regex(
      /^\+?[0-9\s-]{10,15}$/,
      "Telefon nömrəsi düzgün formatda olmalıdır"
    ),
  occupation: z.string().optional(),
  topics: z.array(z.string()).optional(),
  terms: z.literal(true, {
    errorMap: () => ({
      message: "Məlumatların işlənməsi üçün razılıq verilməlidir",
    }),
  }),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function Register() {
  const { t } = useTranslation();
  const { isSubmitting, isSuccess, submitRegistration, resetForm } =
    useRegistration();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      occupation: "",
      topics: [],
      terms: false,
    },
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    await submitRegistration(data);
  };

  return (
    <section id="register" className="py-20 bg-tedblack text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-poppins font-bold text-center mb-4">
            {t('register_title')}
          </h2>
          <p className="text-gray-300 text-center mb-10">
            {t('register_subtitle')}
          </p>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-tedred/20 border border-tedred rounded-xl p-8 text-center mt-6"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-tedred mb-4">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-2">
                    {t('registration_success')}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {t('registration_success_message')}
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm text-white hover:text-tedred transition-colors"
                  >
                    {t('back')}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-8 space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="block text-sm font-medium">
                              {t('form_first_name')}
                            </FormLabel>
                            <FormControl>
                              <input
                                {...field}
                                className="w-full px-4 py-2 bg-white/10 border border-gray-500 rounded-md focus:ring-2 focus:ring-tedred focus:border-transparent transition-colors"
                                placeholder={t('form_first_name_placeholder')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="block text-sm font-medium">
                              {t('form_last_name')}
                            </FormLabel>
                            <FormControl>
                              <input
                                {...field}
                                className="w-full px-4 py-2 bg-white/10 border border-gray-500 rounded-md focus:ring-2 focus:ring-tedred focus:border-transparent transition-colors"
                                placeholder={t('form_last_name_placeholder')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="block text-sm font-medium">
                            {t('form_email')}
                          </FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              type="email"
                              className="w-full px-4 py-2 bg-white/10 border border-gray-500 rounded-md focus:ring-2 focus:ring-tedred focus:border-transparent transition-colors"
                              placeholder={t('form_email_placeholder')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="block text-sm font-medium">
                            {t('form_phone')}
                          </FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              className="w-full px-4 py-2 bg-white/10 border border-gray-500 rounded-md focus:ring-2 focus:ring-tedred focus:border-transparent transition-colors"
                              placeholder={t('form_phone_placeholder')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="block text-sm font-medium">
                            {t('form_occupation')}
                          </FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              className="w-full px-4 py-2 bg-white/10 border border-gray-500 rounded-md focus:ring-2 focus:ring-tedred focus:border-transparent transition-colors"
                              placeholder={t('form_occupation_placeholder')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="topics"
                      render={() => (
                        <FormItem className="space-y-2">
                          <FormLabel className="block text-sm font-medium">
                            {t('form_topics')}
                          </FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {[
                              {
                                id: "technology",
                                label: t('topic_technology'),
                              },
                              { id: "education", label: t('topic_education') },
                              {
                                id: "sustainability",
                                label: t('topic_sustainability'),
                              },
                              { id: "culture", label: t('topic_culture') },
                            ].map((topic) => (
                              <label
                                key={topic.id}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  value={topic.id}
                                  {...form.register("topics")}
                                  className="rounded text-tedred focus:ring-tedred"
                                />
                                <span>{topic.label}</span>
                              </label>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="rounded text-tedred focus:ring-tedred"
                            />
                          </FormControl>
                          <FormLabel className="text-sm">
                            {t('form_terms')}
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-tedred hover:bg-red-700 text-white font-medium py-3 rounded-md transition-colors flex justify-center items-center"
                      >
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          t('form_submit')
                        )}
                      </button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
