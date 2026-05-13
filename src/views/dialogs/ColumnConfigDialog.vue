<template>
  <div class="ms-dialog-overlay" v-if="modelValue">
    <div class="ms-dialog column-config-dialog">
      <div class="ms-dialog__header">
        <h3 class="ms-dialog__title">Tùy chỉnh cột</h3>
        <div class="ms-dialog__close" @click="close">✕</div>
      </div>
      
      <div class="ms-dialog__content">
        <div class="config-search">
          <MsInput v-model="searchText" placeholder="Tìm kiếm cột" isSearch />
        </div>

        <div class="column-list-wrapper">
          <div class="column-list-header">
            <div class="col-check"><input type="checkbox" :checked="isAllVisible" @change="toggleAll" /></div>
            <div class="col-name">Tên cột</div>
            <div class="col-width">Độ rộng</div>
            <div class="col-fix">Cố định</div>
          </div>
          
          <draggable 
            v-model="localColumns" 
            item-key="key" 
            class="column-list-body"
            handle=".drag-handle"
          >
            <template #item="{ element }">
              <div class="column-item" v-show="matchesSearch(element)">
                <div class="col-check">
                  <input type="checkbox" v-model="element.visible" />
                </div>
                <div class="col-name">
                  <span class="drag-handle">⠿</span>
                  {{ element.label }}
                </div>
                <div class="col-width">
                  <input type="text" v-model="element.width" class="width-input" />
                </div>
                <div class="col-fix">
                  <input type="checkbox" v-model="element.fixed" />
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div class="ms-dialog__footer">
        <div class="footer-left">
          <MsButton type="secondary" @click="reset">Lấy lại mặc định</MsButton>
        </div>
        <div class="footer-right">
          <MsButton type="secondary" @click="close">Hủy</MsButton>
          <MsButton type="primary" @click="apply">Cất</MsButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { VueDraggableNext as draggable } from "vue-draggable-next";
import MsInput from "../../components/ms-input/MsInput.vue";
import MsButton from "../../components/ms-button/MsButton.vue";

const props = defineProps({
  modelValue: Boolean,
  columns: Array
});

const emit = defineEmits(["update:modelValue", "apply", "reset"]);

const localColumns = ref([]);
const searchText = ref("");

watch(() => props.modelValue, (val) => {
  if (val) {
    localColumns.value = props.columns.map(c => ({
      ...c,
      visible: c.visible !== false, // default to true
      width: c.width || "120",
      fixed: !!c.fixed
    }));
  }
}, { immediate: true });

const isAllVisible = computed(() => {
  return localColumns.value.every(c => c.visible);
});

const toggleAll = () => {
  const target = !isAllVisible.value;
  localColumns.value.forEach(c => c.visible = target);
};

const matchesSearch = (col) => {
  if (!searchText.value) return true;
  return col.label.toLowerCase().includes(searchText.value.toLowerCase());
};

const close = () => emit("update:modelValue", false);

const apply = () => {
  emit("apply", localColumns.value);
  close();
};

const reset = () => {
  emit("reset");
  close();
};
</script>

<style scoped lang="scss">
.ms-dialog-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 1100;
}

.column-config-dialog {
  background: #fff;
  border-radius: 4px;
  width: 700px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
}

.ms-dialog__header {
  padding: 16px 24px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
  .ms-dialog__title { font-size: 18px; font-weight: 700; margin: 0; }
  .ms-dialog__close { cursor: pointer; font-size: 20px; color: #666; }
}

.ms-dialog__content {
  padding: 16px 24px;
  display: flex; flex-direction: column; gap: 16px;
  flex: 1;
  overflow: hidden;
}

.column-list-wrapper {
  border: 1px solid #e0e0e0;
  display: flex; flex-direction: column;
  max-height: 400px;
}

.column-list-header {
  display: flex;
  background: #f4f5f8;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  div { padding: 8px; border-right: 1px solid #e0e0e0; }
}

.column-list-body {
  overflow-y: auto;
}

.column-item {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  &:hover { background: #f0f4ff; }
  div { padding: 8px; border-right: 1px solid #e0e0e0; display: flex; align-items: center; }
}

.col-check { width: 40px; justify-content: center; }
.col-name { flex: 1; gap: 8px; }
.col-width { width: 100px; }
.col-fix { width: 80px; justify-content: center; border-right: none !important; }

.drag-handle { cursor: grab; color: #999; font-size: 18px; }
.width-input { width: 100%; height: 28px; border: 1px solid #d0d0d0; border-radius: 3px; padding: 0 8px; }

.ms-dialog__footer {
  padding: 16px 24px;
  display: flex; align-items: center; justify-content: space-between;
  border-top: 1px solid #e0e0e0;
  background: #f9f9f9;
}

.footer-right { display: flex; gap: 12px; }
</style>
