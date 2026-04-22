import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Lock, Eye, EyeOff, ArrowLeft, Shield, Plane, Compass, Star } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);
  const email = searchParams.get('email');

  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* LEFT SIDE - Image with overlay */}
      <div
        className="fixed top-0 left-0 bottom-0 w-1/2 bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2f6f85]/85 to-[#0f3d4c]/90"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-10 max-w-md animate-[slideInLeft_0.8s_ease]">
          <div className="mb-10">
            <img src="/images/logo-white.png" alt="Al Miaraj Voyages" className="h-14 mx-auto filter brightness-0 invert" />
          </div>

          <div className="flex justify-center gap-5 mb-8">
            <Plane className="w-10 h-10 text-[#fb923c] animate-[float_3s_ease-in-out_infinite]" />
            <Compass className="w-10 h-10 text-[#fb923c] animate-[float_3s_ease-in-out_infinite] [animation-delay:0.5s]" />
            <Star className="w-10 h-10 text-[#fb923c] animate-[float_3s_ease-in-out_infinite] [animation-delay:1s]" />
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-4">Nouveau mot de passe</h1>
          <p className="text-white/90 text-lg mb-8">
            Créez un nouveau mot de passe pour votre compte
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-white/15 backdrop-blur-sm px-5 py-2 rounded-full text-white text-sm hover:bg-[#fb923c] transition-all">✈️ Vols</span>
            <span className="bg-white/15 backdrop-blur-sm px-5 py-2 rounded-full text-white text-sm hover:bg-[#fb923c] transition-all">🏨 Hôtels</span>
            <span className="bg-white/15 backdrop-blur-sm px-5 py-2 rounded-full text-white text-sm hover:bg-[#fb923c] transition-all">🕋 Hajj & Omra</span>
            <span className="bg-white/15 backdrop-blur-sm px-5 py-2 rounded-full text-white text-sm hover:bg-[#fb923c] transition-all">🗺️ Circuits</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="flex-1 ml-[50%] bg-[#f8fafc] flex items-center justify-center min-h-screen overflow-y-auto">
        <div className="w-full max-w-md px-6 py-12 animate-[fadeInUp_0.6s_ease]">

          {/* Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg relative">
            {/* Gradient border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fb923c] to-[#2f6f85] rounded-t-3xl"></div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#ecfdf5] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#10b981]" />
              </div>
              <h1 className="text-2xl font-bold text-[#1e293b] mb-2">Réinitialiser le mot de passe</h1>
              <p className="text-sm text-[#64748b]">
                Créez un nouveau mot de passe sécurisé
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success Message */}
              {message && (
                <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-[slideDown_0.3s_ease]">
                  <span>✅</span> {message}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-[slideDown_0.3s_ease]">
                  <span>❌</span> {error}
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1e293b]">
                  Nouveau mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 border-2 border-[#e2e8f0] rounded-xl focus:border-[#fb923c] focus:outline-none focus:ring-4 focus:ring-[#fb923c]/10 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#fb923c] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1e293b]">
                  Confirmer le mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 border-2 border-[#e2e8f0] rounded-xl focus:border-[#fb923c] focus:outline-none focus:ring-4 focus:ring-[#fb923c]/10 transition-all"
                    value={password_confirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#fb923c] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="text-xs text-[#64748b] space-y-1">
                <p className="font-semibold mb-1">Le mot de passe doit contenir :</p>
                <ul className="space-y-1">
                  <li className={`flex items-center gap-1 ${password.length >= 8 ? 'text-green-600' : ''}`}>
                    <span>{password.length >= 8 ? '✓' : '○'}</span> Au moins 8 caractères
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#2f6f85] to-[#1e5a6e] text-white font-semibold rounded-xl hover:from-[#1e5a6e] hover:to-[#154a5a] hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Réinitialisation...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Réinitialiser
                  </>
                )}
              </button>
            </form>

            {/* Links */}
            <div className="text-center mt-6 pt-4 border-t border-[#e2e8f0]">
              <Link to="/login" className="text-[#fb923c] font-semibold text-sm hover:text-[#ea580c] hover:underline inline-flex items-center gap-1 transition-colors">
                <ArrowLeft size={16} />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
