import React from 'react';
import { ShoppingCart, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-surface border-t border-border mt-20 md:mt-32 pt-16 md:pt-24 pb-12">
            <div className="container-custom">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-12 md:mb-20">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-6 md:gap-8 items-center sm:items-start text-center sm:text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-[0_8px_16px_rgba(27,77,62,0.2)]">
                                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg md:text-xl font-black text-text tracking-tighter leading-none">Albalad Market</span>
                                <span className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Premium Grocers</span>
                            </div>
                        </div>
                        <p className="text-sm text-text-muted leading-relaxed font-medium max-w-sm">
                            Bringing the freshest organic produce and premium household essentials straight from local farms to your doorstep with uncompromising quality.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-bg flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                                    <Icon size={18} strokeWidth={2.5} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick & Support Combined/Separated with Style */}
                    <div className="flex flex-col gap-6 md:gap-8 items-center sm:items-start text-center sm:text-left">
                        <h4 className="text-[10px] md:text-[11px] font-black text-text uppercase tracking-[0.2em] border-l-4 border-primary pl-4">Shop Collection</h4>
                        <ul className="flex flex-col gap-3 md:gap-4">
                            {['Daily Essentials', 'Fresh Produce', 'Dairy & Eggs', 'Sustainable Meat'].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className="text-sm font-semibold text-text-muted hover:text-primary transition-all duration-200 flex items-center gap-2 group justify-center sm:justify-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary group-hover:scale-150 transition-all" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-6 md:gap-8 items-center sm:items-start text-center sm:text-left">
                        <h4 className="text-[10px] md:text-[11px] font-black text-text uppercase tracking-[0.2em] border-l-4 border-accent pl-4">Customer Care</h4>
                        <ul className="flex flex-col gap-3 md:gap-4">
                            {['Order Tracking', 'Delivery Guide', 'Return Policy', 'Gift Cards'].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className="text-sm font-semibold text-text-muted hover:text-primary transition-all duration-200 flex items-center gap-2 group justify-center sm:justify-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary group-hover:scale-150 transition-all" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact - Visualized */}
                    <div className="flex flex-col gap-6 md:gap-8 items-center sm:items-start text-center sm:text-left">
                        <h4 className="text-[10px] md:text-[11px] font-black text-text uppercase tracking-[0.2em] border-l-4 border-slate-900 pl-4">get in touch</h4>
                        <ul className="flex flex-col gap-4">
                            <li className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-bg rounded-2xl border border-transparent hover:border-border transition-all w-full">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                                    <MapPin size={18} strokeWidth={2.5} />
                                </div>
                                <span className="text-xs font-bold text-text-muted leading-relaxed">123 Market St, Central Plaza,<br />City Center</span>
                            </li>
                            <li className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-bg rounded-2xl border border-transparent hover:border-border transition-all w-full">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                                    <Phone size={18} strokeWidth={2.5} />
                                </div>
                                <span className="text-xs font-bold text-text-muted">+1 (555) 000-1111</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 md:pt-10 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.1em] text-center md:text-left">
                        © 2026 Albalad Market. Crafted with Passion.
                    </p>
                    <div className="flex items-center gap-6 md:gap-8">
                        <a href="#" className="text-[9px] md:text-[10px] font-black text-text-muted hover:text-primary uppercase tracking-[0.1em] transition-colors">Privacy Policy</a>
                        <a href="#" className="text-[9px] md:text-[10px] font-black text-text-muted hover:text-primary uppercase tracking-[0.1em] transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
