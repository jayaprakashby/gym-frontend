import api from './api';

export const getClasses = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const res = await api.get(`/classes?${params.toString()}`);
  return res.data;
};

export const getClassById = async (id) => {
  const res = await api.get(`/classes/${id}`);
  return res.data;
};

export const createClass = async (classData) => {
  const res = await api.post('/classes', classData);
  return res.data;
};

export const updateClass = async (id, classData) => {
  const res = await api.put(`/classes/${id}`, classData);
  return res.data;
};

export const deleteClass = async (id) => {
  const res = await api.delete(`/classes/${id}`);
  return res.data;
};
