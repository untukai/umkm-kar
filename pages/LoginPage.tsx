
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import { useNotification } from '../hooks/useNotification';

const GoogleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.999 35.936 44 30.606 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);


const LoginPage: React.FC = () => {
  const { signInWithGoogle, loginAsSeller } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const handleGoogleSignIn = () => {
    signInWithGoogle();
    const redirectUrl = searchParams.get('redirect') || '/profile';
    navigate(redirectUrl);
  };
  
  const handleSellerLogin = () => {
    const sellerEmail = 'penjual@example.com';
    loginAsSeller(sellerEmail);
    showNotification('Info Demo', 'Anda masuk sebagai penjual demo.');
    const redirectUrl = searchParams.get('redirect') || '/seller';
    navigate(redirectUrl);
  };

  return (
    <div className="flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-800">Selamat Datang</h1>
            <p className="text-neutral-500 mt-2">Masuk untuk mulai berbelanja di KODIK.</p>
        </div>
        <div className="space-y-4 mt-8">
            <Button 
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full !font-bold !py-3 flex items-center justify-center gap-3 !text-neutral-700 !border-neutral-300 hover:!bg-neutral-100"
            >
                <GoogleIcon />
                Masuk dengan Google
            </Button>
            <Button 
                onClick={handleSellerLogin}
                variant="secondary"
                className="w-full !font-bold !py-3 !bg-neutral-800 !text-white hover:!bg-neutral-900"
            >
                Masuk sebagai Penjual (Demo)
            </Button>
        </div>
        <p className="text-center text-xs text-neutral-500 mt-8">
          Dengan melanjutkan, Anda menyetujui <a href="#" className="underline hover:text-primary">Syarat & Ketentuan</a> kami.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;