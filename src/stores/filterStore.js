import { defineStore } from "pinia";

export const useFilterStore = defineStore("filter", {
  state: () => ({
    // Cấu trúc: { fieldKey: { operator: 'contains', value: '', active: false } }
    columnFilters: {},
    showAdvancedFilter: false,
  }),
  actions: {
    setFilter(key, { operator, value, active }) {
      this.columnFilters[key] = { 
        operator: operator || 'contains', 
        value: value !== undefined ? value : '', 
        active: active !== undefined ? active : true 
      };
    },
    removeFilter(key) {
      if (this.columnFilters[key]) {
        this.columnFilters[key].active = false;
        this.columnFilters[key].value = '';
      }
    },
    clearAll() {
      Object.keys(this.columnFilters).forEach(key => {
        this.columnFilters[key].active = false;
        this.columnFilters[key].value = '';
      });
    },
    toggleAdvancedFilter() {
      this.showAdvancedFilter = !this.showAdvancedFilter;
    }
  },
});
