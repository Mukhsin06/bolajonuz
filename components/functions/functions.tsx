'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Play, 
  Pause, 
  Plus, 
  Activity, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Upload
} from 'lucide-react';

interface CloudFunction {
  id: string;
  name: string;
  trigger: 'http' | 'firestore' | 'auth' | 'storage';
  status: 'active' | 'inactive' | 'error';
  lastDeployed: string;
  invocations: number;
  runtime: string;
  memoryUsage: string;
  avgDuration: string;
}

export function Functions() {
  const [functions] = useState<CloudFunction[]>([
    {
      id: '1',
      name: 'sendWelcomeEmail',
      trigger: 'auth',
      status: 'active',
      lastDeployed: '2024-01-20 14:30',
      invocations: 1247,
      runtime: 'Node.js 20',
      memoryUsage: '256 MB',
      avgDuration: '0.85s'
    },
    {
      id: '2',
      name: 'processPayment',
      trigger: 'http',
      status: 'active',
      lastDeployed: '2024-01-19 09:15',
      invocations: 892,
      runtime: 'Node.js 20',
      memoryUsage: '512 MB',
      avgDuration: '1.24s'
    },
    {
      id: '3',
      name: 'generateReport',
      trigger: 'firestore',
      status: 'inactive',
      lastDeployed: '2024-01-18 16:45',
      invocations: 156,
      runtime: 'Python 3.11',
      memoryUsage: '1 GB',
      avgDuration: '3.67s'
    },
    {
      id: '4',
      name: 'resizeImage',
      trigger: 'storage',
      status: 'error',
      lastDeployed: '2024-01-17 11:20',
      invocations: 45,
      runtime: 'Node.js 20',
      memoryUsage: '512 MB',
      avgDuration: '2.15s'
    }
  ]);

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'http':
        return '🌐';
      case 'firestore':
        return '🗄️';
      case 'auth':
        return '🔐';
      case 'storage':
        return '📁';
      default:
        return '⚡';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const totalInvocations = functions.reduce((sum, fn) => sum + fn.invocations, 0);
  const activeFunctions = functions.filter(fn => fn.status === 'active').length;
  const errorFunctions = functions.filter(fn => fn.status === 'error').length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cloud Functions</h1>
          <p className="text-gray-600 mt-2">Manage your serverless functions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            New Function
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Functions</p>
                <p className="text-2xl font-bold text-gray-900">{functions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeFunctions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Activity className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Invocations</p>
                <p className="text-2xl font-bold text-gray-900">{totalInvocations.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-gray-900">{errorFunctions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="functions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="functions">Functions</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="functions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Function List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {functions.map((func) => (
                  <div key={func.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getTriggerIcon(func.trigger)}</div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900">{func.name}</h3>
                          {getStatusBadge(func.status)}
                        </div>
                        <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
                          <span>Trigger: {func.trigger}</span>
                          <span>Runtime: {func.runtime}</span>
                          <span>Memory: {func.memoryUsage}</span>
                          <span>{func.invocations} invocations</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Last deployed: {func.lastDeployed}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Deploy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Function Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-gray-500">2024-01-20 14:32:15</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">INFO</Badge>
                    <span className="text-xs text-gray-600">sendWelcomeEmail</span>
                  </div>
                  <p className="text-gray-800">Function execution started</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-gray-500">2024-01-20 14:32:16</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">INFO</Badge>
                    <span className="text-xs text-gray-600">sendWelcomeEmail</span>
                  </div>
                  <p className="text-gray-800">Email sent successfully to user@example.com</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-gray-500">2024-01-20 14:31:45</span>
                    <Badge className="bg-red-100 text-red-800 text-xs">ERROR</Badge>
                    <span className="text-xs text-gray-600">resizeImage</span>
                  </div>
                  <p className="text-gray-800">Failed to process image: Invalid file format</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Execution Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {functions.map((func) => (
                    <div key={func.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{func.name}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">{func.avgDuration}</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min(parseFloat(func.avgDuration) * 20, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {functions.map((func) => (
                    <div key={func.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{func.name}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">{func.memoryUsage}</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${Math.min(parseInt(func.memoryUsage) / 10, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}