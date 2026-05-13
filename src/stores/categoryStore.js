import { defineStore } from 'pinia';
import httpClient from '../api/httpClient';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    isLoading: false,
  }),
  actions: {
    async fetchCategories() {
      this.isLoading = true;
      try {
        const response = await httpClient.get('/inventoryItemCategory');
        this.categories = response.data || [];
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async addCategory(name) {
      const payload = { inventoryItemCategoryName: name, inventoryItemCategoryCode: `CAT-${Date.now()}` };
      const res = await httpClient.post('/inventoryItemCategory', payload);
      await this.fetchCategories();
      return res.data;
    }
  }
});
