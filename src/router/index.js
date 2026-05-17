import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../views/layouts/MainLayout.vue";
import InventoryPage from "../views/inventory/InventoryPage.vue";

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
          component: InventoryPage,
        },
        {
          path: "/inventory/add",
          name: "inventory-add",
          component: () => import("../views/inventory/InventoryDetail.vue"),
        },
        {
          path: "/inventory/edit/:id",
          name: "inventory-edit",
          component: () => import("../views/inventory/InventoryDetail.vue"),
        },
      ],
    },
  ],
});

export default router;
