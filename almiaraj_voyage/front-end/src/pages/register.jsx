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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { useAuth } from "@/context/AuthContext";
import AuthApi from "@/services/Api/AuthApi";

const formSchema = z.object({
  nom: z.string().min(4).max(30),
  prenom: z.string().min(2).max(30),
  email: z.string().email().min(2).max(30),
  password: z.string().min(8).max(30),
  ConfirmePassword: z.string().min(8).max(30),
  telephone: z.string().min(10).max(15),
  nationalite: z.string().min(1),
});

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "elarchoui@gmail.com",
      password: "123456789",
      ConfirmePassword: "123456789",
      nom: "",
      prenom: "",
      telephone: "",
      nationalite: "",
      terms: z.literal(true, {
        errorMap: () => ({ message: "You must accept the terms" }),
      }),
    },
  });

  const countries = [
    { value: "ma", label: "Maroc 🇲🇦" },
    { value: "fr", label: "France 🇫🇷" },
    { value: "es", label: "Espagne 🇪🇸" },
  ];

  const onSubmit = async (values) => {
    if (values.password !== values.ConfirmePassword) {
      form.setError("root", {
        message: "Confirmation de mot de passe incorrect .",
      });
      return;
    }
    const data = {
      nom: values.nom,
      prenom: values.prenom,
      email: values.email,
      password: values.password,
      password_confirmation: values.ConfirmePassword,
      nat: values.nationalite,
      numTel: values.telephone,
    };

    console.log("Sending data:", data);
    await register(data);

    // try {
    //   await AuthApi.getCsrfToken();
    //   const response =
    //   if (response.status === 200 || response.status === 204) {
    //     setAuthenticated(true);
    //     navigate("/");
    //   }
    // } catch (error) {
    //   if (error.response?.status === 422) {
    //     const errors = error.response.data.errors;
    //     if (errors.email) {
    //       form.setError("email", {
    //         message: errors.email.join(", "),
    //       });
    //     }
    //     if (errors.password) {
    //       form.setError("password", {
    //         message: errors.password.join(", "),
    //       });
    //     }
    //     if (!errors.email && !errors.password) {
    //       form.setError("root", {
    //         message: error.response.data.message || "Données incorrectes",
    //       });
    //     }
    //   } else if (error.response?.status === 419) {
    //     form.setError("root", {
    //       message: "La session est terminée, veuillez actualiser la page.",
    //     });
    //   } else {
    //     form.setError("root", {
    //       message:
    //         error.response?.data?.message ||
    //         "Une erreur inattendue s'est produite.",
    //     });
    //   }
    // }
  };

  return (
    <div
      style={{ width: "700px" }}
      className=" mx-auto mt-10  p-6 border rounded-lg"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {form.formState.errors.root && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {form.formState.errors.root.message}
            </div>
          )}
          <FieldGroup className="grid  grid-cols-2">
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Prénom <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Entrez Le prénom .."
                      {...field}
                    />
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
                  <FormLabel>
                    Nom <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Entrez le Nom de famille ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldGroup>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FieldGroup className="grid  grid-cols-2">
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Numéro de téléphone
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="00 00 00 00 00"
                      {...field}
                    />
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
                  <FormLabel>Nationalité</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir nationalité" />
                      </SelectTrigger>

                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldGroup>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mot de Passe <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
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
                <FormLabel>
                  Confirmez le mot de passe
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-4 h-4 border border-gray-300 rounded"
                    />
                  </FormControl>

                  <FormLabel className="text-sm font-medium">
                    I agree with the{" "}
                    <a href="/terms" className="text-blue-600 hover:underline">
                      Terms and Conditions
                    </a>
                  </FormLabel>
                </div>
                <FieldDescription>
                  By clicking this checkbox, you agree to the terms and
                  conditions.
                </FieldDescription>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting && (
              <Loader className="mx-1 my-2 animate-spin" />
            )}
            Inscrire
          </Button>
        </form>
      </Form>
    </div>
  );
}
