import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CURRENCY_CODE from '../utils/constants';


// these are all sync
export const useDonorStore = create(
  persist(
    (set) => ({
      // State
      fullName: 'hello',
      email: '',
      emailOptIn: true,
      amount: 0.0,
      currency: 'usd',
      setFullName: (newFullName) => set({ fullName: newFullName }),
      setEmail: (email) => set({ email }),
      setAmount: (amount) => set({ amount }),
      setCurrency: (currency) => set({ currency }),
      toggleEmailOptIn: () => set((state) => ({ emailOptIn: !state.emailOptIn })),
    }),
    {
      name: 'donor-storage', // LocalStorage key
    }
  )
);