import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const strategy = process.env.STRATEGY;
const listUrls = process.env.URLS;
// eslint-disable-next-line max-len
const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

const getCoalesce = async (memberId: number) => {
  const apiResponse = await getApiResponse(memberId);

  if (strategy === 'average') {
    return getAverage();
  } else if (strategy === 'maximum') {
    return getMaximum();
  } else if (strategy === 'minimum') {
    return getMinimum();
  }
};

const getApiResponse = async (memberId: number) => {
  const regex = new RegExp(urlRegex);
  const urls = listUrls?.split(',');
  // eslint-disable-next-line no-array-constructor
  const response = new Array<any>();
  for (const url in urls) {
    if (url.match(regex)) {
      const result = await axios.get(`${url}/${memberId}`);
      response.map(result.data);
    }
  };
  return response;
};

const getAverage = async () => {
  return;
};

const getMaximum = async () => {
  return;
};

const getMinimum = async () => {
  return;
};

export { getCoalesce };
