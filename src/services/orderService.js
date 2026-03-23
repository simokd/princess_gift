import api from './api'

const orderService = {
  getAll: async () => {
    const { data } = await api.get('/orders')
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/orders/${id}`)
    return data
  },

  create: async (order) => {
    const { data } = await api.post('/orders', {
      ...order,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    })
    return data
  },

  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/orders/${id}`, { status })
    return data
  },

  delete: async (id) => {
    await api.delete(`/orders/${id}`)
  },
}

export default orderService
