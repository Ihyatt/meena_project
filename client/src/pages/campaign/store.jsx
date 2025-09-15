// Zustand and Middleware
import { create } from "zustand";
import { persist } from "zustand/middleware";

// State Management
import useAuthStore from "src/pages/auth/store";

// Environment Variables
const backednUrl = import.meta.env.VITE_BACKEND_API_URL;

const useManageCampaignStore = create(
  persist(
    (set, get) => ({
      title: "",
      description: "",
      goal: 0,
      closeoutDate: null,
      imageUrl: "",
      isLoading: false,
      error: null,
      setTitle: (title) => set({ title }),
      setDescription: (description) => set({ description }),
      setGoal: (goal) => set({ goal }),
      setCloseoutDate: (closeoutDate) => set({ closeoutDate }),
      setImageUrl: (imageUrl) => set({ imageUrl }),

      fetchDraft: async () => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          const response = await fetch(`${backednUrl}/admins/campaigns/draft`, {
            method: "POST",
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
            title: data.title || "",
            description: data.description || "",
            goal: data.goal || 0,
            closeoutDate: null,
            imageUrl: "",
            isLoading: false,
          });
          return data.id;
        } catch (error) {
          console.error("Error fetching campaign draft:", error);
          set({ error: error.message, isLoading: false });
        }
      },

      saveDraft: async () => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          const { title, description, goal, closeoutDate } = get();

          const response = await fetch(
            `${backednUrl}/admins/campaigns/${campaignId}/save-draft`,
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

          set({
            title: data.title || "",
            description: data.description || "",
            goal: data.goal || 0,
            closeoutDate: null,
            imageUrl: "",
            isLoading: false,
          });
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

          set({ isLoading: false });

          return data;
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },

      shareDraft: async () => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();

          const response = await fetch(
            `${backednUrl}/admins/campaigns/${campaignId}/share-draft`,
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

          set({ error: error, isLoading: false });
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
      saveCampaign: async (campaignId) => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();

          const response = await fetch(
            `${backednUrl}/admins/campaigns/${campaignId}/save`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ title, description, goal }),
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
    }),
    {
      name: "manage-campaign-storage",
    }
  )
);

export default useManageCampaignStore;
