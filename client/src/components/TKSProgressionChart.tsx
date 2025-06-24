import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BookOpen, Target, Zap, TrendingUp } from 'lucide-react';

interface TKSProgressionData {
  levelName: string;
  sortOrder: number;
  experienceRange: string;
  taskCount: number;
  knowledgeCount: number;
  skillCount: number;
}

interface TKSProgressionChartProps {
  careerTrackId: number;
  careerTrackName: string;
  className?: string;
}

export function TKSProgressionChart({ careerTrackId, careerTrackName, className }: TKSProgressionChartProps) {
  const [progressionData, setProgressionData] = useState<TKSProgressionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchProgressionData = async () => {
      try {
        const response = await fetch(`/api/career-tracks/${careerTrackId}/tks-progression`);
        if (response.ok) {
          const data = await response.json();
          setProgressionData(data.tksProgression || []);
        }
      } catch (error) {
        console.error('Error fetching TKS progression data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isVisible) {
      fetchProgressionData();
    }
  }, [careerTrackId, isVisible]);

  const chartData = progressionData.map(level => ({
    level: level.levelName.replace('-Level', ''),
    experience: level.experienceRange,
    Tasks: level.taskCount,
    Knowledge: level.knowledgeCount,
    Skills: level.skillCount,
    Total: level.taskCount + level.knowledgeCount + level.skillCount
  }));

  if (!isVisible) {
    return (
      <div className={className}>
        <Button 
          variant="outline" 
          onClick={() => setIsVisible(true)}
          className="w-full flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          View TKS Progression Chart
        </Button>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          NICE Framework TKS Progression - {careerTrackName}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tasks, Knowledge, and Skills requirements inherited from NICE Framework Work Roles at each career level
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-sm text-muted-foreground">Loading progression data...</div>
          </div>
        ) : progressionData.length > 0 ? (
          <div className="space-y-6">
            {/* Summary Statistics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {progressionData.length}
                </div>
                <div className="text-sm text-muted-foreground">Career Levels</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {chartData.reduce((sum, level) => sum + level.Tasks, 0)}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Target className="w-3 h-3" />
                  Total Tasks
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {chartData.reduce((sum, level) => sum + level.Knowledge, 0)}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Total Knowledge
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {chartData.reduce((sum, level) => sum + level.Skills, 0)}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3" />
                  Total Skills
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="level" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow-lg">
                            <p className="font-semibold">{label}</p>
                            <p className="text-sm text-muted-foreground mb-2">{data.experience}</p>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Target className="w-3 h-3 text-red-600" />
                                <span className="text-sm">Tasks: {data.Tasks}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-3 h-3 text-blue-600" />
                                <span className="text-sm">Knowledge: {data.Knowledge}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Zap className="w-3 h-3 text-green-600" />
                                <span className="text-sm">Skills: {data.Skills}</span>
                              </div>
                              <hr className="my-1" />
                              <div className="font-semibold text-sm">Total TKS: {data.Total}</div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Tasks" fill="#dc2626" name="Tasks" />
                  <Bar dataKey="Knowledge" fill="#2563eb" name="Knowledge" />
                  <Bar dataKey="Skills" fill="#16a34a" name="Skills" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Level Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {progressionData.map((level) => (
                <Card key={level.sortOrder} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div>
                        <div className="font-semibold text-sm">{level.levelName}</div>
                        <div className="text-xs text-muted-foreground">{level.experienceRange}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs flex items-center gap-1">
                            <Target className="w-3 h-3 text-red-600" />
                            Tasks
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {level.taskCount}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-blue-600" />
                            Knowledge
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {level.knowledgeCount}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs flex items-center gap-1">
                            <Zap className="w-3 h-3 text-green-600" />
                            Skills
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {level.skillCount}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-xs text-center text-muted-foreground pt-4 border-t">
              Data sourced from NICE Framework 2.0 Work Role mappings
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No TKS progression data available for this career track
          </div>
        )}
      </CardContent>
    </Card>
  );
}