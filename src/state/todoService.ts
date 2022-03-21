import { ErrorResponse, DataResponse } from './types';

const fetchAllTodos: () => Promise<DataResponse | ErrorResponse> = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ kind: 'dataResponse', todoItems: [] });
    }, 3000);
  });
};

export { fetchAllTodos };
