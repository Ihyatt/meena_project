import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import useDonateStore from 'src/stores/Donate';
import Loading from "src/components/Loading";


const stripePublishableKey = import.meta.env.VITE_STRIPE_PK;

const SubscriptionCheckout = () => {
    const { fetchSubscriptionClientSecret, isLoading } = useDonateStore();
    const stripePromise = loadStripe(stripePublishableKey)

    return (
        <div className="
            max-w-md
            mx-auto
            p-4
            border
            border-gray-300
            rounded-lg
            shadow-md
            bg-white
            ">
            {isLoading && <Loading />}
            <div id="checkout">
                <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ fetchClientSecret: fetchSubscriptionClientSecret }}
                >
                    <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
            </div>
        </div>
    );
};

export default SubscriptionCheckout;