import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle, Package } from 'lucide-react';

const HistoryPage = () => {
    const { history } = useStore();

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-2xl text-text-muted gap-md">
                <Package size={48} className="opacity-10" />
                <h3 className="font-bold text-lg">No orders found</h3>
                <p className="text-sm">Your purchase history will appear here once you place an order.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-lg">
            {history.map((order) => (
                <div key={order.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-lg flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-gray-50 bg-gray-50/30">
                        <div className="flex items-center gap-md">
                            <div className="bg-primary/10 text-primary p-2 rounded-full">
                                <CheckCircle size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Order ID</span>
                                <span className="text-sm font-bold text-text-dark">#{order.id}</span>
                            </div>
                            <div className="flex flex-col ml-md">
                                <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Date</span>
                                <span className="text-sm text-text-dark">{order.date}</span>
                            </div>
                        </div>
                        <div className="flex flex-col md:items-end">
                            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Total Amount</span>
                            <span className="text-xl font-bold text-primary">${order.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="p-lg flex flex-wrap gap-md">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-sm bg-gray-50 px-md py-sm rounded-lg border border-gray-100">
                                <img src={item.image} className="w-8 h-8 rounded object-cover" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-text-dark">{item.name}</span>
                                    <span className="text-[10px] text-text-muted">Qty: {item.quantity}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryPage;
