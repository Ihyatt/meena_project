import { create } from 'zustand';
import { persist } from 'zustand/middleware';


const backednUrl = import.meta.env.VITE_BACKEND_API_URL;


const useCampaignStore = create(
  persist(
    (set) => ({
      campaign: null,
      loading: true,
      fetchCampaign: async () => {
        set({ loading: true });
        const campaign = await fetch(`${backednUrl}`).then(res => res.json());
        set({ campaign, loading: false });
      },
    }),
    {
      name: 'campaign-storage'
    }
  )
);

export default useCampaignStore;