
import type { Task } from "../../types/Task"
import NavigationItem from "./NavigationItem"
import {
    Inbox,
    CircleCheck,
    Clock,
    CalendarDays,
    Star
} from "lucide-react"

interface NavigationProps {
    tasks: Task[]
    activeSection: string
    setActiveSection: (section: string) => void
}

function Navigation({
    tasks,
    activeSection,
    setActiveSection
}: NavigationProps) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayKey = getDateKey(today)

    const endOfWeek = new Date(today)
    const daysUntilSunday = (7 - today.getDay()) % 7
    endOfWeek.setDate(today.getDate() + daysUntilSunday)
    endOfWeek.setHours(23, 59, 59, 999)

    const allCount = tasks.length

    const completedCount = tasks.filter(
        (task) => task.isCompleted
    ).length

    const todayCount = tasks.filter((task) => {
        if (task.isCompleted || !task.deadline) return false

        const deadlineDate = new Date(task.deadline)

        return (
            !Number.isNaN(deadlineDate.getTime()) &&
            getDateKey(deadlineDate) === todayKey
        )
    }).length

    const weekCount = tasks.filter((task) => {
        if (task.isCompleted || !task.deadline) return false

        const deadlineDate = new Date(task.deadline)

        return (
            !Number.isNaN(deadlineDate.getTime()) &&
            deadlineDate >= today &&
            deadlineDate <= endOfWeek
        )
    }).length

    const importantCount = tasks.filter(
        (task) => task.isImportant && !task.isCompleted
    ).length

    return (
        <nav>
            <ul>
                <NavigationItem
                    icon={Inbox}
                    label="Все задачи"
                    active={activeSection === "Все задачи"}
                    onClick={() => setActiveSection("Все задачи")}
                    count={allCount}
                />

                <NavigationItem
                    icon={CircleCheck}
                    label="Выполненные"
                    active={activeSection === "Выполненные"}
                    onClick={() => setActiveSection("Выполненные")}
                    count={completedCount}
                />

                <NavigationItem
                    icon={Clock}
                    label="Сегодня"
                    active={activeSection === "Сегодня"}
                    onClick={() => setActiveSection("Сегодня")}
                    count={todayCount}
                />

                <NavigationItem
                    icon={CalendarDays}
                    label="До конца недели"
                    active={activeSection === "До конца недели"}
                    onClick={() => setActiveSection("До конца недели")}
                    count={weekCount}
                />

                <NavigationItem
                    icon={Star}
                    label="Важные"
                    active={activeSection === "Важные"}
                    onClick={() => setActiveSection("Важные")}
                    count={importantCount}
                />
            </ul>
        </nav>
    )
}

function getDateKey(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}

export default Navigation
