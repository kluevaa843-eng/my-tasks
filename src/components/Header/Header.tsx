
import {
    Search,
    Sun,
    Moon,
    ArrowDownWideNarrow,
    ChevronDown,
    Check,
    Menu,
    X
} from "lucide-react"
import { useState } from "react"
import type { Task } from "../../types/Task"
import "./Header.css"

export type SortOrder = "manual" | "oldest" | "newest"

type HeaderProps = {
    tasks: Task[]
    isDarkTheme: boolean
    toggleTheme: () => void
    toggleSidebar: () => void
    sortOrder: SortOrder
    onSortChange: (order: SortOrder) => void
    searchQuery: string
    onSearchChange: (value: string) => void
    onSelectTask: (task: Task) => void
}

function Header(props: HeaderProps) {
    const [isSortOpen, setIsSortOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const sortLabels: Record<SortOrder, string> = {
        manual: "Без сортировки",
        oldest: "Сначала старые",
        newest: "Сначала новые"
    }

    const searchResults = props.tasks
        .filter((task) =>
            task.title
                .toLowerCase()
                .includes(props.searchQuery.trim().toLowerCase())
        )
        .slice(0, 7)

    function handleSortChange(order: SortOrder) {
        props.onSortChange(order)
        setIsSortOpen(false)
    }

    function handleSelectTask(task: Task) {
        props.onSelectTask(task)
        setIsSearchOpen(false)
    }

    function clearSearch() {
        props.onSearchChange("")
        setIsSearchOpen(false)
    }

    return (
        <header className="header">
            <button
                type="button"
                className="mobile-menu-btn"
                aria-label="Открыть меню"
                onClick={props.toggleSidebar}
            >
                <Menu size={22} />
            </button>

            <div className="search-container">
                <div className="search-box">
                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Поиск задач..."
                        value={props.searchQuery}
                        onChange={(event) => {
                            props.onSearchChange(event.target.value)
                            setIsSearchOpen(true)
                        }}
                        onFocus={() => setIsSearchOpen(true)}
                        onBlur={() => setIsSearchOpen(false)}
                    />

                    {props.searchQuery && (
                        <button
                            type="button"
                            className="search-clear-btn"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={clearSearch}
                            aria-label="Очистить поиск"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {isSearchOpen && props.searchQuery.trim() && (
                    <div className="search-results">
                        <p className="search-results-heading">
                            Результаты поиска
                        </p>

                        {searchResults.length > 0 ? (
                            searchResults.map((task) => (
                                <button
                                    type="button"
                                    className="search-result-item"
                                    key={task.id}
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleSelectTask(task)}
                                >
                                    <span
                                        className={`search-result-status ${
                                            task.isCompleted ? "completed" : ""
                                        }`}
                                    >
                                        {task.isCompleted && <Check size={12} />}
                                    </span>

                                    <span className="search-result-title">
                                        {task.title}
                                    </span>

                                    {task.category && (
                                        <span className="search-result-category">
                                            {task.category.name}
                                        </span>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="search-empty">
                                Задачи не найдены
                            </div>
                        )}

                        {searchResults.length === 7 && (
                            <p className="search-results-footer">
                                Показаны первые 7 совпадений
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="header-actions">
                <div className="sort-container">
                    <button
                        type="button"
                        className="sort-btn"
                        onClick={() => setIsSortOpen((current) => !current)}
                    >
                        <ArrowDownWideNarrow size={18} />
                        <span>{sortLabels[props.sortOrder]}</span>
                        <ChevronDown size={16} />
                    </button>

                    {isSortOpen && (
                        <div className="sort-menu">
                            <p>Порядок задач</p>

                            <button
                                type="button"
                                onClick={() => handleSortChange("manual")}
                            >
                                <span>Без сортировки</span>
                                {props.sortOrder === "manual" && (
                                    <Check size={16} />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSortChange("oldest")}
                            >
                                <span>Сначала старые</span>
                                {props.sortOrder === "oldest" && (
                                    <Check size={16} />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSortChange("newest")}
                            >
                                <span>Сначала новые</span>
                                {props.sortOrder === "newest" && (
                                    <Check size={16} />
                                )}
                            </button>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="theme-btn"
                    aria-label="Переключить тему"
                    onClick={props.toggleTheme}
                >
                    {props.isDarkTheme ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </div>
        </header>
    )
}

export default Header
