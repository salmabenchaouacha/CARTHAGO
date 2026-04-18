import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const RegisterPage = ({ isPartner = false }: { isPartner?: boolean }) => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [businessName, setBusinessName] = useState('');
  const [activityType, setActivityType] = useState('artisan');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [regionId, setRegionId] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const payload: any = {
      username,
      password,
      email,
      full_name: fullName,
      phone,
      role: isPartner ? 'partner' : 'user',
    };

    if (isPartner) {
      payload.business_name = businessName;
      payload.activity_type = activityType;
      payload.description = description;
      payload.address = address;
      if (regionId) payload.region_id = Number(regionId);
      if (latitude) payload.latitude = Number(latitude);
      if (longitude) payload.longitude = Number(longitude);
    }

    const result = await register(payload);

    if (!result.success) {
      setError(result.error || "Erreur lors de l'inscription");
      return;
    }

    navigate('/connexion');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-sand">
      <div className="w-full max-w-xl p-8 rounded-2xl bg-card border">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold">Explore Tunisia</span>
          </Link>
          <h1 className="font-display text-2xl font-bold">
            {isPartner ? 'Inscription Partenaire' : 'Créer un compte'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isPartner ? 'Rejoignez notre réseau de partenaires' : 'Commencez à explorer la Tunisie'}
          </p>
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
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              {isPartner ? "Nom du responsable" : "Nom complet"}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Téléphone</label>
            <input
              type="text"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm"
            />
          </div>

          {isPartner && (
            <>
              <div>
                <label className="text-sm font-medium text-foreground">Nom de l'établissement</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Type d'activité</label>
                <select
                  value={activityType}
                  onChange={e => setActivityType(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm"
                >
                  <option value="artisan">Artisan</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="guest_house">Maison d'hôte</option>
                  <option value="guide">Guide</option>
                  <option value="tourism">Prestataire touristique</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Adresse</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">ID Région</label>
                <input
                  type="number"
                  value={regionId}
                  onChange={e => setRegionId(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                    className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                    className="w-full mt-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold text-primary-foreground ${
              isPartner ? 'gradient-warm' : 'gradient-mediterranean'
            }`}
          >
            {isPartner ? 'Créer mon espace partenaire' : "S'inscrire"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          Déjà un compte ?{' '}
          <Link to="/connexion" className="text-primary hover:underline">
            Connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;