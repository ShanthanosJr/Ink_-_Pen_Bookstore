import React from 'react';

const ContactInfo = () => {
    return (
        <div className="space-y-8">
            {/* Contact Details Card */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">📍</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1">Our Store</h4>
                            <p className="text-gray-600 leading-relaxed">
                                123 Book Lane, Storyville<br />
                                Literature City, CA 90210
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">📞</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1">Phone Support</h4>
                            <p className="text-gray-600">+1 (555) 123-4567</p>
                            <p className="text-xs text-gray-400 mt-1">Mon-Fri, 9am - 6pm EST</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">✉️</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1">Email Us</h4>
                            <p className="text-gray-600">hello@inkandpens.com</p>
                            <p className="text-gray-600">support@inkandpens.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-3xl h-64 w-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-60 transition duration-500 transform group-hover:scale-105" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524813686514-a57563d77965?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                        <span className="text-red-500 animate-bounce">📍</span>
                        <span className="font-bold text-gray-900 text-sm">Find us on Map</span>
                    </div>
                </div>
            </div>

            {/* Mission / Why Us */}
            <div className="bg-indigo-900 text-white p-8 rounded-3xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4">Why Ink & Pens?</h3>
                    <p className="text-indigo-200 text-sm leading-relaxed mb-4">
                        We believe that every book holds a new world waiting to be explored. Our mission is to connect readers with stories that inspire, educate, and transform.
                    </p>
                    <p className="text-indigo-200 text-sm leading-relaxed">
                        Whether you visit us in-store or online, we promise curated excellence and a community that cares about the written word.
                    </p>
                </div>
                {/* Decorative background */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-2xl"></div>
            </div>
        </div>
    );
};

export default ContactInfo;
