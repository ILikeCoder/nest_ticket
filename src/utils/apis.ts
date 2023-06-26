import axios from 'axios';
const baseURL = 'https://ticket.sdstm.cn/backend/operate/wx';
axios.defaults.baseURL = baseURL;
export const insertPersonApi = async (data, token) => {
  const url = '/insertIndividualRelevanceCustomer';
  const res = await axios.post(url, data, {
    headers: {
      Authorization: token,
    },
  });
  return res;
};
export const getPersonDataListApi = (token) => {
  const url = '/relevanceCustomerList/';
  return axios.get(url, {
    headers: {
      Authorization: token,
    },
  });
};
export const deletePersonApi = (id, token) => {
  const url = `/deleteIndividualRelevanceCustomerById/${id}`;
  return axios.post(
    url,
    {},
    {
      headers: {
        Authorization: token,
      },
    },
  );
};
