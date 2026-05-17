<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="toast__container">
      <div
        v-for="item in toasts"
        :key="item.id"
        class="toast__notification"
        :class="`toast--${item.type}`"
      >
        <div class="toast__icon" :class="`toast__icon--${item.type}`"></div>
        <div class="toast__content">{{ item.message }}</div>
        <div class="toast__close" @click="removeToast(item.id)"></div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const toasts = ref([]);
let toastId = 0;

/**
 * Thêm một toast notification
 * @param {Object} payload - { message, type, duration }
 */
const addToast = (payload) => {
  const id = ++toastId;
  const toast = {
    id,
    message: payload.message || "",
    type: payload.type || "success", // success | error | warning | info
    duration: payload.duration || 3000,
  };

  toasts.value.push(toast);

  // Tự động ẩn sau duration
  if (toast.duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, toast.duration);
  }
};

/**
 * Xóa toast theo id
 */
const removeToast = (id) => {
  const index = toasts.value.findIndex((t) => t.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

// Lắng nghe custom event từ toast.js
const handleToastEvent = (e) => {
  addToast(e.detail);
};

onMounted(() => {
  window.addEventListener("ms-toast", handleToastEvent);
});

onUnmounted(() => {
  window.removeEventListener("ms-toast", handleToastEvent);
});
</script>

<style scoped>
/* ============================================ */
/*  Toast Container – Vị trí trên cùng giữa    */
/* ============================================ */
.toast__container {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
}

/* ============================================ */
/*  Toast Item                                  */
/* ============================================ */
.toast__notification {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 320px;
  max-width: 480px;
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 13px;
  font-family: "Inter", sans-serif;
  line-height: 1.5;
  position: relative;
}

/* ============================================ */
/*  Toast Types – Màu nền + viền               */
/* ============================================ */
.toast--success {
  background-color: #f0fdf4;
  border-left: 4px solid #22c55e;
  color: #166534;
}

.toast--error {
  background-color: #fef2f2;
  border-left: 4px solid #ef4444;
  color: #991b1b;
}

.toast--warning {
  background-color: #fffbeb;
  border-left: 4px solid #f59e0b;
  color: #92400e;
}

.toast--info {
  background-color: #eff6ff;
  border-left: 4px solid #3b82f6;
  color: #1e40af;
}

/* ============================================ */
/*  Toast Icon – Biểu tượng cho từng loại      */
/* ============================================ */
.toast__icon {
  width: 20px;
  height: 20px;
  min-width: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast__icon--success {
  background-color: #22c55e;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E");
  -webkit-mask-size: 14px;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.toast__icon--error {
  background-color: #ef4444;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
  -webkit-mask-size: 12px;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.toast__icon--warning {
  background-color: #f59e0b;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z'/%3E%3C/svg%3E");
  -webkit-mask-size: 14px;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.toast__icon--info {
  background-color: #3b82f6;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E");
  -webkit-mask-size: 16px;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

/* ============================================ */
/*  Toast Content                               */
/* ============================================ */
.toast__content {
  flex: 1;
  font-weight: 500;
}

/* ============================================ */
/*  Toast Close Button                          */
/* ============================================ */
.toast__close {
  width: 16px;
  height: 16px;
  min-width: 16px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
  background-color: currentColor;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
}

.toast__close:hover {
  opacity: 1;
}

/* ============================================ */
/*  Toast Animation                             */
/* ============================================ */
.toast-enter-active {
  animation: toastSlideIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1);
}

.toast-leave-active {
  animation: toastSlideOut 0.3s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;
}

.toast-move {
  transition: transform 0.3s ease;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toastSlideOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
}
</style>
