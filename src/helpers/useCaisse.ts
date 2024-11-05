import globaleFunctions from "./globaleFunctions.js";
import moment from "moment";

export default function useServices() {

  const { postApiData, getApiData, editApiData, deleteApiData } = globaleFunctions();

  async function listServices(){
    try {
      const listSpaServices = await getApiData(`${import.meta.env.VITE_APP_API_URL}/services?s={"limit":10000}`);
      return listSpaServices;

    } catch (err){
      console.log('Catch: useServices, listSpaServices', err)
      return err;
    }
  };
  async function listServicesTypes(){
    try {
      const listServicesTypes = await getApiData(`${import.meta.env.VITE_APP_API_URL}/services/types`);
      return listServicesTypes;

    } catch (err){
      console.log('Catch: useServices, listServicesTypes', err)
      return err;
    }
  };
  async function listServicesByType(serviceType){
    try {
      const listServicesByType = await getApiData(`${import.meta.env.VITE_APP_API_URL}/services?s={"limit":10000,"filter":{"type":${serviceType}}}`);
      return listServicesByType;

    } catch (err){
      console.log('Catch: useServices, listServicesByType', err)
      return err;
    }
  };
  async function listAppointments(type, status){
    let filter = '"status":"CONFIRMED"';
    if(status == 'payed'){
      filter = '"status":"PAYED"'
    }
    if (type == 'today') {
      filter+= `,"date":{"$gte":"${moment().format('DD-MM-YYYY')}","$lte":"${moment().format('DD-MM-YYYY')}"}`;
    }
    try {
      const listAppointments = await getApiData(`${import.meta.env.VITE_APP_API_URL}/appointments?s={"limit":1000,"page":1,"sort":{"created_at":-1},"order":"asc","filter":{${filter}}}`);
      return listAppointments;

    } catch (err){
      console.log('Catch: useCaisse, listAppointments', err)
      return err;
    }
  };
  async function listPendingAppointments(){
    try {
      const listAppointments = await getApiData(`${import.meta.env.VITE_APP_API_URL}/appointments?s={"limit":1000,"page":1,"sort":{"created_at":-1},"order":"asc","filter":{"status":"PENDING"}}`);
      return listAppointments;

    } catch (err){
      console.log('Catch: useCaisse, listPendingAppointments', err)
      return err;
    }
  };
  async function saveCommand(data){
    try {
      const appointment = await postApiData(`${import.meta.env.VITE_APP_API_URL}/appointments`, data);
      return appointment;

    } catch (err){
      console.log('Catch: useCaisse, appointment', err)
      return err;
    }
  };
  async function updateCommand(id, data){
    try {
      const appointment = await editApiData(`${import.meta.env.VITE_APP_API_URL}/appointments/${id}`, data);
      return appointment;

    } catch (err){
      console.log('Catch: useCaisse, appointment', err)
      return err;
    }
  };
  async function editAppointmentStatus(id, status){
    try {
      const appointment = await editApiData(`${import.meta.env.VITE_APP_API_URL}/appointments/${id}`, {"status": status});
      return appointment;

    } catch (err){
      console.log('Catch: useCaisse, appointment', err)
      return err;
    }
  };
  async function checkDiscount(discountCode){
    try {
      const discountStatus = await getApiData(`${import.meta.env.VITE_APP_API_URL}/discount/check/${discountCode}`);
      return discountStatus;

    } catch (err){
      console.log('Catch: useCaisse, checkDiscount', err)
      return err;
    }
  };
  async function deleteAppointment(id){
    try {
      const appointment = await deleteApiData(`${import.meta.env.VITE_APP_API_URL}/appointments/${id}`);
      return appointment;

    } catch (err){
      console.log('Catch: useCaisse, appointment', err)
      return err;
    }
  };

  return {
    listServices,
    listServicesTypes,
    listServicesByType,

    listAppointments,
    listPendingAppointments,
    saveCommand,
    updateCommand,
    editAppointmentStatus,
    deleteAppointment,

    checkDiscount
  };
}
