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
        // Construct standard payload
        const payload = { ...data };

        // Convert kitchenIDs to kitchens array of objects
        if (data.kitchenIDs) {
          payload.kitchens = data.kitchenIDs.map(id => ({ kitchenID: id }));
          delete payload.kitchenIDs;
        }

        // Convert servingPreferences to additions array of objects (defensive mapping for additions/addtions)
        if (data.servingPreferences) {
          const mappedAdditions = data.servingPreferences
            .filter(pref => pref.preferenceID)
            .map(pref => ({
              inventoryItemAdditionID: pref.preferenceID,
              additionID: pref.preferenceID,
              extraPrice: pref.price || 0,
              price: pref.price || 0
            }));
          
          payload.additions = mappedAdditions;
          payload.addtions = mappedAdditions; // Defensive copy in case of backend typo
          delete payload.servingPreferences;
        }

        if (isEdit) {
          await httpClient.put(`/inventory/${payload.inventoryItemID}`, payload);
        } else {
          await httpClient.post('/inventory', payload);
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
