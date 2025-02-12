import { RecurringPattern, Task } from '@/types/database';

export function generateNextOccurrence(
  baseDate: Date,
  pattern: RecurringPattern
): Date | null {
  const next = new Date(baseDate);

  switch (pattern.frequency) {
    case 'daily':
      next.setDate(next.getDate() + (pattern.interval || 1));
      break;

    case 'weekly':
      if (pattern.weekdays && pattern.weekdays.length > 0) {
        // Find next weekday in the list
        let found = false;
        let currentDay = next.getDay();
        let daysChecked = 0;

        while (!found && daysChecked < 7) {
          currentDay = (currentDay + 1) % 7;
          if (pattern.weekdays.includes(currentDay)) {
            found = true;
            next.setDate(next.getDate() + daysChecked + 1);
          }
          daysChecked++;
        }

        if (!found) return null;
      } else {
        next.setDate(next.getDate() + 7 * (pattern.interval || 1));
      }
      break;

    case 'monthly':
      if (pattern.monthDay) {
        next.setDate(pattern.monthDay);
        next.setMonth(next.getMonth() + (pattern.interval || 1));
      } else {
        next.setMonth(next.getMonth() + (pattern.interval || 1));
      }
      break;

    case 'yearly':
      next.setFullYear(next.getFullYear() + (pattern.interval || 1));
      break;

    default:
      return null;
  }

  // Check if we've reached the end
  if (pattern.endDate && next > new Date(pattern.endDate)) {
    return null;
  }

  return next;
}

export function shouldCreateNextInstance(task: Task): boolean {
  if (!task.recurring_pattern || !task.due_date) return false;

  const now = new Date();
  const dueDate = new Date(task.due_date);
  const daysDiff = Math.floor(
    (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Create next instance when we're within 7 days of the due date
  return daysDiff <= 7;
} 