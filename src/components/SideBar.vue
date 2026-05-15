<template>
  <div class="sidebar" :class="{ 'sidebar--collapsed': isToggle }">
    <div class="sidebar_bg">
      <div class="sidebar__menu">
        <template v-for="(item, index) in listItemSidebar" :key="index">
          <div
            class="sidebar__menu__item"
            :class="{ 'sidebar__menu__item--active': isActive === index }"
            @click="toggleActive(index)"
          >
            <MsIcon
              v-if="isActive === index"
              :x="item.icon.x"
              :y="item.icon.y"
              color="#2979ff"
              :size="item.icon.size || 24"
              :webkitMaskImage="getIconUrl(item.icon.url)"
            />
            <MsIcon
              v-else
              :x="item.icon.x"
              :y="item.icon.y"
              color="#5c6a82"
              :size="item.icon.size || 24"
              :webkitMaskImage="getIconUrl(item.icon.url)"
            />
            <div class="sidebar__menu__item__text">{{ item.name }}</div>
            <div
              v-if="item.hasChildren"
              class="sidebar__menu__item__chevron"
            ></div>
          </div>
          <div v-if="item.hasDivider" class="sidebar__divider"></div>
        </template>
      </div>
    </div>

    <!-- Toggle button: góc dưới bên phải sidebar -->
    <button class="sidebar__toggle-btn" @click="toggleSidebar">
      <MsIcon
        :webkitMaskImage="icons.sidebar.swap"
        :x="0"
        :y="0"
        :size="20"
        color="#1f1f1f"
      />
    </button>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import MsIcon from "./ms-icon/MsIcon.vue";
import { listSidebar } from "../assets/data/sidebar";

const icons = inject("icons");
const isActive = ref(5);
const isToggle = ref(false);
const listItemSidebar = ref(listSidebar);

const emit = defineEmits(["toggle"]);

// Tải tất cả các file SVG trong thư mục icons dưới dạng URL
const iconsGlob = import.meta.glob("../assets/icons/*.svg", {
  as: "url",
  eager: true,
});

/**
 * Hàm tự động resolve đường dẫn ảnh SVG bằng Vite
 */
const getIconUrl = (iconUrl) => {
  if (!iconUrl) return undefined;
  if (iconUrl.startsWith("http")) return iconUrl;
  const path = `../assets/icons/${iconUrl}`;
  return iconsGlob[path] || new URL(path, import.meta.url).href;
};

/**
 * Thay đổi trạng thái active của menu item
 */
const toggleActive = (index) => {
  isActive.value = index;
};

/**
 * Thu gọn hoặc mở rộng Sidebar
 */
const toggleSidebar = () => {
  isToggle.value = !isToggle.value;
  emit("toggle", isToggle.value);
};
</script>

<style lang="scss">
$sidebar-width: 200px;
$sidebar-collapsed-width: 64px;
$transition-speed: 0.25s;

.sidebar {
  position: absolute;
  top: 48px;
  left: 0;
  bottom: 0;
  width: $sidebar-width;
  color: black;
  background-size: cover;
  overflow: hidden;
  transition: width $transition-speed ease;

  .sidebar_bg {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 16px 0;
    background: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__toggle-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 40px;
    height: 40px;
    border-radius: 8px 0 0 0;
    border: 1px solid #e0e0e0;
    background: #e9eaeb;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: background-color $transition-speed ease;

    &:hover {
      background-color: #f2f2f2;
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transform-origin: center center;
      transition: transform $transition-speed ease;
    }
  }

  &__menu {
    flex: 1;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    &__item {
      height: 38px;
      display: flex;
      align-items: center;
      border-radius: 4px;
      padding: 0 12px;
      margin: 0 8px 4px 8px;
      cursor: pointer;
      transition: all $transition-speed ease;

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      &--active {
        background-color: #eaf1fb !important;

        .sidebar__menu__item__text {
          color: #2979ff !important;
          font-weight: 700;
        }
      }

      &__text {
        color: #1f1f1f;
        margin-left: 12px;
        font-weight: 500;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        opacity: 1;
        max-width: 200px;
        transition:
          opacity $transition-speed ease,
          max-width $transition-speed ease,
          margin-left $transition-speed ease;
      }

      &__chevron {
        width: 6px;
        height: 6px;
        border-right: 2px solid #5c6a82;
        border-bottom: 2px solid #5c6a82;
        transform: rotate(45deg);
        margin-left: auto;
        margin-right: 8px;
        opacity: 1;
        transition: opacity $transition-speed ease;
      }
    }
  }

  &__divider {
    height: 1px;
    background-color: #e5e8ec;
    margin: 4px 12px 16px 12px;
  }

  &--collapsed {
    width: $sidebar-collapsed-width;

    .sidebar__menu__item {
      &__text {
        opacity: 0;
        max-width: 0;
        margin-left: 0;
      }

      &__chevron {
        opacity: 0;
      }
    }

    .sidebar__divider {
      margin: 4px 8px 16px 8px;
    }

    .sidebar__toggle-btn__icon {
      transform: rotate(180deg);
    }
  }
}
</style>
