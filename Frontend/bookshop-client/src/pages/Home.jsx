import Hero from '../components/home/Hero';
import BookList from '../components/BookList';
import Categories from '../components/home/Categories';
import Promotions from '../components/home/Promotions';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';
import QuoteOfTheWeek from '../components/home/QuoteOfTheWeek';

const Home = () => {
    return (
        <div className="space-y-12">
            <Hero />

            <QuoteOfTheWeek />

            <div id="featured" className="container mx-auto px-4">
                <BookList limit={4} showAdminControls={false} title="Featured Collection" />
            </div>

            <div className="container mx-auto px-4 mt-8">
                <BookList limit={4} showAdminControls={false} title="Editor's Choice" />
            </div>

            <div className="container mx-auto px-4">
                <Categories />
                <Promotions />
                <Testimonials />
                <Newsletter />
            </div>
        </div>
    );
};

export default Home;
