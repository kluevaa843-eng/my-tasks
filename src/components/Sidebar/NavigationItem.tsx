import type { LucideIcon } from "lucide-react"

type NavigationItemProps = {
    icon: LucideIcon;
    label: string;
    count: number;
}
interface ExtendedNavigationItemProps extends NavigationItemProps {
  active: boolean;
  onClick: () => void;
}


function NavigationItem(props: ExtendedNavigationItemProps) {
    const Icon = props.icon
    return (
        <li
        onClick={props.onClick}
        className={props.active ? 'active' : ''}>
            <span className="nav-icon"><Icon /></span>
            <span className="nav-label">{props.label}</span>
            <span className="nav-count">{props.count}</span>
        </li>
    )
}

export default NavigationItem