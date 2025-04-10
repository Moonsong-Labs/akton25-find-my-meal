import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class Restaurant {
  final String name;
  final String image;
  final double rating;
  final String distance;
  final String cuisine;
  final String priceRange;
  final bool isOpenNow;

  Restaurant({
    required this.name,
    required this.image,
    required this.rating,
    required this.distance,
    required this.cuisine,
    required this.priceRange,
    required this.isOpenNow,
  });
}

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final TextEditingController _searchController = TextEditingController();
  bool _isLoading = false;

  // Filter state
  String _selectedCuisine = 'Any';
  String _selectedPrice = 'Any';
  double _maxDistance = 5.0;
  bool _isOpenNow = false;
  List<Restaurant> _filteredRestaurants = [];

  final List<String> _cuisines = [
    'Any',
    'Italian',
    'Mexican',
    'Chinese',
    'Japanese',
    'Indian',
    'American',
    'Mediterranean',
    'Thai',
    'Vietnamese',
  ];

  final List<String> _prices = [
    'Any',
    '\$',
    '\$\$',
    '\$\$\$',
    '\$\$\$\$',
  ];

  // Sample restaurant data
  final List<Restaurant> _restaurants = [
    Restaurant(
      name: 'Italian Bistro',
      image: 'assets/images/restaurant_1.jpg',
      rating: 4.8,
      distance: '0.3 mi',
      cuisine: 'Italian',
      priceRange: '\$\$\$',
      isOpenNow: true,
    ),
    Restaurant(
      name: 'Sushi Master',
      image: 'assets/images/restaurant_2.jpg',
      rating: 4.5,
      distance: '0.5 mi',
      cuisine: 'Japanese',
      priceRange: '\$\$\$\$',
      isOpenNow: true,
    ),
    Restaurant(
      name: 'Taco Heaven',
      image: 'assets/images/restaurant_3.jpg',
      rating: 4.3,
      distance: '0.7 mi',
      cuisine: 'Mexican',
      priceRange: '\$',
      isOpenNow: true,
    ),
    Restaurant(
      name: 'Golden Dragon',
      image: 'assets/images/restaurant_4.jpg',
      rating: 4.6,
      distance: '0.9 mi',
      cuisine: 'Chinese',
      priceRange: '\$\$',
      isOpenNow: false,
    ),
    Restaurant(
      name: 'Mediterranean Delight',
      image: 'assets/images/restaurant_5.jpg',
      rating: 4.7,
      distance: '1.1 mi',
      cuisine: 'Mediterranean',
      priceRange: '\$\$\$',
      isOpenNow: true,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _filteredRestaurants = _restaurants;
  }

  void _showFilters() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
          ),
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Filters',
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Text(
                  'Cuisine',
                  style: GoogleFonts.lato(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _cuisines.map((cuisine) {
                    return FilterChip(
                      label: Text(cuisine),
                      selected: _selectedCuisine == cuisine,
                      onSelected: (selected) {
                        setModalState(() {
                          setState(() {
                            _selectedCuisine = cuisine;
                          });
                        });
                      },
                    );
                  }).toList(),
                ),
                const SizedBox(height: 24),
                Text(
                  'Price Range',
                  style: GoogleFonts.lato(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _prices.map((price) {
                    return FilterChip(
                      label: Text(price),
                      selected: _selectedPrice == price,
                      onSelected: (selected) {
                        setModalState(() {
                          setState(() {
                            _selectedPrice = price;
                          });
                        });
                      },
                    );
                  }).toList(),
                ),
                const SizedBox(height: 24),
                Text(
                  'Maximum Distance: ${_maxDistance.toStringAsFixed(1)} miles',
                  style: GoogleFonts.lato(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Slider(
                  value: _maxDistance,
                  min: 1,
                  max: 20,
                  divisions: 19,
                  label: _maxDistance.toStringAsFixed(1),
                  onChanged: (value) {
                    setModalState(() {
                      setState(() {
                        _maxDistance = value;
                      });
                    });
                  },
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Checkbox(
                      value: _isOpenNow,
                      onChanged: (value) {
                        setModalState(() {
                          setState(() {
                            _isOpenNow = value ?? false;
                          });
                        });
                      },
                    ),
                    Text(
                      'Open Now',
                      style: GoogleFonts.lato(
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      _performSearch();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).primaryColor,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Text(
                      'Apply Filters',
                      style: GoogleFonts.lato(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _performSearch() {
    final searchQuery = _searchController.text.toLowerCase();

    setState(() {
      _filteredRestaurants = _restaurants.where((restaurant) {
        // Apply search query filter
        if (searchQuery.isNotEmpty) {
          final matchesSearch =
              restaurant.name.toLowerCase().contains(searchQuery) ||
                  restaurant.cuisine.toLowerCase().contains(searchQuery);
          if (!matchesSearch) return false;
        }

        // Apply cuisine filter
        if (_selectedCuisine != 'Any' &&
            restaurant.cuisine != _selectedCuisine) {
          return false;
        }

        // Apply price filter
        if (_selectedPrice != 'Any' &&
            restaurant.priceRange != _selectedPrice) {
          return false;
        }

        // Apply distance filter
        final distance =
            double.parse(restaurant.distance.replaceAll(' mi', ''));
        if (distance > _maxDistance) {
          return false;
        }

        // Apply open now filter
        if (_isOpenNow && !restaurant.isOpenNow) {
          return false;
        }

        return true;
      }).toList();
    });

    if (_filteredRestaurants.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('No restaurants found matching your criteria')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Find My Meal',
          style: GoogleFonts.playfairDisplay(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilters,
          ),
        ],
      ),
      body: Stack(
        children: [
          // Background Image
          Image.asset(
            'assets/images/search_background.jpg',
            fit: BoxFit.cover,
            width: double.infinity,
            height: double.infinity,
          ),
          // Gradient Overlay
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.black.withOpacity(0.3),
                  Colors.black.withOpacity(0.7),
                ],
              ),
            ),
          ),
          SafeArea(
            child: Column(
              children: [
                // Search Bar
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 10,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: TextField(
                      controller: _searchController,
                      decoration: InputDecoration(
                        hintText: 'Search for restaurants...',
                        hintStyle: GoogleFonts.lato(
                          color: Colors.grey[600],
                        ),
                        prefixIcon: const Icon(Icons.search),
                        suffixIcon: IconButton(
                          icon: const Icon(Icons.filter_list),
                          onPressed: _showFilters,
                        ),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 15,
                        ),
                      ),
                      style: GoogleFonts.lato(
                        fontSize: 16,
                      ),
                      onSubmitted: (_) => _performSearch(),
                    ),
                  ),
                ),
                // Restaurant List
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(20),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 10,
                          offset: const Offset(0, -5),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Found ${_filteredRestaurants.length} Restaurants',
                                style: GoogleFonts.playfairDisplay(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  // Reset filters
                                  setState(() {
                                    _selectedCuisine = 'Any';
                                    _selectedPrice = 'Any';
                                    _maxDistance = 5.0;
                                    _isOpenNow = false;
                                    _searchController.clear();
                                    _filteredRestaurants = _restaurants;
                                  });
                                },
                                child: Text(
                                  'Reset Filters',
                                  style: GoogleFonts.lato(
                                    color: Theme.of(context).primaryColor,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Expanded(
                          child: ListView.builder(
                            padding: const EdgeInsets.only(
                                left: 16, right: 16, bottom: 16),
                            itemCount: _filteredRestaurants.length,
                            itemBuilder: (context, index) {
                              final restaurant = _filteredRestaurants[index];
                              return GestureDetector(
                                onTap: () {
                                  Navigator.pushNamed(
                                    context,
                                    '/restaurant-detail',
                                    arguments: {
                                      'name': restaurant.name,
                                      'rating': restaurant.rating,
                                      'distance': restaurant.distance,
                                      'image': restaurant.image,
                                    },
                                  );
                                },
                                child: Container(
                                  margin: const EdgeInsets.only(bottom: 16),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(12),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.1),
                                        blurRadius: 10,
                                        offset: const Offset(0, 5),
                                      ),
                                    ],
                                  ),
                                  child: Row(
                                    children: [
                                      ClipRRect(
                                        borderRadius:
                                            const BorderRadius.horizontal(
                                          left: Radius.circular(12),
                                        ),
                                        child: Image.asset(
                                          restaurant.image,
                                          width: 100,
                                          height: 100,
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                      Expanded(
                                        child: Padding(
                                          padding: const EdgeInsets.all(12.0),
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                restaurant.name,
                                                style: GoogleFonts.lato(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              const SizedBox(height: 4),
                                              Row(
                                                children: [
                                                  const Icon(
                                                    Icons.star,
                                                    color: Colors.amber,
                                                    size: 16,
                                                  ),
                                                  const SizedBox(width: 4),
                                                  Text(
                                                    restaurant.rating
                                                        .toString(),
                                                    style: GoogleFonts.lato(
                                                      fontSize: 12,
                                                    ),
                                                  ),
                                                  const SizedBox(width: 8),
                                                  Text(
                                                    '•',
                                                    style: GoogleFonts.lato(
                                                      color: Colors.grey,
                                                    ),
                                                  ),
                                                  const SizedBox(width: 8),
                                                  Text(
                                                    restaurant.distance,
                                                    style: GoogleFonts.lato(
                                                      fontSize: 12,
                                                      color: Colors.grey,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                              const SizedBox(height: 4),
                                              Text(
                                                '${restaurant.cuisine} • ${restaurant.priceRange}',
                                                style: GoogleFonts.lato(
                                                  fontSize: 12,
                                                  color: Colors.grey,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}
