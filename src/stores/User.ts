import { defineStore } from "pinia";

export const userStore = defineStore({

  id: "user",

  state: () => ({
    accessToken: null,
    userData: null,
    confirmOptions:{
      title:null,
      type:null,
      message:null,
      callback:null,
      button:null,
      hasCancel: true,
      hasCheckbox:false,
      checkBoxText:null
    },
    isConfirm:false,
  }),

  getters: {

  },

  actions: {

  }

});
