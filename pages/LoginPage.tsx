import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { BuildingStorefrontIcon, UserIcon } from '../components/Icons';

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

const LoginPage: React.FC = () => {
    const { login } = useAuth();

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Masuk ke KODIK</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Pilih peran Anda untuk melanjutkan
                    </p>
                </div>
                <div className="mt-8 space-y-6">
                    <button
                        onClick={() => login('buyer')}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <UserIcon className="h-5 w-5 text-primary-light group-hover:text-primary-lighter" />
                        </span>
                        Masuk sebagai Pembeli
                    </button>
                    <button
                        onClick={() => login('seller')}
                        className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <BuildingStorefrontIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-600" />
                        </span>
                        Masuk sebagai Penjual
                    </button>
                     <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Login dengan Google</span>
                        </div>
                    </div>
                     <p className="mt-2 text-center text-xs text-gray-500">
                        Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi kami.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
