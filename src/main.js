import { createApp, ref, onUnmounted } from "vue";
import App from "./App.vue";
import router from "./router/router";
/* eslint-disable */
import store from "./store/store";
// Import the functions you need from the SDKs you need
import derectives from '@/directives/index'
import components from '@/components/UI/index'


const app = createApp(App);

derectives.forEach((der) => {
    app.directive(der.name, der)
})

components.forEach((c) => {

app.component(c.name, c)

})

app.directive();

app.use(store).use(router).mount("#app");
