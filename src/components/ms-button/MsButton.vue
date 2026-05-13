<template>
  <button
    class="ms-button"
    :class="[
      `ms-button--${type}`, 
      { 'ms-button--icon-only': iconOnly }
    ]"
    @click="$emit('click')"
  >
    <div v-if="icon" class="ms-button__icon" :class="icon"></div>
    <div v-if="text" class="ms-button__text">{{ text }}</div>
    <slot></slot>
  </button>
</template>

<script setup>

defineProps({
  text: { type: String, default: "" },
  icon: { type: String, default: "" }, 
  iconOnly: { type: Boolean, default: false },
  type: {
    type: String,
    default: "primary",
  }
});
defineEmits(["click"]);
</script>

<style scoped>
.ms-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  background-color: transparent;
  padding: 0;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.ms-button--primary {
  background-color: #2680eb;
  color: #fff;
  border-radius: 4px;
  padding: 0 16px;
  height: 36px;
}
.ms-button--primary:hover {
  background-color: #1a6ac7;
}

.ms-button--secondary {
  background-color: #fff;
  color: #1f1f1f;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0 16px;
  height: 36px;
}
.ms-button--secondary:hover {
  background-color: #f2f2f2;
}

.ms-button--icon {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ms-button--icon:hover {
  background-color: #0000001a;
}
</style>
