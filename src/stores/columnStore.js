import { defineStore } from "pinia";
import fieldMenuData from "../assets/data/fieldMenu.js";

export const useColumnStore = defineStore("column", {
  state: () => ({
    inventoryColumns: [...fieldMenuData.map(f => ({ ...f, visible: true, width: 150, fixed: false }))],
    showConfig: false,
  }),
  actions: {
    toggleConfig() {
      this.showConfig = !this.showConfig;
    },
    updateColumns(newCols) {
      this.inventoryColumns = newCols;
    },
    resetColumns() {
      this.inventoryColumns = [...fieldMenuData.map(f => ({ ...f, visible: true, width: 150 }))];
    }
  },
});
