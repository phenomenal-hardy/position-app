import { httpClient } from "./httpClient";

export default {

    async fetchDashboard(payload: { userId: number | null }) {

        return httpClient.get('dashboard', {
            params: payload,
        });
    },
    async saveUserInput(payload: {
        userId: number | null,
        chartDate: string | undefined,
        chartAmount: number | undefined
    }) {

        return httpClient.post('dashboard/save-user-input', payload);
    }
}