import { defineStore } from 'pinia';
import httpClient from '../api/httpClient';

export const useKitchenStore = defineStore('kitchen', {
  state: () => ({
    kitchens: [],
    isLoading: false,
  }),
  actions: {
    async fetchKitchens() {
      this.isLoading = true;
      try {
        const response = await httpClient.get('/kitchen');
        this.kitchens = response.data || [];
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
});
