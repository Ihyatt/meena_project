import { create } from 'zustand';
import { persist } from 'zustand/middleware';


const backednUrl = import.meta.env.VITE_BACKEND_API_URL;



const useAuthStore = create(
  persist(
    (set, get) => ({
      jwtToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (emailAddress, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${backednUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailAddress, password }),
          });
          const data = await response.json();
          if (!response.ok) {
            set({ error: data.message });
          }
          if (data.status !== 'success') {
            set({ error: data.message });
            return false;
          }
          set({
            jwtToken: data.jwtToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({ error: error, isLoading: false });
          return false;
        }

      },
      logout: () => {
        set({
          jwtToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;