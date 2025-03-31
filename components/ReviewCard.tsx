"use client";

interface Review {
  id: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: Date;
  jobTitle: string;
}

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border-b last:border-b-0 pb-4 mb-4 last:mb-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold">{review.clientName}</p>
          <p className="text-sm text-gray-500">{review.jobTitle}</p>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-lg ${
                i < review.rating ? 'text-yellow-500' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <p className="text-gray-600">{review.comment}</p>
      <p className="text-sm text-gray-500 mt-2">
        {new Date(review.date).toLocaleDateString()}
      </p>
    </div>
  );
} 