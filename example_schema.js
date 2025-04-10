/**
 * JSON Schema with explanatory comments to guide the AI
 * This file is for reference only and should not be used directly as JSON
 */

const restaurantSchema = {
  "restaurant": {
    // Full restaurant name from Google Maps API
    "name": "Delicious Bites",
    
    // Unique Google Places ID used for API calls and data retrieval
    "placeId": "ChIJ5678ijkl9012mnop",
    
    "address": {
      // Complete formatted address from Google Maps API
      "formatted": "456 Food Street, Sample City, Sample Country",
      
      "components": {
        // Street name and number from Google Maps API
        "street": "456 Food Street",
        
        // City from Google Maps API
        "city": "Sample City",
        
        // State or province from Google Maps API
        "state": "Sample State",
        
        // Postal/ZIP code from Google Maps API
        "postalCode": "94103",
        
        // Country from Google Maps API
        "country": "Sample Country"
      },
      
      "location": {
        // Decimal latitude from Google Maps API
        "latitude": 37.7750,
        
        // Decimal longitude from Google Maps API
        "longitude": -122.4195
      }
    },
    
    "contact": {
      // Phone number with country code from Google Maps API
      "phone": "+1-234-567-8901",
      
      // Main restaurant website URL from Google Maps API
      "website": "https://www.deliciousbites.com",
      
      // Direct menu link - can be from Google Maps or optiona if not available
      "menuLink": "https://www.deliciousbites.com/menu"
    },
    
    // Opening hours for each day of the week from Google Maps API
    "openingHours": [
      {
        // Day of the week
        "day": "Monday",
        
        // Opening time in 12-hour format
        "open": "8:00 AM",
        
        // Closing time in 12-hour format
        "close": "10:00 PM"
      },
      // Repeat for each day of the week...
      {
        "day": "Tuesday",
        "open": "8:00 AM",
        "close": "10:00 PM"
      },
      {
        "day": "Wednesday",
        "open": "8:00 AM",
        "close": "10:00 PM"
      }
    ],
    
    // Boolean indicator if restaurant is currently open, from Google Maps API
    "isThisRestaurantOpenNow": true,
    
    "rating": {
      // Average rating on 5-point scale from Google Maps API
      "average": 4.5,
      
      // Total number of reviews from Google Maps API
      "reviewCount": 125,
      
      // Sample of recent reviews from Google Maps API
      "reviews": [
        {
          // Review author name from Google Maps API
          "author": "John Doe",
          
          // Individual rating on 5-point scale from Google Maps API
          "rating": 5,
          
          // Review text content from Google Maps API
          "comment": "Amazing food and friendly service!",
          
          // Review timestamp in ISO format from Google Maps API
          "timestamp": "2025-03-15T14:23:00Z"
        },
        {
          "author": "Jane Doe",
          "rating": 4,
          "comment": "Great ambiance and tasty dishes.",
          "timestamp": "2025-03-14T10:12:00Z"
        }
      ]
    },
    
    "distanceMatrix": {
      // Distance from user's current location from Google Maps Distance Matrix API
      "distanceFromUser": "5 km",
      
      // Estimated travel time from Google Maps Distance Matrix API
      "estimatedTravelTime": "10 minutes",
      
      // Transportation mode (driving, walking, transit, cycling) from Google Maps
      "mode": "driving"
    },
    
    "aiInsights": {
      /* RESTAURANT DESCRIPTION - AI GENERATED
       * Process: The AI should analyze available information about the restaurant from Google Maps data
       * including cuisine type, top dishes mentioned in reviews, ambiance descriptions, and special features.
       * It should then craft a compelling narrative description that highlights what makes this restaurant unique
       * and appealing to the specific user.
       * 
       * Input data: Restaurant type, cuisine, dominant positive themes from reviews, distinctive features
       * Output style: Vivid, appealing description with sensory details when possible
       * Length: 20-50 words
       * Tone: Enthusiastic and descriptive without being overly promotional
       * Do not invent factual claims not supported by the available data
       */
      "description": "Cozy Italian restaurant famous for its signature Truffle Pasta.",
      
      /* MENU RECOMMENDATION - AI GENERATED
       * Process: The AI should identify the most praised or distinctive dishes from review data,
       * considering the specific user's known food preferences, dietary restrictions, and past ordering history.
       * It should then recommend a specific dish with supporting evidence for why this dish would be appealing.
       * 
       * Input data: Menu items mentioned in reviews, star ratings associated with specific dishes,
       * user dietary preferences, past orders and cuisine preferences
       * Output style: Specific dish recommendation with supporting evidence (ratings, popularity, etc.)
       * Length: 15-30 words
       * Include: Dish name, reason for recommendation (ratings or popularity), special quality of the dish
       * Adapt based on known user preferences (e.g., vegetarian options for vegetarian users)
       */
      "menuRecommendation": "Our AI suggests trying the Truffle Pasta, rated 92% by diners!",
      
      /* CROWD LEVEL/OCCASION RECOMMENDATION - AI GENERATED
       * Process: The AI should analyze review sentiment regarding ambiance, noise levels, seating arrangements,
       * and customer demographics to determine what type of visit the restaurant is best suited for.
       * 
       * Input data: Review mentions of ambiance, noise level, table spacing, lighting, music, crowd types
       * Output style: Clear recommendation for specific visit type with supporting detail
       * Length: 10-20 words
       * Consider: Time of day and day of week variations if data is available
       * Avoid general statements; be specific about the type of occasion
       */
      "crowdLevelRecommendation": "Its a great restaurant for a romantic night",
      
      /* PERSONALIZED SUGGESTION - AI GENERATED
       * Process: The AI should analyze the user's specific dining history, saved preferences, dietary needs,
       * and recent searches to generate a highly personalized recommendation tailored exclusively to this user.
       * 
       * Input data: User dining history, stated cuisine preferences, dietary restrictions, recent searches,
       * saved restaurants, and seasonal relevance
       * Output style: Personal, targeted suggestion that references specific user preferences
       * Length: 15-30 words
       * Must include: Reference to at least one specific preference or behavior of the user
       * Avoid generic recommendations that could apply to anyone
       */
      "personalizedSuggestion": "Based on your dietary preferences and past visits, we think you'll love the Mushroom Risotto.",
      
      "matchScore": {
        /* MATCH SCORE - AI GENERATED
         * Process: The AI should calculate a numerical compatibility score based on how well the restaurant
         * attributes align with the user's known preferences and search context.
         * 
         * Calculation method: 
         * 1. Identify key matching attributes between restaurant and user preferences
         * 2. Weight attributes based on importance (cuisine type and dietary needs weighted highest)
         * 3. Calculate percentage match (0-100) based on weighted attributes
         * 4. Minimum score should be 50, even for minimal matches to avoid discouraging exploration
         */
        "score": 92,
        
        /* MATCH EXPLANATION - AI GENERATED
         * Process: The AI should explain the reasoning behind the match score by identifying the specific
         * factors that make this restaurant suitable for this particular user.
         * 
         * Input data: User preferences, dining history, specified requirements, and restaurant attributes
         * Output style: Concise explanation listing 2-4 specific matching points
         * Length: 15-40 words
         * Must include: Both food-related factors and experience/ambiance factors
         * Prioritize: Factors most relevant to current user context (e.g., current location, time of day, weather)
         */
        "explanation": "This restaurant matches your preferences for Italian cuisine, romantic setting, and vegetarian options."
      },
      
      /* CULTURAL CONTEXT - AI GENERATED
       * Process: The AI should research and provide interesting cultural or historical information about
       * the restaurant's cuisine, cooking methods, or specific dishes to enhance the dining experience
       * with educational content.
       * 
       * Input data: Restaurant cuisine type, signature dishes, cultural origin, historical context
       * Output style: Educational, storytelling approach that creates interest and appreciation
       * Length: 20-50 words
       * Focus on: Authentic cultural insights, traditional techniques, ingredient origins, historical connections
       * Avoid: Generalizations and stereotypes about cuisines
       * Verify: Cultural claims should be based on reliable culinary knowledge
       */
      "culturalContext": "This restaurant's Truffle Pasta uses locally sourced ingredients with techniques passed down for generations from the chef's Italian grandmother.",
      
      "occasionSuitability": {
        /* OCCASION SUITABILITY RATINGS - AI GENERATED
         * Process: The AI should evaluate how suitable the restaurant is for different social occasions
         * by analyzing factors like noise level, table arrangements, menu formality, pricing, and ambiance.
         * 
         * Input data: Reviews mentioning occasions, ambiance descriptions, photos showing layout,
         * price level, noise level indicators
         * Output style: Numerical ratings from 0-100 for each occasion type
         * Rating scale: 0-50 (Not recommended), 51-70 (Acceptable), 71-85 (Good match), 86-100 (Excellent match)
         * Must consider: Noise level, privacy, table spacing, menu sharing options, pricing
         */
        "romantic": 95,
        "friends": 80,
        "businessMeeting": 70,
        "familyDinner": 80
      },
      
      /* TAGS - AI GENERATED
       * Process: The AI should identify the most relevant category tags for the restaurant based on
       * its characteristics, cuisine, and distinctive features that would help users find it in searches.
       * 
       * Input data: Restaurant category from Google, cuisine type, special features, ambiance descriptions
       * Output style: Array of 3-7 concise category tags
       * Selection criteria: Prioritize tags that:
       *   1. Match user's recent searches or stated preferences
       *   2. Highlight distinctive aspects of this restaurant
       *   3. Include at least one cuisine type and one ambiance/experience type
       * Avoid: Generic tags that don't differentiate (e.g., "restaurant", "food")
       */
      "tags": ["Italian", "Romantic", "Vegetarian"]
    },
    
    // Photo URLs from Google Maps API
    "photos": [
      "https://example.com/photo1.jpg",
      "https://example.com/photo2.jpg",
      "https://example.com/photo3.jpg"
    ],
    
    // Special features and amenities - base data from Google Maps API
    "specialFeatures": {
      // Indicates if parking is available - from Google Maps API
      "parkingAvailable": true,
      
      // Indicates if the venue is wheelchair accessible - from Google Maps API
      "wheelchairAccessible": true,
      
      // Indicates if outdoor seating is available - from Google Maps API
      "outdoorSeating": true,
      
      // Indicates if pets are allowed - from Google Maps API
      "petFriendly": true
    },
    
    "localExperience": {
      /* NEIGHBORHOOD VIBE - AI GENERATED
       * Process: The AI should analyze the character and style of the neighborhood surrounding the restaurant
       * based on nearby establishments, area reviews, and local points of interest.
       * 
       * Input data: Nearby establishments, neighborhood name, area reviews, local attractions
       * Output style: Descriptive characterization of the area's atmosphere and distinctive features
       * Length: 10-30 words
       * Focus on: Architectural style, types of businesses, area activity, cultural character
       * Avoid: Generic descriptions that could apply to any area
       * Consider: Time-relevant aspects (daytime vs. nighttime atmosphere if significant)
       */
      "neighborhoodVibe": "Trendy artistic district with galleries and boutiques",
      
      // Indicates if the restaurant is popular among locals - can be AI determined from review analysis
      "localFavorite": true,
      
      /* HIDDEN GEM - AI GENERATED
       * Process: The AI should identify non-obvious insider information or recommendations that would
       * enhance the dining experience, based on review analysis, restaurant features, or local knowledge.
       * 
       * Input data: Uncommon mentions in reviews, special features not prominently advertised,
       * insider tips from past customers
       * Output style: Exclusive tip phrased conversationally as insider information
       * Length: 10-25 words
       * Focus on: Information that feels exclusive and enhances the dining experience
       * Avoid: Obvious information already included in restaurant descriptions
       * Verify: Information should have some basis in review data or restaurant features
       */
      "hiddenGem": "Ask for their secret menu with experimental dishes"
    },
    
    "pricingInsights": {
      // Price category from Google Maps API ($ inexpensive, $$ moderate, $$$ expensive, $$$$ very expensive)
      "priceCategory": "$$",
      
      // Average cost per person in local currency - from Google Maps API or AI estimated
      "averageMealCost": 35,
      
      /* SPECIAL OFFERS - AI GENERATED/ENHANCED
       * Process: The AI should identify current promotions, deals, or special events offered by the restaurant
       * based on website data, event listings, and mentions in recent reviews.
       * 
       * Input data: Restaurant website (if available), review mentions of promotions, social media data if available
       * Output style: Array of specific, currently valid offers
       * Selection criteria: Prioritize:
       *   1. Time-relevant offers (seasonal, day-specific)
       *   2. Offers that align with user interests
       *   3. Value-oriented promotions
       * Verify: Promotions should be reasonably current and mentioned in available data
       * Update frequency: Check for current validity regularly
       */
      "specialOffers": ["Happy Hour 4-6pm", "Weekend Brunch Deal", "Loyalty Program"]
    },
    
    // Reservation system information - base data from Google Maps with possible AI enhancement
    "reservationSystem": {
      // Indicates if the restaurant accepts reservations - from Google Maps API
      "reservationSystem": true,
      
      // Link for making online reservations - from Google Maps API
      "reservationSystemLink": "https://www.deliciousbites.com/reservation"
    }
  }
}; 