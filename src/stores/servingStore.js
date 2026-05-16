import { defineStore } from "pinia";
import httpClient from "../api/httpClient";

export const useServingStore = defineStore("serving", {
  state: () => ({
    preferences: [
      { id: 1, name: "Ít cay", price: 0 },
      { id: 2, name: "Không hành", price: 0 },
      { id: 3, name: "Thêm phomai", price: 5000 },
    ],
    isLoading: false,
  }),
  actions: {
    async fetchPreferences() {
      this.isLoading = true;
      try {
        const response = await httpClient.get("/additions");
        this.preferences = response.data.listData || (Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async addPreference(preference) {
      try {
        const response = await httpClient.post("/additions", preference);
        this.preferences.push(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
