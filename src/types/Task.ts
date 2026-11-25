export type Category = {
    id: number
    name: string
    color: string
}

export type Task = {
    id: string
    title: string
    category: Category | null
    deadline: string
    createdAt: number
    isCompleted: boolean
    isImportant: boolean
}