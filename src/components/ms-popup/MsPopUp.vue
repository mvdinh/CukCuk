<template>
  <Teleport to="body">
    <Transition name="popup">
      <div v-if="visible" class="popup__overlay" @click.self="handleCancel">
        <div class="popup__container" :class="`popup--${type}`">
          <!-- Header -->
          <div class="popup__header">
            <div class="popup__header__icon" :class="`popup__header__icon--${type}`"></div>
            <div class="popup__header__title">{{ title }}</div>
            <div class="popup__header__close" @click="handleCancel"></div>
          </div>

          <!-- Body -->
          <div class="popup__body">
            <div class="popup__body__message">{{ message }}</div>
          </div>

          <!-- Footer -->
          <div class="popup__footer">
            <button class="btn btn--cancel" @click="handleCancel">
              {{ cancelText }}
            </button>
            <button
              class="btn btn--confirm"
              :class="`btn--${type}`"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const visible = ref(false);
const title = ref("Xác nhận");
const message = ref("");
const type = ref("warning"); // warning | danger | info
const confirmText = ref("Đồng ý");
const cancelText = ref("Hủy");

let resolvePromise = null;

/**
 * Mở popup confirm
 * @param {Object} payload - { title, message, type, confirmText, cancelText }
 */
const openPopup = (payload) => {
  title.value = payload.title || "Xác nhận";
  message.value = payload.message || "";
  type.value = payload.type || "warning";
  confirmText.value = payload.confirmText || "Đồng ý";
  cancelText.value = payload.cancelText || "Hủy";
  visible.value = true;
};

const handleConfirm = () => {
  visible.value = false;
  if (resolvePromise) {
    resolvePromise(true);
    resolvePromise = null;
  }
};

const handleCancel = () => {
  visible.value = false;
  if (resolvePromise) {
    resolvePromise(false);
    resolvePromise = null;
  }
};

// Lắng nghe custom event từ confirmDialog utility
const handleConfirmEvent = (e) => {
  openPopup(e.detail.payload);
  resolvePromise = e.detail.resolve;
};

onMounted(() => {
  window.addEventListener("ms-confirm", handleConfirmEvent);
});

onUnmounted(() => {
  window.removeEventListener("ms-confirm", handleConfirmEvent);
});
</script>

<style scoped>
/* ============================================ */
/*  Popup Overlay                               */
/* ============================================ */
.popup__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 999998;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ============================================ */
/*  Popup Container                             */
/* ============================================ */
.popup__container {
  width: 440px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "Inter", sans-serif;
}

/* ============================================ */
/*  Popup Header                                */
/* ============================================ */
.popup__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.popup__header__icon {
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-radius: 50%;
}

.popup__header__icon--warning {
  background-color: #f59e0b;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z'/%3E%3C/svg%3E");
  -webkit-mask-size: 18px;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.popup__header__icon--danger {
  background-color: #ef4444;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E");
  -webkit-mask-size: 18px;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.popup__header__icon--info {
  background-color: #3b82f6;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E");
  -webkit-mask-size: 18px;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.popup__header__title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #1f1f1f;
}

.popup__header__close {
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0.45;
  transition: opacity 0.2s;
  background-color: #1f1f1f;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
}

.popup__header__close:hover {
  opacity: 0.85;
}

/* ============================================ */
/*  Popup Body                                  */
/* ============================================ */
.popup__body {
  padding: 24px 20px;
}

.popup__body__message {
  font-size: 14px;
  line-height: 1.6;
  color: #444;
}

/* ============================================ */
/*  Popup Footer                                */
/* ============================================ */
.popup__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 20px 16px;
  border-top: 1px solid #f0f0f0;
}

.btn {
  padding: 8px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;
}

.btn--cancel {
  background: #f5f5f5;
  color: #555;
  border: 1px solid #e0e0e0;
}

.btn--cancel:hover {
  background: #eee;
}

.btn--confirm {
  color: #fff;
}

.btn--confirm.btn--warning {
  background: #f59e0b;
}

.btn--confirm.btn--warning:hover {
  background: #d97706;
}

.btn--confirm.btn--danger {
  background: #ef4444;
}

.btn--confirm.btn--danger:hover {
  background: #dc2626;
}

.btn--confirm.btn--info {
  background: #3b82f6;
}

.btn--confirm.btn--info:hover {
  background: #2563eb;
}

/* ============================================ */
/*  Popup Animation                             */
/* ============================================ */
.popup-enter-active {
  animation: popupFadeIn 0.25s ease-out;
}

.popup-leave-active {
  animation: popupFadeOut 0.2s ease-in forwards;
}

.popup-enter-active .popup__container {
  animation: popupScaleIn 0.25s cubic-bezier(0.21, 1.02, 0.73, 1);
}

.popup-leave-active .popup__container {
  animation: popupScaleOut 0.2s ease-in forwards;
}

@keyframes popupFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popupFadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes popupScaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes popupScaleOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}
</style>
