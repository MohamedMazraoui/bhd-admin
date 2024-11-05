import globaleFunctions from "./globaleFunctions.js";
import { userStore } from "@/stores/User";

export default function useUser() {

  const { postApiAuth, postApiData, getApiData, editApiData, deleteApiData } = globaleFunctions();
  const user = userStore();

  // async function refreshToken(){

  //   try {

  //     let data = {
  //       "accessToken": localStorage.accessToken
  //     };
  //     const tokenRefreshed = await postApiData(`${import.meta.env.VITE_APP_API_URL}/auth/refresh-token`, data);
  //     console.log("tokenRefreshed: ", tokenRefreshed);
  //     if (tokenRefreshed?.accessToken) {
  //       user.accessToken = tokenRefreshed.accessToken;
  //       localStorage.accessToken = tokenRefreshed.accessToken;
  //     }else{
  //       user.accessToken = localStorage.accessToken;
  //     }

  //   } catch (err){
  //     console.log('Catch: useUser, refreshToken', err)
  //     user.accessToken = localStorage.accessToken;
  //   }

  // };
  async function signIn(data){

    try {
      const authData = await postApiAuth(`${import.meta.env.VITE_APP_API_URL}/auth/login`, data);
      return authData;

    } catch (err){
      console.log('Catch: useUser, signIn', err)
      return err;
    }

  };
  async function userData(){
    try {
      const userData = await getApiData(`${import.meta.env.VITE_APP_API_URL}/auth/user-data`);
      return userData;

    } catch (err){
      console.log('Catch: useUser, userData', err)
      return err;
    }
  };

  async function listUsers(page){
    try {

      const listUsers = await getApiData(`${import.meta.env.VITE_APP_API_URL}/users?s={"limit":15,"page":${page}}`);
      return listUsers;

    } catch (err){
      console.log('Catch: useUser, listUsers', err)
      return err;
    }
  };
  async function createUser(data){
    try {
      const user = await postApiData(`${import.meta.env.VITE_APP_API_URL}/users`, data);
      return user;

    } catch (err){
      console.log('Catch: useUser, createUser', err)
      return err;
    }
  };
  async function editUser(id, data){
    try {
      const user = await editApiData(`${import.meta.env.VITE_APP_API_URL}/users/${id}`, data);
      return user;

    } catch (err){
      console.log('Catch: useUser, editUser', err)
      return err;
    }
  };
  async function deleteUser(id){
    try {
      const user = await deleteApiData(`${import.meta.env.VITE_APP_API_URL}/users/${id}`);
      return user;

    } catch (err){
      console.log('Catch: useUser, deleteUser', err)
      return err;
    }
  };

  async function resetPassword(data){
    try {
      const user = await postApiData(`${import.meta.env.VITE_APP_API_URL}/users/reset-password`, data);
      return user;

    } catch (err){
      console.log('Catch: useUser, resetPassword', err)
      return err;
    }
  };

  async function getSettings(){
    try {

      const settings = await getApiData(`${import.meta.env.VITE_APP_API_URL}/settings`);
      return settings;

    } catch (err){
      console.log('Catch: useUser, getSettings', err)
      return err;
    }
  };
  async function editSettings(data){
    try {
      const settings = await postApiData(`${import.meta.env.VITE_APP_API_URL}/settings`, data);
      return settings;

    } catch (err){
      console.log('Catch: useUser, editSettings', err)
      return err;
    }
  };

  async function userPointage(userID, date){
    try {

      // ${date.month+1}-${date.year}
      const settings = await getApiData(`${import.meta.env.VITE_APP_API_URL}/pointages/user/${userID}?s={"filter":{"startTime":"${date.month+1}-${date.year}"}}`);
      return settings;

    } catch (err){
      console.log('Catch: useUser, userPointage', err)
      return err;
    }
  };
  async function payUser(data){
    try {

      const payedUser = await postApiData(`${import.meta.env.VITE_APP_API_URL}/salary`, data);
      return payedUser;

    } catch (err){
      console.log('Catch: useUser, payUser', err)
      return err;
    }
  };
  async function pointUser(data){
    try {

      const pointerUser = await postApiData(`${import.meta.env.VITE_APP_API_URL}/pointages`, data);
      return pointerUser;

    } catch (err){
      console.log('Catch: useUser, pointUser', err)
      return err;
    }
  };
  async function updatePointageUser(employeId, data){
    try {

      const pointerUser = await editApiData(`${import.meta.env.VITE_APP_API_URL}/pointages/${employeId}`, data);
      return pointerUser;

    } catch (err){
      console.log('Catch: useUser, updatePointageUser', err)
      return err;
    }
  };
  async function deleteEmployePointage(id){
    try {
      const user = await deleteApiData(`${import.meta.env.VITE_APP_API_URL}/pointages/${id}`);
      return user;

    } catch (err){
      console.log('Catch: useUser, deleteEmployePointage', err)
      return err;
    }
  };
  async function filtredUsers(filter){
    try {

      const filtredUsers = await getApiData(`${import.meta.env.VITE_APP_API_URL}/salary/payments?s=${filter}`);
      return filtredUsers;

    } catch (err){
      console.log('Catch: useUser, filtredUsers', err)
      return err;
    }
  };



  return {
    // refreshToken,
    signIn,
    userData,

    listUsers,
    createUser,
    editUser,
    deleteUser,

    resetPassword,

    getSettings,
    editSettings,

    userPointage,
    payUser,
    pointUser,
    updatePointageUser,
    deleteEmployePointage,
    filtredUsers
  };
}
