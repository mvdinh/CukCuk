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
      // Mocking fetch
      return this.preferences;
    },
    async addPreference(preference) {
      this.preferences.push(preference);
      return preference;
    },
  },
});
