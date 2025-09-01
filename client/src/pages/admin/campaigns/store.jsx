import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAuthStore from "src/pages/auth/store";

const backednUrl = import.meta.env.VITE_BACKEND_API_URL;

const useCampaignStore = create(
  persist(
    (set, get) => ({
      campaigns: [],
      isLoading: false,
      error: null,

      fetchCampaignDraft: async () => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          const response = await fetch(
            `${backednUrl}/admins/campaigns/drafts`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          set({
            isLoading: false,
          });
          return data;
        } catch (error) {
          console.error("Error fetching campaign draft:", error);
          set({ error: error.message, isLoading: false });
        }
      },

      shareCampaignDraft: async (
        campaignId,
        title,
        description,
        goal,
        closeoutDate
      ) => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          const response = await fetch(
            `${backednUrl}/admins/campaigns/${campaignId}/share`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ title, description, goal, closeoutDate }),
            }
          );
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          set((state) => ({
            campaigns: [data, ...state.campaigns],
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
      fetchCampaigns: async () => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          const response = await fetch(`${backednUrl}/admins/campaigns/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          set({
            campaigns: data,
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
          const response = await fetch(
            `${backednUrl}/admins/campaigns/${campaignId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          set({
            isLoading: false,
          });
          return data;
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
      saveCampaign: async (
        campaignId,
        title,
        description,
        goal,
        closeoutDate
      ) => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          console.log("Saving campaign...", {
            campaignId,

            title,
            description,
            goal,
            closeoutDate,
          });

          const response = await fetch(
            `${backednUrl}/admins/campaigns/${campaignId}/save`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ title, description, goal, closeoutDate }),
            }
          );
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          if (data.draft == true) {
            set({ isLoading: false });
            return data;
          }

          set((state) => ({
            campaigns: state.campaigns.map((campaign) =>
              data.id == campaign.id
                ? {
                    ...data,
                  }
                : campaign
            ),
            isLoading: false,
          }));

          return data;
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
      launchCampaign: async (campaignId) => {
        const { jwtToken } = useAuthStore.getState();
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            `${backednUrl}/admins/campaigns/${campaignId}/launch`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          set((state) => ({
            campaigns: state.campaigns.map((campaign) =>
              campaign.id == data.id
                ? {
                    ...campaign,
                    isActive: data.isActive,
                  }
                : campaign
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
      closeCampaign: async (campaignId) => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          const response = await fetch(
            `${backednUrl}/admins/campaigns/${campaignId}/close`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }

          set((state) => ({
            campaigns: state.campaigns.map((campaign) =>
              campaign.id == data.id
                ? {
                    ...data,
                    isActive: data.isActive,
                  }
                : campaign
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
          const fd = new FormData();
          fd.append("file", file);
          const response = await fetch(
            `${backednUrl}/admins/campaigns/${campaignId}/upload`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
              body: fd,
            }
          );
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }

          set((state) => ({
            campaigns: state.campaigns.map((campaign) =>
              campaign.id == data.campaignId
                ? {
                    ...campaign,
                    imageUrl: data.url,
                  }
                : campaign
            ),
            isLoading: false,
          }));

          return data;
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
    }),
    {
      name: "campaign-storage",
    }
  )
);

export default useCampaignStore;
