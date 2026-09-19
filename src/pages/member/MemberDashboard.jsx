import { useState, useEffect } from 'react';
import { getClasses } from '../../services/classService';
import { createBooking, getMyBookings, cancelBooking } from '../../services/bookingService';
import ClassCard from '../../components/ClassCard';
import BookingCard from '../../components/BookingCard';
import { toast } from 'react-toastify';
import { ArrowRight, Calendar, Dumbbell, Search, Sparkles, User } from 'lucide-react';

const MemberDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('classes');
  const [filters, setFilters] = useState({ category: '', date: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [bookingClassId, setBookingClassId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [classesData, bookingsData] = await Promise.all([
        getClasses(filters),
        getMyBookings(),
      ]);
      setClasses(classesData);
      setMyBookings(bookingsData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (classId) => {
    if (bookingClassId) return;
    setBookingClassId(classId);
    try {
      await createBooking(classId);
      toast.success('Class booked successfully!');
      await fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingClassId(null);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setCancellingId(bookingId);
      try {
        await cancelBooking(bookingId);
        toast.success('Booking cancelled');
        await fetchData();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel booking');
      } finally {
        setCancellingId(null);
      }
    }
  };

  const isBooked = (classId) => {
    return myBookings.some((b) => b.classId?._id === classId);
  };

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            <Sparkles className="h-3.5 w-3.5" /> Your training floor is ready
          </div>
          <h1 className="display-font text-5xl font-extrabold uppercase leading-none text-white sm:text-6xl">Train hard.<br /><span className="text-brand">Book smart.</span></h1>
          <p className="mt-4 max-w-xl text-slate-400">Discover your next session, reserve a slot in seconds, and keep your momentum moving.</p>
        </div>
        <div className="fitbook-next-card relative hidden min-h-56 overflow-hidden rounded-3xl border border-brand-border bg-gradient-to-br from-brand/20 via-slate-900 to-slate-950 p-6 lg:block">
          <Dumbbell className="absolute -right-3 -top-6 h-48 w-48 rotate-12 text-brand/20" />
          <div className="relative flex h-full flex-col justify-end">
            <p className="text-xs uppercase tracking-[0.2em] text-brand">Next up</p>
            <p className="mt-2 text-2xl font-bold text-white">Make the next rep count.</p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-brand-border bg-brand-card p-5"><p className="text-xs uppercase text-slate-500">Total classes</p><p className="mt-1 text-3xl font-black text-white">{myBookings.length}</p></div>
        <div className="rounded-2xl border border-brand-border bg-brand-card p-5"><p className="text-xs uppercase text-slate-500">Completed</p><p className="mt-1 text-3xl font-black text-brand">{myBookings.filter((booking) => booking.status === 'completed').length}</p></div>
        <div className="rounded-2xl border border-brand-border bg-brand-card p-5"><p className="text-xs uppercase text-slate-500">Attendance rate</p><p className="mt-1 text-3xl font-black text-white">--</p></div>
      </div>

      <div className="mb-6 flex w-fit space-x-1 rounded-xl border border-brand-border bg-slate-950 p-1">
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
            activeTab === 'classes' ? 'bg-brand text-brand-dark shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Browse Classes ({classes.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
            activeTab === 'bookings' ? 'bg-brand text-brand-dark shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          My Bookings ({myBookings.length})
        </button>
      </div>

      {activeTab === 'classes' && (
        <>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 rounded-xl border border-brand-border bg-slate-950 px-4 py-3 text-black placeholder:text-slate-600 focus:border-brand focus:outline-none"
            />
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="rounded-xl border border-brand-border bg-slate-950 px-4 py-3 text-slate-300 focus:border-brand focus:outline-none"
            >
              <option value="">All Categories</option>
              <option value="Yoga">Yoga</option>
              <option value="Pilates">Pilates</option>
              <option value="Zumba">Zumba</option>
              <option value="HIIT">HIIT</option>
              <option value="Strength">Strength</option>
              <option value="Cardio">Cardio</option>
              <option value="CrossFit">CrossFit</option>
            </select>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="rounded-xl border border-brand-border bg-slate-950 px-4 py-3 text-slate-300 focus:border-brand focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-brand-border bg-brand-card p-12 text-center">
                <Search className="mx-auto h-10 w-10 text-slate-600" />
                <p className="mt-3 text-lg text-slate-300">No classes available</p>
                <p className="mt-1 text-sm text-slate-500">Try another search or category.</p>
              </div>
            ) : (
              filteredClasses.map((cls) => (
                <ClassCard
                  key={cls._id}
                  gymClass={cls}
                  onBook={handleBook}
                  isBooked={isBooked(cls._id)}
                  booking={bookingClassId === cls._id}
                />
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'bookings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myBookings.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No bookings yet</p>
              <p className="text-gray-400 text-sm mt-1">Browse classes and book your first session</p>
              <button
                onClick={() => setActiveTab('classes')}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Browse Classes
              </button>
            </div>
          ) : (
            myBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} cancelling={cancellingId === booking._id} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;
