import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe('pk_test_JDCX09OjIVdwMLhu33i7z5yc00NAOZFi0J');

export const bookTour = async tourId => {
  try {
    //1. Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    //2. Create checkout form + charge credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (error) {
    showAlert('error', err);
  }
};
