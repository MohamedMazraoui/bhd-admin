import globaleFunctions from "./globaleFunctions.js";

export default function useAnalytics() {

  const { getApiData } = globaleFunctions();

  async function smallCharts(startDate, endDate){
    try {

      console.log("startDate: ", startDate);
      const smallCharts = await getApiData(`${import.meta.env.VITE_APP_API_URL}/charges/progress-stats?s={"filter":{"startDate":"${startDate}","endDate":"${endDate}"}}`);
      return smallCharts;

    } catch (err){
      console.log('Catch: useAnalytics, smallCharts', err)
      return err;
    }
  };
  async function globalChart(startDate, endDate){
    try {

      const globalChart = await getApiData(`${import.meta.env.VITE_APP_API_URL}/charges/stats?s={"filter":{"startDate":"${startDate}","endDate":"${endDate}"}}`);
      return globalChart;

    } catch (err){
      console.log('Catch: useAnalytics, globalChart', err)
      return err;
    }
  };
  async function topCharts(startDate, endDate){
    try {

      const topCharts = await getApiData(`${import.meta.env.VITE_APP_API_URL}/charges/top-stats?s={"filter":{"startDate":"${startDate}","endDate":"${endDate}"}}`);
      return topCharts;

    } catch (err){
      console.log('Catch: useAnalytics, topCharts', err)
      return err;
    }
  };


  async function spaReport(startDate, endDate){
    try {

      const spaReport = await getApiData(`${import.meta.env.VITE_APP_API_URL}/charges/spa-report?s={"filter":{"startDate":"${startDate}","endDate":"${endDate}"}}`);
      return spaReport;

    } catch (err){
      console.log('Catch: useAnalytics, spaReport', err)
      return err;
    }
  };
  async function chargeReport(startDate, endDate){
    try {

      const chargeReport = await getApiData(`${import.meta.env.VITE_APP_API_URL}/charges/charges-report?s={"filter":{"startDate":"${startDate}","endDate":"${endDate}"}}`);
      return chargeReport;

    } catch (err){
      console.log('Catch: useAnalytics, chargeReport', err)
      return err;
    }
  };
  async function paymentsReport(startDate, endDate){
    try {

      const paymentsReport = await getApiData(`${import.meta.env.VITE_APP_API_URL}/charges/payments-report?s={"filter":{"startDate":"${startDate}","endDate":"${endDate}"}}`);
      return paymentsReport;

    } catch (err){
      console.log('Catch: useAnalytics, paymentsReport', err)
      return err;
    }
  };
  async function salaryReport(startDate, endDate){
    try {

      const salaryReport = await getApiData(`${import.meta.env.VITE_APP_API_URL}/pointages/salary-report?s={"filter":{"startDate":"${startDate}","endDate":"${endDate}"}}`);
      return salaryReport;

    } catch (err){
      console.log('Catch: useAnalytics, salaryReport', err)
      return err;
    }
  };

  return {
    smallCharts,
    globalChart,
    topCharts,

    spaReport,
    chargeReport,
    paymentsReport,
    salaryReport
  };
}
