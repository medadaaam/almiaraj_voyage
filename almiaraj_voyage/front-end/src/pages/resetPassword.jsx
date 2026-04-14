import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosClient } from "@/api/axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  // جيبي الـ email من query params
  const searchParams = new URLSearchParams(window.location.search);
  const email = searchParams.get('email');

  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (password !== password_confirmation) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setLoading(false);
      return;
    }

    try {
      await axiosClient.post("/reset-password", {
        token: token,
        email: email,
        password: password,
        password_confirmation: password_confirmation,
      });

      setMessage("Mot de passe réinitialisé avec succès!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error.response?.data);
      setError(error.response?.data?.message || "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Réinitialiser le mot de passe</h2>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          className="w-full border p-3 rounded-lg mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          className="w-full border p-3 rounded-lg mb-4"
          value={password_confirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2f6f85] text-white px-4 py-2 rounded-lg hover:bg-[#25596b] transition disabled:opacity-50"
        >
          {loading ? "Réinitialisation..." : "Réinitialiser"}
        </button>
      </form>

      <div className="text-center mt-4">
        <Link to="/login" className="text-[#2f6f85] hover:underline">
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
