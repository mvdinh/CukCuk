<template>
  <div class="sidebar" :class="{ 'sidebar--collapsed ': isToggle }">
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

            <div class="sidebar__menu__item__text">
              {{ item.name }}
            </div>

            <div
              v-if="item.hasChildren"
              class="sidebar__menu__item__chevron"
            ></div>
          </div>
          <div v-if="item.hasDivider" class="sidebar__divider"></div>
        </template>
      </div>
      <div class="sidebar__toggle" @click="toggleSidebar">
        <div class="sidebar__toggle__icon"></div>
        <div class="sidebar__toggle__text">Thu gọn</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MsIcon from "./ms-icon/MsIcon.vue";
import { ref } from "vue";
import { listSidebar } from "../assets/data/sidebar";

// Resolve đường dẫn tới file SVG trong src/assets/image (Vite)

import MsButton from "./ms-button/MsButton.vue";

const isActive = ref(5);

// Tải tất cả các file SVG trong thư mục icons dưới dạng URL
const iconsGlob = import.meta.glob('../assets/icons/*.svg', { as: 'url', eager: true });

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
 * @param {number} index
 */
const toggleActive = (index) => {
  isActive.value = index;
};

const emit = defineEmits(["toggle"]);

const listItemSidebar = ref(listSidebar);
const isToggle = ref(false);

/**
 * Thu gọn hoặc mở rộng Sidebar
 */
const toggleSidebar = () => {
  isToggle.value = !isToggle.value;
  emit("toggle", isToggle.value);
};
</script>

<style lang="scss" scoped>
$sidebar-width: 200px;
$sidebar-collapsed-width: 64px;
$transition-speed: 0.25s;
$bg-dark: #0a1623;
$text-gray: #c5ccd5;

.sidebar {
  position: absolute;
  top: 48px;
  left: 0;
  bottom: 0;
  width: $sidebar-width;
  padding: 32px 0 16px 0;
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
        opacity: 1;
        transition: opacity $transition-speed ease;
      }

      &__chevron {
        width: 6px;
        height: 6px;
        border-right: 2px solid #5c6a82;
        border-bottom: 2px solid #5c6a82;
        transform: rotate(45deg);
        margin-left: auto;
        margin-right: 8px;
        transition: transform $transition-speed ease;
      }
    }
  }

  &__divider {
    height: 1px;
    background-color: #e5e8ec;
    margin: 4px 12px 16px 12px;
  }

  &__toggle {
    display: flex;
    height: 40px;
    align-items: center;
    margin: 0 12px;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 0 8px;
    cursor: pointer;
    flex-shrink: 0;
    transition: all $transition-speed ease;

    &__icon {
      width: 20px;
      height: 20px;
      -webkit-mask-image: url(https://amisplatform.misacdn.net/apps/recruit/assets/images/ICON.svg);
      -webkit-mask-position: -60px -696px;
      background-color: #555;
      transition: transform $transition-speed ease;
    }

    &__text {
      color: #1f1f1f;
      font-size: 14px;
      font-weight: 700;
      margin-left: 12px;
      white-space: nowrap;
    }
  }

  &--collapsed {
    width: $sidebar-collapsed-width;

    .sidebar__menu__item {
      padding: 8px;
      margin: 0 8px 12px 8px;
      justify-content: center;

      &__text {
        display: none;
        opacity: 0;
      }

      &__chevron {
        display: none;
      }
    }

    .sidebar__divider {
      margin: 4px 8px 16px 8px;
    }

    .sidebar__toggle {
      justify-content: center;
      padding: 0;

      &__text {
        display: none;
      }

      &__icon {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
