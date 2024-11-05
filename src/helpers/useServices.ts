import globaleFunctions from "./globaleFunctions.js";

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
  async function createService(data){
    try {
      const service = await postApiData(`${import.meta.env.VITE_APP_API_URL}/services`, data);
      return service;

    } catch (err){
      console.log('Catch: useService, service', err)
      return err;
    }
  };
  async function editService(id, data){
    try {
      const service = await editApiData(`${import.meta.env.VITE_APP_API_URL}/services/${id}`, data);
      return service;

    } catch (err){
      console.log('Catch: useService, service', err)
      return err;
    }
  };
  async function deleteService(id){
    try {
      const service = await deleteApiData(`${import.meta.env.VITE_APP_API_URL}/services/${id}`);
      return service;

    } catch (err){
      console.log('Catch: useServices, deleteService', err)
      return err;
    }
  };

  return {
    listServices,
    listServicesTypes,
    listServicesByType,
    createService,
    editService,
    deleteService
  };
}
