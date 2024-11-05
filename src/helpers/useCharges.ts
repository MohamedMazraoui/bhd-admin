import globaleFunctions from "./globaleFunctions.js";

export default function useCharges() {

  const { postApiData, getApiData, editApiData, deleteApiData } = globaleFunctions();

  async function listCharges(startDate, endDate, page){
    try {

      const listSpaServices = await getApiData(`${import.meta.env.VITE_APP_API_URL}/charges?s={"limit":15,"page":${page},"filter":{"date":{"$gte":"${startDate}","$lte":"${endDate}"}}}`);
      return listSpaServices;

    } catch (err){
      console.log('Catch: useCharges, listCharges', err)
      return err;
    }
  };
  async function createCharge(data){
    try {
      const charge = await postApiData(`${import.meta.env.VITE_APP_API_URL}/charges`, data);
      return charge;

    } catch (err){
      console.log('Catch: useCharges, createCharge', err)
      return err;
    }
  };
  async function editCharge(id, data){
    try {
      const charge = await editApiData(`${import.meta.env.VITE_APP_API_URL}/charges/${id}`, data);
      return charge;

    } catch (err){
      console.log('Catch: useCharges, editCharge', err)
      return err;
    }
  };
  async function deleteCharge(id){
    try {
      const charge = await deleteApiData(`${import.meta.env.VITE_APP_API_URL}/charges/${id}`);
      return charge;

    } catch (err){
      console.log('Catch: useCharges, deleteCharge', err)
      return err;
    }
  };

  return {
    listCharges,
    createCharge,
    editCharge,
    deleteCharge
  };
}
