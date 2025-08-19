"use client";
import React from "react";
// Temporarily disabled FullCalendar for testing AdminDataTable
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import {
//   EventInput,
//   DateSelectArg,
//   EventClickArg,
//   EventContentArg,
// } from "@fullcalendar/core";
// import { useModal } from "@/hooks/useModal";
// import { Modal } from "@/components/ui/modal";

// interface CalendarEvent extends EventInput {
//   extendedProps: {
//     calendar: string;
//   };
// }

const Calendar: React.FC = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Calendar Component</h3>
        <p className="text-gray-600 dark:text-gray-400">
          FullCalendar temporarily disabled for AdminDataTable testing.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Install @fullcalendar/react to re-enable full functionality.
        </p>
      </div>
    </div>
  );
};

export default Calendar;
