interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

const categories = ['All', 'Crops', 'Livestock', 'Market', 'Technology', 'Climate'];

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category === 'All' ? '' : category)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            (category === 'All' && !selected) || selected === category
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
