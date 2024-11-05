import axios from "axios";
// import * as Vue from 'vue'
// import { watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { userStore } from "@/stores/User";

export default function globaleFunctions() {


  const route = useRoute();
  const router = useRouter();

  const userDataStore = userStore();

  async function postApiAuth(endpoint, data) {

    try {
      const res = await axios.post(endpoint, data);
      return res;

    } catch (error) {
      console.log('Catch: globaleFunctions, postApiAuth', error);
      return error;

    }
  };

  async function postApiData(endpoint, data) {


    if ((userDataStore?.accessToken) || (route?.query?.at) || (localStorage?.accessToken)) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userDataStore?.accessToken ? userDataStore.accessToken : route?.query?.at ? route.query.at : localStorage?.accessToken ? localStorage.accessToken : null}`;
    }else{
      return null
    }
    try {
      const res = await axios.post(endpoint, data);
      delete axios.defaults.headers.common["Authorization"];

      return res;
    } catch (error) {
      console.log('Catch: globaleFunctions, postApiData', error)
      delete axios.defaults.headers.common["Authorization"];
      return error;
    }
  };

  async function editApiData(endpoint, data) {


    if ((userDataStore?.accessToken) || (route?.query?.at)) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userDataStore?.accessToken ? userDataStore.accessToken : route?.query?.at ? route.query.at : localStorage?.accessToken ? localStorage.accessToken : null}`;
    }else{
      return null
    }
    try {
      const res = await axios.patch(endpoint, data);
      delete axios.defaults.headers.common["Authorization"];

      return res;
    } catch (error) {
      console.log('Catch: globaleFunctions, editApiData', error)
      delete axios.defaults.headers.common["Authorization"];
      return error;
    }
  };

  async function deleteApiData(endpoint) {


    if ((userDataStore?.accessToken) || (route?.query?.at)) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userDataStore?.accessToken ? userDataStore.accessToken : route?.query?.at ? route.query.at : localStorage?.accessToken ? localStorage.accessToken : null}`;
    }else{
      return null
    }
    try {
      const res = await axios.delete(endpoint);
      delete axios.defaults.headers.common["Authorization"];

      return res;
    } catch (error) {
      console.log('Catch: globaleFunctions, deleteApiData', error)
      delete axios.defaults.headers.common["Authorization"];
      return error;
    }
  };

  async function getApiData(endpoint) {


    if ((userDataStore?.accessToken) || (route?.query?.at)) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userDataStore?.accessToken ? userDataStore.accessToken : route?.query?.at ? route.query.at : localStorage?.accessToken ? localStorage.accessToken : null}`;
    }else{
      return null
    }
    try {
      const res = await axios.get(endpoint);
      delete axios.defaults.headers.common["Authorization"];

      return res;
    } catch (error) {
      console.log('Catch: globaleFunctions, getApiData', error)
      delete axios.defaults.headers.common["Authorization"];
      return error;
    }
  };

  function logout(msg) {
    userDataStore.accessToken = null;
    userDataStore.userData = null;
    localStorage.clear();
    router.push({name:'login'});
  };

  function confirm(type,message,callback,button,hasCheckbox,checkBoxText,title, hasCancel){

    if(type && message){
      userDataStore.confirmOptions.title = title
      userDataStore.confirmOptions.type = type
      userDataStore.confirmOptions.message = message
      userDataStore.confirmOptions.callback = callback
      userDataStore.confirmOptions.button = button
      if (hasCancel == false) {
        userDataStore.confirmOptions.hasCancel = false;
      }
      userDataStore.confirmOptions.hasCheckbox = hasCheckbox ? true : false
      userDataStore.confirmOptions.checkBoxText = checkBoxText ? checkBoxText : null
      userDataStore.isConfirm = true
    }

  };

  return {
    postApiAuth,
    postApiData,
    editApiData,
    deleteApiData,
    getApiData,
    logout,
    confirm
  };
}
