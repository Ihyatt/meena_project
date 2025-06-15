import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CURRENCY_CODE from '../utils/constants';


// these are all sync
const useDonorStore = create(
    persist(
      (set, get) => ({
        firstName: '',
        lastName: '',
        email: '',
        emailOptIn: true,
        amount: 0.00,
        currency: CURRENCY_CODE.USD,
        
        setFirstName: (newFirstName) => set({ firstName: newFirstName }),
        setlastname:(newLastName) => set({ lastName: newLastName }),
        setEmail: (newEmail) => set({ email: newEmail }),
        setAmount: (newAmount) => set({ amount: newAmount }),
        toggleEmailOptIn: set((state) => ({ emailOptIn: !state.emailOptIn })),
        setCurrency: (newCurrency) => set({ currency: newCurrency }),
    },
    {
      name: 'donor-storage',
    }
  )
  )
);
  
  export default useDonorStore;

