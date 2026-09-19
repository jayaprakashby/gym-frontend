import api from './api';

export const markAttendance = async (bookingId, status) => {
  const res = await api.post('/attendance', { bookingId, status });
  return res.data;
};

export const getAttendanceByClass = async (classId) => {
  const res = await api.get(`/attendance/class/${classId}`);
  return res.data;
};
