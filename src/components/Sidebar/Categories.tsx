
import CategoryItem from "./CategoryItem"
import { Plus, X } from "lucide-react"
import { useState } from "react"
import type { Category, Task } from "../../types/Task"

type CategoriesProps = {
    tasks: Task[]
    categories: Category[]
    activeCategoryId: number | null
    onAddCategory: (category: Category) => void
    onDeleteCategory: (id: number) => void
    onSelectCategory: (id: number) => void
}

function hslToHex(h: number, s: number, l: number) {
    s /= 100
    l /= 100

    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
        const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
        return Math.round(255 * color).toString(16).padStart(2, "0")
    }

    return `#${f(0)}${f(8)}${f(4)}`
}

function Categories({
    tasks,
    categories,
    activeCategoryId,
    onAddCategory,
    onDeleteCategory,
    onSelectCategory
}: CategoriesProps) {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [categoryName, setCategoryName] = useState("")
    const [categoryColor, setCategoryColor] = useState("#f1aab6")

    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
    const [hue, setHue] = useState(350)
    const [saturation, setSaturation] = useState(70)
    const [lightness, setLightness] = useState(80)
    const [draftColor, setDraftColor] = useState("#f5a3b0")

    function openColorPicker() {
        setDraftColor(categoryColor)
        setIsColorPickerOpen(true)
    }

    function updateColor(h: number, s: number, l: number) {
        const newColor = hslToHex(h, s, l)
        setDraftColor(newColor)
    }

    function handleChooseColor() {
        setCategoryColor(draftColor)
        setIsColorPickerOpen(false)
    }

    function handleAddCategory() {
        if (!categoryName.trim()) return

        const newCategory: Category = {
            id: Date.now(),
            name: categoryName.trim(),
            color: categoryColor
        }

        onAddCategory(newCategory)

        setCategoryName("")
        setCategoryColor("#f1aab6")
        setIsFormOpen(false)
    }

    return (
        <section className="categories">
            <div className="categories-header">
                <h3 className="categories-title">
                    Категории
                </h3>

                <button
                    aria-label="Добавить категорию"
                    className="add-category-btn"
                    onClick={() => setIsFormOpen(!isFormOpen)}
                >
                    <Plus />
                </button>
            </div>

            {isFormOpen && (
                <form onSubmit={(e) => e.preventDefault()}>
                    <label>Название категории</label>

                    <input
                        type="text"
                        value={categoryName}
                        placeholder="например, работа"
                        onChange={(e) => setCategoryName(e.target.value)}
                    />

                    <div className="color-picker">
                        <button
                            type="button"
                            className="color-picker-trigger"
                            onClick={openColorPicker}
                        >
                            <span
                                className="color-preview"
                                style={{ backgroundColor: categoryColor }}
                            />
                            <span>Выбрать цвет</span>
                        </button>

                        <span className="color-hex">
                            {categoryColor}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddCategory}
                    >
                        Добавить категорию
                    </button>
                </form>
            )}

            {isColorPickerOpen && (
                <div
                    className="color-modal-overlay"
                    onClick={() => setIsColorPickerOpen(false)}
                >
                    <div
                        className="color-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Выбор цвета категории"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="color-modal-header">
                            <h3>Выбор цвета</h3>

                            <button
                                type="button"
                                className="color-modal-close"
                                aria-label="Закрыть"
                                onClick={() => setIsColorPickerOpen(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div
                            className="color-modal-preview"
                            style={{ backgroundColor: draftColor }}
                        />

                        <div className="color-modal-value">
                            {draftColor.toUpperCase()}
                        </div>

                        <div className="color-slider-group">
                            <div className="color-slider-heading">
                                <label htmlFor="hue-slider">Оттенок</label>
                                <span>{hue}°</span>
                            </div>

                            <input
                                id="hue-slider"
                                className="hue-slider"
                                type="range"
                                min="0"
                                max="360"
                                value={hue}
                                onChange={(e) => {
                                    const value = Number(e.target.value)
                                    setHue(value)
                                    updateColor(value, saturation, lightness)
                                }}
                            />
                        </div>

                        <div className="color-slider-group">
                            <div className="color-slider-heading">
                                <label htmlFor="saturation-slider">Насыщенность</label>
                                <span>{saturation}%</span>
                            </div>

                            <input
                                id="saturation-slider"
                                type="range"
                                min="0"
                                max="100"
                                value={saturation}
                                onChange={(e) => {
                                    const value = Number(e.target.value)
                                    setSaturation(value)
                                    updateColor(hue, value, lightness)
                                }}
                            />
                        </div>

                        <div className="color-slider-group">
                            <div className="color-slider-heading">
                                <label htmlFor="lightness-slider">Яркость</label>
                                <span>{lightness}%</span>
                            </div>

                            <input
                                id="lightness-slider"
                                type="range"
                                min="20"
                                max="90"
                                value={lightness}
                                onChange={(e) => {
                                    const value = Number(e.target.value)
                                    setLightness(value)
                                    updateColor(hue, saturation, value)
                                }}
                            />
                        </div>

                        <div className="color-modal-actions">
                            <button
                                type="button"
                                className="color-cancel-btn"
                                onClick={() => setIsColorPickerOpen(false)}
                            >
                                Отмена
                            </button>

                            <button
                                type="button"
                                className="color-confirm-btn"
                                onClick={handleChooseColor}
                            >
                                Выбрать
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="categories-list">
                {categories.map((category) => {
                    const count = tasks.filter(
                        (task) => task.category?.id === category.id
                    ).length

                    return (
                        <CategoryItem
                            key={category.id}
                            id={category.id}
                            name={category.name}
                            color={category.color}
                            count={count}
                            active={activeCategoryId === category.id}
                            onClick={onSelectCategory}
                            onDelete={onDeleteCategory}
                        />
                    )
                })}
            </div>
        </section>
    )
}

export default Categories
