'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface CollectionItem {
  id: string;
  name: string;
  type: 'collection' | 'document';
  children?: CollectionItem[];
  expanded?: boolean;
  data?: Record<string, any>;
}

export function Database() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [collections, setCollections] = useState<CollectionItem[]>([
    {
      id: '1',
      name: 'users',
      type: 'collection',
      expanded: true,
      children: [
        {
          id: '1-1',
          name: 'user_123',
          type: 'document',
          data: {
            name: 'John Doe',
            email: 'john@example.com',
            createdAt: '2024-01-15T10:30:00Z',
            active: true
          }
        },
        {
          id: '1-2',
          name: 'user_456',
          type: 'document',
          data: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            createdAt: '2024-01-14T08:15:00Z',
            active: false
          }
        }
      ]
    },
    {
      id: '2',
      name: 'products',
      type: 'collection',
      expanded: false,
      children: [
        {
          id: '2-1',
          name: 'product_001',
          type: 'document',
          data: {
            title: 'Premium Widget',
            price: 29.99,
            category: 'electronics',
            inStock: true
          }
        }
      ]
    },
    {
      id: '3',
      name: 'orders',
      type: 'collection',
      expanded: false,
      children: []
    }
  ]);

  const toggleExpand = (id: string) => {
    setCollections(prev => 
      prev.map(collection => 
        collection.id === id 
          ? { ...collection, expanded: !collection.expanded }
          : collection
      )
    );
  };

  const renderTreeItem = (item: CollectionItem, level = 0) => {
    const isCollection = item.type === 'collection';
    const hasChildren = item.children && item.children.length > 0;
    
    return (
      <div key={item.id}>
        <div
          className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
            selectedItem?.id === item.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => setSelectedItem(item)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(item.id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {item.expanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          
          {isCollection ? (
            <Folder className="w-4 h-4 text-blue-500" />
          ) : (
            <File className="w-4 h-4 text-gray-500" />
          )}
          
          <span className="text-sm font-medium text-gray-900">{item.name}</span>
          
          {isCollection && item.children && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {item.children.length}
            </span>
          )}
        </div>
        
        {hasChildren && item.expanded && (
          <div>
            {item.children!.map(child => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Firestore Database</h1>
          <p className="text-gray-600 mt-2">Manage your NoSQL document database</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Collection
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collections Tree */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Collections</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search collections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {collections.map(collection => renderTreeItem(collection))}
          </CardContent>
        </Card>

        {/* Document Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {selectedItem ? `${selectedItem.name} (${selectedItem.type})` : 'Select an item'}
              </CardTitle>
              {selectedItem && (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedItem ? (
              <div className="space-y-4">
                {selectedItem.type === 'document' && selectedItem.data ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Document Data</h3>
                    <pre className="text-sm text-gray-800 overflow-auto">
                      {JSON.stringify(selectedItem.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Collection Selected</h3>
                    <p className="text-gray-500 mt-2">
                      This is a collection containing {selectedItem.children?.length || 0} documents
                    </p>
                    <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Document
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No item selected</h3>
                <p className="text-gray-500 mt-2">Select a collection or document to view its details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}