import { defineStore } from 'pinia';
import httpClient from '../api/httpClient';

export const useInventoryItemStore = defineStore('inventoryItem', {
  state: () => ({
    item: {},
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchItem(id) {
      this.isLoading = true;
      try {
        const response = await httpClient.get(`/inventory/${id}`);
        this.item = response.data;
      } catch (error) {
        this.error = error;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async saveItem(data, isEdit = false) {
      this.isLoading = true;
      try {
        if (isEdit) {
          await httpClient.put(`/inventory/${data.inventoryItemID}`, data);
        } else {
          await httpClient.post('/inventory', data);
        }
      } catch (error) {
        this.error = error;
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
