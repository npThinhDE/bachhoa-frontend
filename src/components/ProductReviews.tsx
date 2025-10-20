// src/components/ProductReviews.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import axiosClient from '@/api/axiosClient';

// --- Types ---
interface Review {
  reviewId: number;
  username: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}

interface Props {
  readonly productId: number;
}

// --- Helper Components ---
const StarRating = ({ rating, className = '' }: { rating: number; className?: string }) => (
  <div className={`flex items-center text-yellow-400 ${className}`}>
    {[...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
      </svg>
    ))}
  </div>
);

const ReviewSummary = ({ reviews }: { reviews: Review[] }) => {
  const summary = useMemo(() => {
    if (reviews.length === 0) {
      return { average: 0, total: 0, distribution: {} };
    }
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = parseFloat((sum / total).toFixed(1));
    const distribution = reviews.reduce((acc, r) => {
      acc[r.rating] = (acc[r.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    return { average, total, distribution };
  }, [reviews]);

  if (summary.total === 0) return null;

  return (
    <div className="mb-10 p-6 border rounded-lg bg-gray-50 flex flex-col md:flex-row gap-6 items-center">
      <div className="text-center flex-shrink-0">
        <div className="text-5xl font-bold text-gray-800">{summary.average}</div>
        <StarRating rating={Math.round(summary.average)} />
        <div className="text-sm text-gray-600 mt-1">({summary.total} đánh giá)</div>
      </div>
      <div className="w-full flex-1 space-y-1">
        {[5, 4, 3, 2, 1].map(star => {
          const count = summary.distribution[star] || 0;
          const percentage = (count / summary.total) * 100;
          return (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 w-12">{star} sao</span>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-gray-600 w-8 text-right font-medium">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Main Component ---
export default function ProductReviews({ productId }: Props) {
  const { user } = useAppSelector((state) => state.auth);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // ✅ gọi API công khai
      const response = await axiosClient.get(`/reviews?productId=${productId}`);
      setReviews(response.data);
      setError(null);
    } catch {
      setError('Không thể tải danh sách đánh giá.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!user) {
      setSubmitError(
        <span>
          Bạn cần{' '}
          <Link to="/login" className="font-bold underline hover:text-blue-700">
            đăng nhập
          </Link>{' '}
          để gửi đánh giá.
        </span>
      );
      return;
    }

    if (!comment.trim()) {
      setSubmitError('Vui lòng nhập nội dung đánh giá.');
      return;
    }

    setSubmitting(true);
    try {
      // ✅ SỬA: Gọi đúng endpoint secure
      await axiosClient.post(`/secure/reviews?productId=${productId}`, {
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
      });

      setTitle('');
      setComment('');
      setRating(5);
      await fetchReviews();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || 'Gửi đánh giá thất bại. Vui lòng thử lại.';
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const renderReviewList = () => {
    if (loading) return <div className="text-center py-8">Đang tải đánh giá...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
    if (reviews.length === 0)
      return (
        <div className="text-center py-8 text-gray-500">
          Chưa có đánh giá nào. Hãy là người đầu tiên!
        </div>
      );

    return (
      <ul className="space-y-8">
        {reviews.map((r) => (
          <li key={r.reviewId} className="flex gap-4">
            <img
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${r.username}`}
              alt={r.username}
              className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-semibold text-gray-800">{r.username}</span>
                <StarRating rating={r.rating} />
              </div>
              <p className="text-xs text-gray-500 mb-2">
                {new Date(r.createdAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {r.title && (
                <h3 className="font-semibold text-lg text-gray-900">{r.title}</h3>
              )}
              <p className="text-gray-700 whitespace-pre-line">{r.comment}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Đánh giá sản phẩm</h2>

      <ReviewSummary reviews={reviews} />

      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Chia sẻ cảm nhận của bạn</h3>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 border rounded-lg bg-white shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mức độ hài lòng
            </label>
            <StarRating rating={rating} />
            <input
              type="range"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tiêu đề (tùy chọn)
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sản phẩm tuyệt vời!"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nội dung đánh giá
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              rows={4}
              required
            />
          </div>
          {submitError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {submitError}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors"
          >
            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>
      </div>

      {renderReviewList()}
    </div>
  );
}
