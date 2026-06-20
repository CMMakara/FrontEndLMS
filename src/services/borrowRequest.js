
import api from './api'

export const getAllBorrowRequestAPI = async (params = {}) => {
  try {
    const res = await api.get('/borrowsRequest', {
      params: {
        search: params.search || '',
        page: params.page || 1,
        per_page: params.per_page || 10,
      },
    });
    return res.data;
  } catch (error) {
    console.log('getAllBorrowRequest error:', error);
    throw error;
  }
};