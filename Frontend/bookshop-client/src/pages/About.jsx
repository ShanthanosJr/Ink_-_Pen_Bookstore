import React from 'react';
import logo from '../assets/inkandpens.png';

const About = () => {
    return (
        <div className="bg-paper min-h-screen pb-20">
            {/* Header Hero */}
            <header className="relative py-24 border-b border-border-linen bg-paper-dark overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <span className="inline-block py-1 px-4 border border-accent-olive text-accent-olive font-serif italic text-xs mb-6 tracking-[0.2em] uppercase">Our Chronicle</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-ink mb-6 tracking-tight italic">Ink & Pens</h1>
                    <div className="w-24 h-px bg-accent-olive mx-auto opacity-40"></div>
                </div>
            </header>

            <div className="container mx-auto px-6 mt-16 max-w-5xl">
                {/* Logo & Manifesto Section */}
                <section className="mb-24 flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-2/5 flex flex-col items-center">
                        <div className="relative p-8 border-4 border-double border-border-linen bg-paper shadow-xl group">
                            <img
                                src={logo}
                                alt="Ink & Pens Logo"
                                className="w-full max-w-[280px] grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute -bottom-4 -right-4 bg-ink text-paper text-[10px] px-3 py-1 font-serif uppercase tracking-widest border border-ink">
                                Reg. Mark 2026
                            </div>
                        </div>
                        <p className="mt-8 text-[10px] text-ink-light uppercase tracking-[0.3em] font-bold text-center">The Official Insignia</p>
                    </div>

                    <div className="md:w-3/5">
                        <h2 className="text-3xl font-serif font-bold text-ink mb-8 border-b border-border-linen pb-4 italic">Our Philosophy</h2>
                        <p className="text-lg text-ink-light font-body leading-relaxed italic mb-6">
                            "In an era of fleeting screens and pixels, we remain anchored in the weight of a bound volume and the scent of aging paper."
                        </p>
                        <p className="text-ink text-opacity-80 font-body leading-relaxed mb-6">
                            Ink & Pens was established not merely as a marketplace, but as a sanctuary. We believe that a bookstore should be a quiet conversation between the reader and the shelf, a place where time slows to the rhythm of a turning page.
                        </p>
                        <div className="flex gap-4">
                            <span className="w-12 h-px bg-accent-olive mt-3"></span>
                            <p className="text-sm font-serif font-bold text-accent-olive uppercase tracking-widest">A Dedication to Literature</p>
                        </div>
                    </div>
                </section>

                {/* History Section - Styled as a Scroll */}
                <section className="mb-24 bg-paper-dark p-12 md:p-20 border border-border-linen shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-accent-olive/30"></div>
                    <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none font-serif text-[200px] leading-none select-none">📜</div>

                    <div className="relative z-10">
                        <h2 className="text-4xl font-serif font-bold text-ink mb-12 text-center">The Genesis</h2>

                        <div className="space-y-12 max-w-2xl mx-auto border-l-2 border-dotted border-accent-olive/40 pl-12 relative">
                            <div className="relative">
                                <div className="absolute -left-[54px] top-1 w-2.5 h-2.5 rounded-full bg-accent-olive border-4 border-paper shadow-sm"></div>
                                <h3 className="font-serif font-bold text-xl text-ink underline decoration-accent-olive/30 underline-offset-4 mb-2">Winter, 2026</h3>
                                <p className="text-ink-light font-body leading-relaxed italic">
                                    The first inkling of our presence began as a small catalog of rare fiction, operating out of a shared library space in the heart of Literature City.
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute -left-[54px] top-1 w-2.5 h-2.5 rounded-full bg-accent-olive border-4 border-paper shadow-sm"></div>
                                <h3 className="font-serif font-bold text-xl text-ink underline decoration-accent-olive/30 underline-offset-4 mb-2">The Expansion</h3>
                                <p className="text-ink-light font-body leading-relaxed italic">
                                    Our collection expanded to bridge the gap between classic arts and modern technology, ensuring that even a digital volume feels personal and tangible.
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute -left-[54px] top-1 w-2.5 h-2.5 rounded-full bg-accent-olive border-4 border-paper shadow-sm"></div>
                                <h3 className="font-serif font-bold text-xl text-ink underline decoration-accent-olive/30 underline-offset-4 mb-2">The Digital Atelier</h3>
                                <p className="text-ink-light font-body leading-relaxed italic">
                                    Today, we stand as a global boutique, curated by hand and driven by a community that cherishes the artisanal side of knowledge.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Founders Section */}
                <section className="text-center mb-12">
                    <span className="font-serif italic text-accent-olive text-sm mb-4 block tracking-widest uppercase">The Custodians</span>
                    <h2 className="text-4xl font-serif font-bold text-ink mb-16 underline decoration-accent-leather underline-offset-8">Founding Collective</h2>

                    <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
                        <div className="group">
                            <div className="aspect-square bg-paper-dark border-2 border-border-linen mb-6 relative overflow-hidden flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700 shadow-lg">
                                <span className="text-6xl text-ink/10 font-serif italic">KR</span>
                                <div className="absolute inset-0 border-[16px] border-paper pointer-events-none opacity-50"></div>
                            </div>
                            <h4 className="text-xl font-serif font-bold text-ink">Kavishka R.</h4>
                            <p className="text-xs font-body italic text-accent-olive uppercase tracking-[0.2em] mt-2">Chief Archivist & Founder</p>
                        </div>

                        <div className="group">
                            <div className="aspect-square bg-paper-dark border-2 border-border-linen mb-6 relative overflow-hidden flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700 shadow-lg">
                                <span className="text-6xl text-ink/10 font-serif italic">AS</span>
                                <div className="absolute inset-0 border-[16px] border-paper pointer-events-none opacity-50"></div>
                            </div>
                            <h4 className="text-xl font-serif font-bold text-ink">The Scribe</h4>
                            <p className="text-xs font-body italic text-accent-olive uppercase tracking-[0.2em] mt-2">Technical Curator</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
