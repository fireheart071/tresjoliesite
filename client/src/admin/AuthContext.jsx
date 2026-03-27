import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // In a real app, verify token with backend
            setUser({ username: localStorage.getItem('adminUsername') });
        }
        setLoading(false);
    }, [token]);

    const login = (newToken, username) => {
        localStorage.setItem('adminToken', newToken);
        localStorage.setItem('adminUsername', username);
        setToken(newToken);
        setUser({ username });
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading: loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
