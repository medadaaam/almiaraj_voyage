import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
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
import { FieldDescription, FieldGroup } from "@/components/ui/field";

const formSchema = z.object({
  email: z.string().email().min(2).max(30),
  password: z.string().min(8).max(30),
});

export default function Login() {
  const { login, setAuthenticated } = useAuth();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "elarchoui@gmail.com",
      password: "123456789",
    },
  });

  const onSubmit = async (values) => {
    try {
      await AuthApi.getCsrfToken();
      const response = await login(values.email, values.password);
      if (response.status === 200 || response.status === 204) {
        setAuthenticated(true);
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors.email) {
          form.setError("email", {
            message: errors.email.join(", "),
          });
        }
        if (errors.password) {
          form.setError("password", {
            message: errors.password.join(", "),
          });
        }
        if (!errors.email && !errors.password) {
          form.setError("root", {
            message: error.response.data.message || "Données incorrectes",
          });
        }
      } else if (error.response?.status === 419) {
        form.setError("root", {
          message: "La session est terminée, veuillez actualiser la page.",
        });
      } else {
        form.setError("root", {
          message:
            error.response?.data?.message ||
            "Une erreur inattendue s'est produite.",
        });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-center text-[#2f6f85]"> AL MIARAJ VOYAGES</h3>
          {form.formState.errors.root && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {form.formState.errors.root.message}
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
          <FieldGroup className="grid grid-cols-1">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Password</FormLabel>

                    <a
                      href="/forgot-password"
                      className="text-sm text-[#2f6f85] hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting && (
              <Loader className="mx-2 my-2 animate-spin" />
            )}
            Login
          </Button>
        </form>
      </Form>
      <p className="mt-6 text-sm/6 text-center">
        <span className="text-gray-600  dark:text-gray-400">
          Don't have an account?{" "}
        </span>
        <Link
          to="/register"
          className="font-semibold hover:text-orange-700 text-orange-500"
        >
          S'inscrire
        </Link>
      </p>
    </div>
  );
}
