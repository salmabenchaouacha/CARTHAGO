import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const RegisterPage = ({ isPartner = false }: { isPartner?: boolean }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(name, email, password, isPartner ? 'partner' : 'user');
    navigate(isPartner ? '/partenaire' : '/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-sand">
      <div className="w-full max-w-md p-8 rounded-2xl bg-card border">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold">Explore Tunisia</span>
          </Link>
          <h1 className="font-display text-2xl font-bold">{isPartner ? 'Inscription Partenaire' : 'Créer un compte'}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isPartner ? 'Rejoignez notre réseau de partenaires' : 'Commencez à explorer la Tunisie'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">{isPartner ? 'Nom de l\'établissement' : 'Nom complet'}</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Mot de passe</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm" />
          </div>
          <button type="submit" className={`w-full py-3 rounded-xl font-semibold text-primary-foreground ${isPartner ? 'gradient-warm' : 'gradient-mediterranean'}`}>
            {isPartner ? 'Créer mon espace partenaire' : 'S\'inscrire'}
          </button>
        </form>
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Déjà un compte ? <Link to="/connexion" className="text-primary hover:underline">Connexion</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
