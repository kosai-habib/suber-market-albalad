import React, { useState, useMemo } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { ProductGrid } from './components/ProductDisplay';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import HistoryPage from './components/HistoryPage';

const MainApp = () => {
  const { products } = useStore();
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('pop');
  const [showHistory, setShowHistory] = useState(false);
  const [showDeals, setShowDeals] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Step 1: Filter by category (if not All)
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    // Step 2: Filter by Deals (is_discounted)
    if (showDeals) {
      result = result.filter(p => p.is_discounted);
    }

    // Step 3: Sort
    if (sort === 'pop') {
      result.sort((a, b) => b.popularity - a.popularity);
    } else if (sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [category, showDeals, sort, products]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] min-h-screen bg-bg-main">
      <Header className="col-span-full sticky top-0 z-50 h-20 bg-bg-card border-b border-gray-100 px-lg" />

      {!showHistory && (
        <Sidebar
          className="hidden md:flex bg-bg-card border-r border-gray-100 sticky top-20 h-[calc(100vh-5rem)]"
          activeCategory={category}
          setCategory={(cat) => { setCategory(cat); setShowDeals(false); }}
          activeSort={sort}
          setSort={setSort}
          showDeals={showDeals}
          setShowDeals={(val) => { setShowDeals(val); if (val) setCategory('All'); }}
        />
      )}

      <main className={`p-lg flex flex-col gap-lg ${showHistory ? 'col-span-full max-w-5xl mx-auto w-full' : ''}`}>
        <div className="flex flex-col gap-xs">
          <h2 className="text-3xl font-bold tracking-tight text-text-dark capitalize">
            {showHistory ? 'Your Activity' : (showDeals ? 'Featured Deals' : (category === 'All' ? 'Our Shop' : category))}
          </h2>
          <p className="text-text-muted">
            {showHistory ? 'View your past orders and preferences' : (showDeals ? 'Premium products at special prices' : 'Hand-picked premium quality items')}
          </p>
        </div>

        {showHistory ? (
          <HistoryPage />
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </main>

      <CartDrawer />
      <AuthModal />

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-card border-t border-gray-100 flex items-center justify-around px-md z-50">
        <button onClick={() => setShowHistory(false)} className="text-text-muted hover:text-primary">Shop</button>
        <button onClick={() => setShowHistory(true)} className="text-text-muted hover:text-primary">History</button>
      </nav>
    </div>
  );
};

function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}

export default App;
