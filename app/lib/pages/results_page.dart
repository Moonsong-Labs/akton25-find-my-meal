import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class Restaurant {
  final String name;
  final String cuisine;
  final double rating;
  final String address;
  final String imageUrl;
  final String funFact;
  final bool isOpen;
  final double distance;
  final LatLng location;

  Restaurant({
    required this.name,
    required this.cuisine,
    required this.rating,
    required this.address,
    required this.imageUrl,
    required this.funFact,
    required this.isOpen,
    required this.distance,
    required this.location,
  });
}

class ResultsPage extends StatefulWidget {
  const ResultsPage({super.key});

  @override
  State<ResultsPage> createState() => _ResultsPageState();
}

class _ResultsPageState extends State<ResultsPage> {
  bool _showMap = false;
  GoogleMapController? _mapController;
  final Set<Marker> _markers = {};

  // Mock data for demonstration
  final List<Restaurant> _restaurants = [
    Restaurant(
      name: 'La Trattoria',
      cuisine: 'Italian',
      rating: 4.8,
      address: '123 Main St, Anytown',
      imageUrl: 'https://example.com/restaurant1.jpg',
      funFact: 'Family-owned since 1985',
      isOpen: true,
      distance: 1.2,
      location: const LatLng(37.7749, -122.4194), // San Francisco coordinates
    ),
    Restaurant(
      name: 'Sushi Master',
      cuisine: 'Japanese',
      rating: 4.9,
      address: '456 Oak Ave, Anytown',
      imageUrl: 'https://example.com/restaurant2.jpg',
      funFact: 'Chef trained in Tokyo for 10 years',
      isOpen: true,
      distance: 2.5,
      location: const LatLng(37.7833, -122.4167),
    ),
    Restaurant(
      name: 'Taco Fiesta',
      cuisine: 'Mexican',
      rating: 4.7,
      address: '789 Pine St, Anytown',
      imageUrl: 'https://example.com/restaurant3.jpg',
      funFact: 'Home of the famous "El Diablo" burrito',
      isOpen: true,
      distance: 0.8,
      location: const LatLng(37.7812, -122.4207),
    ),
  ];

  @override
  void initState() {
    super.initState();
    _updateMarkers();
  }

  void _updateMarkers() {
    _markers.clear();
    for (var restaurant in _restaurants) {
      _markers.add(
        Marker(
          markerId: MarkerId(restaurant.name),
          position: restaurant.location,
          infoWindow: InfoWindow(
            title: restaurant.name,
            snippet: restaurant.cuisine,
          ),
        ),
      );
    }
  }

  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Recommended Restaurants'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(_showMap ? Icons.list : Icons.map),
            onPressed: () {
              setState(() {
                _showMap = !_showMap;
              });
            },
          ),
        ],
      ),
      body: _showMap
          ? GoogleMap(
              onMapCreated: _onMapCreated,
              initialCameraPosition: const CameraPosition(
                target: LatLng(37.7749, -122.4194),
                zoom: 13,
              ),
              markers: _markers,
              myLocationEnabled: true,
              myLocationButtonEnabled: true,
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: _restaurants.length,
              itemBuilder: (context, index) {
                final restaurant = _restaurants[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 16.0),
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: InkWell(
                    onTap: () {
                      Navigator.pushNamed(context, '/restaurant');
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ClipRRect(
                          borderRadius: const BorderRadius.vertical(
                            top: Radius.circular(16),
                          ),
                          child: Image.network(
                            restaurant.imageUrl,
                            height: 200,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                height: 200,
                                color: Colors.grey[300],
                                child: const Icon(
                                  Icons.restaurant,
                                  size: 50,
                                  color: Colors.grey,
                                ),
                              );
                            },
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    restaurant.name,
                                    style: const TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 8,
                                      vertical: 4,
                                    ),
                                    decoration: BoxDecoration(
                                      color: restaurant.isOpen
                                          ? Colors.green
                                          : Colors.red,
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text(
                                      restaurant.isOpen ? 'Open' : 'Closed',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  const Icon(
                                    Icons.star,
                                    color: Colors.amber,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    restaurant.rating.toString(),
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  const Icon(
                                    Icons.location_on,
                                    color: Colors.grey,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    '${restaurant.distance} miles',
                                    style: const TextStyle(
                                      color: Colors.grey,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                restaurant.cuisine,
                                style: TextStyle(
                                  color: Theme.of(context).colorScheme.primary,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                restaurant.address,
                                style: const TextStyle(
                                  color: Colors.grey,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Fun Fact: ${restaurant.funFact}',
                                style: const TextStyle(
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
