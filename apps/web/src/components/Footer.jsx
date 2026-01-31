import React from 'react';
import { ShoppingCart, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-surface border-t border-border mt-20 pt-16 pb-8">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-sm">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-soft">
                                <ShoppingCart size={24} strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-heading font-bold text-text">Albalad <span className="text-primary italic">Market</span></span>
                        </div>
                        <p className="text-sm text-text-muted leading-relaxed">
                            Bringing the freshest organic produce and premium household essentials straight from the local farms to your home.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-bg flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-bg flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-bg flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-all">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-base font-bold text-text uppercase tracking-widest">Shop</h4>
                        <ul className="flex flex-col gap-4">
                            <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">Daily Deals</a></li>
                            <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">Fresh Produce</a></li>
                            <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">Dairy & Eggs</a></li>
                            <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">Meat & Seafood</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-base font-bold text-text uppercase tracking-widest">Support</h4>
                        <ul className="flex flex-col gap-4">
                            <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">Track Order</a></li>
                            <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">Delivery Policy</a></li>
                            <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">Contact Us</a></li>
                            <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-base font-bold text-text uppercase tracking-widest">Contact</h4>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-primary shrink-0" />
                                <span className="text-sm text-text-muted">123 Market St, Central Plaza, City Center</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-primary shrink-0" />
                                <span className="text-sm text-text-muted">+1 (555) 000-1111</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-primary shrink-0" />
                                <span className="text-sm text-text-muted">hello@albaladmarket.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-text-muted">
                        © 2026 Albalad Market. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-xs text-text-muted hover:text-text transition-colors">Privacy Policy</a>
                        <a href="#" className="text-xs text-text-muted hover:text-text transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
