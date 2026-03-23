import api from './api'

const categoryService = {
  getAll: async () => {
    const { data } = await api.get('/categories')
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/categories/${id}`)
    return data
  },

  create: async (category) => {
    const { data } = await api.post('/categories', category)
    return data
  },

  update: async (id, category) => {
    const { data } = await api.put(`/categories/${id}`, category)
    return data
  },

  delete: async (id) => {
    await api.delete(`/categories/${id}`)
  },
}

export default categoryService
