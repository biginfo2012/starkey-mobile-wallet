import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

axios.defaults.timeout = 30000;

export const useAxios = async <T>({
  axiosParams,
}: {
  axiosParams: AxiosRequestConfig;
  responseDataKey?: string;
}): Promise<T> => {
  return new Promise((resolve, reject) => {
    axios
      .request(axiosParams)
      .then((response: AxiosResponse<T>) => {
        resolve(response?.data);
      })
      .catch(async error => {
        if (error.response?.status.toString().includes('203')) {
          // Handle specific status code if needed
        } else if (error.response?.status.toString().includes('4')) {
          reject(error.response?.data?.message);
        } else if (error.response?.status.toString().includes('5')) {
          let errObj = {
            code: 5000,
            status: false,
            //message: Strings.somethingWentWrong,
            data: {},
          };
          reject(JSON.stringify(errObj));
        } else {
          reject(JSON.stringify(error?.response?.data));
        }
      });
  });
};
