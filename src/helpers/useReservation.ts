import globaleFunctions from "./globaleFunctions.js";
import moment from "moment";

export default function useReservation() {

  const { postApiData, getApiData, editApiData, deleteApiData } = globaleFunctions();

  async function listReservations(page, keyword){

    try {
      const listReservations = await getApiData(`${import.meta.env.VITE_APP_API_URL}/reservations?page=${page}&per_page=15&keyword=${keyword ? keyword : ''}`);
      return listReservations;

    } catch (err){
      console.log('Catch: useUser, listReservations', err)
      return err;
    }
  };
  async function createReservation(data){
    try {
      const appointment = await postApiData(`${import.meta.env.VITE_APP_API_URL}/reservations`, data);
      return appointment;

    } catch (err){
      console.log('Catch: useUser, appointment', err)
      return err;
    }
  };
  async function editReservationStatus(id, status, extraData){

    let finalData = {"status": status}
    console.log("extraData: ", extraData);
    if (extraData) {
      finalData = {...finalData, ...{payment: extraData}}
    }
    try {
      const reservation = await editApiData(`${import.meta.env.VITE_APP_API_URL}/reservations/${id}`, finalData);
      return reservation;

    } catch (err){
      console.log('Catch: useUser, reservation', err)
      return err;
    }
  };
  async function updateReservation(id, data){
    try {
      const appointment = await editApiData(`${import.meta.env.VITE_APP_API_URL}/reservations/${id}`, data);
      return appointment;

    } catch (err){
      console.log('Catch: useUser, appointment', err)
      return err;
    }
  };
  async function deleteReservation(id){
    try {
      const reservation = await deleteApiData(`${import.meta.env.VITE_APP_API_URL}/reservations/${id}`);
      return reservation;

    } catch (err){
      console.log('Catch: useUser, reservation', err)
      return err;
    }
  };

  return {
    listReservations,
    createReservation,
    editReservationStatus,
    updateReservation,
    deleteReservation
  };
}
