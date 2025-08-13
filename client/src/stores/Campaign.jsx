import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from "src/stores/Auth";


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
      admin: null,
      launchedCampaigns: 0,
      title: '',
      description: '',
      isActive: false,
      goal: 0,
      campaignId: null,
      file: null,
      imageUrl: '',
      donationsWindow: [],
      isLoading: false,
      error: null,
      setTitle: (title) => set({ title }),
      setDescription: (description) => set({ description }),
      setGoal: (goal) => set({ goal }),
      setIsActive: () => set((state) => ({ isActive: !state.isActive })),
      setFile: (file) => set({ file }),

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
          set({
            campaigns: data['campaigns'] || [],
            donationsLatLng: data['donationsLatLng'] || [],
            donors: data['donors'] || [],
            launchedCampaigns: data['launchedCampaigns'] || 0,
            totalHistoricalDonors: data['totalHistoricalDonors'] || 0,
            totalHistoricalDonations: data['totalHistoricalDonations'] || 0,
            totalHistoricalRaised: data['totalHistoricalRaised'] || null,
            donationsWindow: data['donationsWindow'] || null,
            isLoading: false,
          });
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
      fetchCampaign: async (campaignId) => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          const response = await fetch(`${backednUrl}/admins/campaigns/${campaignId}`, {
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
          set({
            title: data.title,
            description: data.description,
            goal: data.goal,
            isLoading: false,
            imageUrl: data.imageUrl,
          });
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
      saveCampaign: async (campaignId) => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          const state = get();
          const { title, description, goal } = state;
          const response = await fetch(`${backednUrl}/admins/campaigns/${campaignId}/save`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
            'body': JSON.stringify({ title, description, goal }),
          });
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          set((state) => ({
            campaigns: state.campaigns.map((item) =>
              data.id === item.id && !data.isDraft ? {
                ...item,
                title: data.title,
                imageUrl: data.imageUrl,
                description: data.description,
                isActive: data.isActive,
                goal: data.goal,
              } : item,
            ),
            title: data.title,
            description: data.description,
            goal: data.goal,
            imageUrl: data.imageUrl,
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
      launchCampaign: async (campaignId) => {
        const { jwtToken } = useAuthStore.getState();
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${backednUrl}/admins/campaigns/${campaignId}/launch`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }

          const { campaigns } = get();

          const newCampaigns = campaigns
            .filter(item => item.id !== data.id)
            .map(item => ({ ...item, isActive: false }));


          set({ campaigns: [data, ...newCampaigns], isLoading: false });
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
      closeCampaign: async (campaignId) => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          const response = await fetch(`${backednUrl}/admins/campaigns/${campaignId}/close`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          set((state) => ({
            campaigns: state.campaigns.map((item) =>
              data.id === item.id ? {
                ...item,
                isActive: data.isActive,
              } : item,
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
      upload: async (campaignId, file) => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          const fd = new FormData()
          fd.append('file', file)
          const response = await fetch(`${backednUrl}/admins/campaigns/${campaignId}/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
            },
            body: fd,
          });
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          set((state) => ({
            campaigns: state.campaigns.map((item) =>
              campaignId == item.id ? {
                ...item,
                imageUrl: data.url,
              } : item,
            ),
            imageUrl: data.url,
            file: null,
            isLoading: false,
          }));
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

