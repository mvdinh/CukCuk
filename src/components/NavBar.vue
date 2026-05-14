<template>
  <div class="navbar">
    <!-- LEFT -->
    <div class="navbar__left">
      <!-- LOGO -->
      <div class="navbar__left__logo">
        <!-- Grid -->
        <MsIcon :size="24" :webkitMaskImage="icons.navbar.grid_dots" />

        <!-- Logo -->
        <MsIcon
          :size="32"
          :webkitMaskImage="icons.navbar.CUKCUK"
          :isImage="true"
        />

        <!-- Name -->
        <div class="navbar__left__logo__name">MISA CukCuk</div>
      </div>

      <!-- RESTAURANT -->
      <div class="navbar__left__search">
        <h3>Nhà hàng Phở Phú Gia</h3>

        <div class="navbar__left__search__chevron"></div>
      </div>
    </div>

    <!-- RIGHT -->
    <div class="navbar__right">
      <!-- Setting -->
      <MsButton type="icon" @click="columnStore.toggleConfig()">
        <MsIcon :size="24" :webkitMaskImage="icons.navbar.settings" />
      </MsButton>

      <!-- AI -->
      <MsButton type="icon">
        <MsIcon
          :size="24"
          :webkitMaskImage="icons.navbar.AVA"
          :isImage="true"
        />
      </MsButton>

      <!-- Chat -->
      <MsButton type="icon" class="navbar__right__chat">
        <div class="navbar__right__chat__icon"></div>

        <div class="navbar__right__chat__new">20</div>
      </MsButton>

      <!-- Bell -->
      <MsButton type="icon">
        <MsIcon :size="24" :webkitMaskImage="icons.navbar.bell" />
      </MsButton>

      <!-- Help -->
      <MsButton type="icon">
        <MsIcon :size="24" :webkitMaskImage="icons.navbar.help" />
      </MsButton>

      <!-- Option -->
      <MsButton type="icon">
        <MsIcon :size="24" :webkitMaskImage="icons.navbar.dots_circle" />
      </MsButton>

      <!-- Avatar -->
      <MsButton type="icon">
        <div class="navbar__right__avatar"></div>
      </MsButton>
    </div>
  </div>
</template>

<script setup>
import { inject } from "vue";

import MsIcon from "./ms-icon/MsIcon.vue";
import MsButton from "./ms-button/MsButton.vue";
import { useColumnStore } from "../stores/columnStore";

const icons = inject("icons");
const columnStore = useColumnStore();
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  z-index: 999;

  height: 48px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: #2979ff;
  color: #ffffff;

  /* ================= LEFT ================= */

  &__left {
    display: flex;
    align-items: center;
    height: 100%;

    &__logo {
      display: flex;
      align-items: center;

      width: 233px;
      height: 100%;

      padding-left: 16px;
      gap: 12px;

      &__name {
        font-size: 18px;
        font-weight: 700;
        user-select: none;
      }
    }

    &__search {
      display: flex;
      align-items: center;

      margin-left: 16px;

      cursor: pointer;

      h3 {
        margin: 0;

        font-size: 14px;
        font-weight: 500;

        color: #ffffff;
      }

      &__chevron {
        width: 6px;
        height: 6px;

        margin-left: 8px;
        margin-bottom: 4px;

        border-right: 2px solid #ffffff;
        border-bottom: 2px solid #ffffff;

        transform: rotate(45deg);
      }
    }
  }

  /* ================= RIGHT ================= */

  &__right {
    display: flex;
    align-items: center;

    gap: 8px;

    margin-right: 20px;

    &__chat {
      position: relative;

      &__icon {
        width: 24px;
        height: 20px;

        background-image: url("https://amisplatform.misacdn.net/apps/recruit/assets/images/ICON.svg");
        background-position: -145px -610px;

        filter: brightness(0) invert(1);
      }

      &__new {
        position: absolute;
        top: 1px;
        right: -6px;

        min-width: 16px;
        height: 16px;

        padding: 0 4px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 999px;

        background-color: red;
        color: #ffffff;

        font-size: 10px;
        font-weight: 700;
      }
    }

    &__avatar {
      width: 30px;
      height: 30px;

      border-radius: 50%;

      background: url("https://avatarhub.edu.vn/wp-content/uploads/2025/12/avatar-mac-dinh-cua-fb-4.jpg")
        center / cover no-repeat;
    }
  }

  /* ================= ICON OVERRIDE ================= */

  :deep(.icon) {
    background-color: #ffffff !important;
  }

  /* icon image giữ nguyên màu */
  :deep(.icon--image) {
    background-color: transparent !important;
  }
}
</style>
