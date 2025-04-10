import { SearchResult } from '@/types/restaurant';
import { StarIcon } from '@heroicons/react/20/solid';

interface SearchResultsProps {
  results: SearchResult;
}

export function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Found {results.restaurants.length} restaurants
        </h3>
        <div className="text-sm text-gray-500">
          Sorted by relevance
        </div>
      </div>

      <div className="space-y-4">
        {results.restaurants.map((restaurant) => (
          <div
            key={restaurant.place_id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {restaurant.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {restaurant.vicinity}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {restaurant.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({restaurant.user_ratings_total} reviews)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {restaurant.opening_hours?.open_now && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Open Now
                  </span>
                )}
                {restaurant.distance && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {restaurant.distance.toFixed(1)} km away
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                {restaurant.formatted_phone_number && (
                  <a
                    href={`tel:${restaurant.formatted_phone_number}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    📞 {restaurant.formatted_phone_number}
                  </a>
                )}
                {restaurant.website && (
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    🌐 Website
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">
                    Matching Factors
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {results.analysis.matching_factors.map((factor, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">
                    Potential Concerns
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {results.analysis.concerns.map((concern, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-yellow-500 mr-2">!</span>
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 