import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from "src/pages/auth/store";


const backednUrl = import.meta.env.VITE_BACKEND_API_URL;

const useEmailStore = create(
    persist(
        (set, get) => ({
            subject: '',
            isLoading: false,
            templateId: '',
            error: null,

            setSubject: (subject) => set({ subject }),
            setTemplateId: (templateId) => set({ templateId }),


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
                        templateId: data.templateId,
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
                    const { subject, templateId } = state;
                    console.log(subject, templateId)

                    const response = await fetch(`${backednUrl}/admins/emails/email-template/save`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'Content-Type': 'application/json',
                        },
                        'body': JSON.stringify({ emailType, subject, templateId }),
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        set({ error: data.message, isLoading: false });
                    }
                    set({
                        subject: data.subject,
                        templateId: data.templateId,
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






