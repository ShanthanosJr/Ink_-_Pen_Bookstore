const Categories = () => {
    const categories = [
        { name: 'Fiction', icon: '🎭', color: 'border-l-4 border-l-red-800' },
        { name: 'Non-Fiction', icon: '🧠', color: 'border-l-4 border-l-blue-800' },
        { name: 'Technology', icon: '⚡', color: 'border-l-4 border-l-purple-800' },
        { name: 'Education', icon: '🎓', color: 'border-l-4 border-l-green-800' },
        { name: 'History', icon: '📜', color: 'border-l-4 border-l-yellow-700' },
        { name: 'Art & Design', icon: '🎨', color: 'border-l-4 border-l-orange-700' },
    ];

    return (
        <section className="py-16">
            <div className="flex items-center justify-between mb-8 border-b border-border-linen pb-2">
                <h2 className="text-3xl font-serif font-bold text-ink">Browse Archives</h2>
                <div className="h-px flex-grow bg-accent-olive/20 ml-6 hidden sm:block"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.map((cat) => (
                    <div key={cat.name} className="group cursor-pointer">
                        <div className={`bg-paper border border-border-linen ${cat.color} p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:shadow-md hover:bg-paper-dark relative overflow-hidden`}>
                            {/* Paper texture overlay */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

                            <span className="text-4xl opacity-80 group-hover:scale-110 transition-transform duration-500">{cat.icon}</span>
                            <span className="font-serif font-bold text-ink text-center text-sm tracking-wide uppercase">{cat.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Categories;
