import Hero from '../components/home/Hero';
import BookList from '../components/BookList';
import Categories from '../components/home/Categories';
import Promotions from '../components/home/Promotions';
import ReaderReviews from '../components/home/ReaderReviews';
import Newsletter from '../components/home/Newsletter';
import QuoteOfTheWeek from '../components/home/QuoteOfTheWeek';

const Home = () => {
    return (
        <div className="space-y-12">
            <Hero />

            <QuoteOfTheWeek />

            <div id="featured" className="container mx-auto px-4">
                <BookList sort="bestsellers" title="Best sellers" subtitle="What other readers are buying" link="/shop?sort=popular" />
            </div>

            <div className="container mx-auto px-4 mt-8">
                <BookList sort="rated" title="Highest rated" subtitle="Loved by our reviewers" link="/shop?sort=rating" />
                <BookList sort="newest" title="New on the shelves" link="/shop" />
            </div>

            <div className="container mx-auto px-4">
                <Categories />
                <Promotions />
                <ReaderReviews />
                <Newsletter />
            </div>
        </div>
    );
};

export default Home;
