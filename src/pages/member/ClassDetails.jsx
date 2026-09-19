import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClassById } from '../../services/classService';
import { createBooking, getMyBookings } from '../../services/bookingService';
import CapacityIndicator from '../../components/CapacityIndicator';
import { toast } from 'react-toastify';
import { ArrowLeft, Calendar, Clock, Dumbbell, MapPin, User } from 'lucide-react';

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gymClass, setGymClass] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchClass();
  }, [id]);

  const fetchClass = async () => {
    try {
      const [classData, bookingsData] = await Promise.all([
        getClassById(id),
        getMyBookings(),
      ]);
      setGymClass(classData);
      setIsBooked(bookingsData.some((b) => b.classId?._id === id));
    } catch (error) {
      toast.error('Failed to load class details');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    setBooking(true);
    try {
      await createBooking(id);
      setIsBooked(true);
      toast.success('Class booked successfully!');
      await fetchClass();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!gymClass) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Class not found</p>
        <button onClick={() => navigate('/member')} className="mt-4 text-blue-600 hover:underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const date = new Date(gymClass.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <button
        onClick={() => navigate('/member')}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Classes
      </button>

      <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-card shadow-glow">
        <div className="fitbook-details-header border-b border-brand-border bg-gradient-to-br from-brand/20 via-slate-900 to-slate-950 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="display-font text-4xl font-bold uppercase">{gymClass.name}</h1>
              <span className="mt-2 inline-block rounded border border-brand/20 bg-brand/10 px-2 py-1 text-xs text-brand">
                {gymClass.category}
              </span>
            </div>
            <span className="text-sm uppercase tracking-wider text-brand">{gymClass.status}</span>
          </div>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          <p className="text-slate-400">{gymClass.description}</p>

          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-brand-border bg-slate-950 p-4">
              <span className="text-xs text-slate-500">Trainer</span>
              <p className="mt-1 flex items-center gap-2 font-medium text-white"><User className="h-4 w-4 text-brand" />{gymClass.trainerId?.name || 'TBA'}</p>
            </div>
            <div className="rounded-xl border border-brand-border bg-slate-950 p-4">
              <span className="text-xs text-slate-500">Location</span>
              <p className="mt-1 flex items-center gap-2 font-medium text-white"><MapPin className="h-4 w-4 text-brand" />{gymClass.location}</p>
            </div>
            <div className="rounded-xl border border-brand-border bg-slate-950 p-4">
              <span className="text-xs text-slate-500">Date</span>
              <p className="mt-1 flex items-center gap-2 font-medium text-white"><Calendar className="h-4 w-4 text-brand" />{date}</p>
            </div>
            <div className="rounded-xl border border-brand-border bg-slate-950 p-4">
              <span className="text-xs text-slate-500">Time</span>
              <p className="mt-1 flex items-center gap-2 font-medium text-white"><Clock className="h-4 w-4 text-brand" />{gymClass.startTime} - {gymClass.endTime}</p>
            </div>
            <div className="rounded-xl border border-brand-border bg-slate-950 p-4">
              <span className="text-xs text-slate-500">Duration</span>
              <p className="mt-1 flex items-center gap-2 font-medium text-white"><Dumbbell className="h-4 w-4 text-brand" />{gymClass.duration} min</p>
            </div>
            <div className="rounded-xl border border-brand-border bg-slate-950 p-4">
              <span className="text-xs text-slate-500">Capacity</span>
              <p className="mt-1 font-medium text-white">{gymClass.bookedCount} / {gymClass.capacity}</p>
            </div>
          </div>

          <CapacityIndicator bookedCount={gymClass.bookedCount} capacity={gymClass.capacity} />

          <button
            onClick={handleBook}
            disabled={isBooked || gymClass.bookedCount >= gymClass.capacity || booking}
            className={`w-full py-3 rounded-lg font-medium text-lg transition-colors ${
              isBooked
                ? 'cursor-not-allowed bg-slate-800 text-slate-500'
                : gymClass.bookedCount >= gymClass.capacity
                ? 'cursor-not-allowed bg-red-500/10 text-red-300'
                : 'bg-brand text-brand-dark hover:bg-brand-hover'
            }`}
          >
            {booking
              ? 'Booking...'
              : isBooked
              ? 'Already Booked'
              : gymClass.bookedCount >= gymClass.capacity
              ? 'Class Full'
              : 'Book This Class'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
