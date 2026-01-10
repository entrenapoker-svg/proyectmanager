import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const ErrorBoundaryFallback = () => {
    const { signOut } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
            <h2 className="text-3xl font-bold text-red-500 mb-4">Something went wrong.</h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">
                A critical error occurred while rendering the application. This might be due to a corrupted session or data state.
            </p>
            <button
                onClick={() => {
                    signOut();
                    window.location.href = '/login';
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all"
            >
                <LogOut size={20} />
                <span>Logout & Reset</span>
            </button>
        </div>
    );
};

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorBoundaryFallback />;
        }

        return this.props.children;
    }
}
