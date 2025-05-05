import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

// Form validation schema for login
const loginSchema = z.object({
  username: z.string().min(3, "İstifadəçi adı ən azı 3 simvol olmalıdır"),
  password: z.string().min(6, "Şifrə ən azı 6 simvol olmalıdır"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Form validation schema for registration
const registerSchema = z.object({
  username: z.string().min(3, "İstifadəçi adı ən azı 3 simvol olmalıdır"),
  password: z.string().min(6, "Şifrə ən azı 6 simvol olmalıdır"),
  confirmPassword: z.string().min(6, "Şifrə ən azı 6 simvol olmalıdır"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifrələr uyğun gəlmir",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [, setLocation] = useLocation();
  const { user, isLoading, loginMutation, registerMutation } = useAuth();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  // Handle register form submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  // If user is already logged in, redirect to admin dashboard
  if (user) {
    setLocation("/adminndutedxozu");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left side: Auth forms */}
      <div className="lg:w-1/2 flex justify-center items-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">TEDx NDU Admin</h1>
            <p className="text-gray-600 mt-2">Naxçıvan Dövlət Universiteti</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Giriş</TabsTrigger>
              <TabsTrigger value="register">Qeydiyyat</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Giriş</CardTitle>
                  <CardDescription>TEDx NDU Admin panelinə daxil olun</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>İstifadəçi adı</FormLabel>
                            <FormControl>
                              <Input placeholder="istifadəçi adı" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Şifrə</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="şifrə" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {loginMutation.isError && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            {(loginMutation.error as Error)?.message || "Giriş zamanı xəta baş verdi"}
                          </AlertDescription>
                        </Alert>
                      )}
                      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Giriş...
                          </>
                        ) : (
                          "Daxil ol"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Qeydiyyat</CardTitle>
                  <CardDescription>Yeni admin hesabı yaradın</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>İstifadəçi adı</FormLabel>
                            <FormControl>
                              <Input placeholder="istifadəçi adı" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Şifrə</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="şifrə" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Şifrəni təsdiqləyin</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="şifrəni təkrar daxil edin" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {registerMutation.isError && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            {(registerMutation.error as Error)?.message || "Qeydiyyat zamanı xəta baş verdi"}
                          </AlertDescription>
                        </Alert>
                      )}
                      <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Qeydiyyat...
                          </>
                        ) : (
                          "Qeydiyyatdan keç"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side: Hero section */}
      <div className="lg:w-1/2 bg-primary hidden lg:flex flex-col justify-center items-center text-white p-8">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6">TEDx Naxçıvan Dövlət Universiteti</h1>
          <p className="text-xl mb-8">Admin Paneli</p>
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-medium">Qeydiyyatları idarə edin</h3>
              <p className="text-sm opacity-90">Bütün qeydiyyat tələblərini görün və idarə edin</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-medium">Əlaqə sorğularını idarə edin</h3>
              <p className="text-sm opacity-90">Ziyarətçilərdən gələn sorğuları və şərhləri oxuyun və cavab verin</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-medium">Statistikanı izləyin</h3>
              <p className="text-sm opacity-90">Qeydiyyat və ziyarət statistikasını izləyin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}