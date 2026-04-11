import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (success) navigate('/');
    else setError('Identifiants incorrects');
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

        <div className="mb-4 p-3 rounded-lg bg-mediterranean-light text-primary text-xs">
          <strong>Comptes de test :</strong><br />
          Utilisateur : sophie@example.com<br />
          Partenaire : dar@example.com<br />
          Admin : admin@exploretunisia.com<br />
          (mot de passe quelconque)
        </div>

        {error && <p className="text-destructive text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm" placeholder="votre@email.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Mot de passe</label>
            <div className="relative mt-1">
              <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
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
