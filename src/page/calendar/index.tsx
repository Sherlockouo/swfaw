import { Calendar } from "@nextui-org/react";

const CustomCalendar = () => {
  return (
    <div className="m-10">
      <Calendar
        aria-label="Date (Show Month and Year Picker)"
        showMonthAndYearPickers
      />
    </div>
  );
};
export default CustomCalendar;
