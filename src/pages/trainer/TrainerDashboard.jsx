import { useState, useEffect } from 'react';
import { getClasses } from '../../services/classService';
import { markAttendance, getAttendanceByClass } from '../../services/attendanceService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const TrainerDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await getClasses({ trainer: user.id });
      setClasses(data);
    } catch (error) {
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = async (cls) => {
    setSelectedClass(cls);
    try {
      const attendanceData = await getAttendanceByClass(cls._id);
      setAttendance(attendanceData);
    } catch (error) {
      toast.error('Failed to load attendance');
    }
  };

  const handleMarkAttendance = async (bookingId, status) => {
    try {
      await markAttendance(bookingId, status);
      toast.success(`Marked as ${status}`);
      const attendanceData = await getAttendanceByClass(selectedClass._id);
      setAttendance(attendanceData);
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const getAttendanceStatus = (bookingId) => {
    const record = attendance.find((a) => a.bookingId?._id === bookingId);
    return record?.status || null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayClasses = classes.filter((c) => new Date(c.date).toISOString().split('T')[0] === today);
  const upcomingClasses = classes.filter((c) => new Date(c.date).toISOString().split('T')[0] > today);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Trainer Dashboard</h1>
        <div className="flex space-x-2 text-sm">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{classes.length} classes</span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">{attendance.filter(a => a.status === 'present').length} attended</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Class List */}
        <div className="lg:col-span-1">
          {todayClasses.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Today</h2>
              <div className="space-y-2">
                {todayClasses.map((cls) => (
                  <button
                    key={cls._id}
                    onClick={() => handleClassSelect(cls)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedClass?._id === cls._id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white hover:bg-gray-50 shadow-sm'
                    }`}
                  >
                    <p className="font-medium">{cls.name}</p>
                    <p className={`text-sm ${selectedClass?._id === cls._id ? 'text-blue-100' : 'text-gray-500'}`}>
                      {cls.startTime} - {cls.endTime} | {cls.location}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {upcomingClasses.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Upcoming</h2>
              <div className="space-y-2">
                {upcomingClasses.map((cls) => (
                  <button
                    key={cls._id}
                    onClick={() => handleClassSelect(cls)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedClass?._id === cls._id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white hover:bg-gray-50 shadow-sm'
                    }`}
                  >
                    <p className="font-medium">{cls.name}</p>
                    <p className={`text-sm ${selectedClass?._id === cls._id ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(cls.date).toLocaleDateString()} | {cls.startTime}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {classes.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">No classes assigned yet</p>
            </div>
          )}
        </div>

        {/* Right: Attendance Panel */}
        <div className="lg:col-span-2">
          {selectedClass ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 text-white">
                <h2 className="text-xl font-semibold">{selectedClass.name}</h2>
                <p className="text-blue-100 text-sm mt-1">
                  {new Date(selectedClass.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })} | {selectedClass.startTime} - {selectedClass.endTime} | {selectedClass.location}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <span className="bg-white/20 px-2 py-0.5 rounded">{selectedClass.category}</span>
                  <span className="ml-2 text-blue-200">
                    {attendance.length} booked | {attendance.filter((a) => a.status === 'present').length} present
                  </span>
                </div>
              </div>

              <div className="p-5">
                {attendance.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-lg">No bookings for this class yet</p>
                    <p className="text-gray-300 text-sm mt-1">Members will appear here once they book</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attendance.map((record) => {
                      const status = getAttendanceStatus(record.bookingId?._id);
                      return (
                        <div
                          key={record._id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                              {(record.memberId?.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{record.memberId?.name}</p>
                              <p className="text-sm text-gray-500">{record.memberId?.email}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleMarkAttendance(record.bookingId?._id, 'present')}
                              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                status === 'present'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleMarkAttendance(record.bookingId?._id, 'absent')}
                              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                status === 'absent'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg">Select a class to manage attendance</p>
              <p className="text-gray-400 text-sm mt-1">Choose from your assigned classes on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
