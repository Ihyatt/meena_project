import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCampaignStore = create(
  persist(
    (set) => ({
      campaignId: null,
      setCampaign: (campaignId) => set({ campaignId }),
    }),
    {
      name: 'campaign-storage',
      partialize: (state) => ({ campaignId: state.campaignId }),
    }
  )
);

export default useCampaignStore;