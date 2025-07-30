import './app/styles/index.scss';
import '@iconscout/unicons/css/line.css';

import App from './App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './app/router';

import vuetify from '@/shared/plugins/vuetify';

const app = createApp(App);
const pinia = createPinia();

app
    .use(pinia)
    .use(router)
    .use(vuetify)
    .mount('#app');
