import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  CreditCard, 
  DollarSign, 
  Calendar,
  Filter,
  Download,
  Baby,
  FileText,
  Printer
} from 'lucide-react';
import { StorageManager } from '../utils/storage';
import { format } from 'date-fns';
import type { Child, Payment, PaymentReceipt } from '../types';

const Payments: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedChildren = StorageManager.load<Child[]>('children', []);
    const savedPayments = StorageManager.load<Payment[]>('payments', []);
    const savedReceipts = StorageManager.load<PaymentReceipt[]>('paymentReceipts', []);
    setChildren(savedChildren.filter(c => c.isActive));
    setPayments(savedPayments);
    setReceipts(savedReceipts);
  };

  const savePayments = (updatedPayments: Payment[]) => {
    StorageManager.save('payments', updatedPayments);
    setPayments(updatedPayments);
  };

  const saveReceipts = (updatedReceipts: PaymentReceipt[]) => {
    StorageManager.save('paymentReceipts', updatedReceipts);
    setReceipts(updatedReceipts);
  };

  const filteredPayments = payments.filter(payment => {
    const child = children.find(c => c.id === payment.childId);
    const matchesSearch = child && (
      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.surname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesMonth = selectedMonth === '' || payment.date.startsWith(selectedMonth);
    return matchesSearch && matchesMonth;
  });

  const monthlyTotal = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  const generateReceiptNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${year}${month}${day}${random}`;
  };

  const generateReceipt = (payment: Payment) => {
    const child = children.find(c => c.id === payment.childId);
    if (!child) return;

    const receipt: PaymentReceipt = {
      id: Date.now().toString(),
      paymentId: payment.id,
      childName: `${child.name} ${child.surname}`,
      amount: payment.amount,
      date: payment.date,
      month: payment.month,
      receiptNumber: generateReceiptNumber()
    };

    const updatedReceipts = [...receipts, receipt];
    saveReceipts(updatedReceipts);
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const handleAddPayment = (paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: Date.now().toString(),
    };
    savePayments([...payments, newPayment]);
    
    // Auto-generate receipt
    setTimeout(() => generateReceipt(newPayment), 100);
    setShowAddModal(false);
  };

  const PaymentForm: React.FC<{
    onSubmit: (data: Omit<Payment, 'id'>) => void;
    onCancel: () => void;
  }> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      childId: '',
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      month: format(new Date(), 'yyyy-MM'),
      year: new Date().getFullYear(),
      paymentMethod: 'naqd' as const,
      description: '',
      receivedBy: 'Admin'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        year: new Date(formData.date).getFullYear()
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Yangi to'lov qo'shish</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bola *
              </label>
              <select
                value={formData.childId}
                onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Bolani tanlang</option>
                {children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.name} {child.surname} - {child.group}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Miqdor (so'm) *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="500000"
                required
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sana *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Oy *
              </label>
              <input
                type="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To'lov usuli *
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="naqd">Naqd pul</option>
                <option value="karta">Plastik karta</option>
                <option value="bank">Bank o'tkazmasi</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Izoh
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Qo'shimcha ma'lumot..."
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                Qo'shish
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ReceiptModal: React.FC = () => {
    if (!selectedPayment) return null;
    
    const child = children.find(c => c.id === selectedPayment.childId);
    const receipt = receipts.find(r => r.paymentId === selectedPayment.id);
    
    const printReceipt = () => {
      window.print();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">To'lov cheki</h3>
            <button
              onClick={printReceipt}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Printer className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-4" id="receipt-content">
            <div className="text-center border-b pb-4">
              <h2 className="text-xl font-bold text-gray-900">Bog'cha SRM</h2>
              <p className="text-sm text-gray-600">To'lov cheki</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Chek raqami:</span>
                <span className="font-mono">{receipt?.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sana:</span>
                <span>{format(new Date(selectedPayment.date), 'dd.MM.yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bola:</span>
                <span>{child?.name} {child?.surname}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guruh:</span>
                <span>{child?.group}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Oy:</span>
                <span>{selectedPayment.month}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To'lov usuli:</span>
                <span>
                  {selectedPayment.paymentMethod === 'naqd' ? 'Naqd' :
                   selectedPayment.paymentMethod === 'karta' ? 'Karta' : 'Bank'}
                </span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Jami:</span>
                <span>{selectedPayment.amount.toLocaleString()} so'm</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500 border-t pt-4">
              <p>Rahmat!</p>
              <p>{format(new Date(), 'dd.MM.yyyy HH:mm')}</p>
            </div>
          </div>
          
          <div className="p-6 border-t flex justify-end space-x-3">
            <button
              onClick={() => setShowReceiptModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Yopish
            </button>
            <button
              onClick={printReceipt}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center"
            >
              <Printer className="h-4 w-4 mr-2" />
              Chop etish
            </button>
          </div>
        </div>
      </div>
    );
  };

  const exportPayments = () => {
    const csvContent = [
      ['Sana', 'Bola', 'Miqdor (so\'m)', 'Oy', 'To\'lov usuli', 'Izoh'],
      ...filteredPayments.map(payment => {
        const child = children.find(c => c.id === payment.childId);
        return [
          format(new Date(payment.date), 'dd.MM.yyyy'),
          child ? `${child.name} ${child.surname}` : 'Noma\'lum',
          payment.amount.toLocaleString(),
          payment.month,
          payment.paymentMethod,
          payment.description || ''
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tolovlar_${selectedMonth}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">To'lovlar</h1>
          <p className="text-gray-600 mt-1">To'lovlar tarixi va boshqaruv</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={exportPayments}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Yangi to'lov
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Oylik jami</p>
              <p className="text-2xl font-bold text-green-900">
                {monthlyTotal.toLocaleString()} so'm
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">To'lovlar soni</p>
              <p className="text-2xl font-bold text-blue-900">{filteredPayments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">O'rtacha to'lov</p>
              <p className="text-2xl font-bold text-purple-900">
                {filteredPayments.length > 0 
                  ? Math.round(monthlyTotal / filteredPayments.length).toLocaleString()
                  : 0
                } so'm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Bola ismi bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bola
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Miqdor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To'lov usuli
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((payment) => {
                  const child = children.find(c => c.id === payment.childId);
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(payment.date), 'dd.MM.yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Baby className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {child ? `${child.name} ${child.surname}` : 'Noma\'lum'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {child?.group}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-semibold text-green-600">
                          {payment.amount.toLocaleString()} so'm
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.paymentMethod === 'naqd' ? 'bg-green-100 text-green-800' :
                          payment.paymentMethod === 'karta' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {payment.paymentMethod === 'naqd' ? 'Naqd' :
                           payment.paymentMethod === 'karta' ? 'Karta' : 'Bank'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => generateReceipt(payment)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors flex items-center"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Chek
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Hech qanday to'lov topilmadi</p>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddModal && (
        <PaymentForm
          onSubmit={handleAddPayment}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Receipt Modal */}
      {showReceiptModal && <ReceiptModal />}
    </div>
  );
};

export default Payments;