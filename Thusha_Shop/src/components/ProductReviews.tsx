
import React, { useState } from "react";
import { Star, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";
import { Review } from "@/types";

interface ProductReviewsProps {
  productId: number;
  reviews: Review[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, reviews }) => {
  const { user, isAuthenticated } = useUser();
  const { toast } = useToast();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [helpfulReviews, setHelpfulReviews] = useState<number[]>([]);

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
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
    
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback! Your review will be published after moderation.",
    });
    
    setReviewFormData({
      rating: 5,
      title: "",
      comment: "",
    });
    setShowReviewForm(false);
  };

  const handleHelpfulClick = (reviewId: number) => {
    if (helpfulReviews.includes(reviewId)) {
      return;
    }
    
    setHelpfulReviews(prev => [...prev, reviewId]);
    toast({
      title: "Thank you!",
      description: "You marked this review as helpful",
    });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Rating Summary */}
        <div className="md:w-1/3 bg-secondary p-6 rounded-lg">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(averageRating) ? "fill-yellow-500 text-yellow-500" : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
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

        {/* Review Form Toggle */}
        <div className="md:w-2/3">
          <Button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full mb-6 flex items-center justify-center"
          >
            {showReviewForm ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Cancel Review
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Write a Review
              </>
            )}
          </Button>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="bg-accent p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
              
              <div className="mb-4">
                <Label htmlFor="rating" className="block mb-2">Rating</Label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewFormData(prev => ({ ...prev, rating: star }))}
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
                <Label htmlFor="title" className="block mb-2">Review Title</Label>
                <Input
                  id="title"
                  value={reviewFormData.title}
                  onChange={(e) => setReviewFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Summarize your experience"
                  required
                />
              </div>
              
              <div className="mb-4">
                <Label htmlFor="comment" className="block mb-2">Your Review</Label>
                <Textarea
                  id="comment"
                  value={reviewFormData.comment}
                  onChange={(e) => setReviewFormData(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  placeholder="What did you like or dislike? How was the fit and quality?"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">Submit Review</Button>
            </form>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          {reviews.length === 0
            ? "No Reviews Yet"
            : `${reviews.length} ${reviews.length === 1 ? "Review" : "Reviews"}`}
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Be the first to review this product
            </p>
            <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold">{review.userName}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()} • 
                      {review.verified && (
                        <span className="text-green-600 ml-1">Verified Purchase</span>
                      )}
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-yellow-500 text-yellow-500" : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="mb-4">{review.comment}</p>
                
                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {review.images.map((image, i) => (
                      <img
                        key={i}
                        src={image}
                        alt={`Review image ${i + 1}`}
                        className="h-20 w-20 object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleHelpfulClick(review.id)}
                  disabled={helpfulReviews.includes(review.id)}
                  className="text-sm flex items-center"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful ({review.helpful + (helpfulReviews.includes(review.id) ? 1 : 0)})
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
