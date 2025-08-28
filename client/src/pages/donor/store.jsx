import { setActive } from "@material-tailwind/react/components/Tabs/TabsContext";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const backendUrl = import.meta.env.VITE_BACKEND_API_URL;

const useDonateStore = create(
  persist(
    (set, get) => ({
      lat: null,
      lng: null,
      error: null,
      paymentIntentId: "",
      setPaymentIntentId: (paymentIntentId) => set({ paymentIntentId }),
      setLat: (lat) => set({ lat }),
      setlng: (lng) => set({ lng }),

      fetchCampaign: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${backendUrl}/donations`);
          const data = await response.json();
          set({
            isLoading: false,
          });
          return data;
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
      createPaymentIntent: async ({
        fullName,
        emailAddress,
        amount,
        isEmailSubscription,
        isAnonymous,
      }) => {
        set({ isLoading: true, error: null });
        try {
          const state = get();
          const { paymentIntentId, lat, lng } = state;

          const response = await fetch(
            `${backendUrl}/donations/create-payment-intent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                paymentIntentId,
                emailAddress,
                fullName,
                isEmailSubscription,
                amount,
                isAnonymous,
                lat,
                lng,
              }),
            }
          );
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          set({ isLoading: false, paymentIntentId: data.paymentIntentId });
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
      fetchClientSecret: async () => {
        set({ isLoading: true, error: null });
        try {
          const state = get();
          const { paymentIntentId } = state;

          const response = await fetch(
            `${backendUrl}/donations/create-checkout-session`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                paymentIntentId,
              }),
            }
          );
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          set({ isLoading: false, paymentIntentId: "" });
          return data.clientSecret;
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },

      fetchCheckout: async (sessionId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            `${backendUrl}/donations/check-session-status?session_id=${sessionId}`
          );
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          set({
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error,
          });
        }
      },
    }),
    {
      name: "donate-storage",
    }
  )
);

export default useDonateStore;
