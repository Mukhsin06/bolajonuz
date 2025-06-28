'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Search, 
  Filter, 
  FolderOpen, 
  File, 
  Image, 
  FileText, 
  Download,
  Trash2,
  MoreHorizontal,
  HardDrive
} from 'lucide-react';

interface StorageItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
  fileType?: string;
  url?: string;
}

export function Storage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const [items] = useState<StorageItem[]>([
    {
      id: '1',
      name: 'images',
      type: 'folder',
      modified: '2024-01-20',
    },
    {
      id: '2',
      name: 'documents',
      type: 'folder',
      modified: '2024-01-19',
    },
    {
      id: '3',
      name: 'profile-picture.jpg',
      type: 'file',
      size: '245 KB',
      modified: '2024-01-18',
      fileType: 'image',
      url: 'https://example.com/profile.jpg'
    },
    {
      id: '4',
      name: 'user-manual.pdf',
      type: 'file',
      size: '1.2 MB',
      modified: '2024-01-17',
      fileType: 'document',
      url: 'https://example.com/manual.pdf'
    },
    {
      id: '5',
      name: 'backup-data.json',
      type: 'file',
      size: '89 KB',
      modified: '2024-01-16',
      fileType: 'text',
      url: 'https://example.com/backup.json'
    }
  ]);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (item: StorageItem) => {
    if (item.type === 'folder') {
      return <FolderOpen className="w-5 h-5 text-blue-500" />;
    }
    
    switch (item.fileType) {
      case 'image':
        return <Image className="w-5 h-5 text-green-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-red-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const totalSize = items
    .filter(item => item.type === 'file')
    .reduce((acc, item) => acc + (parseFloat(item.size?.split(' ')[0] || '0')), 0);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Storage</h1>
          <p className="text-gray-600 mt-2">Manage your files and folders</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <HardDrive className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Storage</p>
                <p className="text-2xl font-bold text-gray-900">{totalSize.toFixed(1)} MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <File className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{items.filter(i => i.type === 'file').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-full">
                <FolderOpen className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Folders</p>
                <p className="text-2xl font-bold text-gray-900">{items.filter(i => i.type === 'folder').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <Image className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Images</p>
                <p className="text-2xl font-bold text-gray-900">{items.filter(i => i.fileType === 'image').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Browser */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>Files</span>
              <Badge variant="secondary">{currentPath}</Badge>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  selectedItems.includes(item.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelection(item.id)}
                    className="rounded border-gray-300"
                  />
                  <div className="flex items-center space-x-3">
                    {getFileIcon(item)}
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Modified {item.modified}</span>
                        {item.size && <span>{item.size}</span>}
                        {item.type === 'file' && (
                          <Badge variant="outline" className="text-xs">
                            {item.fileType}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.type === 'file' && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}