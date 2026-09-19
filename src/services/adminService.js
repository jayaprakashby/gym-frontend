import api from './api';

export const getAllBookings = async () => {
  const res = await api.get('/admin/bookings');
  return res.data;
};

export const getClassBookings = async (classId) => {
  const res = await api.get(`/admin/classes/${classId}/bookings`);
  return res.data;
};

export const getAllMembers = async () => {
  const res = await api.get('/admin/members');
  return res.data;
};

export const getAllTrainers = async () => {
  const res = await api.get('/admin/trainers');
  return res.data;
};

export const createUser = async (userData) => {
  const res = await api.post('/admin/users', userData);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

export const updateUserStatus = async (id, membershipStatus) => {
  const res = await api.put(`/admin/users/${id}/status`, { membershipStatus });
  return res.data;
};
