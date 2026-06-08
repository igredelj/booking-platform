import { CreditCard } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { completePayment } from '../features/booking/bookingSlice';
import { confirmBooking } from '../services/bookingApi';

interface PaymentFormValues {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export const PaymentPage = () => {
  const booking = useAppSelector((state) => state.booking);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<PaymentFormValues>();

  const onSubmit = async (values: PaymentFormValues) => {
    const response = await confirmBooking({
      booking: {
        search: booking.search,
        outboundFlightId: booking.selection.outboundOfferId,
        inboundFlightId: booking.selection.returnOfferId,
        fareId: booking.selection.fareBundleId,
        reviewed: booking.status === 'reviewed',
      },
      payment: values,
    });
    dispatch(completePayment(response.confirmationCode));
    navigate('/confirmation');
  };

  return (
    <section className="flow-page" aria-labelledby="payment-title">
      <div className="page-heading">
        <h1 id="payment-title">Payment</h1>
        <p>Use the mock payment form to complete this test booking.</p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>
          Name on card
          <input {...register('cardholderName', { required: true })} aria-invalid={Boolean(formState.errors.cardholderName)} />
        </label>
        <label>
          Card number
          <input inputMode="numeric" {...register('cardNumber', { required: true })} aria-invalid={Boolean(formState.errors.cardNumber)} />
        </label>
        <label>
          Expiry
          <input placeholder="MM/YY" {...register('expiry', { required: true })} aria-invalid={Boolean(formState.errors.expiry)} />
        </label>
        <label>
          CVC
          <input inputMode="numeric" {...register('cvc', { required: true })} aria-invalid={Boolean(formState.errors.cvc)} />
        </label>
        <button className="primary-action" type="submit">
          <CreditCard aria-hidden="true" size={18} />
          Pay and confirm
        </button>
      </form>
    </section>
  );
};
