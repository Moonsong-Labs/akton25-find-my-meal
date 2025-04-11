/**
 * Main Page Component
 * Created: 2024-04-10
 * Changes:
 * - Added InteractionFlow component
 * - Added state management for flow steps
 * - Added recommendations display
 * - Improved error handling and progress display
 * - Updated UI with modern design and animations
 * - Added RestaurantReport component
 */

"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Button,
  Typography,
  CircularProgress,
  Paper,
  TextField,
  LinearProgress,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion, AnimatePresence } from "framer-motion";
import InteractionFlow from "@/components/InteractionFlow";
import RestaurantReport from "@/components/RestaurantReport";
import { styled } from "@mui/material/styles";

// Add phase tracking
type InteractionPhase =
  | "initial"
  | "chatting"
  | "recommending"
  | "report"
  | "error";

// Define chat message structure
interface ChatMessage {
  role: "user" | "agent";
  content: string;
}

interface FlowStep {
  actor: string;
  action: string;
  status: "pending" | "in-progress" | "completed" | "error";
  timestamp?: string;
  details?: string;
}

// Define a basic type for opening_hours based on its usage
interface OpeningHours {
  open_now?: boolean;
  // Add other potential fields if needed, e.g., periods, weekday_text
}

// Define Restaurant type matching the structure expected by RestaurantReport component
interface Restaurant {
  name: string;
  rating: number; // Added from RestaurantReport definition
  user_ratings_total: number; // Added from RestaurantReport definition
  vicinity: string; // Added from RestaurantReport definition
  formatted_phone_number?: string; // Added from RestaurantReport definition
  website?: string; // Added from RestaurantReport definition
  opening_hours?: OpeningHours; // Use the specific OpeningHours type
  // Include fields from Recommender if needed, assuming backend merges them
  place_id?: string; // Keep place_id if useful downstream
  why_is_a_good_choice_for_you?: string; // Keep explanation if useful downstream
  // Add new fields from Places API
  formatted_address?: string;
  price_level?: number;
  photos?: {
    photo_reference: string;
    width: number;
    height: number;
  }[];
  reviews?: {
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }[];
}

// Define the structure of the final API response, assuming backend enrichment
interface ApiResponse {
  restaurants: Restaurant[]; // Use the detailed Restaurant type
  analysis?: {
    recommendations?: string;
  };
}

const SearchContainer = styled(motion.div)(({ theme }) => ({
  position: "relative",
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",
  marginBottom: theme.spacing(4),
}));

const SearchWrapper = styled(Box)({
  position: "relative",
  width: "100%",
  display: "flex",
  alignItems: "center",
});

const SearchIconWrapper = styled(Box)({
  position: "absolute",
  left: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 1,
  color: "#6B7280",
  display: "flex",
  alignItems: "center",
});

const StyledInput = styled("input")({
  width: "100%",
  padding: "14px 14px 14px 44px",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#111827",
  backgroundColor: "#FFFFFF",
  border: "1px solid #D1D5DB",
  borderRadius: "24px",
  outline: "none",
  "&::placeholder": {
    color: "#6B7280",
  },
  "&:focus": {
    borderColor: "#9CA3AF",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
});

const SearchButton = styled(Button)({
  position: "absolute",
  right: "4px",
  top: "50%",
  transform: "translateY(-50%)",
  minWidth: "auto",
  padding: "8px 16px",
  backgroundColor: "#F3F4F6",
  color: "#374151",
  borderRadius: "20px",
  textTransform: "none",
  fontWeight: 500,
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "#E5E7EB",
    boxShadow: "none",
  },
  "&.Mui-disabled": {
    backgroundColor: "#F3F4F6",
    color: "#9CA3AF",
  },
});

const sessionId =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

export default function Home() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [flowSteps, setFlowSteps] = useState<FlowStep[]>([]);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- New State ---
  const [interactionPhase, setInteractionPhase] =
    useState<InteractionPhase>("initial");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentChatMessage, setCurrentChatMessage] = useState(""); // For chat input
  const [isChatComplete, setIsChatComplete] = useState(false); // Flag for showing "Next"
  // --- End New State ---

  // Add these new state variables
  const [isEnrichingRestaurants, setIsEnrichingRestaurants] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);

  const handleSearch = async () => {
    if (!query.trim()) return; // Don't search if query is empty

    setIsLoading(true);
    setApiResponse(null);
    setShowReport(false);
    setError(null);
    setChatHistory([]); // Clear previous chat
    setIsChatComplete(false);
    setInteractionPhase("chatting"); // Move to chat phase

    const userMessage: ChatMessage = { role: "user", content: query };
    setChatHistory([userMessage]); // Add initial user query to history

    const initialFlow: FlowStep[] = [
      {
        actor: "User",
        action: "Initiated search",
        status: "completed",
        timestamp: new Date().toLocaleTimeString(),
        details: query,
      },
      {
        actor: "Information Agent",
        action: "Starting conversation...",
        status: "in-progress",
        timestamp: new Date().toLocaleTimeString(),
      },
      // Add other steps as pending later when moving phases
    ];
    setFlowSteps(initialFlow);
    setQuery(""); // Clear the main search input after starting

    try {
      // Call the Information Agent endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AGENT_URL}/prompt/${sessionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage.content }), // Send initial query
        }
      );

      if (!response.ok) {
        let errorBody = "Server returned an error.";
        try {
          const errorData = await response.json();
          errorBody = errorData.detail || JSON.stringify(errorData);
        } catch {
          errorBody = (await response.text()) || errorBody;
        }
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorBody}`
        );
      }

      // --- Process Agent's First Response ---
      // Assuming the endpoint returns the agent's response directly (e.g., as text or simple JSON)
      // We need to know the *actual* response structure from `/prompt/{session_id}`
      // Let's *assume* it returns simple text for the chat response for now.
      const agentResponseText = await response.text(); // *** ADJUST BASED ON ACTUAL API RESPONSE ***
      const agentMessage: ChatMessage = {
        role: "agent",
        content: agentResponseText,
      };

      setChatHistory((prev) => [...prev, agentMessage]);

      // Update flow step for Information Agent - Mark as 'in-progress' as chat continues
      setFlowSteps((prev) =>
        prev.map((step) =>
          step.actor === "Information Agent"
            ? {
                ...step,
                status: "in-progress",
                action: "Waiting for user response",
                details:
                  "Agent asked: " + agentResponseText.substring(0, 100) + "...",
              }
            : step
        )
      );

      // *** TODO: Logic to check if chat is complete based on agentResponseText ***
      // This needs to be implemented based on how your backend signals completion.
      // Example: if (agentResponseText.toLowerCase().includes("shall i proceed?")) { setIsChatComplete(true); }
    } catch (err) {
      console.error("Initial search / chat start failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to start chat: ${errorMessage}`);
      setInteractionPhase("error");
      setFlowSteps((prev) =>
        prev
          .map((step) =>
            step.status === "in-progress"
              ? { ...step, status: "error" as const, details: errorMessage }
              : step
          )
          .concat({
            actor: "System",
            action: "Chat initialization failed",
            status: "error" as const,
            details: errorMessage,
            timestamp: new Date().toLocaleTimeString(),
          })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- handleSendMessage (During Chat) ---
  const handleSendMessage = async () => {
    if (!currentChatMessage.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      role: "user",
      content: currentChatMessage,
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setCurrentChatMessage(""); // Clear chat input

    // Update flow step for user action
    setFlowSteps((prev) =>
      prev.map((step) =>
        step.actor === "Information Agent"
          ? {
              ...step,
              status: "in-progress",
              action: "Processing user reply...",
              details:
                "User said: " + userMessage.content.substring(0, 100) + "...",
            }
          : step
      )
    );

    try {
      // Call Information Agent endpoint AGAIN
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AGENT_URL}/prompt/${sessionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Send the LATEST user message. Backend uses session history.
          body: JSON.stringify({ message: userMessage.content }),
        }
      );

      if (!response.ok) {
        let errorBody = "Server returned an error during chat.";
        try {
          const errorData = await response.json();
          errorBody = errorData.detail || JSON.stringify(errorData);
        } catch {
          errorBody = (await response.text()) || errorBody;
        }
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorBody}`
        );
      }

      const agentResponseText = await response.text(); // *** ADJUST BASED ON ACTUAL API RESPONSE ***
      const agentMessage: ChatMessage = {
        role: "agent",
        content: agentResponseText,
      };
      setChatHistory((prev) => [...prev, agentMessage]);

      // *** TODO: Logic to check if chat is complete based on agentResponseText ***
      // Example: Backend sends specific signal like "OK, I have enough information."
      // const isCompleteSignal = agentResponseText.toLowerCase().includes("enough information");
      const isCompleteSignal = false; // Replace with actual check
      if (isCompleteSignal) {
        setIsChatComplete(true);
        // Update flow step for info agent to show completion
        setFlowSteps((prev) =>
          prev.map((step) =>
            step.actor === "Information Agent"
              ? {
                  ...step,
                  status: "completed",
                  action: "Chat finished",
                  details: "Ready for recommendations.",
                }
              : step
          )
        );
      } else {
        // Update flow step for info agent awaiting next user reply
        setFlowSteps((prev) =>
          prev.map((step) =>
            step.actor === "Information Agent"
              ? {
                  ...step,
                  status: "in-progress",
                  action: "Waiting for user response",
                  details:
                    "Agent asked: " +
                    agentResponseText.substring(0, 100) +
                    "...",
                }
              : step
          )
        );
      }
    } catch (err) {
      console.error("Chat message failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Chat failed: ${errorMessage}`);
      // Update flow step to show error for the agent
      setFlowSteps((prev) =>
        prev.map((step) =>
          step.actor === "Information Agent"
            ? {
                ...step,
                status: "error" as const,
                details: `Failed: ${errorMessage}`,
              }
            : step
        )
      );
      // Optionally revert last user message or show error indicator in chat
      setChatHistory((prev) => prev.slice(0, -1)); // Remove agent's failed response if added
      setCurrentChatMessage(userMessage.content); // Restore user input
    } finally {
      setIsLoading(false);
    }
  };

  // --- handleGetRecommendations (Triggered by "Next") ---
  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setInteractionPhase("recommending"); // Move to recommending phase

    // Update flow steps - Set Info Agent complete, Recommender in-progress
    setFlowSteps((prev) =>
      prev
        .map((step) =>
          step.actor === "Information Agent" && step.status !== "completed"
            ? {
                ...step,
                status: "completed" as const,
                action: "Chat finished",
                details: "Proceeding to recommendations.",
              }
            : step
        )
        .concat([
          // Add Recommender and Maps as pending/in-progress
          {
            actor: "Recommender Agent",
            action: "Processing chat context...",
            status: "in-progress" as const,
            timestamp: new Date().toLocaleTimeString(),
          },
          {
            actor: "Google Maps API",
            action: "Waiting for recommendations...",
            status: "pending" as const,
            timestamp: new Date().toLocaleTimeString(),
          },
        ])
    );

    try {
      // Call the Recommender Agent endpoint
      const data: {
        restaurants: {
          name: string;
          place_id: string;
          why_is_a_good_choice_for_you: string;
        }[];
      } = await fetch(
        `${process.env.NEXT_PUBLIC_AGENT_URL}/prompt_response/${sessionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      ).then((res) => res.json());

      // Update Recommender Agent flow step
      setFlowSteps((prev) =>
        prev.map((step) =>
          step.actor === "Recommender Agent"
            ? {
                ...step,
                status: "completed",
                details: `Found ${
                  data.restaurants?.length ?? 0
                } potential restaurants.`,
              }
            : step
        )
      );

      // Initialize enrichedRestaurants at a higher scope so it's accessible later
      const enrichedRestaurants: Restaurant[] = [];

      // If we have restaurants with place_ids, enrich them with Google Maps API
      if (data.restaurants && data.restaurants.length > 0) {
        // Update Google Maps API flow step to in-progress
        setFlowSteps((prev) =>
          prev.map((step) =>
            step.actor === "Google Maps API"
              ? {
                  ...step,
                  status: "in-progress",
                  action: "Fetching detailed information...",
                  details: `Enhancing data for ${data.restaurants.length} restaurants.`,
                }
              : step
          )
        );

        setIsEnrichingRestaurants(true);
        // const enrichedRestaurants: Restaurant[] = []; // Moved to higher scope

        // Process each restaurant with place_id sequentially
        for (let i = 0; i < data.restaurants.length; i++) {
          const restaurant = data.restaurants[i];

          // Update progress for UI
          setEnrichmentProgress(
            Math.floor((i / data.restaurants.length) * 100)
          );

          // Skip if no place_id
          if (!restaurant.place_id) continue;

          // Call Google Maps Places API through your backend proxy
          // This assumes you have a backend endpoint that proxies requests to Google
          const placeDetailsResponse = await fetch(
            `/api/proxy?url=${encodeURIComponent(
              `https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant.place_id}&key=AIzaSyCNPVj9WL_g8xfDDqhzxFM3Oa4dCI0TOHk`
            )}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const placeDetails = await placeDetailsResponse.json();

          // Ensure we have a valid result before processing
          if (placeDetails && placeDetails.result) {
            enrichedRestaurants.push({
              ...restaurant,
              // Override with more accurate data from Places API
              name: placeDetails.result.name || restaurant.name,
              rating: placeDetails.result.rating,
              user_ratings_total: placeDetails.result.user_ratings_total,
              vicinity: placeDetails.result.vicinity,
              formatted_address: placeDetails.result.formatted_address,
              formatted_phone_number:
                placeDetails.result.formatted_phone_number,
              website: placeDetails.result.website,
              opening_hours: placeDetails.result.opening_hours,
              price_level: placeDetails.result.price_level,
              photos: placeDetails.result.photos,
              reviews: placeDetails.result.reviews?.slice(0, 3), // Include up to 3 reviews
              why_is_a_good_choice_for_you:
                restaurant.why_is_a_good_choice_for_you,
            });
          } else {
            // If the Places API didn't return valid data, still include the restaurant with basic info
            enrichedRestaurants.push({
              ...restaurant,
              name: restaurant.name,
              why_is_a_good_choice_for_you:
                restaurant.why_is_a_good_choice_for_you,
              // Add required properties with default values
              rating: 0,
              user_ratings_total: 0,
              vicinity: "No location data available",
            });
          }
        }

        setEnrichmentProgress(100);
        setIsEnrichingRestaurants(false);
        setRestaurants(enrichedRestaurants);

        // Update Google Maps API flow step to completed
        setFlowSteps((prev) =>
          prev.map((step) =>
            step.actor === "Google Maps API"
              ? {
                  ...step,
                  status: "completed",
                  action: "Information enrichment complete",
                  details: `Enhanced data for ${enrichedRestaurants.length} restaurants.`,
                }
              : step
          )
        );
      } else {
        // No restaurants to enrich
        setFlowSteps((prev) =>
          prev.map((step) =>
            step.actor === "Google Maps API"
              ? {
                  ...step,
                  status: "completed",
                  details: "No restaurants found to enrich.",
                }
              : step
          )
        );
      }

      // Move to report phase if results exist
      if (enrichedRestaurants && enrichedRestaurants.length > 0) {
        // Save the final enriched restaurants
        setRestaurants(enrichedRestaurants);

        setInteractionPhase("report");
        // Trigger animation slightly after state change
        setTimeout(() => setShowReport(true), 100);
      } else {
        // Handle no restaurants found after recommendation phase
        setInteractionPhase("report");
        setError("No restaurants found based on the conversation.");
        setFlowSteps((prev) =>
          prev
            .map((step) => ({
              ...step,
              status:
                step.status === "pending"
                  ? ("completed" as const)
                  : step.status,
            }))
            .concat({
              actor: "System",
              action: "Search complete",
              status: "completed" as const,
              details: "No restaurants found.",
              timestamp: new Date().toLocaleTimeString(),
            })
        );
        setShowReport(false);
      }
    } catch (err) {
      console.error("Recommendation failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to get recommendations: ${errorMessage}`);
      setInteractionPhase("error");
      setFlowSteps((prev) =>
        prev
          .map((step) =>
            step.status === "in-progress" || step.status === "pending"
              ? {
                  ...step,
                  status: "error" as const,
                  details: `Failed: ${errorMessage}`,
                }
              : step
          )
          .concat({
            actor: "System",
            action: "Recommendation failed",
            status: "error" as const,
            details: errorMessage,
            timestamp: new Date().toLocaleTimeString(),
          })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ bgcolor: "#FFFFFF" }}>
      <Box sx={{ my: 6, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              mb: 4,
              color: "#111827",
              fontSize: "2.5rem",
            }}
          >
            Mealseek
          </Typography>
        </motion.div>

        {/* == Conditional Rendering based on Phase == */}

        {/* Initial Search Bar (Phase: initial) */}
        {interactionPhase === "initial" && (
          <SearchContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <SearchWrapper>
              <SearchIconWrapper>
                {" "}
                <SearchIcon sx={{ fontSize: 20 }} />{" "}
              </SearchIconWrapper>
              <StyledInput
                placeholder="What kind of food are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  !isLoading &&
                  query.trim() &&
                  handleSearch()
                }
                disabled={isLoading}
              />
              <SearchButton
                onClick={handleSearch}
                disabled={isLoading || !query.trim()}
              >
                {isLoading ? (
                  <CircularProgress size={16} sx={{ color: "#9CA3AF" }} />
                ) : (
                  "Start Search"
                )}
              </SearchButton>
            </SearchWrapper>
          </SearchContainer>
        )}

        {/* Chat Interface (Phase: chatting) */}
        {interactionPhase === "chatting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              maxWidth: "800px",
              margin: "20px auto",
            }}
          >
            {/* Simple Chat History Display */}
            <Paper
              elevation={1}
              sx={{
                maxHeight: "40vh",
                overflowY: "auto",
                p: 2,
                mb: 2,
                textAlign: "left",
                background: "#f9f9f9",
                borderRadius: "12px",
              }}
            >
              {chatHistory.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 1.5,
                    display: "flex",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      borderRadius: "15px",
                      bgcolor:
                        msg.role === "user" ? "primary.main" : "grey.200",
                      color:
                        msg.role === "user"
                          ? "primary.contrastText"
                          : "text.primary",
                      maxWidth: "80%",
                      wordWrap: "break-word",
                    }}
                  >
                    <Typography variant="body1">{msg.content}</Typography>
                  </Paper>
                </Box>
              ))}
              {/* Show typing indicator if loading during chat */}
              {isLoading &&
                interactionPhase === "chatting" &&
                !isChatComplete && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      p: 1,
                    }}
                  >
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Agent is typing...
                    </Typography>
                  </Box>
                )}
            </Paper>

            {/* Chat Input and Send Button */}
            {!isChatComplete && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Your reply..."
                  value={currentChatMessage}
                  onChange={(e) => setCurrentChatMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    !isLoading &&
                    currentChatMessage.trim() &&
                    handleSendMessage()
                  }
                  disabled={isLoading}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={isLoading || !currentChatMessage.trim()}
                  sx={{ borderRadius: "20px", height: "40px" }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send"
                  )}
                </Button>
              </Box>
            )}

            {/* "Next" Button (appears when chat is complete) */}
            {
              <Button
                variant="contained"
                color="secondary" // Changed color for emphasis
                onClick={handleGetRecommendations}
                sx={{ mt: 2, borderRadius: "20px", px: 3 }}
                endIcon={<ArrowForwardIcon />}
              >
                Next: Find Restaurants
              </Button>
            }
            {/* Show loading indicator if chat is complete but waiting for "Next" click / recommending phase */}
            {isChatComplete && isLoading && interactionPhase === "chatting" && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <CircularProgress />
                <Typography sx={{ ml: 1 }} color="text.secondary">
                  Preparing recommendations...
                </Typography>
              </Box>
            )}
          </motion.div>
        )}

        {/* Loading indicator during recommending phase */}
        {interactionPhase === "recommending" && isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              my: 4,
            }}
          >
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Finding recommendations...</Typography>
          </Box>
        )}

        {/* Enrichment Progress Indicator */}
        {interactionPhase === "recommending" && isEnrichingRestaurants && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Enriching restaurant data: {enrichmentProgress}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={enrichmentProgress}
              sx={{ width: "80%", maxWidth: "400px" }}
            />
          </Box>
        )}

        {/* Error Display (Improved styling) */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              marginBottom: "16px",
              maxWidth: "800px",
              margin: "16px auto",
            }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 2,
                bgcolor: "error.light",
                color: "error.contrastText",
                borderRadius: "8px",
              }}
            >
              <Typography variant="body1" component="div">
                <strong>Error:</strong> {error}
              </Typography>
            </Paper>
          </motion.div>
        )}

        {/* Interaction Flow (Visible during/after chat) */}
        <AnimatePresence>
          {flowSteps.length > 0 && interactionPhase !== "initial" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{
                marginTop: interactionPhase === "chatting" ? "0px" : "20px",
              }} // Adjust margin based on phase
            >
              <InteractionFlow steps={flowSteps} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Restaurant Report (Phase: report) */}
        <AnimatePresence>
          {interactionPhase === "report" &&
            showReport &&
            restaurants &&
            restaurants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }} // Add small delay
              >
                <RestaurantReport
                  restaurants={restaurants}
                  recommendations=""
                  // Use first user message as original query for the report title
                  originalQuery={
                    chatHistory.length > 0
                      ? chatHistory[0].content
                      : "your request"
                  }
                />
              </motion.div>
            )}
          {/* Optional: Message when report is ready but has no results */}
          {interactionPhase === "report" &&
            !isLoading &&
            (!apiResponse?.restaurants ||
              apiResponse.restaurants.length === 0) &&
            !error && (
              <Typography sx={{ mt: 4 }} color="text.secondary">
                No restaurants found matching the criteria from our
                conversation.
              </Typography>
            )}
        </AnimatePresence>
      </Box>
    </Container>
  );
}
