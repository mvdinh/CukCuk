<template>
  <router-view></router-view>

  <!-- Global Toast Notification -->
  <MsNotification />

  <!-- Global Confirm Popup -->
  <MsPopUp />
</template>

<script setup>
import MsNotification from "./components/ms-notification/MsNotification.vue";
import MsPopUp from "./components/ms-popup/MsPopUp.vue";
</script>
