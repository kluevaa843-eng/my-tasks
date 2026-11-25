
import { useEffect, useState } from "react"
import type { Task, Category } from "./types/Task"
import type { SortOrder } from "./components/Header/Header"
import "./App.css"
import Header from "./components/Header/Header"
import Main from "./components/Main/Main"
import Sidebar from "./components/Sidebar/Sidebar"

function App() {
    const [activeSection, setActiveSection] = useState("Все задачи")
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
    const [isDarkTheme, setIsDarkTheme] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [sortOrder, setSortOrder] = useState<SortOrder>("manual")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

    const [tasks, setTasks] = useState<Task[]>(() => {
        try {
            const savedTasks = localStorage.getItem("tasks")
            return savedTasks ? JSON.parse(savedTasks) : []
        } catch {
            return []
        }
    })

    const [categories, setCategories] = useState<Category[]>(() => {
        try {
            const savedCategories = localStorage.getItem("categories")
            return savedCategories ? JSON.parse(savedCategories) : []
        } catch {
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }, [tasks])

    useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(categories))
        window.dispatchEvent(new Event("categories-updated"))
    }, [categories])

    function toggleTheme() {
        setIsDarkTheme((currentTheme) => !currentTheme)
    }

    function toggleSidebar() {
        setIsSidebarOpen((currentState) => !currentState)
    }

    function closeSidebar() {
        setIsSidebarOpen(false)
    }

    function handleSectionChange(section: string) {
        setActiveSection(section)
        setActiveCategoryId(null)
    }

    function handleCategorySelect(id: number) {
        setActiveCategoryId(id)
        setActiveSection("Все задачи")
        setSearchQuery("")
        setSelectedTaskId(null)
    }

    function handleSearchChange(value: string) {
        setSearchQuery(value)
        setSelectedTaskId(null)
    }

    function handleSelectTask(task: Task) {
        setSearchQuery(task.title)
        setSelectedTaskId(task.id)
    }

    function handleAddCategory(category: Category) {
        setCategories((currentCategories) => [
            ...currentCategories,
            category
        ])
    }

    function handleDeleteCategory(id: number) {
        setCategories((currentCategories) =>
            currentCategories.filter((category) => category.id !== id)
        )

        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.category?.id === id
                    ? { ...task, category: null }
                    : task
            )
        )

        if (activeCategoryId === id) {
            setActiveCategoryId(null)
        }
    }

    function handleAddTask(task: Task) {
        setTasks((currentTasks) => [...currentTasks, task])
    }

    function handleToggleComplete(id: string) {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === id
                    ? { ...task, isCompleted: !task.isCompleted }
                    : task
            )
        )
    }

    function handleToggleImportant(id: string) {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === id
                    ? { ...task, isImportant: !task.isImportant }
                    : task
            )
        )
    }

    function handleDeleteTask(id: string) {
        setTasks((currentTasks) =>
            currentTasks.filter((task) => task.id !== id)
        )

        if (selectedTaskId === id) {
            setSelectedTaskId(null)
            setSearchQuery("")
        }
    }

    function handleEditTask(
        id: string,
        updates: Pick<Task, "title" | "category" | "deadline">
    ) {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === id
                    ? { ...task, ...updates }
                    : task
            )
        )

        if (selectedTaskId === id) {
            setSearchQuery(updates.title)
        }
    }

    function handleMoveTask(id: string, direction: "up" | "down") {
        setTasks((currentTasks) => {
            const currentIndex = currentTasks.findIndex(
                (task) => task.id === id
            )

            const newIndex =
                direction === "up" ? currentIndex - 1 : currentIndex + 1

            if (
                currentIndex === -1 ||
                newIndex < 0 ||
                newIndex >= currentTasks.length
            ) {
                return currentTasks
            }

            const updatedTasks = [...currentTasks]
            const [movedTask] = updatedTasks.splice(currentIndex, 1)

            updatedTasks.splice(newIndex, 0, movedTask)

            return updatedTasks
        })
    }

    return (
        <div className={`app-layout ${isDarkTheme ? "dark-theme" : ""}`}>
            {isSidebarOpen && (
                <button
                    className="sidebar-overlay"
                    aria-label="Закрыть меню"
                    onClick={closeSidebar}
                />
            )}

            <Sidebar
                tasks={tasks}
                categories={categories}
                activeSection={activeSection}
                activeCategoryId={activeCategoryId}
                setActiveSection={handleSectionChange}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                onSelectCategory={handleCategorySelect}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />

            <div className="main-content">
                <Header
                    tasks={tasks}
                    isDarkTheme={isDarkTheme}
                    toggleTheme={toggleTheme}
                    toggleSidebar={toggleSidebar}
                    sortOrder={sortOrder}
                    onSortChange={setSortOrder}
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    onSelectTask={handleSelectTask}
                />

                <Main
                    tasks={tasks}
                    activeSection={activeSection}
                    activeCategoryId={activeCategoryId}
                    sortOrder={sortOrder}
                    searchQuery={searchQuery}
                    selectedTaskId={selectedTaskId}
                    onAddTask={handleAddTask}
                    onToggleComplete={handleToggleComplete}
                    onToggleImportant={handleToggleImportant}
                    onDeleteTask={handleDeleteTask}
                    onMoveTask={handleMoveTask}
                    onEditTask={handleEditTask}
                />
            </div>
        </div>
    )
}

export default App

