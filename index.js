import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { GraffitiPlugin } from '@graffiti-garden/wrapper-vue';
import { GraffitiLocal } from '@graffiti-garden/implementation-local';

import { HomeComponent } from './homeComponent.js';
import { ChatComponent } from './chatComponent.js';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomeComponent},
    { path: '/chat/:channel', component: ChatComponent, props: true},
  ]
});

createApp({
    components: {
        HomeComponent,
        ChatComponent,
    }
})
  .use(router)
  .use(GraffitiPlugin, {
    graffiti: new GraffitiLocal()
  })
  .mount('#app');