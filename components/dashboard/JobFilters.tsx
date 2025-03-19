"use client";

interface JobFiltersProps {
  onFilterChange: (filters: {
    status: string;
    sortBy: string;
    searchTerm: string;
  }) => void;
}

export default function JobFilters({ onFilterChange }: JobFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 mb-2">Status</label>
          <select
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Sort By</label>
          <select
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="budget_high">Budget: High to Low</option>
            <option value="budget_low">Budget: Low to High</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Search</label>
          <input
            type="text"
            placeholder="Search jobs..."
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </div>
    </div>
  );
} 