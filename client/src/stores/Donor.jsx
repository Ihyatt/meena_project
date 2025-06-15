import { create } from 'zustand';
import { persist } from 'zustand/middleware';


const useDonorStore = create(
    persist(
      (set, get) => ({
        firstName: '',
        lastName: '',
        email: '',
        emailOptIn: true,
        amount: 0.00,
        currency: 'usd',//make this to enum
        
        setFirstName: (newFirstName) => set({ firstName: newFirstName }),
        setlastname:(newLastName) => set({ lastName: newLastName }),
        setEmail: (newEmail) => set({ email: newEmail }),
        setAmount: (newAmount) => set({ amount: newAmount }),
        setEmailOptIn: (newEmailOptIn) => set({ emailOptIn: newEmailOptIn }),
        setCurrency: (newCurrency) => set({ currency: newCurrency }),
    }),
      {
        name: 'donor-storage',
        partialize: (state) => ({ 
          firstName: state.firstName,
          lastName: state.lastName,
          email: state.email,
          emailOptIn: state.emailOptIn,
          amount: state.amount,
          currency: state.currency,//make this to enum
        })
      }
    )
  );
  
  export default useDonorStore;

