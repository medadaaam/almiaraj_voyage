import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader, User, Mail, Phone, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";

const formSchema = z
  .object({
    nom: z.string().min(2, "Nom doit contenir au moins 2 caractères").max(30),
    prenom: z.string().min(2, "Prénom doit contenir au moins 2 caractères").max(30),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Mot de passe doit contenir au moins 8 caractères"),
    password_confirmation: z.string(),
    numTel: z.string().min(10, "Téléphone invalide").max(15),
    nat: z.string().min(1, "Veuillez sélectionner une nationalité"),
    terms: z.literal(true, {
      errorMap: () => ({ message: "Vous devez accepter les conditions" }),
    }),
  })
  .refine((data) => !data.password_confirmation || data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password_confirmation"],
  });

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, setAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
      nom: "",
      prenom: "",
      numTel: "",
      nat: "",
      terms: false,
    },
  });

  const countries = [
    { value: "Maroc", label: "Maroc 🇲🇦" },
    { value: "France", label: "France 🇫🇷" },
    { value: "Espagne", label: "Espagne 🇪🇸" },
    { value: "Italie", label: "Italie 🇮🇹" },
    { value: "Allemagne", label: "Allemagne 🇩🇪" },
    { value: "États-Unis", label: "États-Unis 🇺🇸" },
    { value: "Canada", label: "Canada 🇨🇦" },
    { value: "Royaume-Uni", label: "Royaume-Uni 🇬🇧" },
    { value: "Belgique", label: "Belgique 🇧🇪" },
    { value: "Suisse", label: "Suisse 🇨🇭" },
  ];

  useEffect(() => {
    if (error && formRef.current) {
      formRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [error]);

  const onSubmit = async (values) => {
    setLoading(true);
    setError("");

    try {
      const response = await registerUser(values);
      if (response?.status === 200 || response?.status === 201) {
        setAuthenticated(true);
        navigate("/");
      }
    } catch (err) {
      console.error("Erreur:", err);
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        if (errors.email) setError(errors.email[0]);
        else if (errors.password) setError(errors.password[0]);
        else setError(err.response.data.message || "Données incorrectes");
      } else {
        setError(err.response?.data?.message || "Une erreur s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card-scrollable aa" ref={formRef}>
      <div className="auth-card-header">
        <h1 className="auth-card-title">Inscription</h1>
        <p className="auth-card-subtitle">Créez votre compte et partez à l'aventure</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          {error && (
            <div className="auth-submit-message error">
              <span>{error}</span>
            </div>
          )}

          {/* Prénom et Nom */}
          <div className="form-row-2">
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem className="auth-form-group">
                  <FormLabel className="auth-label">
                    Prénom <span className="required">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="auth-input-wrapper">
                      <User size={18} className="auth-input-icon" />
                      <Input placeholder="Votre prénom" {...field} className="auth-input" />
                    </div>
                  </FormControl>
                  <FormMessage className="auth-error-text" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem className="auth-form-group">
                  <FormLabel className="auth-label">
                    Nom <span className="required">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="auth-input-wrapper">
                      <User size={18} className="auth-input-icon" />
                      <Input placeholder="Votre nom" {...field} className="auth-input" />
                    </div>
                  </FormControl>
                  <FormMessage className="auth-error-text" />
                </FormItem>
              )}
            />
          </div>

          {/* Email */}
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

          {/* Téléphone et Nationalité */}
          <div className="form-row-2">
            <FormField
              control={form.control}
              name="numTel"
              render={({ field }) => (
                <FormItem className="auth-form-group">
                  <FormLabel className="auth-label">
                    Téléphone <span className="required">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="auth-input-wrapper">
                      <Phone size={18} className="auth-input-icon" />
                      <Input type="tel" placeholder="0612345678" {...field} className="auth-input" />
                    </div>
                  </FormControl>
                  <FormMessage className="auth-error-text" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nat"
              render={({ field }) => (
                <FormItem className="auth-form-group">
                  <FormLabel className="auth-label">
                    Nationalité <span className="required">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="auth-input">
                        <SelectValue placeholder="Choisir nationalité" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="auth-error-text" />
                </FormItem>
              )}
            />
          </div>

          {/* Mot de passe */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="auth-form-group">
                <FormLabel className="auth-label">
                  Mot de passe <span className="required">*</span>
                </FormLabel>
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

          {/* Confirmer mot de passe */}
          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem className="auth-form-group">
                <FormLabel className="auth-label">
                  Confirmer mot de passe <span className="required">*</span>
                </FormLabel>
                <FormControl>
                  <div className="auth-input-wrapper">
                    <Lock size={18} className="auth-input-icon" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      className="auth-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="auth-password-toggle"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="auth-error-text" />
              </FormItem>
            )}
          />

          {/* Terms */}
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="auth-form-group">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#fb923c] focus:ring-[#fb923c]"
                  />
                  <FormLabel className="auth-label text-sm font-normal">
                    J'accepte les{" "}
                    <a href="/terms" className="text-[#fb923c]">
                      conditions générales
                    </a>
                  </FormLabel>
                </div>
                <FormMessage className="auth-error-text" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="auth-btn">
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Inscription en cours...
              </>
            ) : (
              "Créer mon compte"
            )}
          </Button>
        </form>
      </Form>

      {/* Login Link */}
      <div className="auth-links">
        <p className="auth-footer-text">
          Déjà un compte ?{" "}
          <Link to="/login" className="auth-link">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
