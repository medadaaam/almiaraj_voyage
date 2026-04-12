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
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const formSchema = z.object({
  nom: z.string().min(2, "Nom doit contenir au moins 2 caractères").max(30),
  prenom: z.string().min(2, "Prénom doit contenir au moins 2 caractères").max(30),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Mot de passe doit contenir au moins 8 caractères"),
  ConfirmePassword: z.string(),
  telephone: z.string().min(10, "Téléphone invalide").max(15),
  nationalite: z.string().min(1, "Veuillez sélectionner une nationalité"),
}).refine((data) => data.password === data.ConfirmePassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["ConfirmePassword"],
});

export default function Register() {
  const { register: registerUser, setAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      ConfirmePassword: "",
      nom: "",
      prenom: "",
      telephone: "",
      nationalite: "",
    },
  });

  const countries = [
    { value: "ma", label: "Maroc 🇲🇦" },
    { value: "fr", label: "France 🇫🇷" },
    { value: "es", label: "Espagne 🇪🇸" },
    { value: "it", label: "Italie 🇮🇹" },
    { value: "de", label: "Allemagne 🇩🇪" },
    { value: "us", label: "États-Unis 🇺🇸" },
  ];

  const onSubmit = async (values) => {
    setLoading(true);
    setError("");

    try {
      const data = {
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        password: values.password,
        password_confirmation: values.ConfirmePassword,
        nat: values.nationalite,
        numTel: values.telephone,
      };



      const response = await registerUser(data);


      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setAuthenticated(true);
        navigate("/");
      }
    } catch (err) {
      console.error("Error:", err.response?.data);

      if (err.response?.status === 422) {
        const errors = err.response.data.errors;

        if (errors.email) {
          form.setError("email", { message: errors.email[0] });
        }
        if (errors.password) {
          form.setError("password", { message: errors.password[0] });
        }
        if (errors.nom) {
          form.setError("nom", { message: errors.nom[0] });
        }
        if (errors.prenom) {
          form.setError("prenom", { message: errors.prenom[0] });
        }
        if (errors.numTel) {
          form.setError("telephone", { message: errors.numTel[0] });
        }
        if (errors.nat) {
          form.setError("nationalite", { message: errors.nat[0] });
        }
        if (Object.keys(errors).length === 0) {
          setError(err.response.data.message || "Données incorrectes");
        }
      } else if (err.response?.status === 419) {
        setError("Session expirée, veuillez actualiser la page");
      } else {
        setError(err.response?.data?.message || "Une erreur s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Créer un compte</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Votre prénom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Votre nom" {...field} />
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
              <FormItem>
                <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="email" placeholder="exemple@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="0612345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationalite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationalité <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ConfirmePassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer mot de passe <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2f6f85] hover:bg-[#25596b]"
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Inscription en cours...
              </>
            ) : (
              "S'inscrire"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
