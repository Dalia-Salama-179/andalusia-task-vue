import Vue from 'vue'
import App from './App.vue'
import './assets/style/index.css'

Vue.config.productionTip = false;
import router from './router'
import '@progress/kendo-ui'
import '@progress/kendo-theme-default/dist/all.css'
import {Calendar} from '@progress/kendo-dateinputs-vue-wrapper'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);
Vue.component(Calendar.name, Calendar);

import i18n from "./i18n";

new Vue({
    render: h => h(App),
    router,
    i18n,
    components: {
        App,
        Calendar
    }
}).$mount('#app');
