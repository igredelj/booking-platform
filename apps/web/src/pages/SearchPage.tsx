import type { ExperienceProfile } from '@eebkg/config-schema';
import { ArrowLeftRight, CalendarDays, MapPin, Plane, Search, UsersRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../app/hooks';
import { setSearch } from '../features/booking/bookingSlice';
import type { SearchCriteria } from '@eebkg/config-schema';

interface SearchPageProps {
  profile: ExperienceProfile;
}

export const SearchPage = ({ profile }: SearchPageProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState, getValues, setValue } = useForm<SearchCriteria>({
    defaultValues: {
      origin: 'ZAG',
      destination: 'AMS',
      departureDate: '2026-06-20',
      returnDate: '2026-06-27',
      tripType: 'round-trip',
      passengers: {
        adult: 1,
        child: 0,
        senior: 0,
      },
      directOnly: false,
      flexibleDates: false,
    },
  });

  const onSubmit = (values: SearchCriteria) => {
    dispatch(setSearch(values));
    navigate('/flights');
  };

  const swapRoute = () => {
    const origin = getValues('origin');
    const destination = getValues('destination');
    setValue('origin', destination);
    setValue('destination', origin);
  };

  return (
    <section className="search-screen" aria-labelledby="search-title">
      <div className="search-card">
        <div className="search-card-header">
          <div className="search-heading">
            <h1 id="search-title">Build your trip</h1>
            <p>Find the best fare, choose your bundle, and add only what you need.</p>
          </div>

          <div className="trip-toggle" role="radiogroup" aria-label="Trip type">
            <label>
              <input type="radio" value="round-trip" {...register('tripType')} />
              <span>Round trip</span>
            </label>
            <label>
              <input type="radio" value="one-way" {...register('tripType')} />
              <span>One way</span>
            </label>
          </div>
        </div>

        <form className="flight-search-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="route-grid">
            <label className="search-field">
              <span>From</span>
              <span className="input-shell">
                <MapPin aria-hidden="true" size={22} />
                <input
                  {...register('origin', { required: 'Origin is required' })}
                  aria-invalid={Boolean(formState.errors.origin)}
                  placeholder="Departure airport"
                />
              </span>
            </label>

            <button className="swap-button" type="button" aria-label="Swap origin and destination" onClick={swapRoute}>
              <ArrowLeftRight aria-hidden="true" size={22} />
            </button>

            <label className="search-field">
              <span>To</span>
              <span className="input-shell">
                <MapPin aria-hidden="true" size={22} />
                <input
                  {...register('destination', { required: 'Destination is required' })}
                  aria-invalid={Boolean(formState.errors.destination)}
                  placeholder="Arrival airport"
                />
              </span>
            </label>
          </div>

          <div className="search-grid">
            <label className="search-field">
              <span>Departure</span>
              <span className="input-shell">
                <CalendarDays aria-hidden="true" size={22} />
                <input type="date" {...register('departureDate', { required: true })} />
              </span>
            </label>

            <label className="search-field">
              <span>Return</span>
              <span className="input-shell">
                <CalendarDays aria-hidden="true" size={22} />
                <input type="date" {...register('returnDate', { required: true })} />
              </span>
            </label>

            <fieldset className="passenger-field">
              <legend>Passengers</legend>
              <div className="passenger-panel">
                <UsersRound aria-hidden="true" size={22} />
                <label>
                  Adults
                  <input type="number" min="1" {...register('passengers.adult', { valueAsNumber: true, min: 1 })} />
                </label>
                <label>
                  Children
                  <input type="number" min="0" {...register('passengers.child', { valueAsNumber: true, min: 0 })} />
                </label>
                {profile.features.seniorPassenger ? (
                  <label>
                    Seniors
                    <input type="number" min="0" {...register('passengers.senior', { valueAsNumber: true, min: 0 })} />
                  </label>
                ) : null}
              </div>
            </fieldset>

            <label className="search-field">
              <span>Fare type</span>
              <span className="input-shell">
                <Plane aria-hidden="true" size={22} />
                <select defaultValue="economy" aria-label="Fare type">
                  <option value="economy">Economy</option>
                  <option value="premium">Premium economy</option>
                  <option value="business">Business</option>
                </select>
              </span>
            </label>
          </div>

          <button className="search-submit" type="submit">
            <Search aria-hidden="true" size={20} />
            Search flights
          </button>
        </form>
      </div>
    </section>
  );
};
