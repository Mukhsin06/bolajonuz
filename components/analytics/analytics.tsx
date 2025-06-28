'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

export function Analytics() {
  const metrics = [
    {
      title: 'Active Users',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      period: 'Last 30 days'
    },
    {
      title: 'Page Views',
      value: '18,394',
      change: '+8.2%',
      changeType: 'positive',
      icon: Eye,
      period: 'Last 30 days'
    },
    {
      title: 'Avg. Session Duration',
      value: '3m 24s',
      change: '-2.1%',
      changeType: 'negative',
      icon: Clock,
      period: 'Last 30 days'
    },
    {
      title: 'Bounce Rate',
      value: '34.2%',
      change: '-5.4%',
      changeType: 'positive',
      icon: TrendingUp,
      period: 'Last 30 days'
    },
  ];

  const topPages = [
    { path: '/dashboard', views: 4250, percentage: 23.1 },
    { path: '/products', views: 3890, percentage: 21.2 },
    { path: '/profile', views: 2847, percentage: 15.5 },
    { path: '/settings', views: 2103, percentage: 11.4 },
    { path: '/analytics', views: 1892, percentage: 10.3 },
  ];

  const deviceTypes = [
    { type: 'Desktop', icon: Monitor, users: 1547, percentage: 54.3 },
    { type: 'Mobile', icon: Smartphone, users: 1089, percentage: 38.3 },
    { type: 'Tablet', icon: Tablet, users: 211, percentage: 7.4 },
  ];

  const realtimeData = [
    { time: '00:00', users: 45 },
    { time: '04:00', users: 23 },
    { time: '08:00', users: 156 },
    { time: '12:00', users: 234 },
    { time: '16:00', users: 189 },
    { time: '20:00', users: 167 },
    { time: '24:00', users: 89 },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Track your app's performance and user engagement</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-sm ${
                        metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change}
                      </span>
                      <span className="text-xs text-gray-500">{metric.period}</span>
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Top Pages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPages.map((page) => (
                    <div key={page.path} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{page.path}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-500">{page.views.toLocaleString()} views</span>
                          <Badge variant="secondary" className="text-xs">
                            {page.percentage}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${page.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Types */}
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceTypes.map((device) => {
                    const Icon = device.icon;
                    return (
                      <div key={device.type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-100 p-2 rounded-lg">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{device.type}</p>
                            <p className="text-sm text-gray-500">{device.users.toLocaleString()} users</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{device.percentage}%</Badge>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${device.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Real-time Users</span>
                <Badge variant="secondary">89 active now</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {realtimeData.map((data) => (
                  <div key={data.time} className="text-center">
                    <div className="bg-blue-100 rounded-lg p-4 mb-2">
                      <div 
                        className="bg-blue-500 rounded-full mx-auto mb-2"
                        style={{ 
                          width: '8px', 
                          height: `${Math.max(data.users / 5, 8)}px`,
                          maxHeight: '40px'
                        }}
                      />
                      <p className="text-sm font-medium text-gray-900">{data.users}</p>
                    </div>
                    <p className="text-xs text-gray-500">{data.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Demographic data will appear here</p>
                    <p className="text-sm mt-2">Enable Google Analytics to see detailed audience insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Geographic data will appear here</p>
                    <p className="text-sm mt-2">Track where your users are located</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-12 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>User behavior flow will appear here</p>
                  <p className="text-sm mt-2">Analyze how users navigate through your app</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}