import { useAuth } from "@/context/AuthContext";
import { axiosClient } from "@/api/axios";
import { useState } from "react";

export default function EmailWarning() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user || user.email_verified_at) return null;

  const resend = async () => {
    setLoading(true);
    try {
      await axiosClient.post("/email/verification-notification");
      alert("Email sent again!");
    } catch (e) {
      alert("Error sending email");
    }
    setLoading(false);
  };

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 text-center">
      ⚠️ Email non vérifié.

      <button
        onClick={resend}
        className="ml-3 underline font-semibold"
      >
        {loading ? "Sending..." : "Resend"}
      </button>
    </div>
  );
}
