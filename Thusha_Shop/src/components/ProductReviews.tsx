import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";
import { Review } from "@/types/review";

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
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Rating Summary */}
        <div className="md:w-1/3 bg-secondary p-6 rounded-lg">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(averageRating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              Based on {reviews?.length || 0}{" "}
              {reviews?.length === 1 ? "review" : "reviews"}
            </div>
          </div>

          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center">
                <div className="w-12 text-sm">{rating} stars</div>
                <div className="flex-1 mx-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-8 text-right text-sm">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Form */}
        <div className="md:w-2/3">
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full mb-6"
          >
            {showReviewForm ? "Cancel Review" : "Write a Review"}
          </Button>

          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="bg-accent p-6 rounded-lg mb-6"
            >
              <h3 className="text-lg font-semibold mb-4">
                Share Your Experience
              </h3>

              <div className="mb-4">
                <Label>Rating</Label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewFormData((prev) => ({ ...prev, rating: star }))
                      }
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= reviewFormData.rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="title">Review Title</Label>
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
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  value={reviewFormData.comment}
                  onChange={(e) =>
                    setReviewFormData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Share your thoughts"
                  required
                />
              </div>

              <Button type="submit">Submit Review</Button>
            </form>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          {reviews?.length ? `${reviews.length} Reviews` : "No Reviews Yet"}
        </h3>

        {!reviews?.length ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Be the first to review this product
            </p>
            <Button onClick={() => setShowReviewForm(true)}>
              Write a Review
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full font-semibold text-sm">
                      {review.user?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {review.user || "Anonymous"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString()
                          : ""}
                      </div>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (review.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="pl-1">
                  <h4 className="text-base font-semibold text-gray-900 mb-1">
                    {review.title}
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
