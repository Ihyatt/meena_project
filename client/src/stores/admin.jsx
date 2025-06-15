import { create } from 'zustand';
import { persist } from 'zustand/middleware';


const backednUrl = import.meta.env.VITE_BACKEND_API_URL;


const useAuthStore = create(
  persist(
    (set, get) => ({
      jwtToken: null,
      isAuthenticated: false,
      login: async() => {
        const response = await fetch(`${backendUrl}/login`); 
        const data = await response.json();
        set({ 
          jwtToken:data.jwtToken,
          isAuthenticated: true 
        });
      },
      logout: () => {
        set({ 
          jwtToken: null,
          isAuthenticated: false 
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;