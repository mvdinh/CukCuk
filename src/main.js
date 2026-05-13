import { createApp } from "vue";
import "./assets/styles/styles.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";

import { toast } from "./utils/toast";
import { confirmDialog } from "./utils/confirm";
import iconsPlugin from "./plugins/icons";

const app = createApp(App);

// plugin icons
app.use(iconsPlugin);

app.config.globalProperties.$toast = toast;
app.config.globalProperties.$confirm = confirmDialog;

app.use(createPinia()).use(router).mount("#app");
