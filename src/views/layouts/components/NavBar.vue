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
        <div class="navbar__left__name">MISA CukCuk</div>
      </div>

      <!-- RESTAURANT -->
      <div class="navbar__left__restaurant">
        <h3>Nhà hàng Phở Phú Gia</h3>

        <MsIcon
          :x="0"
          :y="0"
          :color="'#717680'"
          :size="16"
          :webkitMaskImage="icons.chevon_down"
          class="sidebar__menu__item__chevron"
        />
      </div>
    </div>

    <!-- RIGHT -->
    <div class="navbar__right">
      <!-- Setting -->
      <MsButton type="icon" @click="columnStore.toggleConfig()">
        <MsIcon
          :size="24"
          :x="3"
          :y="3"
          :webkitMaskImage="icons.navbar.settings"
        />
      </MsButton>

      <!-- AI -->
      <MsButton type="icon">
        <MsIcon
          :x="2"
          :y="2"
          :size="24"
          :webkitMaskImage="icons.navbar.AVA"
          :isImage="true"
        />
      </MsButton>

      <!-- Chat -->
      <div>
        <MsButton type="icon">
          <MsIcon
            :x="3"
            :y="3"
            :size="24"
            :webkitMaskImage="icons.navbar.chat"
          />
        </MsButton>
        <div class="navbar__right__chat__new">20</div>
      </div>

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

import MsIcon from "../../../components/common/ms-icon/MsIcon.vue";
import MsButton from "../../../components/common/ms-button/MsButton.vue";
import { useColumnStore } from "../../../stores/columnStore";

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

  // Left
  &__left {
    height: 32px;
    display: flex;
    align-items: center;
    margin: 8px 0px 8px 16px;

    &__logo {
      display: flex;
      align-items: center;
      height: 100%;
      gap: 12px;
    }
    &__name {
      font-size: 20px;
      line-height: 28px;
      font-weight: 600;
      user-select: none;
    }

    &__restaurant {
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
  // Right
  &__right {
    display: flex;
    align-items: center;
    height: 32px;
    gap: 8px;
    margin-right: 20px;
    &__chat__new {
      position: relative;
      position: absolute;
      top: 6px;
      right: 170px;
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
    &__avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: url("https://avatarhub.edu.vn/wp-content/uploads/2025/12/avatar-mac-dinh-cua-fb-4.jpg")
        center / cover no-repeat;
    }
  }
  :deep(.icon:not(.icon--image)) {
    background-color: #ffffff !important;
  }
}
</style>
