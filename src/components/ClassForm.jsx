import { useState, useEffect } from 'react';
import { getAllTrainers } from '../services/adminService';

const ClassForm = ({ initialData, onSubmit, onCancel }) => {
  const [trainers, setTrainers] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    trainerId: initialData?.trainerId?._id || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    duration: initialData?.duration || 60,
    capacity: initialData?.capacity || 20,
    location: initialData?.location || '',
    category: initialData?.category || 'Yoga',
  });

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const data = await getAllTrainers();
        setTrainers(data);
      } catch (err) {
        console.error('Failed to load trainers');
      }
    };
    fetchTrainers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((current) => ({ ...current, [e.target.name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    const requiredFields = {
      name: 'Class name is required.',
      description: 'Description is required.',
      trainerId: 'Please select a trainer.',
      location: 'Location is required.',
      date: 'Date is required.',
      startTime: 'Start time is required.',
      endTime: 'End time is required.',
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!String(formData[field]).trim()) nextErrors[field] = message;
    });

    if (formData.name.trim() && formData.name.trim().length < 3) {
      nextErrors.name = 'Class name must be at least 3 characters.';
    }
    if (formData.description.trim() && formData.description.trim().length < 10) {
      nextErrors.description = 'Description must be at least 10 characters.';
    }
    if (Number(formData.duration) < 15) {
      nextErrors.duration = 'Duration must be at least 15 minutes.';
    }
    if (Number(formData.capacity) < 1) {
      nextErrors.capacity = 'Capacity must be at least 1 person.';
    }
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      nextErrors.endTime = 'End time must be later than start time.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500">
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? 'Edit Class' : 'Create New Class'}
      </h3>
      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Morning Yoga"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Yoga">Yoga</option>
            <option value="Pilates">Pilates</option>
            <option value="Zumba">Zumba</option>
            <option value="HIIT">HIIT</option>
            <option value="Strength">Strength</option>
            <option value="Cardio">Cardio</option>
            <option value="CrossFit">CrossFit</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Describe the class..."
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            rows={2}
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trainer</label>
          <select
            name="trainerId"
            value={formData.trainerId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.trainerId ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={Boolean(errors.trainerId)}
          >
            <option value="">Select a trainer</option>
            {trainers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
          {errors.trainerId && <p className="mt-1 text-sm text-red-600">{errors.trainerId}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            placeholder="e.g. Studio A"
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={Boolean(errors.location)}
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={Boolean(errors.date)}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={Boolean(errors.duration)}
            min={15}
            step={15}
          />
          {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.startTime ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={Boolean(errors.startTime)}
          />
          {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.endTime ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={Boolean(errors.endTime)}
          />
          {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.capacity ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={Boolean(errors.capacity)}
            min={1}
          />
          {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
        </div>
        <div className="md:col-span-2 flex space-x-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            {initialData ? 'Update Class' : 'Create Class'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassForm;
