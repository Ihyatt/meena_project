import { create } from 'zustand';
import { persist } from 'zustand/middleware';



const useAuthStore = create(
  persist(
    (set, get) => ({
      jwtToken: null,
      isAuthenticated: false,
      login: (jwtToken) => {
        set({ 
          jwtToken,
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
      partialize: (state) => ({ 
        jwtToken: state.jwtToken,
        isAuthenticated: state.jwtToken !== null
      })
    }
  )
);

export default useAuthStore;