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

        setFirstName: (firstName) => set(() => ({ firstName: firstName })),
        setLastName: (lastName) => set(() => ({ lastName: lastName })),
        setEmail: (email) => set(() => ({ email: email })),
        setAmount: (amount) => set(() => ({ amount: amount })),
        setCurrency: (currency) => set(() => ({ currency: currency })),
        toggleEmailOptIn: () => set((state) => ({ emailOptIn: !state.emailOptIn })),
    },
    {
      name: 'donor-storage',
    }
  )
  )
);
  
  export default useDonorStore;

