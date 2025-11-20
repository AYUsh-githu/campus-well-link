import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarEventModal } from '@/components/CalendarEventModal';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: number;
  studentName: string;
  sessionType: string;
  date: Date;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  counselor: string;
}

type ViewMode = 'month' | 'week' | 'day';

const mockEvents: CalendarEvent[] = [
  { id: 1, studentName: 'John Doe', sessionType: 'Individual Session', date: new Date(2025, 10, 20, 9, 0), time: '09:00 AM', status: 'confirmed', counselor: 'Dr. Smith' },
  { id: 2, studentName: 'Jane Smith', sessionType: 'Follow-up', date: new Date(2025, 10, 20, 10, 30), time: '10:30 AM', status: 'pending', counselor: 'Dr. Johnson' },
  { id: 3, studentName: 'Mike Johnson', sessionType: 'Assessment', date: new Date(2025, 10, 21, 14, 0), time: '02:00 PM', status: 'confirmed', counselor: 'Dr. Smith' },
  { id: 4, studentName: 'Sarah Wilson', sessionType: 'Group Session', date: new Date(2025, 10, 22, 15, 30), time: '03:30 PM', status: 'confirmed', counselor: 'Dr. Brown' },
  { id: 5, studentName: 'Alex Brown', sessionType: 'Crisis Support', date: new Date(2025, 10, 23, 11, 0), time: '11:00 AM', status: 'cancelled', counselor: 'Dr. Johnson' },
];

export const AdminCalendar: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [filters, setFilters] = useState({
    sessionType: 'all',
    counselor: 'all',
    status: 'all',
  });

  const statusColors = {
    confirmed: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
    cancelled: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDay = (day: number) => {
    return mockEvents.filter(event => {
      const eventDate = event.date;
      const matchesDate = eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear();

      const matchesFilters =
        (filters.sessionType === 'all' || event.sessionType === filters.sessionType) &&
        (filters.counselor === 'all' || event.counselor === filters.counselor) &&
        (filters.status === 'all' || event.status === filters.status);

      return matchesDate && matchesFilters;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="glass-card p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-wellness-serene to-wellness-peaceful bg-clip-text text-transparent">
                Calendar
              </h1>
              <p className="text-muted-foreground mt-1">Manage counseling sessions and appointments</p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                onClick={() => setViewMode('month')}
                size="sm"
              >
                Month
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                onClick={() => setViewMode('week')}
                size="sm"
              >
                Week
              </Button>
              <Button
                variant={viewMode === 'day' ? 'default' : 'outline'}
                onClick={() => setViewMode('day')}
                size="sm"
              >
                Day
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px,1fr] gap-6">
          {/* Sidebar Filters */}
          <Card className="glass-card p-6 h-fit">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Filters
            </h3>

            <div className="space-y-4">
              {/* Session Type Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Session Type</label>
                <select
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={filters.sessionType}
                  onChange={(e) => setFilters({ ...filters, sessionType: e.target.value })}
                >
                  <option value="all">All Types</option>
                  <option value="Individual Session">Individual Session</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Assessment">Assessment</option>
                  <option value="Group Session">Group Session</option>
                  <option value="Crisis Support">Crisis Support</option>
                </select>
              </div>

              {/* Counselor Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Counselor</label>
                <select
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={filters.counselor}
                  onChange={(e) => setFilters({ ...filters, counselor: e.target.value })}
                >
                  <option value="all">All Counselors</option>
                  <option value="Dr. Smith">Dr. Smith</option>
                  <option value="Dr. Johnson">Dr. Johnson</option>
                  <option value="Dr. Brown">Dr. Brown</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setFilters({ sessionType: 'all', counselor: 'all', status: 'all' })}
              >
                Clear Filters
              </Button>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium mb-3">Status Legend</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-muted-foreground">Cancelled</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Calendar View */}
          <Card className="glass-card p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {monthNames[month]} {year}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {viewMode === 'month' && (
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {dayNames.map(day => (
                  <div key={day} className="text-center font-semibold text-sm py-2 text-muted-foreground">
                    {day}
                  </div>
                ))}

                {/* Empty cells before first day */}
                {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="min-h-[120px] border border-border/50 rounded-lg bg-muted/20" />
                ))}

                {/* Calendar Days */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const events = getEventsForDay(day);
                  const isToday = day === new Date().getDate() &&
                    month === new Date().getMonth() &&
                    year === new Date().getFullYear();

                  return (
                    <div
                      key={day}
                      className={cn(
                        "min-h-[120px] border border-border/50 rounded-lg p-2 bg-card hover:bg-accent/5 transition-colors",
                        isToday && "border-primary border-2"
                      )}
                    >
                      <div className={cn(
                        "text-sm font-semibold mb-2",
                        isToday && "text-primary"
                      )}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {events.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-xs p-1 rounded border cursor-pointer hover:scale-105 transition-transform",
                              statusColors[event.status]
                            )}
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="font-medium truncate">{event.time}</div>
                            <div className="truncate">{event.studentName}</div>
                          </div>
                        ))}
                        {events.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{events.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === 'week' && (
              <div className="text-center py-20 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Week view coming soon</p>
              </div>
            )}

            {viewMode === 'day' && (
              <div className="text-center py-20 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Day view coming soon</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <CalendarEventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </DashboardLayout>
  );
};
