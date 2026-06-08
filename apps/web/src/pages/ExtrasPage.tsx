import { Luggage } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setExtras } from '../features/booking/bookingSlice';
import { fetchAncillaries, type AncillaryOption } from '../services/bookingApi';

export const ExtrasPage = () => {
  const booking = useAppSelector((state) => state.booking);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [ancillaries, setAncillaries] = useState<AncillaryOption[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(booking.selection.ancillaryIds);

  useEffect(() => {
    fetchAncillaries({
      fareId: booking.selection.fareBundleId,
      passengersComplete: booking.status === 'passengers_complete',
    }).then((response) => setAncillaries(response.ancillaries));
  }, [booking.selection.fareBundleId, booking.status]);

  const toggleExtra = (id: string) => {
    setSelectedExtras((current) => (current.includes(id) ? current.filter((extraId) => extraId !== id) : [...current, id]));
  };

  const submit = () => {
    dispatch(setExtras(selectedExtras));
    navigate('/review');
  };

  return (
    <section className="flow-page" aria-labelledby="extras-title">
      <div className="page-heading">
        <h1 id="extras-title">Add extras</h1>
        <p>Customize the trip with optional ancillaries.</p>
      </div>

      <div className="option-stack">
        {ancillaries.map((extra) => (
          <label className="choice-card" key={extra.id}>
            <input type="checkbox" checked={selectedExtras.includes(extra.id)} onChange={() => toggleExtra(extra.id)} />
            <span>
              <strong>{extra.name}</strong>
              <span>{extra.description}</span>
            </span>
            <span className="price">EUR {extra.price}</span>
          </label>
        ))}
      </div>

      <button className="primary-action" type="button" onClick={submit}>
        <Luggage aria-hidden="true" size={18} />
        Continue to review
      </button>
    </section>
  );
};
