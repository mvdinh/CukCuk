<template>
  <div
    class="icon"
    :class="{ 'icon--image': isImage }"
    :style="iconStyle"
    :title="name"
  ></div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: String,

  x: Number,
  y: Number,

  size: {
    type: Number,
    default: 22,
  },

  color: {
    type: String,
    default: "#666",
  },

  webkitMaskImage: {
    type: String,
    default:
      "https://amisplatform.misacdn.net/apps/recruit2/assets/images/ICON.svg",
  },

  isImage: {
    type: Boolean,
    default: false,
  },
});

const baseStyle = {
  width: `${props.size}px`,
  height: `${props.size}px`,
  minWidth: `${props.size}px`,

  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundSize: "contain",
};

const iconStyle = computed(() => {
  // IMAGE
  if (props.isImage) {
    return {
      ...baseStyle,

      backgroundImage: `url("${props.webkitMaskImage}")`,
    };
  }

  // MASK ICON
  return {
    ...baseStyle,

    maskImage: `url("${props.webkitMaskImage}")`,
    WebkitMaskImage: `url("${props.webkitMaskImage}")`,

    maskPosition: `${props.x}px ${props.y}px`,
    WebkitMaskPosition: `${props.x}px ${props.y}px`,

    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",

    backgroundColor: props.color,
  };
});
</script>

<style scoped>
.icon {
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
</style>
