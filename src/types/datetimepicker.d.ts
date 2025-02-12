declare module '@react-native-community/datetimepicker' {
  import type { ComponentType } from 'react';

  export interface DateTimePickerEvent {
    type: string;
    nativeEvent: {
      timestamp?: number;
    };
  }

  export interface DateTimePickerProps {
    value: Date;
    mode?: 'date' | 'time';
    display?: 'default' | 'spinner' | 'calendar' | 'clock';
    onChange?: (event: DateTimePickerEvent, date?: Date) => void;
    [key: string]: any;
  }

  declare const DateTimePicker: ComponentType<DateTimePickerProps>;
  export default DateTimePicker;
} 