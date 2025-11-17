

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAppData } from '../../hooks/useAppData';
import SalesChart from '../../components/seller/SalesChart';
import { BoxIcon, StoreIcon, StarIcon, ClipboardListIcon } from '../../components/Icons';
import Button from '../../components/Button';
import StarRating from '../../components/StarRating';

const SalesSummaryItem = ({ title, value }: { title: string; value: string | React.ReactNode }) => (
    <div className="p-4 bg-neutral-50 rounded-lg shadow-sm">
        <p className="text-sm text-neutral-500">{title}</p>
        <p className="text-lg font-bold text-neutral-800 mt-1 truncate">{value}</p>
    </div>
);


const SellerDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { orders, products, reviews, sellers } = useAppData();
    const [chartView, setChartView] = useState<'harian' | 'mingguan' | 'bulanan'>('harian');

    const seller = useMemo(() => sellers.find(s => s.email === user?.email), [sellers, user]);
    const sellerId = seller?.id;

    // --- Data Calculation ---
    const sellerProducts = useMemo(() => products.filter(p => p.sellerId === sellerId), [products, sellerId]);
    const sellerProductIds = useMemo(() => new Set(sellerProducts.map(p => p.id)), [sellerProducts]);
    const sellerReviews = useMemo(() => reviews.filter(r => sellerProductIds.has(r.productId)), [reviews, sellerProductIds]);

    const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();
    const today = new Date('2024-07-28T12:00:00Z'); // Using a fixed date for consistent demo data
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const monthlyOrders = orders.filter(o => new Date(o.date).getMonth() === today.getMonth() && new Date(o.date).getFullYear() === today.getFullYear());
    const omzetHariIni = orders.filter(o => isSameDay(new Date(o.date), today)).reduce((sum, o) => sum + o.total, 0);
    const omzetKemarin = orders.filter(o => isSameDay(new Date(o.date), yesterday)).reduce((sum, o) => sum + o.total, 0);
    const totalOmzetBulanIni = monthlyOrders.reduce((sum, o) => sum + o.total, 0);
    const totalPesananBulanIni = monthlyOrders.length;
    
    const productSales = monthlyOrders.flatMap(o => o.items).reduce((acc, item) => {
        if (sellerProductIds.has(item.product.id)) {
            acc[item.product.id] = (acc[item.product.id] || 0) + item.quantity;
        }
        return acc;
    }, {} as Record<number, number>);

    const bestSellerId = Object.keys(productSales).length > 0 ? parseInt(Object.keys(productSales).reduce((a, b) => productSales[parseInt(a)] > productSales[parseInt(b)] ? a : b)) : null;
    const produkTerlaris = bestSellerId ? products.find(p => p.id === bestSellerId) : null;
    
    // Data for Quick Action Cards
    const pendingOrders = orders.filter(o => o.status === 'dikemas');
    const lowStockProducts = sellerProducts.filter(p => p.stock > 0 && p.stock < 10);
    const latestReview = sellerReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    const dailySalesData = [{ label: 'Sen', value: 450000 }, { label: 'Sel', value: 380000 }, { label: 'Rab', value: 620000 }, { label: 'Kam', value: 510000 }, { label: 'Jum', value: 850000 }, { label: 'Sab', value: 950000 }, { label: 'Min', value: 790000 }];
    const weeklySalesData = [{ label: 'M1', value: 2100000 }, { label: 'M2', value: 3250000 }, { label: 'M3', value: 2800000 }, { label: 'M4', value: 4100000 }];
    const monthlySalesData = [{ label: 'Jan', value: 15000000 }, { label: 'Feb', value: 12500000 }, { label: 'Mar', value: 18000000 }, { label: 'Apr', value: 16500000 }, { label: 'Mei', value: 21000000 }, { label: 'Jun', value: 19500000 }, { label: 'Jul', value: 25000000 }];
    const getCurrentSalesData = () => chartView === 'harian' ? dailySalesData : chartView === 'mingguan' ? weeklySalesData : monthlySalesData;
    
    const formatRupiah = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Dashboard Penjual</h1>
                <p className="text-neutral-600 mt-1">Selamat datang, {seller?.name || user?.email}!</p>
            </div>
            
            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-neutral-700">Perlu Perhatian</h3>
                        <ClipboardListIcon className="w-6 h-6 text-yellow-500"/>
                    </div>
                    <p className="text-3xl font-bold mt-2">{pendingOrders.length} <span className="text-base font-medium text-neutral-500">Pesanan</span></p>
                    <Link to="orders"><Button variant="outline" className="w-full mt-4 !text-sm !py-1.5">Proses Pesanan</Button></Link>
                </div>
                 <div className="bg-white p-5 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-neutral-700">Stok Segera Habis</h3>
                        <BoxIcon className="w-6 h-6 text-red-500"/>
                    </div>
                    <p className="text-3xl font-bold mt-2">{lowStockProducts.length} <span className="text-base font-medium text-neutral-500">Produk</span></p>
                    <Link to="products"><Button variant="outline" className="w-full mt-4 !text-sm !py-1.5">Cek Stok</Button></Link>
                </div>
                 <div className="bg-white p-5 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-neutral-700">Ulasan Baru</h3>
                        <StarIcon className="w-6 h-6 text-blue-500"/>
                    </div>
                     {latestReview ? (
                        <>
                            <div className="flex items-center gap-2 mt-2">
                                <StarRating rating={latestReview.rating} />
                                <span className="font-bold">{latestReview.rating.toFixed(1)}</span>
                            </div>
                            <Link to="reviews"><Button variant="outline" className="w-full mt-4 !text-sm !py-1.5">Balas Ulasan</Button></Link>
                        </>
                    ) : <p className="mt-2 text-neutral-500">Belum ada ulasan.</p>}
                </div>
            </div>

            {/* Sales Summary Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-4">Ringkasan Penjualan</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <SalesSummaryItem title="Omzet Hari Ini" value={formatRupiah(omzetHariIni)} />
                    <SalesSummaryItem title="Omzet Kemarin" value={formatRupiah(omzetKemarin)} />
                    <SalesSummaryItem title="Omzet Bulan Ini" value={formatRupiah(totalOmzetBulanIni)} />
                    <SalesSummaryItem title="Total Pesanan (Bulan Ini)" value={totalPesananBulanIni.toString()} />
                    <SalesSummaryItem title="Produk Terlaris" value={produkTerlaris ? produkTerlaris.name : 'N/A'} />
                </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                    <h3 className="text-lg font-bold">Grafik Penjualan</h3>
                    <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
                        <button onClick={() => setChartView('harian')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartView === 'harian' ? 'bg-white text-primary shadow-sm' : 'text-neutral-600 hover:bg-neutral-200'}`}>Harian</button>
                        <button onClick={() => setChartView('mingguan')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartView === 'mingguan' ? 'bg-white text-primary shadow-sm' : 'text-neutral-600 hover:bg-neutral-200'}`}>Mingguan</button>
                        <button onClick={() => setChartView('bulanan')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartView === 'bulanan' ? 'bg-white text-primary shadow-sm' : 'text-neutral-600 hover:bg-neutral-200'}`}>Bulanan</button>
                    </div>
                </div>
                <div className="h-64 w-full">
                   <SalesChart data={getCurrentSalesData()} />
                </div>
            </div>

        </div>
    );
};

export default SellerDashboardPage;
