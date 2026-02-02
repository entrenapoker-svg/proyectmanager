import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Calendar, Mail } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setProfiles(data);
            } catch (err) {
                console.error("Admin Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfiles();
        }
    }, [user]);

    if (loading) return <div className="p-8 text-white">Cargando panel de administración...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto text-white">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                    <ShieldAlert size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Panel de Administrador</h1>
                    <p className="text-gray-400">Gestión de usuarios y sistema</p>
                    {error && (
                        <p className="text-sm text-red-400 mt-1">
                            ⚠️ Error: {error}. (Asegúrate de correr ADMIN_SETUP.sql y asignarte rol 'admin')
                        </p>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#121214] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm font-bold uppercase">Total Usuarios</span>
                        <Users className="text-cyan-500" size={20} />
                    </div>
                    <div className="text-3xl font-bold">{profiles.length}</div>
                </div>
            </div>

            {/* User Table */}
            <div className="bg-[#121214] border border-white/10 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/5">
                    <h3 className="font-bold">Usuarios Registrados</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-black/20 text-gray-400 uppercase font-mono text-xs">
                            <tr>
                                <th className="p-4">Email</th>
                                <th className="p-4">Rol</th>
                                <th className="p-4">ID</th>
                                <th className="p-4">Fecha Registro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {profiles.map((profile) => (
                                <tr key={profile.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold text-white flex items-center gap-2">
                                        <Mail size={14} className="text-gray-500" />
                                        {profile.email}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${profile.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                                            {profile.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-xs text-gray-500">{profile.id}</td>
                                    <td className="p-4 text-gray-400">
                                        {new Date(profile.created_at).toLocaleDateString()} {new Date(profile.created_at).toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                            {profiles.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No hay usuarios visibles (Revisa tus permisos RLS).
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
