import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative bg-indigo-900 text-white overflow-hidden rounded-3xl my-6 mx-4 md:mx-0 shadow-2xl">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1507842217121-9e96e47636e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
                    alt="Library Background"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900/80 to-transparent"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col justify-center h-full">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                    Your Next Great Adventure <br />
                    <span className="text-indigo-400">Starts Here.</span>
                </h1>
                <p className="max-w-xl text-lg md:text-xl text-indigo-100 mb-10 leading-relaxed">
                    Discover a curated collection of fiction, non-fiction, and educational resources designed to inspire and empower.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/shop"
                        className="px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:bg-indigo-50 transition transform hover:-translate-y-1 shadow-lg text-center"
                    >
                        Shop Now
                    </Link>
                    <a
                        href="#featured"
                        className="px-8 py-4 border-2 border-indigo-400/50 text-white rounded-full font-bold text-lg hover:bg-indigo-800/50 transition text-center backdrop-blur-sm"
                    >
                        Explore Featured
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Hero;
