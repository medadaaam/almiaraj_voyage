import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Loader, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthApi from "@/services/Api/AuthApi";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Email invalide").min(2, "Email requis").max(30),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").max(30),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, setAuthenticated, getClient  } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "adam@gmail.com",
      password: "123456789",
    },
  });

  const onSubmit = async (values) => {
    try {
      await AuthApi.getCsrfToken();
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await login(values.email, values.password);

      if (response.status === 200 || response.status === 204) {
        setAuthenticated(true);
        await getClient();
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 419) {
        form.setError("root", { message: "Session expirée. Veuillez réessayer." });
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors.email) form.setError("email", { message: errors.email.join(", ") });
        if (errors.password) form.setError("password", { message: errors.password.join(", ") });
        if (!errors.email && !errors.password) {
          form.setError("root", { message: error.response.data.message || "Données incorrectes" });
        }
      } else {
        form.setError("root", { message: error.response?.data?.message || "Une erreur inattendue s'est produite." });
      }
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <h1 className="auth-card-title">Connexion</h1>
        <p className="auth-card-subtitle">Bienvenue sur Al Miaraj Voyages</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          {form.formState.errors.root && (
            <div className="auth-submit-message error">
              <span>{form.formState.errors.root.message}</span>
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="auth-form-group">
                <FormLabel className="auth-label">
                  Email <span className="required">*</span>
                </FormLabel>
                <FormControl>
                  <div className="auth-input-wrapper">
                    <Mail size={18} className="auth-input-icon" />
                    <Input type="email" placeholder="exemple@email.com" {...field} className="auth-input" />
                  </div>
                </FormControl>
                <FormMessage className="auth-error-text" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="auth-form-group">
                <div className="flex justify-between items-center">
                  <FormLabel className="auth-label">
                    Mot de passe <span className="required">*</span>
                  </FormLabel>
                  <Link to="/forgot-password" className="auth-link text-sm">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <FormControl>
                  <div className="auth-input-wrapper">
                    <Lock size={18} className="auth-input-icon" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      className="auth-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth-password-toggle"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="auth-error-text" />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting} className="auth-btn">
            {form.formState.isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Se connecter
          </Button>
        </form>
      </Form>

      <div className="auth-links">
        <p className="auth-footer-text">
          Pas encore de compte ?{" "}
          <Link to="/register" className="auth-link">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
