
import { useState } from "react"
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    X
} from "lucide-react"
import "./AddTask.css"

type MainDatePickerProps = {
    deadline: string
    onChange: (value: string) => void
    onClose: () => void
}

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

function getDateKey(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}

function MainDatePicker({
    deadline,
    onChange,
    onClose
}: MainDatePickerProps) {
    const initialDate = deadline ? new Date(deadline) : new Date()

    const [selectedDate, setSelectedDate] = useState<Date | null>(
        deadline ? initialDate : null
    )

    const [currentMonth, setCurrentMonth] = useState(
        new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
    )

    const [selectedTime, setSelectedTime] = useState(
        deadline
            ? `${String(initialDate.getHours()).padStart(2, "0")}:${String(initialDate.getMinutes()).padStart(2, "0")}`
            : "12:00"
    )

    const today = new Date()

    const firstDay = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    )

    const lastDay = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    )

    const startOffset = (firstDay.getDay() + 6) % 7
    const daysInMonth = lastDay.getDate()

    const calendarDays: (number | null)[] = [
        ...Array.from({ length: startOffset }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1)
    ]

    function changeMonth(direction: number) {
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + direction,
                1
            )
        )
    }

    function selectToday() {
        const currentDate = new Date()

        setSelectedDate(currentDate)
        setCurrentMonth(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        )
    }

    function handleConfirm() {
        if (!selectedDate) return

        const [hours, minutes] = selectedTime.split(":").map(Number)

        const result = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            hours,
            minutes
        )

        const year = result.getFullYear()
        const month = String(result.getMonth() + 1).padStart(2, "0")
        const day = String(result.getDate()).padStart(2, "0")
        const hour = String(result.getHours()).padStart(2, "0")
        const minute = String(result.getMinutes()).padStart(2, "0")

        onChange(`${year}-${month}-${day}T${hour}:${minute}`)
        onClose()
    }

    return (
        <div className="date-picker">
            <div className="date-picker-header">
                <div>
                    <span className="date-picker-caption">ВЫБЕРИ ДАТУ</span>
                    <h3>Срок выполнения</h3>
                </div>

                <button
                    type="button"
                    className="date-picker-close"
                    onClick={onClose}
                    aria-label="Закрыть календарь"
                >
                    <X size={17} />
                </button>
            </div>

            <div className="calendar-month">
                <strong>
                    {currentMonth.toLocaleDateString("ru-RU", {
                        month: "long",
                        year: "numeric"
                    })}
                </strong>

                <div className="calendar-navigation">
                    <button
                        type="button"
                        onClick={() => changeMonth(-1)}
                        aria-label="Предыдущий месяц"
                    >
                        <ChevronLeft size={17} />
                    </button>

                    <button
                        type="button"
                        onClick={() => changeMonth(1)}
                        aria-label="Следующий месяц"
                    >
                        <ChevronRight size={17} />
                    </button>
                </div>
            </div>

            <div className="date-picker-body">
                <div className="date-picker-calendar">
                    <div className="calendar-grid">
                        {weekDays.map((day) => (
                            <span className="calendar-weekday" key={day}>
                                {day}
                            </span>
                        ))}

                        {calendarDays.map((day, index) => {
                            if (day === null) {
                                return (
                                    <span
                                        className="calendar-empty"
                                        key={`empty-${index}`}
                                    />
                                )
                            }

                            const date = new Date(
                                currentMonth.getFullYear(),
                                currentMonth.getMonth(),
                                day
                            )

                            const isSelected =
                                selectedDate !== null &&
                                getDateKey(selectedDate) === getDateKey(date)

                            const isToday =
                                getDateKey(today) === getDateKey(date)

                            return (
                                <button
                                    type="button"
                                    key={day}
                                    className={[
                                        "calendar-day",
                                        isSelected ? "selected" : "",
                                        isToday ? "today" : ""
                                    ].join(" ")}
                                    onClick={() => setSelectedDate(date)}
                                >
                                    {day}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="calendar-time">
                    <div className="calendar-time-label">
                        <Clock size={15} />
                        <span>Время выполнения</span>
                    </div>

                    <input
                        type="time"
                        value={selectedTime}
                        onChange={(event) =>
                            setSelectedTime(event.target.value)
                        }
                    />
                </div>
            </div>

            <div className="date-picker-actions">
                <button
                    type="button"
                    className="calendar-today"
                    onClick={selectToday}
                >
                    Сегодня
                </button>

                <button
                    type="button"
                    className="calendar-clear"
                    onClick={() => {
                        onChange("")
                        onClose()
                    }}
                >
                    Очистить
                </button>

                <button
                    type="button"
                    className="calendar-confirm"
                    disabled={!selectedDate}
                    onClick={handleConfirm}
                >
                    Готово
                </button>
            </div>
        </div>
    )
}

export default MainDatePicker
