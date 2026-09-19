const CapacityIndicator = ({ bookedCount, capacity }) => {
  const percentage = capacity > 0 ? (bookedCount / capacity) * 100 : 0;
  const remaining = capacity - bookedCount;

  let barColor = 'bg-brand';
  let textColor = 'text-brand';
  let bgColor = 'bg-brand/10 border-brand/20';
  let label = `${remaining} spots available`;

  if (remaining === 0) {
    barColor = 'bg-red-500';
    textColor = 'text-red-300';
    bgColor = 'bg-red-500/10 border-red-500/20';
    label = 'Class Full';
  } else if (percentage >= 90) {
    barColor = 'bg-red-400';
    textColor = 'text-red-300';
    bgColor = 'bg-red-500/10 border-red-500/20';
    label = `Only ${remaining} spots left`;
  } else if (percentage >= 70) {
    barColor = 'bg-amber-400';
    textColor = 'text-amber-300';
    bgColor = 'bg-amber-400/10 border-amber-400/20';
    label = `Only ${remaining} spots left`;
  }

  return (
    <div className={`mt-3 rounded-xl border p-3 ${bgColor}`}>
      <div className="flex justify-between items-center text-xs mb-1.5">
        <span className={`font-semibold ${textColor}`}>{label}</span>
        <span className="font-mono text-slate-500">
          {bookedCount}/{capacity}
        </span>
      </div>
      <div className="w-full overflow-hidden rounded-full bg-slate-800 h-2">
        <div
          className={`${barColor} h-full rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default CapacityIndicator;
