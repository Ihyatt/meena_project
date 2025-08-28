import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAuthStore from "src/pages/auth/store";

const backednUrl = import.meta.env.VITE_BACKEND_API_URL;

const useDonorStore = create(
  persist(
    (set, get) => ({
      donors: [],
      fullName: "",
      emailAddress: "",
      emailSubscriptionStatus: "",
      isLoading: false,
      error: null,
      setFullName: (fullName) => set({ fullName }),
      setEmailAddress: (emailAddress) => set({ emailAddress }),
      setEmailSubscriptionStatus: (emailSubscriptionStatus) =>
        set({ emailSubscriptionStatus }),

      fetchDonors: async () => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          const response = await fetch(`${backednUrl}/admins/donors/`, {
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
            donors: data || [],
            isLoading: false,
          });
          return data;
        } catch (error) {
          set({ error: error, isLoading: false });
        }
      },
      fetchDonor: async (donorId) => {
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          const response = await fetch(
            `${backednUrl}/admins/donors/${donorId}`,
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
      manageDonorData: async (donorId) => {
        const state = get();
        const { emailAddress, fullName, emailSubscriptionStatus } = state;
        set({ isLoading: true, error: null });
        try {
          const { jwtToken } = useAuthStore.getState();
          const response = await fetch(
            `${backednUrl}/admins/donors/${donorId}/manage`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                emailAddress,
                fullName,
                emailSubscriptionStatus,
              }),
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
      name: "donor-storage",
    }
  )
);

export default useDonorStore;
