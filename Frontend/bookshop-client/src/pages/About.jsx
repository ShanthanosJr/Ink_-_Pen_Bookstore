import React from 'react';
import logo from '../assets/inkandpens.png';
import { motion } from 'framer-motion';

const About = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3 }
        }
    };

    return (
        <div className="bg-paper min-h-screen pb-20">
            {/* Header Hero */}
            <motion.header
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="relative py-24 border-b border-border-linen bg-paper-dark overflow-hidden"
            >
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.span
                        variants={fadeIn}
                        className="inline-block py-1 px-4 border border-accent-olive text-accent-olive font-serif italic text-xs mb-6 tracking-[0.2em] uppercase"
                    >
                        Our Chronicle
                    </motion.span>
                    <motion.h1
                        variants={fadeIn}
                        className="text-5xl md:text-7xl font-serif font-bold text-ink mb-6 tracking-tight italic"
                    >
                        Ink & Pens
                    </motion.h1>
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 96, opacity: 0.4 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="h-px bg-accent-olive mx-auto"
                    ></motion.div>
                </div>
            </motion.header>

            <div className="container mx-auto px-6 mt-16 max-w-5xl">
                {/* Logo & Manifesto Section */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="mb-24 flex flex-col md:flex-row items-center gap-16"
                >
                    <motion.div
                        variants={fadeIn}
                        className="md:w-2/5 flex flex-col items-center"
                    >
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
                    </motion.div>

                    <motion.div
                        variants={fadeIn}
                        className="md:w-3/5"
                    >
                        <h2 className="text-3xl font-serif font-bold text-ink mb-8 border-b border-border-linen pb-4 italic">Our Philosophy</h2>
                        <p className="text-lg text-ink-light font-body leading-relaxed italic mb-6">
                            "In an era of fleeting screens and pixels, we remain anchored in the weight of a bound volume and the scent of aging paper."
                        </p>
                        <p className="text-ink text-opacity-80 font-body leading-relaxed mb-6">
                            Ink & Pens was established not merely as a marketplace, but as a sanctuary. We believe that a bookstore should be a quiet conversation between the reader and the shelf, a place where time slows to the rhythm of a turning page.
                        </p>
                        <div className="flex gap-4">
                            <motion.span
                                initial={{ width: 0 }}
                                whileInView={{ width: 48 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="h-px bg-accent-olive mt-3"
                            ></motion.span>
                            <p className="text-sm font-serif font-bold text-accent-olive uppercase tracking-widest">A Dedication to Literature</p>
                        </div>
                    </motion.div>
                </motion.section>

                {/* History Section - Styled as a Scroll */}
                <section className="mb-24 bg-paper-dark p-12 md:p-20 border border-border-linen shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-accent-olive/30"></div>
                    <motion.div
                        initial={{ opacity: 0, rotate: -10 }}
                        whileInView={{ opacity: 0.05, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5 }}
                        className="absolute bottom-0 right-0 p-4 pointer-events-none font-serif text-[200px] leading-none select-none"
                    >📜</motion.div>

                    <div className="relative z-10">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl font-serif font-bold text-ink mb-12 text-center"
                        >
                            The Genesis
                        </motion.h2>

                        <div className="space-y-12 max-w-2xl mx-auto border-l-2 border-dotted border-accent-olive/40 pl-12 relative">
                            {[
                                { year: "Winter, 2026", title: "The first inkling", text: "The first inkling of our presence began as a small catalog of rare fiction, operating out of a shared library space in the heart of Literature City." },
                                { year: "The Expansion", title: "Personal and tangible", text: "Our collection expanded to bridge the gap between classic arts and modern technology, ensuring that even a digital volume feels personal and tangible." },
                                { year: "The Digital Atelier", title: "Global boutique", text: "Today, we stand as a global boutique, curated by hand and driven by a community that cherishes the artisanal side of knowledge." }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: idx * 0.2, duration: 0.6 }}
                                    className="relative"
                                >
                                    <div className="absolute -left-[54px] top-1 w-2.5 h-2.5 rounded-full bg-accent-olive border-4 border-paper shadow-sm"></div>
                                    <h3 className="font-serif font-bold text-xl text-ink underline decoration-accent-olive/30 underline-offset-4 mb-2">{item.year}</h3>
                                    <p className="text-ink-light font-body leading-relaxed italic">
                                        {item.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Founders Section */}
                <section className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="font-serif italic text-accent-olive text-sm mb-4 block tracking-widest uppercase"
                    >
                        The Custodians
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-4xl font-serif font-bold text-ink mb-16 underline decoration-accent-leather underline-offset-8"
                    >
                        Founding Collective
                    </motion.h2>

                    <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
                        {[
                            { name: "Kavishka R.", role: "Chief Archivist & Founder", initials: "KR" },
                            { name: "Chamath P.", role: "Technical Curator", initials: "CP" }
                        ].map((founder, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.3 }}
                                className="group"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="aspect-square bg-paper-dark border-2 border-border-linen mb-6 relative overflow-hidden flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700 shadow-lg"
                                >
                                    <span className="text-6xl text-ink/10 font-serif italic">{founder.initials}</span>
                                    <div className="absolute inset-0 border-[16px] border-paper pointer-events-none opacity-50"></div>
                                </motion.div>
                                <h4 className="text-xl font-serif font-bold text-ink">{founder.name}</h4>
                                <p className="text-xs font-body italic text-accent-olive uppercase tracking-[0.2em] mt-2">{founder.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
