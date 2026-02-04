const Categories = () => {
    const categories = [
        { name: 'Fiction', icon: '🎭', color: 'bg-pink-100 text-pink-600' },
        { name: 'Non-Fiction', icon: '🧠', color: 'bg-blue-100 text-blue-600' },
        { name: 'Technology', icon: '💻', color: 'bg-purple-100 text-purple-600' },
        { name: 'Education', icon: '🎓', color: 'bg-green-100 text-green-600' },
        { name: 'History', icon: '📜', color: 'bg-yellow-100 text-yellow-600' },
        { name: 'Art & Design', icon: '🎨', color: 'bg-orange-100 text-orange-600' },
    ];

    return (
        <section className="py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Explore Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.map((cat) => (
                    <div key={cat.name} className="group cursor-pointer">
                        <div className={`${cat.color} w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}>
                            <span className="text-4xl">{cat.icon}</span>
                            <span className="font-semibold">{cat.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Categories;
