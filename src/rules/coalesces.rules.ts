import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const listUrls = process.env.URLS;
// eslint-disable-next-line max-len
const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

interface apiResponseInterface {
  deductible: number,
  stop_loss: number,
  oop_max: number,
};

const getCoalesce = async (memberId: number, strategy: string) => {
  const apiResponse = await getApiResponse(memberId);

  if (apiResponse) {
    if (strategy === 'maximum') {
      return getMaximum(apiResponse);
    } else if (strategy === 'minimum') {
      return getMinimum(apiResponse);
    }
    // Default return
    return getAverage(apiResponse);
  }
};

const getApiResponse = async (memberId: number) => {
  const regex = new RegExp(urlRegex);
  const urls = listUrls?.split(',') || '';
  // eslint-disable-next-line no-array-constructor
  const response = new Array<apiResponseInterface>();
  for (const url of urls) {
    if (url.match(regex)) {
      const result = await axios.get(`${url}?member_id=${memberId}`);
      response.push(result.data);
    }
  };
  return response;
};

const getAverage = async (apiResponse: Array<apiResponseInterface>) => {
  const result: apiResponseInterface = {
    deductible: 0, oop_max: 0, stop_loss: 0,
  };
  for (const response of apiResponse) {
    if (response) {
      const { deductible, oop_max: oopMax, stop_loss: stopLoss } = response;
      result.deductible += deductible;
      result.oop_max += oopMax;
      result.stop_loss += stopLoss;
    }
  };
  result.deductible = Math.round(result.deductible / apiResponse.length);
  result.oop_max = Math.round(result.oop_max / apiResponse.length);
  result.stop_loss = Math.round(result.stop_loss / apiResponse.length);
  return result;
};

const getMaximum = async (apiResponse: Array<apiResponseInterface>) => {
  const result: apiResponseInterface = {
    deductible: 0, oop_max: 0, stop_loss: 0,
  };
  let currentResult = 0;
  for (const response of apiResponse) {
    if (response) {
      const { deductible, oop_max: oopMax, stop_loss: stopLoss } = response;
      const calcCurrentResult = deductible + oopMax + stopLoss;
      if (calcCurrentResult > currentResult) {
        currentResult = calcCurrentResult;
        result.deductible = deductible;
        result.oop_max = oopMax;
        result.stop_loss = stopLoss;
      }
    }
  };
  return result;
};

const getMinimum = async (apiResponse: Array<apiResponseInterface>) => {
  const result: apiResponseInterface = {
    deductible: 0, oop_max: 0, stop_loss: 0,
  };
  let currentResult = 0;
  for (const response of apiResponse) {
    if (response) {
      const { deductible, oop_max: oopMax, stop_loss: stopLoss } = response;
      const calcCurrentResult = deductible + oopMax + stopLoss;
      if (calcCurrentResult < currentResult || currentResult === 0) {
        currentResult = calcCurrentResult;
        result.deductible = deductible;
        result.oop_max = oopMax;
        result.stop_loss = stopLoss;
      }
    }
  };
  return result;
};

export { getCoalesce };
