import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ScheduleModal } from './ScheduleModal';

interface CalendarEvent {
  id: number;
  studentName: string;
  sessionType: string;
  date: Date;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  counselor: string;
}

interface CalendarEventModalProps {
  event: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarEventModal: React.FC<CalendarEventModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  const [showReschedule, setShowReschedule] = useState(false);

  const statusConfig = {
    confirmed: { color: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30', label: 'Confirmed' },
    pending: { color: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30', label: 'Pending' },
    cancelled: { color: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30', label: 'Cancelled' },
  };

  const handleMarkCompleted = () => {
    toast({
      title: 'Session Marked as Completed',
      description: `Session with ${event.studentName} has been marked as completed.`,
    });
    onClose();
  };

  const handleCancel = () => {
    toast({
      title: 'Session Cancelled',
      description: `Session with ${event.studentName} has been cancelled.`,
      variant: 'destructive',
    });
    onClose();
  };

  const handleReschedule = () => {
    setShowReschedule(true);
  };

  const handleRescheduleConfirm = () => {
    toast({
      title: 'Session Rescheduled',
      description: `Session with ${event.studentName} has been rescheduled successfully.`,
    });
    setShowReschedule(false);
    onClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Dialog open={isOpen && !showReschedule} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Session Details</DialogTitle>
            <DialogDescription>
              Complete information about this counseling session
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Student Info */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Student</p>
                <p className="font-semibold text-lg">{event.studentName}</p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-wellness-serene/10">
                  <Calendar className="h-5 w-5 text-wellness-serene" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-wellness-peaceful/10">
                  <Clock className="h-5 w-5 text-wellness-peaceful" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{event.time}</p>
                </div>
              </div>
            </div>

            {/* Session Type */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-wellness-warm/10">
                <FileText className="h-5 w-5 text-wellness-warm" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Session Type</p>
                <p className="font-medium">{event.sessionType}</p>
              </div>
            </div>

            {/* Counselor */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-wellness-gentle/10">
                <User className="h-5 w-5 text-wellness-gentle" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Counselor</p>
                <p className="font-medium">{event.counselor}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <span className="text-sm font-medium">Status</span>
              <Badge className={statusConfig[event.status].color}>
                {statusConfig[event.status].label}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Button
                onClick={handleReschedule}
                variant="outline"
                className="w-full"
              >
                <Edit className="h-4 w-4 mr-2" />
                Reschedule
              </Button>

              {event.status !== 'cancelled' && (
                <Button
                  onClick={handleMarkCompleted}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Completed
                </Button>
              )}

              {event.status !== 'cancelled' && (
                <Button
                  onClick={handleCancel}
                  variant="destructive"
                  className="w-full"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Session
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reschedule Modal */}
      {showReschedule && (
        <ScheduleModal
          isOpen={showReschedule}
          onClose={() => setShowReschedule(false)}
          onConfirm={handleRescheduleConfirm}
          studentName={event.studentName}
        />
      )}
    </>
  );
};
