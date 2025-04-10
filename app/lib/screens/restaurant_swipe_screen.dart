// Updated: Restaurant swipe screen implementation
// - Added real photos
// - Enhanced Tinder-like design
// - Improved card animations

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'restaurant_details_screen.dart';

class Restaurant {
  final String name;
  final String imageUrl;
  final String description;
  final List<String> tags;
  final double rating;
  final String priceLevel;
  final String address;
  final String openHours;
  final String phoneNumber;

  Restaurant({
    required this.name,
    required this.imageUrl,
    required this.description,
    required this.tags,
    required this.rating,
    required this.priceLevel,
    required this.address,
    required this.openHours,
    required this.phoneNumber,
  });
}

class RestaurantSwipeScreen extends StatefulWidget {
  const RestaurantSwipeScreen({super.key});

  @override
  State<RestaurantSwipeScreen> createState() => _RestaurantSwipeScreenState();
}

class _RestaurantSwipeScreenState extends State<RestaurantSwipeScreen> {
  final List<Restaurant> _restaurants = [
    Restaurant(
      name: "La Cucina Italiana",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
      description: "Authentic Italian cuisine in a cozy atmosphere. Famous for homemade pasta and wood-fired pizzas.",
      tags: ["Italian", "Pizza", "Pasta"],
      rating: 4.8,
      priceLevel: "\$\$\$",
      address: "123 Gourmet Street",
      openHours: "12:00 PM - 11:00 PM",
      phoneNumber: "+1 (555) 123-4567",
    ),
    Restaurant(
      name: "Sushi Master",
      imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800",
      description: "Premium Japanese dining experience with fresh sushi and sashimi. Omakase available.",
      tags: ["Japanese", "Sushi", "Asian"],
      rating: 4.9,
      priceLevel: "\$\$\$\$",
      address: "456 Ocean Avenue",
      openHours: "11:30 AM - 10:30 PM",
      phoneNumber: "+1 (555) 234-5678",
    ),
    Restaurant(
      name: "The Burger Joint",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
      description: "Gourmet burgers made with premium ingredients. Craft beers and amazing milkshakes.",
      tags: ["American", "Burgers", "Beer"],
      rating: 4.7,
      priceLevel: "\$\$",
      address: "789 Foodie Boulevard",
      openHours: "11:00 AM - 12:00 AM",
      phoneNumber: "+1 (555) 345-6789",
    ),
  ];

  int _currentIndex = 0;
  double _swipeOffset = 0;
  bool _isSwiping = false;

  void _onHorizontalDragUpdate(DragUpdateDetails details) {
    setState(() {
      _swipeOffset += details.delta.dx;
      _isSwiping = true;
    });
  }

  void _onHorizontalDragEnd(DragEndDetails details) {
    final velocity = details.velocity.pixelsPerSecond.dx;
    final swipeThreshold = MediaQuery.of(context).size.width * 0.4;

    if (_swipeOffset.abs() > swipeThreshold || velocity.abs() > 1000) {
      if (_swipeOffset > 0) {
        _saveRestaurant();
      } else {
        _skipRestaurant();
      }
    } else {
      setState(() {
        _swipeOffset = 0;
        _isSwiping = false;
      });
    }
  }

  void _saveRestaurant() {
    setState(() {
      _currentIndex = (_currentIndex + 1) % _restaurants.length;
      _swipeOffset = 0;
      _isSwiping = false;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Saved ${_restaurants[_currentIndex].name} for later!')),
    );
  }

  void _skipRestaurant() {
    setState(() {
      _currentIndex = (_currentIndex + 1) % _restaurants.length;
      _swipeOffset = 0;
      _isSwiping = false;
    });
  }

  void _selectRestaurant() {
    final restaurant = _restaurants[_currentIndex];
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => RestaurantDetailsScreen(
          name: restaurant.name,
          priceLevel: restaurant.priceLevel,
          address: restaurant.address,
          openHours: restaurant.openHours,
          phoneNumber: restaurant.phoneNumber,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final restaurant = _restaurants[_currentIndex];
    final screenSize = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          "Swipe right on your next meal",
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF2A2A2A),
          ),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: GestureDetector(
              onHorizontalDragUpdate: _onHorizontalDragUpdate,
              onHorizontalDragEnd: _onHorizontalDragEnd,
              child: Transform.translate(
                offset: Offset(_swipeOffset, 0),
                child: Transform.rotate(
                  angle: _swipeOffset / screenSize.width * 0.2,
                  child: Card(
                    margin: const EdgeInsets.all(16),
                    elevation: 8,
                    clipBehavior: Clip.antiAlias,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Stack(
                      children: [
                        // Background Image
                        Positioned.fill(
                          child: Image.network(
                            restaurant.imageUrl,
                            fit: BoxFit.cover,
                          ),
                        ),
                        // Gradient Overlay
                        Positioned.fill(
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Colors.transparent,
                                  Colors.black.withOpacity(0.3),
                                  Colors.black.withOpacity(0.7),
                                ],
                              ),
                            ),
                          ),
                        ),
                        // Content
                        Positioned(
                          left: 16,
                          right: 16,
                          bottom: 16,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      restaurant.name,
                                      style: GoogleFonts.poppins(
                                        fontSize: 28,
                                        fontWeight: FontWeight.w600,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                  Text(
                                    restaurant.priceLevel,
                                    style: GoogleFonts.poppins(
                                      fontSize: 20,
                                      color: Colors.white.withOpacity(0.9),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                restaurant.description,
                                style: GoogleFonts.poppins(
                                  fontSize: 16,
                                  color: Colors.white.withOpacity(0.9),
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 12),
                              Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                children: restaurant.tags.map((tag) => Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    tag,
                                    style: GoogleFonts.poppins(
                                      fontSize: 14,
                                      color: Colors.white,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                )).toList(),
                              ),
                            ],
                          ),
                        ),
                        // Swipe Indicator
                        if (_swipeOffset != 0)
                          Positioned(
                            top: 32,
                            right: _swipeOffset > 0 ? 32 : null,
                            left: _swipeOffset < 0 ? 32 : null,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 24,
                                vertical: 12,
                              ),
                              decoration: BoxDecoration(
                                color: _swipeOffset > 0 ? Colors.green : Colors.red,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: Colors.white,
                                  width: 2,
                                ),
                              ),
                              child: Text(
                                _swipeOffset > 0 ? 'SAVE' : 'SKIP',
                                style: GoogleFonts.poppins(
                                  color: Colors.white,
                                  fontSize: 24,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildEmojiButton("🤢", Colors.red, _skipRestaurant),
                _buildEmojiButton("😋", Colors.blue, _selectRestaurant, isSuper: true),
                _buildEmojiButton("🤔", Colors.green, _saveRestaurant),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmojiButton(String emoji, Color color, VoidCallback onPressed, {bool isSuper = false}) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        width: isSuper ? 72 : 64,
        height: isSuper ? 72 : 64,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: color.withOpacity(0.1),
          border: isSuper ? Border.all(color: color, width: 2) : null,
          boxShadow: isSuper ? [
            BoxShadow(
              color: color.withOpacity(0.2),
              blurRadius: 8,
              spreadRadius: 2,
            ),
          ] : null,
        ),
        child: Center(
          child: Text(
            emoji,
            style: TextStyle(
              fontSize: isSuper ? 36 : 32,
            ),
          ),
        ),
      ),
    );
  }
} 