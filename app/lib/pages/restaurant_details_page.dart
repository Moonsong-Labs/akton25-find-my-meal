import 'package:flutter/material.dart';

class RestaurantDetailsPage extends StatelessWidget {
  RestaurantDetailsPage({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock data for demonstration
    final restaurant = {
      'name': 'La Trattoria',
      'cuisine': 'Italian',
      'rating': 4.8,
      'address': '123 Main St, Anytown',
      'imageUrl': 'https://example.com/restaurant1.jpg',
      'funFact': 'Family-owned since 1985',
      'isOpen': true,
      'distance': 1.2,
      'description':
          'Authentic Italian cuisine with a modern twist. Our chef brings 20 years of experience from Naples, Italy.',
      'hours': {
        'Monday': '11:00 AM - 10:00 PM',
        'Tuesday': '11:00 AM - 10:00 PM',
        'Wednesday': '11:00 AM - 10:00 PM',
        'Thursday': '11:00 AM - 11:00 PM',
        'Friday': '11:00 AM - 11:00 PM',
        'Saturday': '10:00 AM - 11:00 PM',
        'Sunday': '10:00 AM - 9:00 PM',
      },
      'priceRange': '\$\$',
      'phone': '(555) 123-4567',
      'website': 'www.latrattoria.com',
      'popularDishes': [
        'Spaghetti Carbonara',
        'Margherita Pizza',
        'Tiramisu',
        'Lasagna',
      ],
    };

    return Scaffold(
      appBar: AppBar(
        title: const Text('Restaurant Details'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Image.network(
              restaurant['imageUrl'] as String,
              height: 250,
              width: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  height: 250,
                  color: Colors.grey[300],
                  child: const Icon(
                    Icons.restaurant,
                    size: 50,
                    color: Colors.grey,
                  ),
                );
              },
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        restaurant['name'] as String,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color:
                              restaurant['isOpen'] as bool
                                  ? Colors.green
                                  : Colors.red,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          restaurant['isOpen'] as bool ? 'Open' : 'Closed',
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
                      const Icon(Icons.star, color: Colors.amber, size: 20),
                      const SizedBox(width: 4),
                      Text(
                        restaurant['rating'].toString(),
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(width: 16),
                      const Icon(
                        Icons.location_on,
                        color: Colors.grey,
                        size: 20,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${restaurant['distance']} miles',
                        style: const TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    restaurant['description'] as String,
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Hours',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  ...(restaurant['hours'] as Map<String, String>).entries.map(
                    (entry) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            entry.key,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          Text(entry.value),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Popular Dishes',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  ...(restaurant['popularDishes'] as List<String>).map(
                    (dish) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.restaurant_menu,
                            size: 20,
                            color: Colors.grey,
                          ),
                          const SizedBox(width: 8),
                          Text(dish),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            // Implement call functionality
                          },
                          icon: const Icon(Icons.phone),
                          label: const Text('Call'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor:
                                Theme.of(context).colorScheme.primary,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            // Implement website navigation
                          },
                          icon: const Icon(Icons.language),
                          label: const Text('Website'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor:
                                Theme.of(context).colorScheme.primary,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
