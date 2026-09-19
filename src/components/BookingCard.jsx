const BookingCard = ({ booking, onCancel, cancelling = false }) => {
  const gymClass = booking.classId;
  const date = new Date(gymClass?.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-5 py-3">
        <div className="flex justify-between items-center">
          <span className="text-white font-medium text-sm">{gymClass?.category}</span>
          <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded">Confirmed</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-800 text-lg">{gymClass?.name}</h3>
        <div className="mt-3 space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {gymClass?.trainerId?.name || 'TBA'}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {date}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {gymClass?.startTime} - {gymClass?.endTime}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {gymClass?.location}
          </div>
        </div>
        <button
          onClick={() => onCancel(booking._id)}
          disabled={cancelling}
          className="mt-4 w-full rounded-xl border border-red-500/20 bg-red-500/10 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-60"
        >
          {cancelling ? 'Cancelling...' : 'Cancel Booking'}
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
