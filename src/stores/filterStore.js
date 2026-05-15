import { defineStore } from "pinia";
import fieldMenuData from "../assets/data/fieldMenu.js";

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
      if (!this.showAdvancedFilter) {
        // Khởi tạo data cho filters trước khi mở popup
        fieldMenuData.forEach(col => {
          if (col.key && !this.columnFilters[col.key]) {
            this.setFilter(col.key, { operator: 'contains', value: '', active: false });
          }
        });
      }
      this.showAdvancedFilter = !this.showAdvancedFilter;
      console.log("toggleAdvancedFilter called, showAdvancedFilter is now:", this.showAdvancedFilter);
    }
  },
});
