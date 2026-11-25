
import type { Task, Category } from "../../types/Task"
import Logo from "./Logo"
import "./Sidebar.css"
import Navigation from "./Navigation"
import Categories from "./Categories"

interface SidebarProps {
    tasks: Task[]
    categories: Category[]
    activeSection: string
    activeCategoryId: number | null
    setActiveSection: (section: string) => void
    onAddCategory: (category: Category) => void
    onDeleteCategory: (id: number) => void
    onSelectCategory: (id: number) => void
    isOpen: boolean
    onClose: () => void
}

function Sidebar(props: SidebarProps) {
    return (
        <aside className={`sidebar ${props.isOpen ? "sidebar-open" : ""}`}>
            <Logo />

            <Navigation
                tasks={props.tasks}
                activeSection={props.activeSection}
                setActiveSection={props.setActiveSection}
            />

            <Categories
                tasks={props.tasks}
                categories={props.categories}
                activeCategoryId={props.activeCategoryId}
                onAddCategory={props.onAddCategory}
                onDeleteCategory={props.onDeleteCategory}
                onSelectCategory={props.onSelectCategory}
            />
        </aside>
    )
}

export default Sidebar
