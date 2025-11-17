
import React, { useState } from 'react';
import { Promotion } from '../../types';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { PlusIcon, XIcon, TagIcon } from '../../components/Icons';
import { useAppData } from '../../hooks/useAppData';

const NewPromoModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const { addPromotion } = useAppData();
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    discountType: 'persen',
    discountValue: '',
    minPurchase: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPromotion({
      type: 'Voucher',
      title: formData.title,
      code: formData.code.toUpperCase(),
      discountType: formData.discountType as 'persen' | 'nominal',
      discountValue: parseInt(formData.discountValue),
      minPurchase: parseInt(formData.minPurchase),
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-overlay" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-popup-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Buat Voucher Baru</h2>
          <button onClick={onClose} className="p-1"><XIcon className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <Input name="title" placeholder="Nama Voucher (Contoh: Diskon Gajian)" onChange={handleChange} required />
            <Input name="code" placeholder="Kode Voucher (Contoh: GAJIANSERU)" onChange={handleChange} required />
            <div className="grid grid-cols-2 gap-4">
              <Input name="discountValue" type="number" placeholder="Nilai Diskon" onChange={handleChange} required />
              <select name="discountType" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="persen">Persen (%)</option>
                <option value="nominal">Nominal (Rp)</option>
              </select>
            </div>
            <Input name="minPurchase" type="number" placeholder="Minimal Pembelian (Rp)" onChange={handleChange} required />
          </div>
          <div className="p-4 border-t text-right">
            <Button type="submit">Simpan Voucher</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PromoCard: React.FC<{ promo: Promotion }> = ({ promo }) => {
  const getStatusChipClass = (status: Promotion['status']) => {
    switch (status) {      
      case 'Aktif': return 'bg-green-100 text-green-800';
      case 'Akan Datang': return 'bg-blue-100 text-blue-800';
      case 'Kadaluarsa': return 'bg-neutral-200 text-neutral-700';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-neutral-800">{promo.title}</h3>
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusChipClass(promo.status)}`}>{promo.status}</span>
      </div>
      <p className="text-sm font-mono bg-neutral-100 text-primary p-2 rounded-md inline-block">Kode: {promo.code}</p>
      <p className="text-sm text-neutral-600">
        Diskon {promo.discountValue}{promo.discountType === 'persen' ? '%' : ' Rupiah'} dengan min. pembelian Rp{promo.minPurchase.toLocaleString('id-ID')}
      </p>
    </div>
  );
};

const SellerPromoPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { promotions, isLoading } = useAppData();

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Promo & Marketing</h1>
            <p className="text-neutral-600 mt-1">Buat voucher dan promosi untuk meningkatkan penjualan.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
            <PlusIcon className="w-5 h-5" />
            <span>Buat Voucher</span>
          </Button>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <p>Memuat promo...</p>
          ) : promotions.length > 0 ? (
            promotions.map(promo => <PromoCard key={promo.id} promo={promo} />)
          ) : (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <TagIcon className="w-12 h-12 mx-auto text-neutral-400" />
              <p className="text-neutral-500 mt-4">Anda belum memiliki promo. <br/> Buat voucher pertama Anda untuk menarik pelanggan!</p>
            </div>
          )}
        </div>
      </div>
      <NewPromoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default SellerPromoPage;
