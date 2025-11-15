
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { orders, products } from '../../data/dummyData';
import { CurrencyDollarIcon, ClipboardListIcon, BoxIcon } from '../../components/Icons';

const StatCard = ({ title, value, icon: Icon, change, changeType }: { title: string; value: string; icon: React.FC<any>; change?: string; changeType?: 'positive' | 'negative' }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-neutral-500">{title}</p>
                <p className="text-2xl font-bold text-neutral-800 mt-1">{value}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
                <Icon className="w-6 h-6 text-primary" />
            </div>
        </div>
        {change && (
            <p className={`text-xs mt-2 ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {change}
            </p>
        )}
    </div>
);

const SellerDashboardPage: React.FC = () => {
    const { user } = useAuth();

    // Dummy data calculations
    const totalOmzetBulanIni = orders.reduce((sum, order) => sum + order.total, 0);
    const pesananBaru = orders.filter(o => o.status === 'dikemas' || o.status === 'menunggu pembayaran').length;
    const produkTerlaris = products[0]; // Simplification
    const recentOrders = orders.slice(0, 4);

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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Omzet (Bulan Ini)" value={formatRupiah(totalOmzetBulanIni)} icon={CurrencyDollarIcon} change="+5.2% dari bulan lalu" changeType="positive" />
                <StatCard title="Pesanan Baru" value={pesananBaru.toString()} icon={ClipboardListIcon} />
                <StatCard title="Produk Terlaris" value={produkTerlaris.name} icon={BoxIcon} />
            </div>

            {/* Sales Chart & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold mb-4">Grafik Penjualan</h3>
                    <div className="h-64 bg-neutral-100 rounded-md flex items-center justify-center">
                        <p className="text-neutral-500">Placeholder untuk grafik penjualan</p>
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
        </div>
    );
};

export default SellerDashboardPage;
