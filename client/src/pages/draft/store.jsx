// Zustand and Middleware
import { create } from "zustand";
import { persist } from "zustand/middleware";

// State Management
import useAuthStore from "src/pages/auth/store";

// Environment Variables
const backednUrl = import.meta.env.VITE_BACKEND_API_URL;

const useDraftStore = create(
  persist(
    (set, get) => ({
      campaigns: [],
      isLoading: false,
      error: null,

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
            isLoading: false,
          });
          return data;
        } catch (error) {
          console.error("Error fetching campaign draft:", error);
          set({ error: error.message, isLoading: false });
        }
      },

      saveDraft: async (campaignId, title, description, goal, closeoutDate) => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();

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

          return data;

          set({ isLoading: false });
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

      shareDraft: async (
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
          if (data.draft == true) {
            set({ isLoading: false });
            return data;
          }

          set({ error: error, isLoading: false });
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
    }),
    {
      name: "draft-storage",
    }
  )
);

export default useDraftStore;
