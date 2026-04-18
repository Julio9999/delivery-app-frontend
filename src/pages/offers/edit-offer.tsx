import { useParams } from 'react-router';
import { OfferFormComponent as OfferForm } from '@/modules/offers/components/offer-form';

export const EditOfferPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <OfferForm
      offerId={id}
      title="Editar oferta"
      submitLabel="Guardar cambios"
    />
  );
};
