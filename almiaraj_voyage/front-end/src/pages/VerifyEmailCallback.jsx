import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function VerifyEmailCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getUser } = useAuth();

  useEffect(() => {
    const verified = searchParams.get('verified');
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    if (verified === '1') {
      // إعادة جلب المستخدم بعد التحقق
      getUser();
      alert('✅ Votre email a été vérifié avec succès !');
      navigate('/');
    } else if (error === 'invalid_signature') {
      alert('❌ Lien de vérification invalide.');
      navigate('/login');
    } else if (message === 'already_verified') {
      alert('ℹ️ Votre email est déjà vérifié.');
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, getUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f6f85] mx-auto"></div>
        <p className="mt-4 text-gray-600">Vérification en cours...</p>
      </div>
    </div>
  );
}
