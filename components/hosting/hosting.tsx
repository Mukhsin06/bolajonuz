'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Upload, 
  Settings, 
  Activity, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react';

interface Deployment {
  id: string;
  version: string;
  status: 'live' | 'preview' | 'failed';
  deployedAt: string;
  domain: string;
  size: string;
  buildTime: string;
}

export function Hosting() {
  const [deployments] = useState<Deployment[]>([
    {
      id: '1',
      version: 'v1.2.3',
      status: 'live',
      deployedAt: '2024-01-20 15:30',
      domain: 'my-app.web.app',
      size: '2.4 MB',
      buildTime: '1m 23s'
    },
    {
      id: '2',
      version: 'v1.2.2',
      status: 'preview',
      deployedAt: '2024-01-19 14:15',
      domain: 'my-app--preview.web.app',
      size: '2.3 MB',
      buildTime: '1m 18s'
    },
    {
      id: '3',
      version: 'v1.2.1',
      status: 'failed',
      deployedAt: '2024-01-18 10:45',
      domain: 'my-app.web.app',
      size: '0 MB',
      buildTime: '0m 45s'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-green-100 text-green-800">Live</Badge>;
      case 'preview':
        return <Badge className="bg-blue-100 text-blue-800">Preview</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'preview':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const liveDeployment = deployments.find(d => d.status === 'live');
  const totalDeployments = deployments.length;
  const successfulDeployments = deployments.filter(d => d.status === 'live' || d.status === 'preview').length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hosting</h1>
          <p className="text-gray-600 mt-2">Deploy and manage your web app</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Upload className="w-4 h-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Live Sites</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
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
                <p className="text-sm font-medium text-gray-600">Deployments</p>
                <p className="text-2xl font-bold text-gray-900">{totalDeployments}</p>
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
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round((successfulDeployments / totalDeployments) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <RefreshCw className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Build Time</p>
                <p className="text-2xl font-bold text-gray-900">1m 15s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Site */}
      {liveDeployment && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Live Site</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  https://{liveDeployment.domain}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Version {liveDeployment.version} • Deployed {liveDeployment.deployedAt}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`https://${liveDeployment.domain}`)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy URL
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Site
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="deployments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="deployments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deployments.map((deployment) => (
                  <div key={deployment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(deployment.status)}
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900">{deployment.version}</h3>
                          {getStatusBadge(deployment.status)}
                        </div>
                        <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
                          <span>Domain: {deployment.domain}</span>
                          <span>Size: {deployment.size}</span>
                          <span>Build: {deployment.buildTime}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Deployed: {deployment.deployedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {deployment.status !== 'failed' && (
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Rollback
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No custom domains</h3>
                <p className="text-gray-500 mt-2">Connect a custom domain to your Firebase Hosting site</p>
                <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
                  Add Custom Domain
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hosting Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Deploy Configuration</h3>
                  <p className="text-sm text-gray-500 mt-1">Configure how your site is built and deployed</p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                      <p><strong>Build Command:</strong> npm run build</p>
                      <p><strong>Output Directory:</strong> dist</p>
                      <p><strong>Node Version:</strong> 18.x</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Security Headers</h3>
                  <p className="text-sm text-gray-500 mt-1">Configure security headers for your site</p>
                  <Button variant="outline" className="mt-2">
                    Configure Headers
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Redirects & Rewrites</h3>
                  <p className="text-sm text-gray-500 mt-1">Set up URL redirects and rewrites</p>
                  <Button variant="outline" className="mt-2">
                    Manage Rules
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}