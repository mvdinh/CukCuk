<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="modelValue" class="dialog-overlay" @click.self="handleClose">
        <div class="dialog">
          <div class="dialog__header">
            <h3 class="dialog__title">Thiết lập bảng</h3>
            <button class="dialog__close" @click="handleClose">✕</button>
          </div>

          <div class="dialog__content">
            <div class="config-search">
              <div class="search-wrapper">
                <input
                  type="text"
                  v-model="searchText"
                  placeholder="Tìm kiếm"
                />
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="search-icon"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="#999"
                    stroke-width="2"
                  />
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="#999"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
            </div>

            <div class="column-table">
              <div class="column-table-header">
                <div class="col-check">
                  <div
                    class="custom-checkbox"
                    :class="{
                      'checked-some':
                        visibleCount > 0 && visibleCount < localColumns.length,
                      'checked-all': visibleCount === localColumns.length,
                    }"
                    @click="toggleAll"
                  >
                    <div
                      v-if="
                        visibleCount > 0 && visibleCount < localColumns.length
                      "
                      class="minus"
                    ></div>
                    <svg
                      v-else-if="visibleCount === localColumns.length"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="white"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div class="col-name">Tên cột</div>
                <div class="col-width">Độ rộng cột</div>
                <div class="col-pin">Ghim cột</div>
                <div class="col-drag"></div>
              </div>

              <div class="column-table-body">
                <VueDraggableNext
                  v-model="localColumns"
                  handle=".drag-handle"
                  :animation="200"
                >
                  <div
                    v-for="col in filteredColumns"
                    :key="col.key"
                    class="column-row"
                  >
                    <div class="col-check">
                      <div
                        class="custom-checkbox"
                        :class="{ 'checked-all': col.visible }"
                        @click="col.visible = !col.visible"
                      >
                        <svg
                          v-if="col.visible"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            stroke="white"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="col-name">{{ col.label }}</div>
                    <div class="col-width">
                      <input
                        type="number"
                        v-model="col.width"
                        class="width-input"
                      />
                    </div>
                    <div class="col-pin">
                      <div
                        class="pin-icon"
                        :class="{ pinned: col.fixed }"
                        @click="col.fixed = !col.fixed"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 2v8m0 0l4 4m-4-4l-4 4m4 6v-2"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="col-drag">
                      <div class="drag-handle">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle cx="9" cy="6" r="1.5" fill="#ccc" />
                          <circle cx="15" cy="6" r="1.5" fill="#ccc" />
                          <circle cx="9" cy="12" r="1.5" fill="#ccc" />
                          <circle cx="15" cy="12" r="1.5" fill="#ccc" />
                          <circle cx="9" cy="18" r="1.5" fill="#ccc" />
                          <circle cx="15" cy="18" r="1.5" fill="#ccc" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </VueDraggableNext>
              </div>
            </div>
          </div>

          <div class="dialog__footer">
            <button class="btn btn--secondary" @click="handleReset">
              Lấy lại mặc định
            </button>
            <div class="footer-right">
              <button class="btn btn--white" @click="handleClose">Hủy</button>
              <button class="btn btn--primary" @click="handleApply">Lưu</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { VueDraggableNext } from "vue-draggable-next";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  columns: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "apply", "reset"]);

const localColumns = ref([]);
const isDragging = ref(false);

// Sync khi dialog mở
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      localColumns.value = props.columns.map((c) => ({ ...c }));
    }
  },
  { immediate: true },
);

const visibleCount = computed(
  () => localColumns.value.filter((c) => c.visible).length,
);

const searchText = ref("");
const filteredColumns = computed(() => {
  if (!searchText.value) return localColumns.value;
  return localColumns.value.filter((c) =>
    c.label.toLowerCase().includes(searchText.value.toLowerCase()),
  );
});

const toggleAll = () => {
  if (visibleCount.value === localColumns.value.length) {
    localColumns.value.forEach((c) => (c.visible = false));
  } else {
    localColumns.value.forEach((c) => (c.visible = true));
  }
};

const handleApply = () => {
  emit(
    "apply",
    localColumns.value.map((c) => ({ ...c })),
  );
  emit("update:modelValue", false);
};

const handleReset = () => {
  emit("reset");
  emit("update:modelValue", false);
};

const handleClose = () => {
  emit("update:modelValue", false);
};
</script>

<style scoped>
/* ====== Overlay & Dialog ====== */
/* ====== Overlay & Dialog ====== */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.dialog {
  background: #ffffff;
  border-radius: 8px;
  width: 648px;
  height: 520px;
  max-width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.dialog__header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 600px;
  height: 68px;
  height: 28px;
  padding: 20px;
  .dialog__title {
    width: 560px;
    height: 28px;
    font-size: 16px;
    font-weight: 700;
    margin: 0;
  }
  .dialog__close {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 20px;
    color: #666;
    gap: 8pxs;
  }
}

.dialog__content {
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  overflow: hidden;
}

.config-search {
  .search-wrapper {
    position: relative;
    input {
      width: 100%;
      height: 36px;
      padding: 0 12px 0 36px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      outline: none;
      &:focus {
        border-color: #2680eb;
      }
    }
    .search-icon {
      position: absolute;
      left: 10px;
      top: 10px;
    }
  }
}

.column-table {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.column-table-header {
  display: flex;
  background: #f4f5f8;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  div {
    padding: 10px 12px;
    border-right: 1px solid #e0e0e0;
  }
}

.column-table-body {
  overflow-y: auto;
  flex: 1;
}

.column-row {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
  &:hover {
    background: #f9fafb;
  }
  div {
    padding: 8px 12px;
    border-right: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
  }
}

.col-check {
  width: 50px;
  justify-content: center;
}
.col-name {
  flex: 1;
}
.col-width {
  width: 140px;
}
.col-pin {
  width: 80px;
  justify-content: center;
}
.col-drag {
  width: 50px;
  justify-content: center;
  border-right: none !important;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &.checked-all {
    background: #2680eb;
    border-color: #2680eb;
  }
  &.checked-some {
    background: #fff;
    border-color: #2680eb;
    .minus {
      width: 10px;
      height: 2px;
      background: #2680eb;
    }
  }
}

.width-input {
  width: 100%;
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0 8px;
  text-align: right;
  &:focus {
    border-color: #2680eb;
    outline: none;
  }
}

.pin-icon {
  cursor: pointer;
  color: #ccc;
  &.pinned {
    color: #2680eb;
  }
  &:hover {
    opacity: 0.8;
  }
}

.drag-handle {
  cursor: grab;
}

.dialog__footer {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f4f5f8;
  border-top: 1px solid #e0e0e0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.footer-right {
  display: flex;
  gap: 8px;
}

.btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  &--primary {
    background: #2680eb;
    color: #fff;
  }
  &--secondary {
    background: #fff;
    border-color: #e0e0e0;
    color: #333;
  }
  &--white {
    background: #fff;
    border-color: transparent;
    color: #333;
  }
  &:hover {
    opacity: 0.9;
  }
}

/* ====== Transitions ====== */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-fade-enter-active .dialog,
.dialog-fade-leave-active .dialog {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-from .dialog,
.dialog-fade-leave-to .dialog {
  transform: scale(0.95) translateY(-8px);
  opacity: 0;
}
</style>
