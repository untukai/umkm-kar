

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { orders, products } from '../../data/dummyData';
import SalesChart from '../../components/seller/SalesChart';
import { BoxIcon, StoreIcon } from '../../components/Icons';
import Button from '../../components/Button';


const SalesSummaryItem = ({ title, value }: { title: string; value: string | React.ReactNode }) => (
    <div className="p-4 bg-neutral-50 rounded-lg shadow-sm">
        <p className="text-sm text-neutral-500">{title}</p>
        <p className="text-lg font-bold text-neutral-800 mt-1 truncate">{value}</p>
    </div>
);


const SellerDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [chartView, setChartView] = useState<'harian' | 'mingguan' | 'bulanan'>('harian');

    // --- Data Calculation for Sales Summary ---
    const isSameDay = (date1: Date, date2: Date) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    };

    // Hardcode "today" to match dummy data for a populated demonstration
    const today = new Date('2024-07-28T12:00:00Z'); 
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1); // This will be July 27th

    const omzetHariIni = orders
        .filter(o => isSameDay(new Date(o.date), today))
        .reduce((sum, order) => sum + order.total, 0);

    const omzetKemarin = orders
        .filter(o => isSameDay(new Date(o.date), yesterday))
        .reduce((sum, order) => sum + order.total, 0);

    const monthlyOrders = orders.filter(o => 
        new Date(o.date).getMonth() === today.getMonth() && 
        new Date(o.date).getFullYear() === today.getFullYear()
    );

    const totalOmzetBulanIni = monthlyOrders.reduce((sum, order) => sum + order.total, 0);
    const totalPesananBulanIni = monthlyOrders.length;
    
    // Find best-selling product for the month
    const productQuantities: { [key: number]: number } = {};
    monthlyOrders.forEach(order => {
        order.items.forEach(item => {
            productQuantities[item.product.id] = (productQuantities[item.product.id] || 0) + item.quantity;
        });
    });

    let bestSellerProductId: number | null = null;
    let maxQuantity = 0;
    for (const productId in productQuantities) {
        if (productQuantities[productId] > maxQuantity) {
            maxQuantity = productQuantities[productId];
            bestSellerProductId = parseInt(productId, 10);
        }
    }
    const produkTerlaris = bestSellerProductId ? products.find(p => p.id === bestSellerProductId) : null;
    const recentOrders = orders.slice(0, 4);
    
    // --- DYNAMIC CHART DATA ---
    const dailySalesData = [
        { label: 'Sen', value: 450000 },
        { label: 'Sel', value: 380000 },
        { label: 'Rab', value: 620000 },
        { label: 'Kam', value: 510000 },
        { label: 'Jum', value: 850000 },
        { label: 'Sab', value: 950000 },
        { label: 'Min', value: 790000 },
    ];

    const weeklySalesData = [
        { label: 'M1', value: 2100000 },
        { label: 'M2', value: 3250000 },
        { label: 'M3', value: 2800000 },
        { label: 'M4', value: 4100000 },
    ];

    const monthlySalesData = [
        { label: 'Jan', value: 15000000 },
        { label: 'Feb', value: 12500000 },
        { label: 'Mar', value: 18000000 },
        { label: 'Apr', value: 16500000 },
        { label: 'Mei', value: 21000000 },
        { label: 'Jun', value: 19500000 },
        { label: 'Jul', value: 25000000 },
    ];

    const getCurrentSalesData = () => {
        switch (chartView) {
            case 'harian':
                return dailySalesData;
            case 'mingguan':
                return weeklySalesData;
            case 'bulanan':
                return monthlySalesData;
            default:
                return dailySalesData;
        }
    };
    
    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };
    
    const getStatusChipClass = (status: typeof orders[0]['status']) => {
        switch (status) {
        case 'menunggu pembayaran': return 'bg-orange-100 text-orange-800';
        case 'dikemas': return 'bg-yellow-100 text-yellow-800';
        case 'dikirim': return 'bg-blue-100 text-blue-800';
        case 'selesai': return 'bg-green-100 text-green-800';
        default: return 'bg-neutral-100 text-neutral-800';
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Dashboard Penjual</h1>
                <p className="text-neutral-600 mt-1">Selamat datang, {user?.email}!</p>
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

            {/* Sales Chart & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
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
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Pesanan Terbaru</h3>
                        <Link to="orders" className="text-sm text-primary hover:underline font-medium">Lihat Semua</Link>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.map(order => (
                            <div key={order.id} className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold text-sm">{order.customerName}</p>
                                    <p className="text-xs text-neutral-500">{order.id}</p>
                                </div>
                                <div className="text-right">
                                     <p className="font-bold text-sm">{formatRupiah(order.total)}</p>
                                     <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusChipClass(order.status)} capitalize`}>{order.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Promo and Marketing Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-4">Promo dan Marketing</h3>
                
                {/* Ad Features */}
                <div className="mb-6">
                    <h4 className="font-semibold text-neutral-700 mb-3">Fitur Iklan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Product Ad Card */}
                        <div className="border rounded-lg p-4 flex flex-col items-start gap-2 bg-primary/5">
                            <div className="flex items-center gap-3">
                               <BoxIcon className="w-6 h-6 text-primary" />
                               <h5 className="font-bold text-primary-dark">Iklan Produk</h5>
                            </div>
                            <p className="text-sm text-neutral-600 flex-grow">Tingkatkan visibilitas produk unggulan Anda di halaman pencarian dan kategori.</p>
                            <Button variant="outline" disabled className="mt-2 w-full sm:w-auto cursor-not-allowed">
                                Buat Iklan (Segera Hadir)
                            </Button>
                        </div>
                        {/* Store Ad Card */}
                         <div className="border rounded-lg p-4 flex flex-col items-start gap-2 bg-primary/5">
                            <div className="flex items-center gap-3">
                               <StoreIcon className="w-6 h-6 text-primary" />
                               <h5 className="font-bold text-primary-dark">Iklan Toko</h5>
                            </div>
                            <p className="text-sm text-neutral-600 flex-grow">Promosikan toko Anda untuk menarik lebih banyak pengunjung dan pengikut setia.</p>
                            <Button variant="outline" disabled className="mt-2 w-full sm:w-auto cursor-not-allowed">
                                Buat Iklan (Segera Hadir)
                            </Button>
                        </div>
                    </div>
                </div>
                
                {/* Ad Performance */}
                <div>
                    <h4 className="font-semibold text-neutral-700 mb-3">Performa Iklan (30 Hari Terakhir)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <SalesSummaryItem title="Impresi" value="120,500" />
                        <SalesSummaryItem title="Klik" value="2,450" />
                        <SalesSummaryItem title="Konversi" value="89" />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SellerDashboardPage;
