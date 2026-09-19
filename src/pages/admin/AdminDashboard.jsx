import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClasses, createClass, updateClass, deleteClass } from '../../services/classService';
import { createUser, deleteUser, getAllBookings, getAllMembers, getAllTrainers, updateUserStatus } from '../../services/adminService';
import ClassForm from '../../components/ClassForm';
import { toast } from 'react-toastify';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const AdminDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('classes');
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classesData, bookingsData, membersData, trainersData] = await Promise.all([
        getClasses(),
        getAllBookings(),
        getAllMembers(),
        getAllTrainers(),
      ]);
      setClasses(classesData);
      setBookings(bookingsData);
      setMembers(membersData);
      setTrainers(trainersData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (classData) => {
    try {
      await createClass(classData);
      toast.success('Class created!');
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create class');
    }
  };

  const handleUpdateClass = async (classData) => {
    try {
      await updateClass(editingClass._id, classData);
      toast.success('Class updated!');
      setShowForm(false);
      setEditingClass(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to update class');
    }
  };

  const handleDeleteClass = async (id) => {
    if (window.confirm('Delete this class?')) {
      try {
        await deleteClass(id);
        toast.success('Class deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete class');
      }
    }
  };

  const handleToggleMemberStatus = async (member) => {
    const newStatus = member.membershipStatus === 'active' ? 'inactive' : 'active';
    try {
      await updateUserStatus(member._id, newStatus);
      toast.success(`Member ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await createUser(Object.fromEntries(formData.entries()));
      toast.success('User added');
      setShowUserForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add user');
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Remove ${user.name}?`)) return;

    try {
      await deleteUser(user._id);
      toast.success(`${user.role === 'trainer' ? 'Trainer' : 'Member'} removed`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove user');
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setShowForm(true);
  };

  const tabConfig = [
    { key: 'classes', label: 'Classes', count: classes.length },
    { key: 'bookings', label: 'Bookings', count: bookings.length },
    { key: 'members', label: 'Members', count: members.length },
    { key: 'trainers', label: 'Trainers', count: trainers.length },
  ];

  const analytics = classes.reduce((days, gymClass) => {
    const day = new Date(gymClass.date).toLocaleDateString('en-US', { weekday: 'short' });
    const existing = days.find((item) => item.day === day);
    if (existing) {
      existing.bookings += gymClass.bookedCount;
      existing.capacity += gymClass.capacity;
    } else {
      days.push({ day, bookings: gymClass.bookedCount, capacity: gymClass.capacity });
    }
    return days;
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="mb-6 flex items-center justify-between">
        <div><p className="text-xs uppercase tracking-[0.2em] text-brand">FITBOOK ADMIN</p><h1 className="display-font text-4xl font-bold uppercase text-white">System overview</h1></div>
        <div className="flex space-x-2 text-sm">
          <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-brand">{classes.length} classes</span>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-300">{members.length} members</span>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[['Total members', members.length], ['Active bookings', bookings.filter((booking) => booking.status === 'confirmed').length], ['Total classes', classes.length], ['Trainers', trainers.length]].map(([label, value], index) => (
          <div key={label} className="rounded-2xl border border-brand-border bg-brand-card p-5"><p className="text-xs uppercase text-slate-500">{label}</p><p className={`mt-1 text-3xl font-black ${index === 1 ? 'text-brand' : 'text-white'}`}>{value}</p></div>
        ))}
      </div>

      <div className="mb-8 rounded-2xl border border-brand-border bg-brand-card p-6">
        <h2 className="mb-4 text-lg font-bold text-white">Booking activity</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics}>
              <defs><linearGradient id="bookingFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#b7f34a" stopOpacity={0.45} /><stop offset="95%" stopColor="#b7f34a" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', color: 'var(--chart-tooltip-text)', borderRadius: 12 }} />
              <Area type="monotone" dataKey="bookings" stroke="#b7f34a" fill="url(#bookingFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tabConfig.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === key ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {activeTab === 'classes' && (
        <>
          <button
            onClick={() => { setEditingClass(null); setShowForm(true); }}
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors"
          >
            + Create Class
          </button>
          {showForm && (
            <ClassForm
              initialData={editingClass}
              onSubmit={editingClass ? handleUpdateClass : handleCreateClass}
              onCancel={() => { setShowForm(false); setEditingClass(null); }}
            />
          )}
          {classes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No classes yet</p>
              <p className="text-gray-400 text-sm mt-1">Create your first class to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <div key={cls._id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{cls.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{cls.category}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">Trainer: {cls.trainerId?.name || 'TBA'}</p>
                  <p className="text-gray-500 text-sm mb-1">
                    {new Date(cls.date).toLocaleDateString()} | {cls.startTime} - {cls.endTime}
                  </p>
                  <p className="text-gray-500 text-sm mb-1">Location: {cls.location}</p>
                  <div className="flex items-center mt-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full ${
                          cls.bookedCount >= cls.capacity ? 'bg-red-500' :
                          cls.bookedCount / cls.capacity > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((cls.bookedCount / cls.capacity) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{cls.bookedCount}/{cls.capacity}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Link to={`/classes/${cls._id}`} className="rounded bg-brand py-1.5 text-center text-sm font-medium text-brand-dark transition hover:bg-brand-hover">
                      View / Book
                    </Link>
                    <button onClick={() => handleEdit(cls)} className="rounded bg-blue-500 py-1.5 text-sm text-white transition-colors hover:bg-blue-600">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteClass(cls._id)} className="rounded bg-red-500 py-1.5 text-sm text-white transition-colors hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No bookings yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Member</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Class</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Trainer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Booked On</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{b.memberId?.name || 'Unknown'}</td>
                    <td className="py-3 px-4 text-sm">{b.classId?.name || 'Deleted'}</td>
                    <td className="py-3 px-4 text-sm">{b.classId?.trainerId?.name || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{b.status}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div>
          <button onClick={() => setShowUserForm(true)} className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium">
            + Add Member
          </button>
          {showUserForm && (
            <UserForm role="member" onSubmit={handleCreateUser} onCancel={() => setShowUserForm(false)} />
          )}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Phone</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {members.map((m) => (
                <tr key={m._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium">{m.name}</td>
                  <td className="py-3 px-4 text-sm">{m.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{m.phone || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      m.membershipStatus === 'active' ? 'bg-green-100 text-green-800' :
                      m.membershipStatus === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>{m.membershipStatus}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleMemberStatus(m)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        m.membershipStatus === 'active'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {m.membershipStatus === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDeleteUser(m)} className="ml-2 px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {activeTab === 'trainers' && (
        <div>
          <button onClick={() => setShowUserForm(true)} className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium">
            + Add Trainer
          </button>
          {showUserForm && (
            <UserForm role="trainer" onSubmit={handleCreateUser} onCancel={() => setShowUserForm(false)} />
          )}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Phone</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {trainers.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium">{t.name}</td>
                  <td className="py-3 px-4 text-sm">{t.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{t.phone || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleDeleteUser(t)} className="ml-2 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-xs font-medium">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
};

const UserForm = ({ role, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-md p-5 mb-4">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">Add {role === 'trainer' ? 'Trainer' : 'Member'}</h2>
    <input type="hidden" name="role" value={role} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input name="name" required className="border rounded px-3 py-2" placeholder="Name" />
      <input name="email" type="email" required className="border rounded px-3 py-2" placeholder="Email" />
      <input name="password" type="password" minLength="6" required className="border rounded px-3 py-2" placeholder="Password" />
      <input
        name="phone"
        type="tel"
        inputMode="numeric"
        maxLength="10"
        pattern="[0-9]{10}"
        onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '').slice(0, 10); }}
        className="border rounded px-3 py-2"
        placeholder="Phone (10 digits)"
      />
    </div>
    <div className="flex gap-2 mt-4">
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add User</button>
      <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Cancel</button>
    </div>
  </form>
);

export default AdminDashboard;
