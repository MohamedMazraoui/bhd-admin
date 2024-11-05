import '@/assets/tailwind.css'

import { createApp, h } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Layouts
import Default from "@/layouts/Default.vue";
import NoSidebar from "@/layouts/NoSidebar.vue";

const app = createApp({
  render: () => h(App),
});

app.use(createPinia());

app.component("default-layout", Default);
app.component("no-sidebar-layout", NoSidebar);

app.use(router);

// Click Away Directive
app.directive('click-outside', {
  mounted: (element, binding) => {
    console.log("clickaway");
    element.clickOutsideEvent = (event) => {
      const excludeComponent = document.getElementById(binding.arg)

      if (
        !(element == event.target || element.contains(event.target)) &&
        !(
          excludeComponent &&
          (event.target == excludeComponent || excludeComponent.contains(event.target))
        )
      ) {
        binding.value(event, element)
      }
    }
    document.addEventListener('click', element.clickOutsideEvent)
  },
  unmounted: function (element) {
    document.removeEventListener('click', element.clickOutsideEvent)
  }
});

app.mount("#app");
