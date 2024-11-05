<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto w-48" src="@/assets/images/logo-white.png" alt="Spa Des Epices" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div @keyup.enter="signInToTheApp()" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
          <div class="mt-2">
            <input v-model="email" id="email" name="email" type="email" autocomplete="email" required="" class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
          </div>
          <div class="mt-2">
            <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required="" class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <button v-if="!loadingAuth" @click="signInToTheApp()" class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Sign in</button>

          <button v-else class="disabled flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            <svg class="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>

        <p v-if="messageError?.length" class="text-sm font-medium leading-6 text-red-600 px-4 py-2 rounded-md bg-red-100 text-center">{{messageError}}</p>

      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

import { userStore } from "@/stores/User";
const user = userStore();

import useUser from "@/helpers/useUser.ts";
const { signIn } = useUser();


let email: string = ref("");
let password: string = ref("");
let loadingAuth: boolean = ref(false);
let messageError: string = ref(null);

async function signInToTheApp(){

  try {
    loadingAuth.value = true;

    let data = {
      email: email.value,
      password: password.value
    }

    const authData = await signIn(data);
    console.log("authData: ", authData);
    if (authData?.data?.accessToken && authData?.data?.user) {
      user.userData = authData.data.user;
      user.accessToken = authData.data.accessToken;
      localStorage.accessToken = authData.data.accessToken;
      router.push({name: "reservations"});
    }

    if (authData?.response?.status > 201) {
      messageError.value = authData.response.data.message || "Something went wrong, Please try again"
    }

    loadingAuth.value = false;
  } catch (error) {
    console.log("error: ", error);
    messageError.value = error?.response?.data?.message ? error.response.data.message : error;
  }

}

</script>

