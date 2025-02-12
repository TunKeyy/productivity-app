declare module '@/types/calendar' {
  export interface DayObject {
    dateString: string;
    day: number;
    month: number;
    year: number;
    timestamp: number;
  }

  export interface Calendar {
    onDayPress: (day: DayObject) => void;
    markedDates?: Record<string, any>;
    onMonthChange?: (date: DayObject) => void;
    theme?: {
      selectedDayBackgroundColor?: string;
      todayTextColor?: string;
      dotColor?: string;
      textDayFontSize?: number;
      textMonthFontSize?: number;
      textDayHeaderFontSize?: number;
    };
  }
} 