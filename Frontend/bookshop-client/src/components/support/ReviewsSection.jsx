import ReaderReviews from '../home/ReaderReviews';

// Real customer reviews with the real average (replaces the invented "4.8 from 1,240+ reviews")
const ReviewsSection = () => <ReaderReviews title="Reader reviews" eyebrow="From our customers" showSummary limit={6} />;

export default ReviewsSection;
