import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from "src/pages/auth/store";
import useAdminStore from "src/pages/admin/store";


const backednUrl = import.meta.env.VITE_BACKEND_API_URL;

const useCampaignStore = create(
    persist(
        (set, get) => ({
            isLoading: false,
            error: null,

            fetchCampaign: async (campaignId) => {
                set({ isLoading: true, error: null });
                try {
                    const { jwtToken } = useAuthStore.getState();
                    const response = await fetch(`${backednUrl}/admins/campaigns/${campaignId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'Content-Type': 'application/json'
                        }
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
                    const { campaigns } = useAdminStore.getState();

                    useAdminStore.setState({
                        campaigns: campaigns.map((item) =>
                            data.id === item.id ? {
                                ...item,
                                title: data.title,
                                imageUrl: data.imageUrl,
                                description: data.description,
                                isActive: data.isActive,
                                goal: data.goal,
                            } : item,
                        ),
                    });

                    set({
                        isLoading: false,
                    });
                    return data;
                } catch (error) {
                    set({ error: error, isLoading: false });
                }
            },
            launchCampaign: async (campaignId) => {
                const { jwtToken } = useAuthStore.getState();
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${backednUrl}/admins/campaigns/${campaignId}/launch`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        set({ error: data.message });
                    }

                    const { campaigns } = useAdminStore.getState();
                    const newCampaigns = campaigns
                        .filter(item => item.id !== data.id)
                        .map(item => ({ ...item, isActive: false }));
                    useAdminStore.setState({ campaigns: [...newCampaigns, { ...data }] });
                    set({ isLoading: false });
                } catch (error) {
                    set({ error: error, isLoading: false });
                }
            },
            closeCampaign: async (campaignId) => {
                set({ isLoading: true, error: null });
                try {
                    const { jwtToken } = useAuthStore.getState();
                    const response = await fetch(`${backednUrl}/admins/campaigns/${campaignId}/close`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        set({ error: data.message });
                    }
                    const { campaigns } = useAdminStore.getState();
                    useAdminStore.setState({
                        campaigns: campaigns.map((item) =>
                            data.id === item.id ? {
                                ...item,
                                isActive: data.isActive,
                            } : item,
                        ),
                    });
                    set({
                        isLoading: false,
                    });
                    useAdminStore.setState({
                        campaigns: campaigns.map((item) =>
                            data.id === item.id ? {
                                ...item,
                                isActive: data.isActive,
                            } : item,
                        ),
                    });
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
                    const { campaigns } = useAdminStore.getState();
                    useAdminStore.setState({
                        campaigns: campaigns.map((item) =>
                            campaignId == item.id ? {
                                ...item,
                                imageUrl: data.url,
                            } : item,
                        ),

                    });

                    set({ isLoading: false, })

                } catch (error) {
                    set({ error: error, isLoading: false });
                }
            },
        }),
        {
            name: 'campaign-storage',
        }
    )
);

export default useCampaignStore;

