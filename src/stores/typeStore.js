import { defineStore } from "pinia";
import httpClient from "../api/httpClient";

export const useTypeStore = defineStore("type", {
  state: () => ({
    types: [],
    isLoading: false,
  }),
  actions: {
    async fetchTypes() {
      this.isLoading = true;
      try {
        const response = await httpClient.get("/types");
        this.types = response.data.listData || [];
      } catch (error) {
        console.error("Error fetching types:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
