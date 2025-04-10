// Created: Restaurant details screen implementation
// - Added restaurant details display
// - Added contact information
// - Added directions and hours

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class RestaurantDetailsScreen extends StatelessWidget {
  final String name;
  final String priceLevel;
  final String address;
  final String openHours;
  final String phoneNumber;

  const RestaurantDetailsScreen({
    super.key,
    required this.name,
    required this.priceLevel,
    required this.address,
    required this.openHours,
    required this.phoneNumber,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Row(
          children: [
            Text(
              "It's a meal!",
              style: GoogleFonts.poppins(
                fontSize: 24,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF2A2A2A),
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              "😋",
              style: TextStyle(fontSize: 24),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Center(
                  child: Icon(
                    Icons.restaurant,
                    size: 64,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      name,
                      style: GoogleFonts.poppins(
                        fontSize: 24,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  Text(
                    priceLevel,
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              _buildSection(
                "How to get there?",
                address,
                Icons.location_on,
              ),
              const SizedBox(height: 16),
              _buildSection(
                "Contact the place:",
                phoneNumber,
                Icons.phone,
              ),
              const SizedBox(height: 16),
              _buildSection(
                "Opening hours",
                openHours,
                Icons.access_time,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSection(String title, String content, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF2A2A2A),
          ),
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Icon(icon, color: Colors.grey[600]),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  content,
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    color: Colors.grey[800],
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
} 