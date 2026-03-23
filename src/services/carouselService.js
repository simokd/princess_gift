import api from './api'

const carouselService = {
  getAll: async () => {
    const { data } = await api.get('/carousel')
    return data
  },

  getActive: async () => {
    const { data } = await api.get('/carousel', {
      params: { active: true },
    })
    return data
  },

  create: async (slide) => {
    const { data } = await api.post('/carousel', {
      ...slide,
      active: true,
    })
    return data
  },

  update: async (id, slide) => {
    const { data } = await api.put(`/carousel/${id}`, slide)
    return data
  },

  delete: async (id) => {
    await api.delete(`/carousel/${id}`)
  },
}

export default carouselService
