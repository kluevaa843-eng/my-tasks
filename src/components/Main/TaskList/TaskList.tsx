
import { useEffect, useState } from "react"
import type { Category, Task } from "../../../types/Task"
import {
    Check,
    Star,
    Pencil,
    Trash2,
    CalendarDays,
    Clock,
    ArrowUp,
    ArrowDown,
    X,
    ChevronDown
} from "lucide-react"
import MainDatePicker from "../AddTask/MainDatePicker"
import "./TaskList.css"

type TaskUpdates = {
    title: string
    category: Category | null
    deadline: string
}

type TaskListProps = {
    tasks: Task[]
    allTasks: Task[]
    canReorder: boolean
    onToggleComplete: (id: string) => void
    onToggleImportant: (id: string) => void
    onDeleteTask: (id: string) => void
    onMoveTask: (id: string, direction: "up" | "down") => void
    onEditTask: (id: string, updates: TaskUpdates) => void
    selectedTaskId: string | null
}

function TaskList({
    tasks,
    allTasks,
    canReorder,
    selectedTaskId,
    onToggleComplete,
    onToggleImportant,
    onDeleteTask,
    onMoveTask,
    onEditTask
}: TaskListProps) {
    const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null)
    const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)
    const [currentTime, setCurrentTime] = useState(Date.now())
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [editTitle, setEditTitle] = useState("")
    const [editCategoryId, setEditCategoryId] = useState("")
    const [editDeadline, setEditDeadline] = useState("")
    const [isEditDatePickerOpen, setIsEditDatePickerOpen] = useState(false)
    useEffect(() => {
        const timer = window.setInterval(() => {
            setCurrentTime(Date.now())
        }, 30000)
        return () => window.clearInterval(timer)
    }, [])
    useEffect(() => {
        if (!selectedTaskId) return

        const selectedElement = document.getElementById(
            `task-${selectedTaskId}`
        )

        selectedElement?.scrollIntoView({
            behavior: "smooth",
            block: "center"
    })
}, [selectedTaskId, tasks])
    useEffect(() => {
        function loadCategories() {
            try {
                const savedCategories = localStorage.getItem("categories")
                setCategories(savedCategories ? JSON.parse(savedCategories) : [])
            } catch {
                setCategories([])
            }
        }

        loadCategories()

        window.addEventListener("categories-updated", loadCategories)

        return () => {
            window.removeEventListener("categories-updated", loadCategories)
        }
    }, [])

    function formatDeadline(deadline: string) {
        if (!deadline) return ""

        const date = new Date(deadline)

        return date.toLocaleString("ru-RU", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        })
    }
    function isDeadlineToday(deadline: string) {
        if (!deadline) return false
        const deadlineDate = new Date(deadline)
        if (Number.isNaN(deadlineDate.getTime())) {
            return false
        }
        const today = new Date()
        return (
            deadlineDate.getDate() === today.getDate() &&
            deadlineDate.getMonth() === today.getMonth() &&
            deadlineDate.getFullYear() === today.getFullYear()
        )
    }
    function isDeadlineOverdue(deadline: string) {
        if (!deadline) return false
        const deadlineDate = new Date(deadline)
        return (
            !Number.isNaN(deadlineDate.getTime()) &&
            deadlineDate.getTime() < currentTime
        )
    }

    function formatCreatedAt(createdAt: number) {
        const minutes = Math.floor((Date.now() - createdAt) / 60000)

        if (minutes < 1) return "Создано только что"
        if (minutes < 60) return `Создано ${minutes} мин. назад`

        const hours = Math.floor(minutes / 60)

        if (hours < 24) return `Создано ${hours} ч. назад`

        const days = Math.floor(hours / 24)

        return `Создано ${days} дн. назад`
    }

    function openEditTask(task: Task) {
        setEditingTask(task)
        setEditTitle(task.title)
        setEditCategoryId(task.category ? String(task.category.id) : "")
        setEditDeadline(task.deadline)
        setIsEditDatePickerOpen(false)
        setIsMenuOpen(null)
    }

    function closeEditTask() {
        setEditingTask(null)
        setIsEditDatePickerOpen(false)
    }

    function saveEditedTask() {
        if (!editingTask || !editTitle.trim()) return

        const selectedCategory =
            categories.find(
                (category) => String(category.id) === editCategoryId
            ) ?? null

        onEditTask(editingTask.id, {
            title: editTitle.trim(),
            category: selectedCategory,
            deadline: editDeadline
        })

        closeEditTask()
    }

    function handleMoveTask(task: Task, direction: "up" | "down") {
        if (!canReorder) return

        const taskIndex = allTasks.findIndex(
            (item) => item.id === task.id
        )

        if (taskIndex === -1) return

        if (direction === "up" && taskIndex === 0) return

        if (direction === "down" && taskIndex === allTasks.length - 1) return

        onMoveTask(task.id, direction)
        setIsMenuOpen(null)
    }

    return (
        <div className="task-list">
            {tasks.map((task, index) => {
                const taskIndex = allTasks.findIndex(
                    (item) => item.id === task.id
                )

                const isFirstTask = taskIndex === 0
                const isLastTask = taskIndex === allTasks.length - 1
                const isTaskMissing = taskIndex === -1

                return (
                    <div
                        id={`task-${task.id}`}
                        className={`task-card ${
                            task.isCompleted ? "completed" : ""
                        } ${
                            selectedTaskId === task.id ? "task-card-highlighted" : ""
                        }`}
                        key={task.id}
                    >
                        <button
                            type="button"
                            className="task-checkbox"
                            onClick={() => onToggleComplete(task.id)}
                            aria-label="Отметить задачу выполненной"
                        >
                            {task.isCompleted && <Check size={15} />}
                        </button>

                        <div className="task-card-content">
                            <h3 className="task-title">{task.title}</h3>

                            <div className="task-meta">
                                {!task.isCompleted &&
                                    !isDeadlineOverdue(task.deadline) &&
                                    isDeadlineToday(task.deadline) && (
                                        <span className="task-today-badge">
                                            Сегодня
                                        </span>
                                )}
                                {task.category && (
                                    <div className="task-category">
                                        <span
                                            className="task-category-dot"
                                            style={{
                                                backgroundColor: task.category.color
                                            }}
                                        />
                                        <span>{task.category.name}</span>
                                    </div>
                                )}

                                {task.deadline && (
                                    <div className="task-deadline">
                                        <CalendarDays size={13} />
                                        <span>{formatDeadline(task.deadline)}</span>
                                    </div>
                                )}

                                <div className="task-created">
                                    <Clock size={13} />
                                    <span>{formatCreatedAt(task.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="task-card-actions">
                            {!task.isCompleted && isDeadlineOverdue(task.deadline) && (
                                <span className="task-overdue-badge">
                                    Просрочено
                                </span>
                            )}
                            <button
                                type="button"
                                className={`task-important ${task.isImportant ? "active" : ""}`}
                                onClick={() => onToggleImportant(task.id)}
                            >
                                <span>Важно</span>
                                <Star size={15} />
                            </button>

                            <div
                                className={`task-menu-container ${
                                    index === tasks.length - 1
                                        ? "task-menu-container-last"
                                        : ""
                                }`}
                            >
                                <button
                                    type="button"
                                    className="task-edit"
                                    onClick={() =>
                                        setIsMenuOpen(
                                            isMenuOpen === task.id ? null : task.id
                                        )
                                    }
                                    aria-label="Открыть меню задачи"
                                >
                                    <Pencil size={17} />
                                </button>

                                {isMenuOpen === task.id && (
                                    <div className="task-menu">
                                        <button
                                            type="button"
                                            onClick={() => openEditTask(task)}
                                        >
                                            <Pencil size={15} />
                                            <span>Редактировать</span>
                                        </button>

                                        <button
                                            type="button"
                                            disabled={!canReorder || isFirstTask || isTaskMissing}
                                            onClick={() => handleMoveTask(task, "up")}
                                        >
                                            <ArrowUp size={15} />
                                            <span>Переместить вверх</span>
                                        </button>

                                        <button
                                            type="button"
                                            disabled={!canReorder || isLastTask || isTaskMissing}
                                            onClick={() => handleMoveTask(task, "down")}
                                        >
                                            <ArrowDown size={15} />
                                            <span>Переместить вниз</span>
                                        </button>

                                        <button
                                            type="button"
                                            className="delete-option"
                                            onClick={() => {
                                                setIsMenuOpen(null)
                                                setDeleteTaskId(task.id)
                                            }}
                                        >
                                            <Trash2 size={15} />
                                            <span>Удалить</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                className="task-delete"
                                onClick={() => setDeleteTaskId(task.id)}
                                aria-label="Удалить задачу"
                            >
                                <Trash2 size={17} />
                            </button>
                        </div>
                    </div>
                )
            })}

            {editingTask !== null && (
                <div className="edit-task-overlay" onClick={closeEditTask}>
                    <div
                        className="edit-task-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-task-heading"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="edit-task-header">
                            <div>
                                <span className="edit-task-caption">
                                    МОИ ЗАДАЧИ
                                </span>
                                <h2 id="edit-task-heading">
                                    Редактирование
                                </h2>
                                <p>Измени детали своей задачи</p>
                            </div>

                            <button
                                type="button"
                                className="edit-task-close"
                                onClick={closeEditTask}
                                aria-label="Закрыть редактирование"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="edit-task-fields">
                            <label className="edit-task-field">
                                <span>Название задачи</span>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(event) =>
                                        setEditTitle(event.target.value)
                                    }
                                    placeholder="Напиши название задачи"
                                    autoFocus
                                />
                            </label>

                            <label className="edit-task-field">
                                <span>Категория</span>
                                <select
                                    value={editCategoryId}
                                    onChange={(event) =>
                                        setEditCategoryId(event.target.value)
                                    }
                                >
                                    <option value="">Без категории</option>

                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={String(category.id)}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <div className="edit-task-field">
                                <span>Срок выполнения</span>

                                <div className="deadline-container edit-task-date-picker-container">
                                    <button
                                        type="button"
                                        className={`deadline-select ${editDeadline ? "has-deadline" : ""}`}
                                        onClick={() =>
                                            setIsEditDatePickerOpen((current) => !current)
                                        }
                                    >
                                        <CalendarDays size={15} />

                                        <span>
                                            {editDeadline
                                                ? formatDeadline(editDeadline)
                                                : "Срок"}
                                        </span>

                                        <ChevronDown size={13} />
                                    </button>

                                    {isEditDatePickerOpen && (
                                        <MainDatePicker
                                            deadline={editDeadline}
                                            onChange={setEditDeadline}
                                            onClose={() =>
                                                setIsEditDatePickerOpen(false)
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="edit-task-actions">
                            <button
                                type="button"
                                className="edit-task-cancel"
                                onClick={closeEditTask}
                            >
                                Отмена
                            </button>

                            <button
                                type="button"
                                className="edit-task-save"
                                disabled={!editTitle.trim()}
                                onClick={saveEditedTask}
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteTaskId !== null && (
                <div className="delete-overlay">
                    <div className="delete-modal">
                        <h3>Удалить задачу?</h3>

                        <p>
                            Вы действительно хотите удалить эту задачу?
                            Это действие нельзя отменить.
                        </p>

                        <div className="delete-modal-actions">
                            <button
                                type="button"
                                className="delete-cancel"
                                onClick={() => setDeleteTaskId(null)}
                            >
                                Нет
                            </button>

                            <button
                                type="button"
                                className="delete-confirm"
                                onClick={() => {
                                    onDeleteTask(deleteTaskId)
                                    setDeleteTaskId(null)
                                }}
                            >
                                Да, удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TaskList
