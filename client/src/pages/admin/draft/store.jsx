import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from "src/pages/auth/store";
import useAdminStore from "src/pages/admin/store";


const backednUrl = import.meta.env.VITE_BACKEND_API_URL;
const useDraftStore = create(
    persist(
        (set, get) => ({
            isLoading: false,
            error: null,

            fetchCampaignDraft: async () => {
                set({ isLoading: true, error: null });
                try {
                    const { jwtToken } = useAuthStore.getState();
                    const response = await fetch(`${backednUrl}/admins/campaigns/drafts`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        set({ error: data.message });
                    }
                    set({
                        isLoading: false,
                    });
                    return data;
                } catch (error) {
                    set({ error: error, isLoading: false });
                }
            },
            shareCampaignDraft: async (campaignId, title, description, goal) => {
                set({ isLoading: true, error: null });
                try {
                    const { jwtToken } = useAuthStore.getState();
                    const response = await fetch(`${backednUrl}/admins/campaigns/${campaignId}/share`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'Content-Type': 'application/json',
                        },
                        'body': JSON.stringify({ title, description, goal }),
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        set({ error: data.message });
                    }
                    const { campaigns } = useAdminStore.getState();
                    useAdminStore.setState({ campaigns: [...campaigns, { ...data }] });
                    set({
                        isLoading: false,
                    });
                } catch (error) {
                    set({ error: error, isLoading: false });
                }
            },
            saveCampaign: async (campaignId, title, description, goal) => {
                set({ isLoading: true, error: null });
                try {
                    const { jwtToken } = useAuthStore.getState();
                    const response = await fetch(`${backednUrl}/admins/campaigns/${campaignId}/save`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'Content-Type': 'application/json',
                        },
                        'body': JSON.stringify({ title, description, goal }),
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        set({ error: data.message });
                    }
                    set({
                        isLoading: false,
                    });
                    return data;
                } catch (error) {
                    set({ error: error, isLoading: false });
                }
            },
            upload: async (campaignId, file) => {
                set({ isLoading: true, error: null });
                try {
                    const { jwtToken } = useAuthStore.getState();
                    const fd = new FormData()
                    fd.append('file', file)
                    const response = await fetch(`${backednUrl}/admins/campaigns/${campaignId}/upload`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                        },
                        body: fd,
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        set({ error: data.message });
                    }
                    set({
                        isLoading: false,
                    });
                    return data;
                } catch (error) {
                    set({ error: error, isLoading: false });
                }
            },
        }), {
        name: 'draft-storage',
    }
    )
);

export default useDraftStore;

