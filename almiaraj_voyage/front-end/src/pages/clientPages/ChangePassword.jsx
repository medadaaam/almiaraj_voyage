import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import "./changePassword.css";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { changePassword, user, clientProfile } = useAuth();

  const currentClient = clientProfile?.client || user;

  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: ""
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
    setSuccess("");
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    console.log("Données envoyées:", {
        current_password: formData.current_password,
        password: formData.password,
        password_confirmation: formData.password_confirmation
    });

    // Validation
    if (!formData.current_password) {
      setError("Veuillez entrer votre mot de passe actuel");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const response = await changePassword({
        current_password: formData.current_password,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });

      if (response?.success) {
        setSuccess("Mot de passe modifié avec succès !");
        setFormData({
          current_password: "",
          password: "",
          password_confirmation: ""
        });

        // Rediriger après 2 secondes
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(response?.message || "Une erreur s'est produite");
      }
    } catch (err) {
      console.error("Change password error:", err);
      setError(err.response?.data?.message || "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        {/* Header */}
        <div className="change-password-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeft size={20} />
            Retour
          </button>
          <div className="header-icon">
            <Shield size={32} />
          </div>
          <h1>Changer le mot de passe</h1>
          <p className="header-subtitle">
            {currentClient?.email && (
              <span>Compte : <strong>{currentClient.email}</strong></span>
            )}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="alert success">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="change-password-form">
          {/* Current Password */}
          <div className="form-group">
            <label className="form-label">
              Mot de passe actuel <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="current_password"
                placeholder="Entrez votre mot de passe actuel"
                value={formData.current_password}
                onChange={handleChange}
                className="form-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="password-toggle"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="form-group">
            <label className="form-label">
              Nouveau mot de passe <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showNewPassword ? "text" : "password"}
                name="password"
                placeholder="Nouveau mot de passe"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="password-toggle"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bars">
                  {[0, 1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`strength-bar ${level < passwordStrength ? 'active' : ''}`}
                      style={{
                        backgroundColor: level < passwordStrength
                          ? passwordStrength === 1 ? '#ef4444'
                            : passwordStrength === 2 ? '#f59e0b'
                            : passwordStrength === 3 ? '#10b981'
                            : '#10b981'
                          : '#e5e7eb'
                      }}
                    />
                  ))}
                </div>
                <p className={`strength-text strength-${passwordStrength}`}>
                  {passwordStrength === 0 && "Très faible"}
                  {passwordStrength === 1 && "Faible"}
                  {passwordStrength === 2 && "Moyen"}
                  {passwordStrength === 3 && "Fort"}
                  {passwordStrength === 4 && "Très fort"}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">
              Confirmer le nouveau mot de passe <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirmation"
                placeholder="Confirmez le nouveau mot de passe"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="form-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Match Indicator */}
            {formData.password && formData.password_confirmation && (
              <p className={`match-indicator ${formData.password === formData.password_confirmation ? 'match' : 'mismatch'}`}>
                {formData.password === formData.password_confirmation ? (
                  <>✓ Les mots de passe correspondent</>
                ) : (
                  <>✗ Les mots de passe ne correspondent pas</>
                )}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="requirements">
            <p className="requirements-title">Le mot de passe doit contenir :</p>
            <ul className="requirements-list">
              <li className={formData.password.length >= 8 ? 'valid' : ''}>
                • Au moins 8 caractères
              </li>
              <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                • Au moins une majuscule
              </li>
              <li className={/[0-9]/.test(formData.password) ? 'valid' : ''}>
                • Au moins un chiffre
              </li>
              <li className={/[^A-Za-z0-9]/.test(formData.password) ? 'valid' : ''}>
                • Au moins un caractère spécial
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Modification en cours...
              </>
            ) : (
              <>
                <Shield size={18} />
                Changer le mot de passe
              </>
            )}
          </button>
        </form>

        {/* Security Tips */}
        <div className="security-tips">
          <h4>💡 Conseils de sécurité</h4>
          <ul>
            <li>N'utilisez pas le même mot de passe que sur d'autres sites</li>
            <li>Évitez les informations personnelles (nom, date de naissance)</li>
            <li>Changez votre mot de passe régulièrement</li>
            <li>Ne partagez jamais votre mot de passe</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
