
import { Trash2 } from "lucide-react"

type CategoryItemProps = {
    id: number
    color: string
    name: string
    onDelete: (id: number) => void
    onClick: (id: number) => void
    count: number
    active: boolean
}

function CategoryItem(props: CategoryItemProps) {
    return (
        <div
            className={`category-item ${props.active ? "active" : ""}`}
            onClick={() => props.onClick(props.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    props.onClick(props.id)
                }
            }}
        >
            <span
                className="category-color"
                style={{ backgroundColor: props.color }}
            />

            <span className="category-name">{props.name}</span>

            <button
                type="button"
                aria-label="Удалить категорию"
                onClick={(event) => {
                    event.stopPropagation()
                    props.onDelete(props.id)
                }}
            >
                <Trash2 size={16} />
            </button>

            <span className="category-count">{props.count}</span>
        </div>
    )
}

export default CategoryItem
