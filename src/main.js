import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { installLoadTracker } from "./services/loadTracker";
import { endSplash } from "./services/splash";

import "./assets/styles/base.css";
import "./assets/styles/games-nav.css";
import "./assets/styles/nav.css";

installLoadTracker();
createApp(App).use(router).mount("#app");
router.isReady().then(endSplash);
