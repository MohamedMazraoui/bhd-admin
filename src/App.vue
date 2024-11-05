<script setup lang="ts">

import { RouterView, useRoute, useRouter } from "vue-router";
import { computed, ref, watch, defineAsyncComponent } from "vue";

const Confirm = defineAsyncComponent(() =>
  import('@/ui-components/Confirm.vue')
)

// Routers
const route = useRoute();
const router = useRouter();

import { userStore } from "@/stores/User";
const user = userStore();

// Functionalities
import globaleFunctions from "@/helpers/globaleFunctions.ts";
const { logout } = globaleFunctions();

import useUser from "@/helpers/useUser.ts";
const { userData } = useUser();


// Variables
let userLoader: boolean = ref(true);
const layout: string = computed(() => {
  const default_layout = "default";
  return `${route.meta.layout || default_layout}-layout`;
});
// Computed To check if Router riquired User data or not
let requireUserData: boolean = computed(() => {

  let routesThatDontRequireUser = [
    "login"
  ];
  return route?.name && routesThatDontRequireUser.indexOf(route.name) >= 0 ? false : true;

});


async function created(){


  await router.isReady();

  await checkAccessToken();
  userLoader.value = false


};

// Functions
async function checkAccessToken(){

  if (route.query.at) {
    user.accessToken = route.query.at;
    localStorage.accessToken = route.query.at
  }else if (localStorage.accessToken) {
    // await refreshToken();
    user.accessToken = localStorage.accessToken;
  }else if(requireUserData.value && !route?.query?.at && !localStorage?.accessToken){
    logout("Access Token Invalid.");
  }


  console.log("requireUserData.value: ", requireUserData.value);
  console.log("user.accessToken: ", user.accessToken);

  if (requireUserData.value && user.accessToken ) {
    const getUserData = await userData();
    console.log("getUserData: ", getUserData);

    if (getUserData?.data?._id) {

      user.userData = getUserData.data;

    }else{
      console.log("Error: ", getUserData?.message || "Something went wrong");
      logout(getUserData?.message || "Something went wrong");
    }
  }

};


created();


</script>

<template>
<div v-if="!userLoader" class="">
  <component :is="layout">
    <RouterView />

    <!-- the Confirm Modal -->
    <Confirm v-if="user.isConfirm"></Confirm>

  </component>
</div>
<div v-else class="flex min-h-screen">
  <div class="space-x-3 flex w-max items-center m-auto">
    <svg class="animate-spin -ml-1 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span class="font-semibold text-blue-600">Loading ...</span>
  </div>
</div>
</template>
