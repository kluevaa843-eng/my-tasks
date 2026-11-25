
import type { Task } from "../../../types/Task"
import "./TaskFilters.css"

export type TaskFilter = "all" | "active" | "completed"

type TaskFiltersProps = {
    tasks: Task[]
    activeFilter: TaskFilter
    onFilterChange: (filter: TaskFilter) => void
}

function TaskFilters({
    tasks,
    activeFilter,
    onFilterChange
}: TaskFiltersProps) {
    const allCount = tasks.length

    const activeCount = tasks.filter(
        (task) => !task.isCompleted
    ).length

    const completedCount = tasks.filter(
        (task) => task.isCompleted
    ).length

    return (
        <div className="task-filters">
            <button
                className={`task-filter ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => onFilterChange("all")}
            >
                Все <span>{allCount}</span>
            </button>

            <button
                className={`task-filter ${activeFilter === "active" ? "active" : ""}`}
                onClick={() => onFilterChange("active")}
            >
                Активные <span>{activeCount}</span>
            </button>

            <button
                className={`task-filter ${activeFilter === "completed" ? "active" : ""}`}
                onClick={() => onFilterChange("completed")}
            >
                Выполненные <span>{completedCount}</span>
            </button>
        </div>
    )
}

export default TaskFilters
