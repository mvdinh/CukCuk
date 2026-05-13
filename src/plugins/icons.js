const modules = import.meta.glob("../assets/icons/**/*", {
  eager: true,
  import: "default",
});

const icons = {};

for (const path in modules) {
  const paths = path.replace("../assets/icons/", "").split("/");

  let current = icons;

  while (paths.length > 1) {
    const folder = paths.shift();

    if (!current[folder]) {
      current[folder] = {};
    }

    current = current[folder];
  }

  const fileName = paths[0].replace(/\.\w+$/, "");

  current[fileName] = modules[path];
}

export default {
  install(app) {
    app.config.globalProperties.$icons = icons;

    app.provide("icons", icons);
  },
};
