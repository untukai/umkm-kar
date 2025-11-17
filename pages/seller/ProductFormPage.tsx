

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { useAppData } from '../../hooks/useAppData';
import Button from '../../components/Button';
import Input from '../../components/Input';

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const { products, sellers, categories, addProduct } = useAppData();
  
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: categories[0]?.name || '',
    description: '',
    stock: '',
    imageUrls: 'https://images.unsplash.com/photo-1578996953843-2272a2753338?w=600&h=600&fit=crop', // Placeholder
  });

  useEffect(() => {
    if (isEditing) {
      const productToEdit = products.find(p => p.id === parseInt(id!));
      if (productToEdit) {
        setFormData({
            name: productToEdit.name,
            price: String(productToEdit.price),
            category: productToEdit.category,
            description: productToEdit.description,
            stock: String(productToEdit.stock),
            imageUrls: productToEdit.imageUrls[0],
        });
      } else {
        showNotification("Error", "Produk tidak ditemukan.", "error");
        navigate('/seller/products');
      }
    }
  }, [id, isEditing, navigate, showNotification, products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentSeller = sellers.find(s => s.email === user?.email);
    if (!currentSeller) {
        showNotification("Error", "Tidak dapat menemukan data penjual. Silakan login ulang.", "error");
        return;
    }

    const newProductData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        stock: parseInt(formData.stock, 10),
        sellerId: currentSeller.id,
        imageUrls: [formData.imageUrls],
    };
    
    if (isEditing) {
      // Logic for updating would go here via a context function.
      // For now, we'll just notify.
      showNotification("Berhasil", `'${newProductData.name}' berhasil diperbarui.`);
    } else {
      await addProduct(newProductData);
      showNotification("Berhasil", `'${newProductData.name}' berhasil ditambahkan.`);
    }

    navigate('/seller/products');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4">
        {isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Nama Produk</label>
          <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-neutral-700">Harga</label>
                <Input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required className="mt-1" placeholder="Contoh: 50000" />
            </div>
            <div>
                <label htmlFor="stock" className="block text-sm font-medium text-neutral-700">Stok</label>
                <Input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required className="mt-1" placeholder="Contoh: 100" />
            </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral-700">Kategori</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Deskripsi</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
        </div>
        
         <div>
          <label htmlFor="imageUrls" className="block text-sm font-medium text-neutral-700">URL Gambar Utama</label>
          <Input type="text" id="imageUrls" name="imageUrls" value={formData.imageUrls} onChange={handleChange} required className="mt-1" />
           <p className="text-xs text-neutral-500 mt-1">Untuk saat ini, silakan masukkan URL gambar dari Unsplash atau sumber lain.</p>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => navigate('/seller/products')}>
            Batal
          </Button>
          <Button type="submit">
            {isEditing ? 'Simpan Perubahan' : 'Simpan Produk'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
