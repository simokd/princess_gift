import api from './api'

const productService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/products', { params })
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/products/${id}`)
    return data
  },

  getByCategory: async (categoryId) => {
    const { data } = await api.get('/products', {
      params: { categoryId },
    })
    return data
  },

  getFeatured: async () => {
    const { data } = await api.get('/products', {
      params: { featured: true },
    })
    return data
  },

  create: async (product) => {
    const { data } = await api.post('/products', {
      ...product,
      createdAt: new Date().toISOString().split('T')[0],
    })
    return data
  },

  update: async (id, product) => {
    const { data } = await api.put(`/products/${id}`, product)
    return data
  },

  delete: async (id) => {
    await api.delete(`/products/${id}`)
  },
}

export default productService
