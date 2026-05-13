import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../views/MainLayout.vue";
import Lich from "../views/Lich.vue";
import InventoryList from "../views/InventoryList.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MainLayout,
      children: [
        {
          path: "/",
          name: "inventory",
          component: InventoryList,
        },
        {
          path: "/lich",
          name: "lich",
          component: Lich,
        },
        {
          path: "/inventory/add",
          name: "inventory-add",
          component: () => import("../views/InventoryForm.vue"),
        },
        {
          path: "/inventory/edit/:id",
          name: "inventory-edit",
          component: () => import("../views/InventoryForm.vue"),
        },
      ],
    },
  ],
});

export default router;
