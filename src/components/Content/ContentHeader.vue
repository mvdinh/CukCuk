<template>
  <div class="content__header">
    <div class="content__header__left">
      <div class="content__header__title">Thực đơn</div>
    </div>

    <div class="content__header__right">
      <MsButton
        type="secondary"
        class="content__header__right__btn--import"
        @click="handleImport"
        style="margin-right: 12px; background: white; border: 1px solid #d3d5d8;"
      >
        <span style="display: flex; align-items: center; gap: 8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
          Nhập từ Excel
        </span>
      </MsButton>

      <div class="content__header__action__add" style="display: flex; margin-left: 0;">
        <MsButton
          type="primary"
          class="content__header__action__add__left"
          @click="handleAdd"
          style="border-radius: 4px 0 0 4px !important; display: flex; align-items: center; gap: 4px;"
        >
          <span>+</span>
          Thêm
        </MsButton>
        <MsButton
          type="primary"
          class="content__header__action__add__right"
          @click="handleMore"
          style="border-radius: 0 4px 4px 0 !important; padding: 0 8px; border-left: 1px solid rgba(255,255,255,0.3);"
        >
          ...
        </MsButton>
      </div>
    </div>
  </div>
</template>
<script setup>
import MsButton from "../ms-button/MsButton.vue";

const emit = defineEmits(["handleAdd", "handleImport", "handleMore"]);

const handleAdd = () => emit("handleAdd");
const handleImport = () => emit("handleImport");
const handleMore = () => emit("handleMore");
</script>
<style scoped>
.content__header__action__add {
  margin-left: 20px;
}
button.content__header__action__add__left {
  border-right: 1px solid #e0e0e0 !important;
  border-radius: 0 !important;
}
.content__header__title{
  color: black;
}
</style>
