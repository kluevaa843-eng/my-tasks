
import { useEffect, useState } from "react"
import type { Task } from "../../types/Task"
import type { SortOrder } from "../Header/Header"
import AddTask from "./AddTask/AddTask"
import "./Main.css"
import TaskFilters from "./TaskFilters/TaskFilters"
import type { TaskFilter } from "./TaskFilters/TaskFilters"
import TaskList from "./TaskList/TaskList"

type MainProps = {
    tasks: Task[]
    activeSection: string
    activeCategoryId: number | null
    sortOrder: SortOrder
    searchQuery: string
    selectedTaskId: string | null
    onAddTask: (task: Task) => void
    onToggleComplete: (id: string) => void
    onToggleImportant: (id: string) => void
    onDeleteTask: (id: string) => void
    onMoveTask: (id: string, direction: "up" | "down") => void
    onEditTask: (
        id: string,
        updates: Pick<Task, "title" | "category" | "deadline">
    ) => void
}

function Main({
    tasks,
    activeSection,
    activeCategoryId,
    sortOrder,
    searchQuery,
    selectedTaskId,
    onAddTask,
    onToggleComplete,
    onToggleImportant,
    onDeleteTask,
    onMoveTask,
    onEditTask
}: MainProps) {
    const [activeFilter, setActiveFilter] = useState<TaskFilter>("all")

    // При смене раздела или категории возвращаем дополнительный фильтр на "Все"
    useEffect(() => {
        setActiveFilter("all")
    }, [activeSection, activeCategoryId])

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayKey = getDateKey(today)

    const endOfWeek = new Date(today)
    const daysUntilSunday = (7 - today.getDay()) % 7
    endOfWeek.setDate(today.getDate() + daysUntilSunday)
    endOfWeek.setHours(23, 59, 59, 999)

    const sortedTasks = [...tasks]

    if (sortOrder === "oldest") {
        sortedTasks.sort((taskA, taskB) => {
            return taskA.createdAt - taskB.createdAt
        })
    }

    if (sortOrder === "newest") {
        sortedTasks.sort((taskA, taskB) => {
            return taskB.createdAt - taskA.createdAt
        })
    }

    const filteredTasks = sortedTasks.filter((task) => {
        // Фильтр дополнительной панели
        if (activeFilter === "active" && task.isCompleted) {
            return false
        }

        if (activeFilter === "completed" && !task.isCompleted) {
            return false
        }

        // Фильтр по выбранной категории
        if (
            activeCategoryId !== null &&
            task.category?.id !== activeCategoryId
        ) {
            return false
        }

        // Фильтр сайдбара
        if (activeSection === "Выполненные" && !task.isCompleted) {
            return false
        }

        if (activeSection === "Сегодня") {
            if (task.isCompleted || !task.deadline) {
                return false
            }

            const deadlineDate = new Date(task.deadline)

            if (
                Number.isNaN(deadlineDate.getTime()) ||
                getDateKey(deadlineDate) !== todayKey
            ) {
                return false
            }
        }

        if (activeSection === "До конца недели") {
            if (task.isCompleted || !task.deadline) {
                return false
            }

            const deadlineDate = new Date(task.deadline)

            if (
                Number.isNaN(deadlineDate.getTime()) ||
                deadlineDate < today ||
                deadlineDate > endOfWeek
            ) {
                return false
            }
        }

        if (
            activeSection === "Важные" &&
            (!task.isImportant || task.isCompleted)
        ) {
            return false
        }

        // Поиск по названию задачи
        return task.title
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase())
    })

    return (
        <main className="main">
            <AddTask onAddTask={onAddTask} />

            <TaskFilters
                tasks={tasks}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />

            <TaskList
                tasks={filteredTasks}
                allTasks={tasks}
                canReorder={
                    sortOrder === "manual" &&
                    activeSection === "Все задачи" &&
                    activeCategoryId === null &&
                    activeFilter === "all" &&
                    searchQuery.trim() === ""
                }
                selectedTaskId={selectedTaskId}
                onToggleComplete={onToggleComplete}
                onToggleImportant={onToggleImportant}
                onDeleteTask={onDeleteTask}
                onMoveTask={onMoveTask}
                onEditTask={onEditTask}
            />
        </main>
    )
}

function getDateKey(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}

export default Main
