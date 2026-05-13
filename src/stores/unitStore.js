import { defineStore } from "pinia";
import httpClient from "../api/httpClient";

export const useUnitStore = defineStore("unit", {
  state: () => ({
    units: [],
    isLoading: false,
  }),
  actions: {
    async fetchUnits() {
      this.isLoading = true;
      try {
        const response = await httpClient.get("/units");
        this.units = response.data.listData || [];
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async addUnit(name) {
      const payload = { unitName: name };
      const res = await httpClient.post("/units", payload);
      await this.fetchUnits();
      return res.data;
    },
  },
});
