import dayjs from 'dayjs';
import axios from 'axios';
export function getWeekDay(date: string) {
  const day = dayjs(date).day();
  const week = ['日', '一', '二', '三', '四', '五', '六'];
  return `${date}  ||  星期${week[day]}`;
}

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
