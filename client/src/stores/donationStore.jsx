import { create } from 'zustand';
import { persist } from 'zustand/middleware';


const donationStore = create(
  persist(
    (set, get) => ({
      amount: 0.0,
      firstName: "",
      lastName: "",
      currency: "USD",
    }),
    {
      name: 'donation-storage',
      partialize: (state) => ({ 
        amount: state.amount,
        firstName: state.firstName,
        lastName: state.lastName,
        currency: state.currency
      })
    }
  )
);

export default donationStore;