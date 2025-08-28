import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAuthStore from "src/pages/auth/store";

const backednUrl = import.meta.env.VITE_BACKEND_API_URL;

const useAdminStore = create(
  persist(
    (set, get) => ({
      isLoading: false,
      error: null,
      fetchDashboardData: async () => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          const response = await fetch(`${backednUrl}/admins/`, {
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
            isLoading: false,
          });
          console.log(data);
          return data;
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
    }),
    {
      name: "admin-storage",
    }
  )
);

export default useAdminStore;
