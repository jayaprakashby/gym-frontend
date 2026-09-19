import api from './api';

export const createBooking = async (classId) => {
  const res = await api.post('/bookings', { classId });
  return res.data;
};

export const getMyBookings = async () => {
  const res = await api.get('/bookings/my');
  return res.data;
};

export const cancelBooking = async (id) => {
  const res = await api.delete(`/bookings/${id}`);
  return res.data;
};

export const getAllBookings = async () => {
  const res = await api.get('/admin/bookings');
  return res.data;
};
