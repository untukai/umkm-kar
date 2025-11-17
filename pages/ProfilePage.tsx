

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { Order } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import { BoxIcon, TruckIcon, CheckCircleIcon, ChevronDownIcon, CurrencyDollarIcon, QrCodeIcon, BanknotesIcon, BuildingStorefrontIcon, XIcon, WalletIcon } from '../components/Icons';

// Sub-component for displaying the visual order status tracker
const OrderStatusTracker = ({ currentStatus }: { currentStatus: Order['status'] }) => {
  const statuses: { id: Order['status']; name: string; icon: React.ReactNode }[] = [
    { id: 'dikemas', name: 'Dikemas', icon: <BoxIcon className="w-6 h-6" /> },
    { id: 'dikirim', name: 'Dikirim', icon: <TruckIcon className="w-6 h-6" /> },
    { id: 'selesai', name: 'Selesai', icon: <CheckCircleIcon className="w-6 h-6" /> },
  ];
  const currentStatusIndex = statuses.findIndex(s => s.id === currentStatus);

  return (
    <div className="w-full px-2 sm:px-4 py-4">
      <div className="flex items-center">
        {statuses.map((status, index) => {
          const isCompleted = index <= currentStatusIndex;
          const isLineActive = index < currentStatusIndex;
          const isLast = index === statuses.length - 1;

          return (
            <React.Fragment key={status.id}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                  {status.icon}
                </div>
                <p className={`mt-2 text-xs sm:text-sm font-semibold transition-colors ${isCompleted ? 'text-primary' : 'text-neutral-500'}`}>{status.name}</p>
              </div>
              {!isLast && (
                <div className={`flex-grow h-1 mx-2 transition-colors ${isLineActive ? 'bg-primary' : 'bg-neutral-200'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Sub-component for the wallet
const KodikWallet: React.FC = () => {
    const { user, topUpCoins, redeemCoins, topUpBalance, withdrawBalance } = useAuth();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState<'topup' | 'redeem'>('topup');
    const [topUpAmount, setTopUpAmount] = useState('');
    const [redeemAmount, setRedeemAmount] = useState('');
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    const coinPrice = 1000;

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const handleTopUp = () => {
        const amount = parseInt(topUpAmount, 10);
        if (isNaN(amount) || amount <= 0) {
            showNotification('Gagal', 'Jumlah koin tidak valid.', 'error');
            return;
        }
        if (topUpCoins(amount)) {
            showNotification('Berhasil', `Anda berhasil membeli ${amount} koin!`);
            setTopUpAmount('');
        } else {
            showNotification('Gagal', 'Saldo Anda tidak mencukupi untuk transaksi ini.', 'error');
        }
    };

    const handleRedeem = () => {
        const amount = parseInt(redeemAmount, 10);
        if (isNaN(amount) || amount <= 0) {
            showNotification('Gagal', 'Jumlah koin tidak valid.', 'error');
            return;
        }
        if (redeemCoins(amount)) {
            showNotification('Berhasil', `Anda berhasil menukar ${amount} koin menjadi saldo.`);
            setRedeemAmount('');
        } else {
            showNotification('Gagal', 'Koin Anda tidak mencukupi.', 'error');
        }
    };
    
    const topUpCost = parseInt(topUpAmount) > 0 ? parseInt(topUpAmount) * coinPrice : 0;
    const redeemValue = parseInt(redeemAmount) > 0 ? parseInt(redeemAmount) * coinPrice : 0;

    return (
        <>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Dompet KODIK</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-100 p-4 rounded-lg">
                    <p className="text-sm text-neutral-600">Saldo Anda</p>
                    <p className="text-2xl font-bold text-primary">{formatRupiah(user?.balance || 0)}</p>
                    <div className="flex gap-2 mt-2">
                        <Button variant="outline" onClick={() => setIsTopUpModalOpen(true)} className="!text-sm !py-1.5 !px-3 flex-1">Isi Saldo</Button>
                        <Button variant="outline" onClick={() => setIsWithdrawModalOpen(true)} className="!text-sm !py-1.5 !px-3 flex-1">Tarik Saldo</Button>
                    </div>
                </div>
                <div className="bg-neutral-100 p-4 rounded-lg">
                    <p className="text-sm text-neutral-600">Koin Anda</p>
                    <p className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
                        <CurrencyDollarIcon className="w-6 h-6" /> {user?.coins || 0}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-4">
                <button onClick={() => setActiveTab('topup')} className={`py-2 px-4 font-semibold ${activeTab === 'topup' ? 'border-b-2 border-primary text-primary' : 'text-neutral-500'}`}>Isi Ulang Koin</button>
                <button onClick={() => setActiveTab('redeem')} className={`py-2 px-4 font-semibold ${activeTab === 'redeem' ? 'border-b-2 border-primary text-primary' : 'text-neutral-500'}`}>Tukar Koin ke Saldo</button>
            </div>

            {/* Tab Content */}
            {activeTab === 'topup' && (
                <div className="space-y-4 animate-fade-in">
                    <h3 className="font-semibold">Beli Koin</h3>
                    <p className="text-sm text-neutral-500">1 Koin = {formatRupiah(coinPrice)}</p>
                    <Input type="number" placeholder="Masukkan jumlah koin" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} />
                    <div className="flex gap-2">
                        {[10, 50, 100].map(val => <Button key={val} type="button" variant="outline" onClick={() => setTopUpAmount(String(val))}>{val} Koin</Button>)}
                    </div>
                    {topUpCost > 0 && <p className="text-sm">Total Biaya: <span className="font-bold">{formatRupiah(topUpCost)}</span></p>}
                    <Button onClick={handleTopUp} disabled={!topUpAmount || parseInt(topUpAmount) <= 0}>Beli Koin</Button>
                </div>
            )}

            {activeTab === 'redeem' && (
                <div className="space-y-4 animate-fade-in">
                    <h3 className="font-semibold">Tukar Koin</h3>
                    <p className="text-sm text-neutral-500">Tukar koin Anda menjadi saldo yang bisa digunakan.</p>
                    <Input type="number" placeholder="Masukkan jumlah koin" value={redeemAmount} onChange={(e) => setRedeemAmount(e.target.value)} />
                     <div className="flex gap-2">
                        {[10, 50, 100].map(val => <Button key={val} type="button" variant="outline" onClick={() => setRedeemAmount(String(val))}>{val} Koin</Button>)}
                    </div>
                    {redeemValue > 0 && <p className="text-sm">Anda akan menerima: <span className="font-bold">{formatRupiah(redeemValue)}</span></p>}
                    <Button onClick={handleRedeem} disabled={!redeemAmount || parseInt(redeemAmount) <= 0}>Tukar Koin</Button>
                </div>
            )}
        </div>
        <TopUpModal 
            isOpen={isTopUpModalOpen} 
            onClose={() => setIsTopUpModalOpen(false)}
            onConfirm={(amount) => {
                topUpBalance(amount);
                showNotification('Berhasil!', `${formatRupiah(amount)} telah ditambahkan ke saldo Anda.`);
                setIsTopUpModalOpen(false);
            }}
        />
        <WithdrawModal
            isOpen={isWithdrawModalOpen}
            onClose={() => setIsWithdrawModalOpen(false)}
            onConfirm={(amount) => {
                if (withdrawBalance(amount)) {
                    showNotification('Penarikan Berhasil!', 'Dana akan segera diproses.');
                    setIsWithdrawModalOpen(false);
                } else {
                    showNotification('Gagal!', 'Saldo Anda tidak mencukupi untuk penarikan ini.', 'error');
                }
            }}
        />
        </>
    );
}

// Sub-component for Top Up Modal
const TopUpModal: React.FC<{isOpen: boolean; onClose: () => void; onConfirm: (amount: number) => void;}> = ({ isOpen, onClose, onConfirm }) => {
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep(1);
                setAmount('');
                setPaymentMethod('');
            }, 300);
        }
    }, [isOpen]);

    const formatRupiah = (number: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    const handleNextStep = () => {
        if (step === 1 && parseInt(amount) > 0) setStep(2);
        if (step === 2 && paymentMethod) setStep(3);
    };
    
    const paymentMethods = [
        { id: 'qris', name: 'QRIS', icon: QrCodeIcon, desc: 'Bayar dengan semua aplikasi E-Wallet.' },
        { id: 'va', name: 'Virtual Account', icon: BanknotesIcon, desc: 'Transfer dari M-Banking Anda.' },
        { id: 'retail', name: 'Gerai Retail', icon: BuildingStorefrontIcon, desc: 'Bayar di Alfamart / Indomaret.' },
    ];

    const renderStepContent = () => {
        switch(step) {
            case 1:
                return (
                    <>
                        <h3 className="text-lg font-bold mb-4">1. Masukkan Jumlah</h3>
                        <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Contoh: 50000" className="text-center text-xl" />
                        <div className="flex gap-2 mt-3">
                            {[50000, 100000, 200000].map(val => (
                                <Button key={val} type="button" variant="outline" onClick={() => setAmount(String(val))} className="flex-1">{formatRupiah(val)}</Button>
                            ))}
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <h3 className="text-lg font-bold mb-4">2. Pilih Metode Pembayaran</h3>
                        <div className="space-y-3">
                            {paymentMethods.map(method => (
                                <label key={method.id} className={`flex items-center gap-4 border p-3 rounded-lg cursor-pointer transition-all ${paymentMethod === method.id ? 'bg-primary/10 border-primary' : 'hover:bg-neutral-50'}`}>
                                    <input type="radio" name="paymentMethod" value={method.id} checked={paymentMethod === method.id} onChange={e => setPaymentMethod(e.target.value)} className="h-4 w-4 text-primary focus:ring-primary"/>
                                    <method.icon className="w-8 h-8 text-primary"/>
                                    <div>
                                        <p className="font-semibold">{method.name}</p>
                                        <p className="text-xs text-neutral-500">{method.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <h3 className="text-lg font-bold mb-4">3. Instruksi Pembayaran</h3>
                        <div className="text-center p-4 bg-neutral-100 rounded-lg">
                            <p>Total Pembayaran</p>
                            <p className="text-2xl font-bold text-primary">{formatRupiah(parseInt(amount))}</p>
                        </div>
                        {paymentMethod === 'qris' && <div className="text-center mt-4">
                            <div className="w-40 h-40 bg-neutral-300 mx-auto my-2 flex items-center justify-center text-neutral-500 text-sm">QR Code Placeholder</div>
                            <p>Scan QR Code di atas menggunakan aplikasi E-Wallet Anda.</p>
                        </div>}
                        {paymentMethod === 'va' && <div className="text-center mt-4 space-y-2">
                            <p>Nomor Virtual Account:</p>
                            <p className="font-bold text-lg bg-neutral-200 p-2 rounded">8808 1234 5678 9012</p>
                            <p className="text-xs">Salin nomor di atas dan bayar melalui M-Banking.</p>
                        </div>}
                        {paymentMethod === 'retail' && <div className="text-center mt-4 space-y-2">
                            <p>Kode Pembayaran:</p>
                            <p className="font-bold text-lg bg-neutral-200 p-2 rounded">KODIKTOPUP123</p>
                            <p className="text-xs">Tunjukkan kode di atas ke kasir Alfamart/Indomaret.</p>
                        </div>}
                    </>
                );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-overlay" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-popup-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Isi Saldo</h2>
                    <button onClick={onClose}><XIcon className="w-6 h-6"/></button>
                </div>
                <div className="p-6">{renderStepContent()}</div>
                <div className="p-4 border-t flex justify-end gap-3">
                    {step > 1 && <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)}>Kembali</Button>}
                    {step < 3 && <Button type="button" onClick={handleNextStep} disabled={(step === 1 && !(parseInt(amount) > 0)) || (step === 2 && !paymentMethod)}>Lanjut</Button>}
                    {step === 3 && <Button type="button" onClick={() => onConfirm(parseInt(amount))}>Saya Sudah Bayar</Button>}
                </div>
            </div>
        </div>
    );
};

const WithdrawModal: React.FC<{isOpen: boolean; onClose: () => void; onConfirm: (amount: number) => void;}> = ({ isOpen, onClose, onConfirm }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('');
    const [destination, setDestination] = useState(''); // 'ewallet' or 'bank'
    const [ewallet, setEwallet] = useState({ provider: 'GoPay', phone: '' });
    const [bank, setBank] = useState({ name: '', number: '', holder: '' });
    const adminFee = 2500;
    
    const balance = user?.balance || 0;
    const amountNum = parseInt(amount) || 0;
    const isAmountValid = amountNum > 0 && (amountNum + adminFee) <= balance;

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep(1); setAmount(''); setDestination('');
            }, 300);
        }
    }, [isOpen]);

    const formatRupiah = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
    
    const handleSetAmount = (percentage: number) => {
        const value = Math.floor(balance * (percentage / 100));
        setAmount(String(value));
    };

    const handleNext = () => {
        if (step === 1 && isAmountValid) setStep(2);
        else if (step === 2 && destination) setStep(3);
    };

    const renderStep = () => {
        switch (step) {
            case 1: return (
                <>
                    <h3 className="text-lg font-bold mb-2">1. Masukkan Jumlah Penarikan</h3>
                    <p className="text-sm text-neutral-500 mb-4">Saldo Tersedia: <span className="font-semibold">{formatRupiah(balance)}</span></p>
                    <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Contoh: 50000" className="text-center text-xl" />
                    <div className="flex gap-2 mt-3">
                        {[25, 50, 100].map(p => <Button key={p} type="button" variant="outline" onClick={() => handleSetAmount(p)} className="flex-1">{p}%</Button>)}
                    </div>
                    {!isAmountValid && amountNum > 0 && <p className="text-red-500 text-xs mt-2 text-center">Jumlah penarikan melebihi saldo yang tersedia (termasuk biaya admin Rp2.500).</p>}
                </>
            );
            case 2: return (
                <>
                    <h3 className="text-lg font-bold mb-4">2. Pilih Tujuan Penarikan</h3>
                    <div className="space-y-3">
                        <label className={`flex items-center gap-4 border p-3 rounded-lg cursor-pointer ${destination === 'ewallet' && 'bg-primary/10 border-primary'}`}>
                            <input type="radio" name="dest" value="ewallet" onChange={e => setDestination(e.target.value)} className="h-4 w-4 text-primary"/>
                            <WalletIcon className="w-8 h-8 text-primary"/>
                            <div><p className="font-semibold">E-Wallet</p><p className="text-xs text-neutral-500">GoPay, OVO, Dana, dll.</p></div>
                        </label>
                        {destination === 'ewallet' && (
                            <div className="pl-12 space-y-2 animate-fade-in">
                                <select className="w-full px-3 py-2 border rounded-lg" value={ewallet.provider} onChange={e => setEwallet(p => ({...p, provider: e.target.value}))}><option>GoPay</option><option>OVO</option><option>Dana</option></select>
                                <Input type="tel" placeholder="Nomor Handphone" value={ewallet.phone} onChange={e => setEwallet(p => ({...p, phone: e.target.value}))}/>
                            </div>
                        )}
                        <label className={`flex items-center gap-4 border p-3 rounded-lg cursor-pointer ${destination === 'bank' && 'bg-primary/10 border-primary'}`}>
                            <input type="radio" name="dest" value="bank" onChange={e => setDestination(e.target.value)} className="h-4 w-4 text-primary"/>
                            <BanknotesIcon className="w-8 h-8 text-primary"/>
                            <div><p className="font-semibold">Transfer Bank</p><p className="text-xs text-neutral-500">BCA, Mandiri, BRI, dll.</p></div>
                        </label>
                        {destination === 'bank' && (
                            <div className="pl-12 space-y-2 animate-fade-in">
                                <Input placeholder="Nama Bank" value={bank.name} onChange={e => setBank(b => ({...b, name: e.target.value}))}/>
                                <Input type="number" placeholder="Nomor Rekening" value={bank.number} onChange={e => setBank(b => ({...b, number: e.target.value}))}/>
                                <Input placeholder="Nama Pemilik Rekening" value={bank.holder} onChange={e => setBank(b => ({...b, holder: e.target.value}))}/>
                            </div>
                        )}
                    </div>
                </>
            );
            case 3: 
                const destinationInfo = destination === 'ewallet'
                    ? `${ewallet.provider} (${ewallet.phone})`
                    : `${bank.name} (${bank.number}) a.n. ${bank.holder}`;
                return (
                <>
                    <h3 className="text-lg font-bold mb-4">3. Konfirmasi Penarikan</h3>
                    <div className="p-4 bg-neutral-100 rounded-lg space-y-2 text-sm">
                       <div className="flex justify-between"><span className="text-neutral-600">Jumlah Penarikan</span><span className="font-semibold">{formatRupiah(amountNum)}</span></div>
                       <div className="flex justify-between"><span className="text-neutral-600">Biaya Admin</span><span className="font-semibold">{formatRupiah(adminFee)}</span></div>
                       <div className="flex justify-between pt-2 border-t mt-2 font-bold text-base"><span className="text-neutral-800">Total Diterima</span><span className="text-primary">{formatRupiah(amountNum - adminFee)}</span></div>
                       <div className="pt-2 border-t mt-2"><p className="text-neutral-600">Tujuan: <span className="font-semibold">{destinationInfo}</span></p></div>
                    </div>
                </>
            );
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-overlay" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-popup-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Tarik Saldo</h2>
                    <button onClick={onClose}><XIcon className="w-6 h-6"/></button>
                </div>
                <div className="p-6">{renderStep()}</div>
                <div className="p-4 border-t flex justify-end gap-3">
                    {step > 1 && <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)}>Kembali</Button>}
                    {step < 3 && <Button type="button" onClick={handleNext} disabled={(step === 1 && !isAmountValid) || (step === 2 && !destination)}>Lanjut</Button>}
                    {step === 3 && <Button type="button" onClick={() => onConfirm(amountNum)}>Konfirmasi & Tarik Dana</Button>}
                </div>
            </div>
        </div>
    );
};

const ProfilePage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);


  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      const storedOrders = JSON.parse(localStorage.getItem('kodik-orders') || '[]');
      setOrders(storedOrders.reverse());
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
  };
  
  const getStatusChipClass = (status: Order['status']) => {
    switch (status) {
      case 'dikemas': return 'bg-yellow-100 text-yellow-800';
      case 'dikirim': return 'bg-blue-100 text-blue-800';
      case 'selesai': return 'bg-green-100 text-green-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  }

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Profil Saya</h1>
          <Button onClick={handleLogout} variant="outline">Keluar</Button>
        </div>
        <p className="text-lg">Selamat datang, <span className="font-semibold">{user?.email}</span>!</p>
      </div>

      <KodikWallet />

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Riwayat Pesanan</h2>
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map(order => (
              <div key={order.id} className="border rounded-lg overflow-hidden transition-shadow duration-300">
                <button 
                  onClick={() => toggleOrderDetails(order.id)} 
                  className="w-full text-left bg-neutral-50 p-4 hover:bg-neutral-100 focus:outline-none focus:bg-neutral-100 transition-colors"
                  aria-expanded={expandedOrderId === order.id}
                  aria-controls={`order-details-${order.id}`}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div className="flex-1">
                      <p className="font-bold text-neutral-800">Pesanan #{order.id}</p>
                      <p className="text-sm text-neutral-500">{formatDate(order.date)}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <div className="text-right sm:text-left">
                         <p className="font-bold text-lg text-primary">{formatRupiah(order.total)}</p>
                      </div>
                       <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusChipClass(order.status)} capitalize`}>{order.status}</span>
                      <ChevronDownIcon className={`w-6 h-6 text-neutral-500 transition-transform flex-shrink-0 ${expandedOrderId === order.id ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </button>
                {expandedOrderId === order.id && (
                  <div id={`order-details-${order.id}`} className="p-4 sm:p-6 bg-white border-t animate-fade-in">
                    <OrderStatusTracker currentStatus={order.status} />
                    <div className="border-t mt-6 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Kolom 1: Alamat Pengiriman */}
                        <div>
                          <h4 className="font-semibold text-neutral-800 mb-2">Alamat Pengiriman</h4>
                          <div className="text-sm text-neutral-600 space-y-1">
                            <p className="font-bold">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.phone}</p>
                          </div>
                        </div>
                        {/* Kolom 2: Barang Pesanan */}
                        <div>
                          <h4 className="font-semibold text-neutral-800 mb-2">Barang Pesanan</h4>
                          <ul className="space-y-2">
                            {order.items.map(item => (
                              <li key={item.product.id} className="text-sm text-neutral-600 flex justify-between">
                                <span className="pr-2">{item.product.name} <span className="text-neutral-500">(x{item.quantity})</span></span>
                                <span className="font-semibold text-neutral-700 whitespace-nowrap">{formatRupiah(item.product.price * item.quantity)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">Anda belum memiliki riwayat pesanan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;