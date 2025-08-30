import { setActive } from "@material-tailwind/react/components/Tabs/TabsContext";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

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
          console.error("Error fetching campaign data:", error);
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
          const paymentIntentId = uuidv4(); // Generate key once
          console.log(1);
          console.log(
            "Creating payment intent with:",
            fullName,
            emailAddress,
            amount,
            isEmailSubscription,
            isAnonymous
          );
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
              }),
            }
          );
          console.log(2);
          const data = await response.json();
          console.log(3);
          if (!response.ok) {
            set({ error: data.message });
          }
          set({ isLoading: false });
          return data;
        } catch (error) {
          set({ error: error, isLoading: false });
          console.error("Error creating payment intent:", error);
        }
      },
      fetchClientSecret: async () => {
        set({ isLoading: true, error: null });
        try {
          const state = get();
          const { paymentIntentId, lat, lng } = state;
          console.log(4);

          const response = await fetch(
            `${backendUrl}/donations/create-checkout-session`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                paymentIntentId,
                lat,
                lng,
              }),
            }
          );
          console.log(5);
          const data = await response.json();
          console.log(6);
          if (!response.ok) {
            set({ error: data.message });
          }
          set({ isLoading: false, paymentIntentId: "" });
          return data.clientSecret;
        } catch (error) {
          set({ error: error, isLoading: false, paymentIntentId: "" });
          console.error("Error fetching client secret:", error);
        }
      },

      fetchCheckout: async (sessionId) => {
        set({ isLoading: true, error: null });
        try {
          console.log(7);
          const response = await fetch(
            `${backendUrl}/donations/check-session-status?session_id=${sessionId}`
          );
          console.log(8);
          const data = await response.json();
          console.log(9);
          if (!response.ok) {
            set({ error: data.message });
          }
          set({
            isLoading: false,
            paymentIntentId: "",
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error,
            paymentIntentId: "",
          });
          console.error("Error fetching checkout session:", error);
        }
      },
    }),
    {
      name: "donate-storage",
    }
  )
);

export default useDonateStore;
