
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Mail, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isSignUp) {
                await signUp(email, password);
                alert('¡Registro exitoso! Revisa tu email para confirmar (o inicia sesión si el auto-confirm está activo).');
            } else {
                await signIn(email, password);
                navigate('/app');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0b] text-white p-4">
            <div className="w-full max-w-md space-y-8 bg-[#18181b] p-8 rounded-2xl border border-white/5 shadow-2xl">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
                        {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        {isSignUp ? 'Únete al gestor de proyectos.' : 'Bienvenido de nuevo.'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                            <input
                                type="email"
                                required
                                className="block w-full rounded-t-md border-0 bg-white/5 py-3 pl-10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-500 sm:text-sm"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                            <input
                                type="password"
                                required
                                className="block w-full rounded-b-md border-0 bg-white/5 py-3 pl-10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-500 sm:text-sm"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full justify-center rounded-md bg-cyan-600 px-3 py-3 text-sm font-semibold text-white hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading && (
                            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        )}
                        {isSignUp ? 'Registrarse' : 'Entrar'}
                    </button>

                    <div className="text-center mt-4 space-y-4">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm text-cyan-400 hover:text-cyan-300"
                        >
                            {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Registrate'}
                        </button>


                    </div>
                </form>
            </div>
        </div>
    );
}
