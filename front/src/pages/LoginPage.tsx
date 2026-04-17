import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login, refreshMe, user } = useAuth();
  const navigate = useNavigate();

  const handleRedirectByRole = (role: string) => {
    if (role === 'admin') navigate('/admin');
    else if (role === 'partner') navigate('/partenaire');
    else navigate('/utilisateur');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(username, password);

    if (!success) {
      setError('Identifiants incorrects');
      return;
    }

    await refreshMe();

    const storedRole = localStorage.getItem("redirect_role");
    if (storedRole) {
      localStorage.removeItem("redirect_role");
      handleRedirectByRole(storedRole);
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      handleRedirectByRole(payload.role);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-sand">
      <div className="w-full max-w-md p-8 rounded-2xl bg-card border">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold">Explore Tunisia</span>
          </Link>
          <h1 className="font-display text-2xl font-bold">Connexion</h1>
          <p className="text-sm text-muted-foreground mt-1">Accédez à votre espace personnel</p>
        </div>

        {error && <p className="text-destructive text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Nom d'utilisateur</label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm"
              placeholder="Votre username"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Mot de passe</label>
            <div className="relative mt-1">
              <input
                type={showPw ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full py-3 rounded-xl gradient-mediterranean text-primary-foreground font-semibold">
            Se connecter
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="text-primary hover:underline">Inscription</Link>
          {' · '}
          <Link to="/inscription-partenaire" className="text-accent hover:underline">Devenir partenaire</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;