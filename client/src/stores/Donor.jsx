import { setActive } from '@material-tailwind/react/components/Tabs/TabsContext';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


const backendUrl = import.meta.env.VITE_BACKEND_API_URL;

const useDonorStore = create(
  persist(
    (set, get) => ({
      fullName: '',
      emailAddress: '',
      isEmailSubscription: false,
      isAnonymous: false,
      amount: 0.0,
      lat: null,
      lng: null,
      isLoading: false,
      activeButton: null,
      error: null,
      status: '',
      id: '',
      image_url: '',
      title: '',
      description: '',
      raised: 0,
      goal: 0,
      total_donations: 0,

      setFullName: (fullName) => set({ fullName }),
      setEmailAddress: (emailAddress) => set({ emailAddress }),
      setAmount: (amount) => set({ amount }),
      setLat: (lat) => set({ lat }),
      setLng: (lng) => set({ lng }),
      setIsEmailSubscription: () => set((state) => ({ isEmailSubscription: !state.isEmailSubscription })),
      setIsAnonymous: () => set((state) => ({ isAnonymous: !state.isAnonymous })),
      setActiveButton: (buttonId) => set({ activeButton: buttonId }),

      fetchCampaign: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${backendUrl}/donations`);
          const data = await response.json();
          set({
            image_url: data.image_url,
            title: data.title,
            description: data.description,
            raised: data.raised,
            goal: data.goal,
            total_donations: data.total_donations,
            isLoading: false,
          });
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },

      fetchClientSecret: async () => {
        set({ isLoading: true, error: null });
        try {

          const state = get();
          const { emailAddress, fullName, isEmailSubscription, amount, isAnonymous, lat, lng } = state;

          const response = await fetch(`${backendUrl}/donations/create-checkout-session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              emailAddress,
              fullName,
              isEmailSubscription,
              amount,
              isAnonymous,
              lat,
              lng
            }),
          });
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          set({ isLoading: false });
          return data.clientSecret;
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
      fetchCheckout: async (sessionId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${backendUrl}/donations/check-session-status?session_id=${sessionId}`)
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          set({ isLoading: false, status: data.status });

        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
    }),
    {
      name: 'donate-storage'
    }
  )
);

export default useDonorStore;