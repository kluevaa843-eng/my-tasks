
import { useEffect, useRef, useState } from "react"
import type { Category, Task } from "../../../types/Task"
import {
    Plus,
    CalendarDays,
    ArrowRight,
    ChevronDown,
    Check
} from "lucide-react"
import MainDatePicker from "./MainDatePicker"
import "./AddTask.css"

type AddTaskProps = {
    onAddTask: (task: Task) => void
}

function AddTask({ onAddTask }: AddTaskProps) {
    const [title, setTitle] = useState("")
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [deadline, setDeadline] = useState("")

    const datePickerRef = useRef<HTMLDivElement>(null)

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

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                datePickerRef.current &&
                event.target instanceof Node &&
                !datePickerRef.current.contains(event.target)
            ) {
                setIsDatePickerOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    function handleCategorySelect(category: Category | null) {
        setSelectedCategory(category)
        setIsCategoryOpen(false)
    }

    function formatDeadline(date: string) {
        if (!date) return "Срок"

        return new Date(date).toLocaleString("ru-RU", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    function handleAddTask() {
        const trimmedTitle = title.trim()

        if (!trimmedTitle) return

        const newTask: Task = {
            id: crypto.randomUUID(),
            title: trimmedTitle,
            category: selectedCategory,
            deadline,
            createdAt: Date.now(),
            isCompleted: false,
            isImportant: false
        }

        onAddTask(newTask)

        setTitle("")
        setDeadline("")
        setSelectedCategory(null)
    }

    return (
        <div className="add-task">
            <button type="button" className="add-task-icon">
                <Plus size={20} />
            </button>

            <input
                type="text"
                className="add-task-input"
                placeholder="Добавить задачу"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") handleAddTask()
                }}
            />

            <div className="add-task-options">
                <div className="category-select-container">
                    <button
                        type="button"
                        className="category-select"
                        onClick={() => {
                            setIsCategoryOpen(!isCategoryOpen)
                            setIsDatePickerOpen(false)
                        }}
                    >
                        {selectedCategory ? (
                            <>
                                <span
                                    className="category-dot"
                                    style={{
                                        backgroundColor: selectedCategory.color
                                    }}
                                />
                                <span>{selectedCategory.name}</span>
                            </>
                        ) : (
                            <>
                                <span className="category-dot" />
                                <span>Без категории</span>
                            </>
                        )}

                        <ChevronDown size={14} />
                    </button>

                    {isCategoryOpen && (
                        <div className="category-menu">
                            <button
                                type="button"
                                className="category-option"
                                onClick={() => handleCategorySelect(null)}
                            >
                                <span className="category-dot no-category-dot" />
                                <span>Без категории</span>
                                {!selectedCategory && <Check size={15} />}
                            </button>

                            {categories.map((category) => (
                                <button
                                    type="button"
                                    className="category-option"
                                    key={category.id}
                                    onClick={() => handleCategorySelect(category)}
                                >
                                    <span
                                        className="category-dot"
                                        style={{
                                            backgroundColor: category.color
                                        }}
                                    />

                                    <span>{category.name}</span>

                                    {selectedCategory?.id === category.id && (
                                        <Check size={15} />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="deadline-container" ref={datePickerRef}>
                    <button
                        type="button"
                        className={`deadline-select ${deadline ? "has-deadline" : ""}`}
                        onClick={() => {
                            setIsDatePickerOpen(!isDatePickerOpen)
                            setIsCategoryOpen(false)
                        }}
                    >
                        <CalendarDays size={15} />
                        <span>{formatDeadline(deadline)}</span>
                        <ChevronDown size={13} />
                    </button>

                    {isDatePickerOpen && (
                        <MainDatePicker
                            deadline={deadline}
                            onChange={setDeadline}
                            onClose={() => setIsDatePickerOpen(false)}
                        />
                    )}
                </div>

                <button
                    type="button"
                    className="add-task-submit"
                    onClick={handleAddTask}
                >
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    )
}

export default AddTask
