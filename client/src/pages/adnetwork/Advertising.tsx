
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Settings, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Advertising() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newAd, setNewAd] = useState({
    name: '',
    type: 'pre-roll',
    content: '',
    targetUrl: '',
    budget: 0,
    cpm: 0,
    targeting: {
      categories: [],
      regions: [],
      devices: []
    }
  });

  // Fetch ads
  const { data: ads, isLoading } = useQuery({
    queryKey: ['ads'],
    queryFn: async () => {
      const response = await fetch('/api/ads');
      if (!response.ok) throw new Error('Failed to fetch ads');
      return response.json();
    }
  });

  // Create ad mutation
  const createAd = useMutation({
    mutationFn: async (adData) => {
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adData)
      });
      if (!response.ok) throw new Error('Failed to create ad');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ads']);
      toast({
        title: 'Success',
        description: 'Advertisement created successfully'
      });
    }
  });

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Ad Network Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="create">Create Ad</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,234.56</div>
                <p className="text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ads?.length || 0}</div>
                <p className="text-muted-foreground">2 pending approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-muted-foreground">3.85% CTR</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Impressions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32,456</div>
                <p className="text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Advertisement</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                createAd.mutate(newAd);
              }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={newAd.name}
                    onChange={(e) => setNewAd({...newAd, name: e.target.value})}
                    placeholder="Enter campaign name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Ad Type</Label>
                  <Select
                    value={newAd.type}
                    onValueChange={(value) => setNewAd({...newAd, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ad type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-roll">Pre-roll</SelectItem>
                      <SelectItem value="mid-roll">Mid-roll</SelectItem>
                      <SelectItem value="post-roll">Post-roll</SelectItem>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="overlay">Overlay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Ad Content URL</Label>
                  <Input
                    id="content"
                    value={newAd.content}
                    onChange={(e) => setNewAd({...newAd, content: e.target.value})}
                    placeholder="Enter ad content URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-url">Target URL</Label>
                  <Input
                    id="target-url"
                    value={newAd.targetUrl}
                    onChange={(e) => setNewAd({...newAd, targetUrl: e.target.value})}
                    placeholder="Enter target URL"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (USD)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={newAd.budget}
                      onChange={(e) => setNewAd({...newAd, budget: parseInt(e.target.value)})}
                      placeholder="Enter budget"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpm">CPM (Cost per 1000 impressions)</Label>
                    <Input
                      id="cpm"
                      type="number"
                      value={newAd.cpm}
                      onChange={(e) => setNewAd({...newAd, cpm: parseInt(e.target.value)})}
                      placeholder="Enter CPM"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={createAd.isLoading}>
                  {createAd.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Campaign
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : ads?.map((ad) => (
                  <div key={ad.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{ad.name}</h3>
                        <span className="text-sm text-muted-foreground">{ad.type}</span>
                      </div>
                      <div className="px-2 py-1 rounded bg-green-100 text-green-800 text-sm">
                        {ad.status}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Budget</div>
                        <div className="font-medium">${ad.budget}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Impressions</div>
                        <div className="font-medium">{ad.impressions}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Clicks</div>
                        <div className="font-medium">{ad.clicks}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">CTR</div>
                        <div className="font-medium">
                          {((ad.clicks / ad.impressions) * 100).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Campaign Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center border rounded">
                        Graph Placeholder
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center border rounded">
                        Graph Placeholder
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Ad Network Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default CPM Rate</Label>
                <Input type="number" placeholder="Enter default CPM" />
              </div>
              
              <div className="space-y-2">
                <Label>Minimum Campaign Budget</Label>
                <Input type="number" placeholder="Enter minimum budget" />
              </div>

              <div className="space-y-2">
                <Label>Ad Categories</Label>
                <Input placeholder="Enter comma-separated categories" />
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
