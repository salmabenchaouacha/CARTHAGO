import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, Check } from 'lucide-react';
import { getPartnerDetail } from '@/services/partnerService';

const PartnerDetailPage = () => {
  const { id } = useParams();
  const [partner, setPartner] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getPartnerDetail(Number(id)).then(setPartner);
    }
  }, [id]);

  if (!partner) return <div className="text-center py-20">Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-10">

      <Link to="/partners" className="flex items-center gap-2 mb-6">
        <ArrowLeft /> Retour
      </Link>

      <h1 className="text-3xl font-bold">{partner.business_name}</h1>

      <p className="text-gray-500 mb-4">{partner.activity_type}</p>

      <div className="flex items-center gap-2 mb-4">
        <MapPin size={16} />
        {partner.address}
      </div>

      <p className="mb-6">{partner.description}</p>

      <div><strong>Région :</strong> {partner.region?.name}</div>
      <div><strong>Ajouté par :</strong> {partner.user?.full_name}</div>

      {partner.is_verified && (
        <div className="flex items-center gap-2 text-green-600 mt-4">
          <Check size={16} />
          Vérifié
        </div>
      )}

    </div>
  );
};

export default PartnerDetailPage;