import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Baby, 
  Phone, 
  Calendar,
  MapPin,
  Users,
  DollarSign
} from 'lucide-react';
import { StorageManager } from '../utils/storage';
import { format } from 'date-fns';
import type { Child, Payment } from '../types';

const Children: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = () => {
    const savedChildren = StorageManager.load<Child[]>('children', []);
    setChildren(savedChildren);
  };

  const saveChildren = (updatedChildren: Child[]) => {
    StorageManager.save('children', updatedChildren);
    setChildren(updatedChildren);
  };

  const groups = ['1-2 yosh', '2-3 yosh', '3-4 yosh', '4-5 yosh', '5-6 yosh'];

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         child.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         child.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === '' || child.group === selectedGroup;
    return matchesSearch && matchesGroup && child.isActive;
  });

  const handleAddChild = (childData: Omit<Child, 'id'>) => {
    const newChild: Child = {
      ...childData,
      id: Date.now().toString(),
    };
    
    // Auto-generate monthly payment
    if (childData.monthlyFee && childData.monthlyFee > 0) {
      const currentMonth = format(new Date(), 'yyyy-MM');
      const newPayment: Payment = {
        id: (Date.now() + 1).toString(),
        childId: newChild.id,
        amount: childData.monthlyFee,
        date: format(new Date(), 'yyyy-MM-dd'),
        month: currentMonth,
        year: new Date().getFullYear(),
        paymentMethod: 'naqd',
        description: 'Avtomatik oylik to\'lov',
        receivedBy: 'Tizim'
      };
      
      const existingPayments = StorageManager.load<Payment[]>('payments', []);
      StorageManager.save('payments', [...existingPayments, newPayment]);
    }
    
    saveChildren([...children, newChild]);
    setShowAddModal(false);
  };

  const handleEditChild = (childData: Omit<Child, 'id'>) => {
    if (editingChild) {
      const updatedChildren = children.map(child =>
        child.id === editingChild.id ? { ...childData, id: editingChild.id } : child
      );
      saveChildren(updatedChildren);
      setEditingChild(null);
    }
  };

  const handleDeleteChild = (childId: string) => {
    if (confirm('Rostdan ham bu bolani o\'chirmoqchimisiz?')) {
      const updatedChildren = children.map(child =>
        child.id === childId ? { ...child, isActive: false } : child
      );
      saveChildren(updatedChildren);
    }
  };

  const ChildForm: React.FC<{
    child?: Child;
    onSubmit: (data: Omit<Child, 'id'>) => void;
    onCancel: () => void;
  }> = ({ child, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      name: child?.name || '',
      surname: child?.surname || '',
      birthDate: child?.birthDate || '',
      group: child?.group || groups[0],
      parentName: child?.parentName || '',
      parentPhone: child?.parentPhone || '',
      parentTelegram: child?.parentTelegram || '',
      address: child?.address || '',
      medicalInfo: child?.medicalInfo || '',
      enrollmentDate: child?.enrollmentDate || format(new Date(), 'yyyy-MM-dd'),
      isActive: child?.isActive ?? true,
      age: child?.age || 1,
      monthlyFee: child?.monthlyFee || 500000 // Default 500,000 so'm
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const birthDate = new Date(formData.birthDate);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      onSubmit({ ...formData, age });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {child ? 'Bolani tahrirlash' : 'Yangi bola qo\'shish'}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ism *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Familiya *
                </label>
                <input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tug'ilgan sana *
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guruh *
                </label>
                <select
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {groups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ota-ona ismi *
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon raqami *
                </label>
                <input
                  type="tel"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+998 90 123 45 67"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Oylik to'lov (so'm) *
                </label>
                <input
                  type="number"
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="500000"
                  required
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telegram username
              </label>
              <input
                type="text"
                value={formData.parentTelegram}
                onChange={(e) => setFormData({ ...formData, parentTelegram: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="@username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manzil *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tibbiy ma'lumotlar
              </label>
              <textarea
                value={formData.medicalInfo}
                onChange={(e) => setFormData({ ...formData, medicalInfo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Allergiya, dori-darmonlar va boshqa tibbiy ma'lumotlar"
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
                {child ? 'Saqlash' : 'Qo\'shish'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bolalar</h1>
          <p className="text-gray-600 mt-1">Jami {filteredChildren.length} ta bola</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yangi bola
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Ism, familiya yoki ota-ona ismi bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Barcha guruhlar</option>
            {groups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Children Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChildren.map((child) => (
          <div key={child.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Baby className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{child.name} {child.surname}</h3>
                  <p className="text-sm text-gray-500">{child.age} yosh</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingChild(child)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteChild(child.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                {child.group}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {child.parentName}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {format(new Date(child.birthDate), 'dd.MM.yyyy')}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-2" />
                {child.monthlyFee?.toLocaleString() || 0} so'm/oy
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {child.address.length > 30 ? child.address.substring(0, 30) + '...' : child.address}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredChildren.length === 0 && (
        <div className="text-center py-12">
          <Baby className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Hech qanday bola topilmadi</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <ChildForm
          onSubmit={handleAddChild}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {editingChild && (
        <ChildForm
          child={editingChild}
          onSubmit={handleEditChild}
          onCancel={() => setEditingChild(null)}
        />
      )}
    </div>
  );
};

export default Children;