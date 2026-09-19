import { Link } from 'react-router-dom';
import CapacityIndicator from './CapacityIndicator';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

const ClassCard = ({ gymClass, onBook, showBookButton = true, isBooked = false, booking = false }) => {
  const date = new Date(gymClass.date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isFull = gymClass.bookedCount >= gymClass.capacity;

  return (
    <div className="fitbook-class-card flex flex-col rounded-2xl border border-brand-border bg-brand-card/90 p-5 transition hover:-translate-y-1 hover:border-slate-600 hover:shadow-glow">
      <div className="flex justify-between items-start mb-2">
        <Link to={`/classes/${gymClass._id}`} className="text-lg font-bold text-white transition hover:text-brand">
          {gymClass.name}
        </Link>
        <span className="rounded border border-brand/20 bg-brand/10 px-2 py-1 text-xs font-semibold text-brand">
          {gymClass.category}
        </span>
      </div>

      <p className="mb-3 line-clamp-2 flex-grow text-sm text-slate-400">{gymClass.description}</p>

      <div className="space-y-2 text-sm text-slate-400">
        <div className="flex items-center">
          <User className="mr-1.5 h-4 w-4 text-slate-500" />
          {gymClass.trainerId?.name || 'TBA'}
        </div>
        <div className="flex items-center">
          <Calendar className="mr-1.5 h-4 w-4 text-slate-500" />
          {date}
        </div>
        <div className="flex items-center">
          <Clock className="mr-1.5 h-4 w-4 text-slate-500" />
          {gymClass.startTime} - {gymClass.endTime}
        </div>
        <div className="flex items-center">
          <MapPin className="mr-1.5 h-4 w-4 text-slate-500" />
          {gymClass.location}
        </div>
      </div>

      <CapacityIndicator bookedCount={gymClass.bookedCount} capacity={gymClass.capacity} />

      {showBookButton && (
        <div className="mt-4 flex space-x-2">
          <Link
            to={`/classes/${gymClass._id}`}
            className="flex-1 rounded-xl border border-slate-700 py-2 text-center text-sm font-medium text-slate-300 transition hover:border-brand hover:text-brand"
          >
            Details
          </Link>
          <button
            onClick={() => onBook(gymClass._id)}
            disabled={isBooked || isFull || booking}
            className={`flex-1 rounded-xl py-2 text-sm font-medium transition-colors ${
              isBooked
                ? 'cursor-not-allowed bg-slate-800 text-slate-500'
                : isFull
                ? 'cursor-not-allowed bg-red-500/10 text-red-300'
                : 'bg-brand text-brand-dark hover:bg-brand-hover'
            }`}
          >
            {booking ? 'Booking...' : isBooked ? 'Booked' : isFull ? 'Full' : 'Book'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassCard;
