import { create } from 'zustand';
import { persist } from 'zustand/middleware';



const useDonorStore = create(
  persist(
    (set, get) => ({
      first_name: null,
      last_name: null,
      isAuthenticated: false,
      userName: false,
      
      login: (jwtToken, permission,userName) => {
        set({ 
          jwtToken,
          permission,
          userName,
          isAuthenticated: true 
        });
      },
      
      logout: () => {
        set({ 
          jwtToken: null,
          permission: null,
          userName: '',
          isAuthenticated: false 

        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        jwtToken: state.jwtToken,
        permission: state.permission,
        userName: state.userName,
        isAuthenticated: state.jwtToken !== null
      })
    }
  )
);

export default useDonorStore;