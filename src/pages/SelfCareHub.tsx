import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Wind, 
  Brain, 
  Zap, 
  BookOpen, 
  Moon, 
  Star,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  Flower,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Timer,
  Calendar
} from 'lucide-react';
import { BreathingExercise } from '@/components/BreathingExercise';
import { MovementExercises } from '@/components/MovementExercises';
import { MindfulnessActivity } from '@/components/MindfulnessActivity';
import { ShimmerCard } from '@/components/LoadingSpinner';

interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: 'breathing' | 'meditation' | 'movement' | 'journaling' | 'mindfulness';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  streak: number;
}

interface TimerState {
  isActive: boolean;
  timeLeft: number;
  totalTime: number;
  currentActivity: string | null;
}

export const SelfCareHub: React.FC = () => {
  const navigate = useNavigate();
  const [isQuickRelaxOpen, setIsQuickRelaxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timer, setTimer] = useState<TimerState>({
    isActive: false,
    timeLeft: 0,
    totalTime: 0,
    currentActivity: null
  });
  
  // Mock data for user progress
  const currentStreak = 15;
  const dailyGoal = 5;
  const completedToday = 3;
  const progressPercentage = (completedToday / dailyGoal) * 100;

  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(loadTimer);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer.isActive && timer.timeLeft > 0) {
      interval = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (timer.timeLeft === 0 && timer.isActive) {
      setTimer(prev => ({ ...prev, isActive: false }));
    }
    return () => clearInterval(interval);
  }, [timer.isActive, timer.timeLeft]);

  const activities: Activity[] = [
    {
      id: '1',
      title: '4-7-8 Breathing Exercise',
      description: 'A simple breathing technique to reduce anxiety and promote relaxation.',
      duration: 5,
      category: 'breathing',
      difficulty: 'beginner',
      completed: true,
      streak: 7
    },
    {
      id: '2',
      title: 'Mindful Body Scan',
      description: 'Progressive relaxation technique focusing on each part of your body.',
      duration: 15,
      category: 'meditation',
      difficulty: 'intermediate',
      completed: false,
      streak: 3
    },
    {
      id: '3',
      title: 'Gentle Morning Stretch',
      description: 'Easy stretching routine to start your day with positive energy.',
      duration: 10,
      category: 'movement',
      difficulty: 'beginner',
      completed: true,
      streak: 12
    },
    {
      id: '4',
      title: 'Gratitude Journaling',
      description: 'Write down three things you\'re grateful for today.',
      duration: 8,
      category: 'journaling',
      difficulty: 'beginner',
      completed: true,
      streak: 5
    },
    {
      id: '5',
      title: 'Walking Meditation',
      description: 'Mindful walking practice to connect with the present moment.',
      duration: 20,
      category: 'mindfulness',
      difficulty: 'intermediate',
      completed: false,
      streak: 0
    },
    {
      id: '6',
      title: 'Progressive Muscle Relaxation',
      description: 'Systematic tensing and relaxing of muscle groups.',
      duration: 25,
      category: 'meditation',
      difficulty: 'advanced',
      completed: false,
      streak: 1
    }
  ];

  const featuredCategories = [
    { id: 'all', label: 'All Activities', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { id: 'breathing', label: 'Breathing', icon: Wind, color: 'from-blue-500 to-cyan-500' },
    { id: 'meditation', label: 'Meditation', icon: Brain, color: 'from-purple-500 to-indigo-500' },
    { id: 'movement', label: 'Movement', icon: Zap, color: 'from-orange-500 to-red-500' },
    { id: 'journaling', label: 'Journaling', icon: Flower, color: 'from-green-500 to-teal-500' },
    { id: 'mindfulness', label: 'Mindfulness', icon: Moon, color: 'from-indigo-500 to-purple-500' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredActivities = selectedCategory === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === selectedCategory);

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to journal page for journaling category
    if (categoryId === 'journaling') {
      navigate('/journal');
      return;
    }
    setSelectedCategory(categoryId);
  };

  const handleQuickRelax = () => {
    setIsQuickRelaxOpen(true);
  };

  const startActivity = (activity: Activity) => {
    setTimer({
      isActive: true,
      timeLeft: activity.duration * 60,
      totalTime: activity.duration * 60,
      currentActivity: activity.id
    });
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const resetTimer = () => {
    setTimer({
      isActive: false,
      timeLeft: 0,
      totalTime: 0,
      currentActivity: null
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show Movement Exercises component when movement category is selected
  if (selectedCategory === 'movement') {
    return <MovementExercises onBack={() => setSelectedCategory('all')} />;
  }

  // Show Mindfulness Activity component when mindfulness category is selected
  if (selectedCategory === 'mindfulness') {
    return <MindfulnessActivity onBack={() => setSelectedCategory('all')} />;
  }

  if (isLoading) {
    return (
      <DashboardLayout userType="student">
        <div className="space-y-8">
          <ShimmerCard className="h-32" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show activities view when a category is selected
  if (selectedCategory !== 'all') {
    return (
      <DashboardLayout userType="student">
        <div className="space-y-8 animate-fade-in">
          {/* Back Button */}
          <Button
            onClick={() => setSelectedCategory('all')}
            variant="outline"
            className="btn-glass"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Categories
          </Button>

          {/* Active Timer */}
          {timer.currentActivity && (
            <Card className="glass-card border-0 bg-gradient-to-r from-wellness-calm/20 to-wellness-peaceful/20">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Timer className="w-5 h-5" />
                  Activity in Progress
                </CardTitle>
                <CardDescription>
                  {activities.find(a => a.id === timer.currentActivity)?.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="text-6xl font-mono font-bold text-wellness-calm">
                  {formatTime(timer.timeLeft)}
                </div>
                
                <div className="space-y-2">
                  <Progress 
                    value={((timer.totalTime - timer.timeLeft) / timer.totalTime) * 100} 
                    className="h-2" 
                  />
                  <p className="text-sm text-muted-foreground">
                    {Math.round(((timer.totalTime - timer.timeLeft) / timer.totalTime) * 100)}% complete
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={pauseTimer}
                    variant="outline"
                    size="lg"
                    className="btn-glass"
                  >
                    {timer.isActive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                    {timer.isActive ? 'Pause' : 'Resume'}
                  </Button>
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    size="lg"
                    className="btn-glass"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity, index) => {
              const category = featuredCategories.find(c => c.id === activity.category);
              const Icon = category?.icon || Heart;
              const isActive = timer.currentActivity === activity.id;
              
              return (
                <Card
                  key={activity.id}
                  className={`glass-card border-0 hover:shadow-xl transition-all duration-500 cursor-pointer tilt-card group ${
                    isActive ? 'ring-2 ring-wellness-calm bg-wellness-calm/10' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category?.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getDifficultyColor(activity.difficulty)} text-white`}
                        >
                          {activity.difficulty}
                        </Badge>
                        {activity.completed && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Timer className="w-4 h-4" />
                        {activity.duration} min
                      </div>
                      {activity.streak > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-4 h-4 text-wellness-warm" />
                          <span className="font-medium">{activity.streak}</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      className="w-full btn-glass group-hover:bg-white/30"
                      onClick={() => startActivity(activity)}
                      disabled={isActive}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isActive ? 'In Progress' : 'Start Activity'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="student">
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Banner */}
        <div className="relative glass-card p-8 text-center tilt-card overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-wellness-calm/20 to-wellness-peaceful/20" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-wellness-warm" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-wellness-calm to-wellness-peaceful bg-clip-text text-transparent">
                Your Self-Care Journey
              </h1>
              <Sparkles className="w-6 h-6 text-wellness-warm" />
            </div>
            <p className="text-xl text-muted-foreground mb-6">
              Take a moment for yourself with personalized wellness activities
            </p>
            
            {/* Streak and Progress */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-wellness-warm" />
                <div>
                  <div className="text-2xl font-bold text-wellness-warm">{currentStreak} days</div>
                  <div className="text-sm text-muted-foreground">Current streak</div>
                </div>
              </div>
              
              <div className="w-px h-16 bg-white/20 hidden md:block" />
              
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-wellness-calm" />
                <div>
                  <div className="text-2xl font-bold text-wellness-calm">{completedToday}/{dailyGoal}</div>
                  <div className="text-sm text-muted-foreground">Today's progress</div>
                </div>
              </div>
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {progressPercentage >= 100 
                  ? "🎉 Daily goal achieved! Amazing work!" 
                  : `${dailyGoal - completedToday} more activities to reach your goal`
                }
              </p>
            </div>

            {/* Quick Relax Button */}
            <Button 
              onClick={handleQuickRelax}
              className="mt-6 bg-gradient-to-r from-wellness-calm to-wellness-peaceful hover:from-wellness-calm/90 hover:to-wellness-peaceful/90 text-white border-0 px-8 py-3"
              size="lg"
            >
              <Wind className="w-5 h-5 mr-2" />
              Quick Relax (2 min)
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center">
          {featuredCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`btn-glass ${selectedCategory === category.id ? 'bg-white/30' : ''}`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glass-card border-0 tilt-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Activities</CardTitle>
              <CheckCircle className="h-4 w-4 text-wellness-calm" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-wellness-calm">{completedToday}</div>
              <p className="text-xs text-muted-foreground">
                {progressPercentage >= 100 ? "Goal achieved!" : `${dailyGoal - completedToday} remaining`}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 tilt-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Target className="h-4 w-4 text-wellness-serene" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-wellness-serene">{currentStreak}</div>
              <p className="text-xs text-muted-foreground">days in a row</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 tilt-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Minutes</CardTitle>
              <Award className="h-4 w-4 text-wellness-peaceful" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-wellness-peaceful">247</div>
              <p className="text-xs text-muted-foreground">this week</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <BreathingExercise 
        isOpen={isQuickRelaxOpen} 
        onClose={() => setIsQuickRelaxOpen(false)}
        duration={120} // 2 minutes for quick relax
      />
    </DashboardLayout>
  );
};