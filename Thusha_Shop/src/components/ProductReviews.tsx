import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, ChevronDown, ChevronUp, MessageSquare, User, Calendar, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";
import { Review } from "@/types/review";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ProductReviewsProps {
  productId: number;
  reviews: Review[]; // 👈 new
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

const API_BASE_URL = "http://localhost:8000/api"; // Update with your API base URL

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  reviews,
  setReviews,
}) => {
  const { user, isAuthenticated } = useUser();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    title: "",
    comment: "",
  });

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/products/${productId}/reviews`
        );
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load reviews",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, setReviews, toast]);

  // Submit review to database
  // Change the API endpoint URL to include trailing slash
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "You must be logged in to leave a review",
        variant: "destructive",
      });
      return;
    }

    if (!reviewFormData.title || !reviewFormData.comment) {
      toast({
        title: "Incomplete Review",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = sessionStorage.getItem("access_token");
      const response = await fetch(
        `${API_BASE_URL}/products/${productId}/reviews/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...reviewFormData,
            userId: user?.id,
            productId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const newReview = await response.json();
      setReviews((prev) => [newReview, ...prev]);

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });

      setReviewFormData({
        rating: 5,
        title: "",
        comment: "",
      });
      setShowReviewForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) /
        reviews.length
      : 0;

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((review) => review.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Rating Summary - Enhanced */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 min-h-[400px]"
        >
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200 shadow-sm h-full flex flex-col justify-center">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center mb-3">
                <div className="p-2 bg-yellow-100 rounded-lg shadow-sm">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        i < Math.floor(averageRating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Based on {reviews?.length || 0}{" "}
                {reviews?.length === 1 ? "review" : "reviews"}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <motion.div 
                  key={rating} 
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: rating * 0.1, duration: 0.3 }}
                >
                  <div className="w-12 text-sm font-medium text-gray-700 flex items-center">
                    <Star className="h-3 w-3 mr-1.5 fill-yellow-400 text-yellow-400" />
                    {rating}
                  </div>
                  <div className="flex-1 mx-2 h-2 rounded-full bg-gray-200 overflow-hidden shadow-inner">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-sm"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: rating * 0.1 + 0.5, duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="w-6 text-right text-sm font-semibold text-gray-700">{count}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Review Form - Enhanced */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 min-h-[400px]"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="w-full mb-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold py-1.5 rounded-md shadow-lg transition-all duration-300 text-sm"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              {showReviewForm ? "Cancel Review" : "Write a Review"}
            </Button>
          </motion.div>

          <AnimatePresence>
            {showReviewForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleReviewSubmit}
                className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200 shadow-lg mb-3"
              >
                <div className="flex items-center mb-3">
                  <div className="p-1 bg-yellow-100 rounded-md mr-2">
                    <Heart className="h-4 w-4 text-yellow-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    Share Your Experience
                  </h3>
                </div>

                <div className="mb-3">
                  <Label className="text-sm font-semibold text-gray-800 mb-1 block">Rating</Label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewFormData((prev) => ({ ...prev, rating: star }))
                        }
                        className="p-0.5 rounded-md hover:bg-yellow-100 transition-colors duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Star
                          className={`h-5 w-5 transition-colors duration-200 ${
                            star <= reviewFormData.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "fill-gray-200 text-gray-200 hover:fill-yellow-300 hover:text-yellow-300"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {reviewFormData.rating === 5 && "Excellent!"}
                    {reviewFormData.rating === 4 && "Very Good!"}
                    {reviewFormData.rating === 3 && "Good!"}
                    {reviewFormData.rating === 2 && "Fair"}
                    {reviewFormData.rating === 1 && "Poor"}
                  </p>
                </div>

                <div className="mb-3">
                  <Label htmlFor="title" className="text-sm font-semibold text-gray-800 mb-1 block">
                    Review Title
                  </Label>
                  <Input
                    id="title"
                    value={reviewFormData.title}
                    onChange={(e) =>
                      setReviewFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Summarize your experience"
                    className="h-8 text-sm border-2 border-gray-200 focus:border-yellow-500 rounded-md transition-colors duration-200"
                    required
                  />
                </div>

                <div className="mb-3">
                  <Label htmlFor="comment" className="text-sm font-semibold text-gray-800 mb-1 block">
                    Your Review
                  </Label>
                  <Textarea
                    id="comment"
                    value={reviewFormData.comment}
                    onChange={(e) =>
                      setReviewFormData((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    rows={2}
                    placeholder="Share your thoughts about this product..."
                    className="text-sm border-2 border-gray-200 focus:border-yellow-500 rounded-md transition-colors duration-200 resize-none"
                    required
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold py-1.5 rounded-md shadow-lg transition-all duration-300 text-sm"
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Submit Review
                  </Button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Reviews List - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="min-h-[400px]"
      >
        <div className="flex items-center mb-3">
          <div className="p-1 bg-purple-100 rounded-md mr-2">
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            {reviews?.length ? `${reviews.length} Customer Reviews` : "No Reviews Yet"}
          </h3>
        </div>

        {!reviews?.length ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 flex flex-col justify-center min-h-[350px]"
          >
            <div className="p-2 bg-gray-200 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-gray-500" />
            </div>
            <h4 className="text-base font-semibold text-gray-800 mb-1">No Reviews Yet</h4>
            <p className="text-gray-600 mb-3 max-w-md mx-auto text-xs">
              Be the first to share your experience with this product and help other customers make informed decisions.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => setShowReviewForm(true)}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold px-4 py-1.5 rounded-md shadow-lg transition-all duration-300 text-sm"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Write the First Review
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid gap-3 min-h-[350px]">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 p-3 group"
              >
                <div className="flex items-start justify-between mb-2">
                  {/* User Info - Enhanced */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="h-8 w-8 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 text-gray-700 rounded-full font-bold text-sm shadow-sm">
                        {review.user?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {review.user || "Anonymous"}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-2.5 w-2.5 mr-1" />
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : ""}
                      </div>
                    </div>
                  </div>

                  {/* Star Rating - Enhanced */}
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 transition-colors duration-200 ${
                            i < (review.rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <Badge 
                      className={`ml-1 text-xs ${
                        (review.rating || 0) >= 4 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : (review.rating || 0) >= 3 
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      {review.rating === 5 && "Excellent"}
                      {review.rating === 4 && "Very Good"}
                      {review.rating === 3 && "Good"}
                      {review.rating === 2 && "Fair"}
                      {review.rating === 1 && "Poor"}
                    </Badge>
                  </div>
                </div>

                {/* Review Text - Enhanced */}
                <div className="pl-1">
                  <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                    {review.title}
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-xs">
                    {review.comment}
                  </p>
                </div>

                {/* Review Actions */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    >
                      <ThumbsUp className="h-2.5 w-2.5" />
                      <span className="text-xs font-medium">Helpful</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors duration-200"
                    >
                      <Heart className="h-2.5 w-2.5" />
                      <span className="text-xs font-medium">Like</span>
                    </motion.button>
                  </div>
                  <div className="text-xs text-gray-400">
                    Verified Purchase
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductReviews;
