import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const strategy = process.env.STRATEGY;
const listUrls = process.env.URLS;
// eslint-disable-next-line max-len
const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

interface apiResponseInterface {
  deductible: number,
  stop_loss: number,
  oop_max: number,
};

const getCoalesce = async (memberId: number) => {
  const apiResponse = await getApiResponse(memberId);

  if (strategy === 'average') {
    return getAverage(apiResponse);
  } else if (strategy === 'maximum') {
    return getMaximum(apiResponse);
  } else if (strategy === 'minimum') {
    return getMinimum(apiResponse);
  }
};

const getApiResponse = async (memberId: number) => {
  const regex = new RegExp(urlRegex);
  const urls = listUrls?.split(',');
  // eslint-disable-next-line no-array-constructor
  const response = new Array<apiResponseInterface>();
  for (const url in urls) {
    if (url.match(regex)) {
      const result = await axios.get(`${url}/${memberId}`);
      response.map(result.data);
    }
  };
  return response;
};

const getAverage = async (apiResponse: Array<apiResponseInterface>) => {
  return apiResponse;
};

const getMaximum = async (apiResponse: Array<apiResponseInterface>) => {
  return apiResponse;
};

const getMinimum = async (apiResponse: Array<apiResponseInterface>) => {
  return apiResponse;
};

export { getCoalesce };
