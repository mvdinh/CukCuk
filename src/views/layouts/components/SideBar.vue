<template>
  <div class="sidebar" :class="{ 'sidebar--collapsed': isToggle }">
    <div class="sidebar__menu">
      <template v-for="(item, index) in listItemSidebar" :key="index">
        <div
          class="sidebar__menu__item"
          :class="{ 'sidebar__menu__item--active': isActive === index }"
          @click="toggleActive(index)"
        >
          <!--Icon active -->
          <MsIcon
            v-if="isActive === index"
            :x="item.icon.x"
            :y="item.icon.y"
            color="#2979ff"
            :size="item.icon.size || 20"
            :webkitMaskImage="getIconUrl(item.icon.url)"
            :isImage="item.icon.isImage"
            class="sidebar__menu__item__icon"
          />
          <!--Icon inactive -->
          <MsIcon
            v-else
            :x="item.icon.x"
            :y="item.icon.y"
            color="#5c6a82"
            :size="item.icon.size || 20"
            :webkitMaskImage="getIconUrl(item.icon.url)"
            :isImage="item.icon.isImage"
            class="sidebar__menu__item__icon"
          />
          <div class="sidebar__menu__item__text">{{ item.name }}</div>
          <MsIcon
            v-if="item.hasChildren"
            :x="0"
            :y="0"
            :color="isActive === index ? '#2979ff' : '#717680'"
            :size="16"
            :webkitMaskImage="icons.chevon_down"
            class="sidebar__menu__item__chevron"
          />
        </div>
        <div v-if="item.hasDivider" class="sidebar__divider"></div>
      </template>
    </div>

    <!-- Toggle button: góc dưới bên phải sidebar -->
    <button class="sidebar__toggle-btn" @click="toggleSidebar">
      <MsIcon
        :webkitMaskImage="icons.sidebar.swap"
        :x="0"
        :y="4"
        :size="20"
        color="#1f1f1f"
        class="sidebar__toggle-btn__icon"
      />
    </button>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import MsIcon from "../../../components/common/ms-icon/MsIcon.vue";
import { listSidebar } from "../../../assets/data/sidebar";
const icons = inject("icons");
const isActive = ref(5);
const isToggle = ref(false);
const listItemSidebar = ref(listSidebar);

const emit = defineEmits(["toggle"]);

// Tải tất cả các file SVG trong thư mục icons dưới dạng URL
const iconsGlob = import.meta.glob("../../../assets/icons/*.svg", {
  as: "url",
  eager: true,
});

/**
 * Hàm tự động resolve đường dẫn ảnh SVG bằng Vite
 */
const getIconUrl = (iconUrl) => {
  if (!iconUrl) return undefined;
  if (iconUrl.startsWith("http")) return iconUrl;
  const path = `../../../assets/icons/${iconUrl}`;
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
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width $transition-speed ease;
  box-sizing: border-box;

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
      // Dùng translate thay vì transform-origin để xoay tại chỗ, không lệch
      transition: transform $transition-speed ease;
      flex-shrink: 0;
    }
  }

  &__menu {
    flex: 1;
    overflow-y: auto;
    margin-top: 16px;

    &::-webkit-scrollbar {
      display: none;
    }

    &__item {
      width: 168px;
      height: 32px;
      margin: 0 16px 8px;
      display: flex;
      align-items: center;
      border-radius: 4px;
      padding: 6px 12px 6px 6px;
      box-sizing: border-box;
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

      // Icon luôn giữ nguyên kích thước, không bị margin hay translate lệch
      &__icon {
        flex-shrink: 0;
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
        margin-left: auto;
        opacity: 1;
        transition: opacity $transition-speed ease;
      }
    }
  }

  &__divider {
    height: 1px;
    background-color: #e5e8ec;
    margin: 4px 16px 12px 16px;
  }

  &--collapsed {
    width: $sidebar-collapsed-width;

    .sidebar__menu__item {
      width: 32px !important;

      &__text {
        display: none !important;
      }

      &__chevron {
        display: none !important;
      }
    }


    // Khi xoay 180 độ, icon vẫn căn giữa vì button dùng flexbox center
    .sidebar__toggle-btn__icon {
      transform: rotate(180deg);
    }
  }
}
</style>
