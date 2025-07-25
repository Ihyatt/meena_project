import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from "src/stores/Auth";


const backednUrl = import.meta.env.VITE_BACKEND_API_URL;

const useEmailStore = create(
    persist(
        (set, get) => ({
            emailAddress: '',
            subject: '',
            body: '',
            isLoading: false,
            error: null,

            setEmailAddress: (emailAddress) => set({ emailAddress }),
            setSubject: (subject) => set({ subject }),
            setBody: (body) => set({ body }),

            unsubscribe: async (emailAddress) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${backednUrl}/admins/emails/unsubscribe`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        'body': JSON.stringify({ emailAddress }),
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        set({ error: data.message, isLoading: false });
                    }
                    set({
                        emailAddress: '',
                        isLoading: false,
                    });
                } catch (error) {
                    set({ error: error, isLoading: false });
                }
            },
            fetchEmailTemplate: async (emailType) => {
                set({ isLoading: true, error: null });
                try {
                    const { jwtToken } = useAuthStore.getState();
                    const response = await fetch(`${backednUrl}/admins/emails/email-template`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'Content-Type': 'application/json',
                        },
                        'body': JSON.stringify({ emailType }),
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        set({ error: data.message, isLoading: false });
                    }
                    set({
                        subject: data.subject,
                        body: data.body,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ error: error, isLoading: false });
                }
            },
            saveEmailTemplate: async (emailType) => {
                set({ isLoading: true, error: null });
                try {
                    const { jwtToken } = useAuthStore.getState();
                    const state = get();
                    const { subject, body } = state;
                    const response = await fetch(`${backednUrl}/admins/emails/email-template/save`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'Content-Type': 'application/json',
                        },
                        'body': JSON.stringify({ emailType, subject, body, }),
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        set({ error: data.message, isLoading: false });
                    }
                    set({
                        subject: data.subject,
                        body: data.body,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ error: error, isLoading: false });
                }
            },
        }),
        {
            name: 'email-storage',
        }
    )
);

export default useEmailStore;






