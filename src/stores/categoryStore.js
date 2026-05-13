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
        const response = await httpClient.get('/categories');
        this.categories = response.data.listData || [];
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async addCategory(name) {
      const payload = { inventoryItemCategoryName: name, inventoryItemCategoryCode: `CAT-${Date.now()}` };
      const res = await httpClient.post('/categories', payload);
      await this.fetchCategories();
      return res.data;
    }
  }
});
