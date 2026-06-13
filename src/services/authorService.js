import api  from "./api";

export const getAllAuthorAPI = async ({
  sort_by = "",
  search = "",
  all = false,
  page = 1,
  per_page = 100,
} = {}) => {
  try {
    const params = {
      search,
      sort_by,
      page,
    };

    if (!all) {
      params.per_page = per_page;
    }

    const res = await api.get("/authors", { params });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateAuthorAPI = async (id ,data) =>{
  try {
    let res = await api.put(`/authors/${id}` , data)
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const deteleAuthorAPI = async (id) =>{
  try {
    let res = await api.delete(`/authors/${id}`)
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const createAuthorAPI = async (data) =>{
  try {
    let res = await api.post('/authors' ,data)
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}