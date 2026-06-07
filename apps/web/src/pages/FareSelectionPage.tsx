import { useEffect, useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectFare } from '../features/booking/bookingSlice';
import { fetchFares, type FareOption } from '../services/bookingApi';

export const FareSelectionPage = () => {
  const booking = useAppSelector((state) => state.booking);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [fares, setFares] = useState<FareOption[]>([]);
  const [fareId, setFareId] = useState('');

  useEffect(() => {
    fetchFares({
      outboundFlightId: booking.selection.outboundOfferId,
      inboundFlightId: booking.selection.returnOfferId,
    }).then((response) => setFares(response.fares));
  }, [booking.selection.outboundOfferId, booking.selection.returnOfferId]);

  const submit = () => {
    dispatch(selectFare(fareId));
    navigate('/passengers');
  };

  return (
    <section className="flow-page" aria-labelledby="fares-title">
      <div className="page-heading">
        <h1 id="fares-title">Choose fare</h1>
        <p>Compare fare conditions before continuing.</p>
      </div>

      <div className="fare-grid">
        {fares.map((fare) => (
          <label className="choice-card vertical" key={fare.id}>
            <input type="radio" name="fare" value={fare.id} checked={fareId === fare.id} onChange={() => setFareId(fare.id)} />
            <strong>{fare.name}</strong>
            <span className="price">EUR {fare.price}</span>
            <ul>
              {fare.conditions.map((condition) => (
                <li key={condition}>{condition}</li>
              ))}
            </ul>
          </label>
        ))}
      </div>

      <button className="primary-action" type="button" disabled={!fareId} onClick={submit}>
        <BadgeCheck aria-hidden="true" size={18} />
        Continue to passengers
      </button>
    </section>
  );
};
