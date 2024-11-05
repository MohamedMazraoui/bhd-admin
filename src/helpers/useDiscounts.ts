import globaleFunctions from "./globaleFunctions.js";

export default function useDiscounts() {

  const { postApiData, getApiData, editApiData, deleteApiData } = globaleFunctions();

  async function listDiscounts(page, status){
    try {

      const listDiscounts = await getApiData(`${import.meta.env.VITE_APP_API_URL}/discount?s={"limit":15,"page":${page},"filter":{"status":"${status}"}}`);
      return listDiscounts;

    } catch (err){
      console.log('Catch: useDiscounts, listDiscounts', err)
      return err;
    }
  };
  async function createDiscount(data){
    try {
      const discount = await postApiData(`${import.meta.env.VITE_APP_API_URL}/discount`, data);
      return discount;

    } catch (err){
      console.log('Catch: useDiscounts, createDiscount', err)
      return err;
    }
  };
  async function editDiscount(id, data){
    try {
      const discount = await editApiData(`${import.meta.env.VITE_APP_API_URL}/discount/${id}`, data);
      return discount;

    } catch (err){
      console.log('Catch: useDiscounts, editDiscount', err)
      return err;
    }
  };
  async function deleteDiscount(id){
    try {
      const discount = await deleteApiData(`${import.meta.env.VITE_APP_API_URL}/discount/${id}`);
      return discount;

    } catch (err){
      console.log('Catch: useDiscounts, deleteDiscount', err)
      return err;
    }
  };


  return {
    listDiscounts,
    createDiscount,
    editDiscount,
    deleteDiscount
  };
}
