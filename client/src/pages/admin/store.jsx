import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from "src/pages/auth/store";


const backednUrl = import.meta.env.VITE_BACKEND_API_URL;

const useAdminStore = create(
  persist(
    (set, get) => ({
      campaigns: [],
      donationsLatLng: [],
      donors: [],
      totalHistoricalRaised: 0,
      totalHistoricalDonations: 0,
      totalHistoricalDonors: 0,
      launchedCampaigns: 0,
      donationsWindow: [],
      isLoading: false,
      error: null,
      fetchCampaigns: async () => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          const response = await fetch(`${backednUrl}/admins/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          console.log(data.donors);
          set({
            campaigns: data['campaigns'] || [],
            donationsLatLng: data['donationsLatLng'] || [],
            donors: data['donors'] || [],
            launchedCampaigns: data['launchedCampaigns'] || 0,
            totalHistoricalDonors: data['totalHistoricalDonors'] || 0,
            totalHistoricalDonations: data['totalHistoricalDonations'] || 0,
            totalHistoricalRaised: data['totalHistoricalRaised'] || null,
            donationsWindow: data['donationsWindow'] || [],
            isLoading: false,
          });
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
    }),
    {
      name: 'admin-storage',
    }
  )
);

export default useAdminStore;

