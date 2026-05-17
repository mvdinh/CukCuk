<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="modelValue" class="dialog-overlay" @click.self="handleClose">
        <div class="dialog">
          <div class="dialog__header">
            <div class="dialog__header__container">
              <h3 class="dialog__title">Thiết lập bảng</h3>
              <button class="dialog__close" @click="handleClose">
                <MsIcon
                  :size="12"
                  :isImage="true"
                  :webkitMaskImage="icons.table.close"
                />
              </button>
            </div>
          </div>

          <div class="dialog__content">
            <div class="config-search">
              <MsInput
                v-model="searchText"
                :isSearch="true"
                placeholder="Tìm kiếm"
                class="config-search-input"
              />
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
                <div class="col-last">Ghim cột</div>
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
                    :class="{ 'row--active': col.visible }"
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
                    <div class="col-last">
                      <div class="col-last-actions">
                        <div
                          class="pin-icon"
                          :class="{ pinned: col.fixed }"
                          @click="col.fixed = !col.fixed"
                        >
                          <MsIcon
                            :size="16"
                            :isImage="true"
                            :webkitMaskImage="
                              col.fixed ? icons.filter.ghim : icons.filter.unpin
                            "
                            :color="col.fixed ? '#2680eb' : '#2680eb'"
                          />
                        </div>
                        <div class="drag-handle">
                          <MsIcon
                            :size="16"
                            :isImage="true"
                            :webkitMaskImage="icons.filter.grip_vertical"
                            color="#a6a6a6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </VueDraggableNext>
              </div>
            </div>
          </div>

          <div class="dialog__footer">
            <MsButton
              type="secondary"
              text="Lấy lại mặc định"
              class="btn-reset"
              @click="handleReset"
            />
            <div class="footer-right">
              <MsButton
                type="secondary"
                text="Hủy"
                class="btn-cancel"
                @click="handleClose"
              />
              <MsButton
                type="primary"
                text="Lưu"
                class="btn-save"
                @click="handleApply"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup>
import { ref, computed, watch, inject } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import MsIcon from "../../../components/common/ms-icon/MsIcon.vue";
import MsButton from "../../../components/common/ms-button/MsButton.vue";
import MsInput from "../../../components/common/ms-input/MsInput.vue";

const icons = inject("icons");

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

<style lang="scss" scoped>
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
  border-radius: 12px;
  width: 648px;
  height: 520px;
  max-width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);

  &__header {
    padding: 24px 24px 16px;
    display: flex;
    justify-content: center;

    &__container {
      width: 600px;
      height: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    color: #1f1f1f;
    line-height: 22px;
  }

  &__close {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
  }

  &__content {
    padding: 0 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
    overflow: hidden;
  }
}

.config-search {
  width: 240px;
  height: 32px;

  :deep(.ms-input) {
    width: 240px !important;
    height: 32px !important;
  }

  :deep(.ms-input__field) {
    width: 240px !important;
    height: 32px !important;
    font-size: 13px !important;
    border: 1px solid #e0e0e0 !important;
    border-radius: 8px !important;
    box-sizing: border-box !important;
    
    &:focus {
      border-color: #2680eb !important;
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
  font-weight: 700;
  border-bottom: 1px solid #e0e0e0;
  height: 32px;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #1f1f1f;
  }
  
  .col-last {
    justify-content: flex-start;
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
  height: 32px;
  background: #ffffff;
  &:hover {
    background: #f9fafb;
  }
  &.row--active {
    background: #f0f6fe;
  }
  div {

    display: flex;
    align-items: center;
  }
}

.col-check {
  width: 40px;
  justify-content: center;
  padding: 0 !important;
  box-sizing: border-box;
}
.col-name {
  width: 355px;
  flex: none;
  padding: 0 12px !important;
  font-size: 13px;
  color: #1f1f1f;
  box-sizing: border-box;
}
.col-width {
  width: 108px;
  justify-content: flex-end;
  padding: 0 12px !important;
  box-sizing: border-box;
}
.col-last {
  width: 89px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px !important;
  box-sizing: border-box;
}
.col-last-actions {
  width: 57px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom-checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &.checked-all {
    background: #2680eb;
    border-color: #2680eb;
  }
  
  &.checked-some {
    background: #2680eb;
    border-color: #2680eb;
    .minus {
      width: 10px;
      height: 2px;
      background: #ffffff;
    }
  }
}

.width-input {
  width: 100% !important;
  height: 28px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 12px;
  text-align: right;
  background: #ffffff;
  box-sizing: border-box;
  font-size: 13px;
  color: #1f1f1f;
  transition: border-color 0.2s;

  &:focus {
    border-color: #2680eb;
    outline: none;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.pin-icon {
  cursor: pointer;
  opacity: 0.4;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &.pinned {
    opacity: 1;
  }
}

.drag-handle {
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog__footer {
  height: 64px;
  box-sizing: border-box;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f4f5f8;
  border-top: 1px solid #e0e0e0;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;

  :deep(.ms-button) {
    height: 32px !important;
    padding: 0 !important;
    border-radius: 8px !important;
  }

  .btn-reset {
    width: 124px !important;
  }

  .footer-right {
    display: flex;
    gap: 8px;

    .btn-cancel,
    .btn-save {
      width: 80px !important;
    }
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
