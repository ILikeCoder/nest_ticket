import axios from 'axios';
export const insertPersonApi = async (data, token) => {
  const url =
    'https://seep.sdstm.cn/ticket/backend/operate/wx/insertIndividualRelevanceCustomer';
  const res = await axios.post(url, data, {
    headers: {
      Authorization: token,
    },
  });
  return res;
};
export const getPersonDataListApi = (token) => {
  const url =
    'https://seep.sdstm.cn/ticket/backend/operate/wx/relevanceCustomerList/';
  return axios.get(url, {
    headers: {
      Authorization: token,
    },
  });
};
export const deletePersonApi = (id, token) => {
  const url = `https://seep.sdstm.cn/ticket/backend/operate/wx/deleteIndividualRelevanceCustomerById/${id}`;
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
