<template>
  <button
    class="ms-button"
    :class="[`ms-button--${type}`]"
    @click="$emit('click')"
  >
    <MsIcon
      v-if="icon"
      :size="iconSize"
      :webkitMaskImage="icon.url"
      :x="icon.x"
      :y="icon.y"
      :color="icon.color"
    />

    <span v-if="text" class="ms-button__text">{{ text }}</span>

    <slot></slot>
  </button>
</template>

<script setup>
import MsIcon from "../ms-icon/MsIcon.vue";

defineProps({
  text: {
    type: String,
    default: "",
  },

  icon: {
    type: Object,
    default: null,
  },

  iconSize: {
    type: Number,
    default: 16,
  },

  iconOnly: {
    type: Boolean,
    default: false,
  },

  type: {
    type: String,
    default: "primary",
  },
});

defineEmits(["click"]);
</script>

<style scoped>
.ms-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  border: none;
  cursor: pointer;
  outline: none;

  font-family: inherit;
  font-size: 14px;

  background-color: transparent;
  padding: 0;

  transition:
    background-color 0.25s ease,
    color 0.25s ease;
}

/* Button Types */
.ms-button--primary {
  background-color: #2680eb;
  color: #fff;
  padding: 0 16px;
  height: 32px;
}

.ms-button--primary:hover {
  background-color: #1a6ac7;
}

.ms-button--secondary {
  background-color: #fff;
  color: #1f1f1f;
  border: 1px solid #e0e0e0;
  padding: 0 16px;
  height: 32px;
}

.ms-button--secondary:hover {
  background-color: #f2f2f2;
}

.ms-button--icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  padding: 0;
  overflow: hidden;
}

.ms-button--icon:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.ms-button--icon-only {
  padding: 0;
  width: 36px;
  height: 36px;
}

.ms-button__text {
  display: flex;
  align-items: center;
}

.ms-button__icon--centered {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: 0;
  line-height: 1;
}
</style>
