
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Safety timeout to prevent black screen if Supabase hangs
        const timeout = setTimeout(() => {
            if (mounted) {
                console.warn("Auth check timed out, forcing load completion.");
                setLoading(false);
            }
        }, 3000);

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (mounted) {
                setUser(session?.user ?? null);
                setLoading(false);
                clearTimeout(timeout);
            }
        }).catch((error) => {
            console.error("Auth session check failed:", error);
            if (mounted) setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            clearTimeout(timeout);
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    };

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        if (error) throw error
        return data
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
