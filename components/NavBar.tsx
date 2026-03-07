import React from "react"
import { Link } from "react-router-dom"
import { HeartPulse, ClipboardList, User, Info, LogOut } from "lucide-react"

interface NavbarProps {
    onLogout: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 md:top-0 md:bottom-auto md:bg-white md:border-b md:h-20 flex items-center">
            <div className="max-w-6xl mx-auto w-full px-6 flex justify-between items-center h-full">
                <Link
                    to="/"
                    className="hidden md:flex items-center gap-2 font-black text-2xl text-blue-600 italic"
                >
                    <HeartPulse size={32} />
                    MED
                    <span className="text-slate-900 font-extrabold not-italic">
                        QR
                    </span>
                </Link>

                <div className="flex w-full justify-around md:w-auto md:gap-8">
                    <NavLink
                        to="/"
                        icon={<ClipboardList size={22} />}
                        label="Status"
                    />
                    <NavLink
                        to="/edit"
                        icon={<User size={22} />}
                        label="Profile"
                    />
                    {/* <NavLink
                        to="/info"
                        icon={<Info size={22} />}
                        label="Info"
                    /> */}
                    <button
                        onClick={onLogout}
                        className="flex flex-col md:flex-row items-center gap-1 p-3 text-slate-400 hover:text-red-500 font-bold transition-colors"
                    >
                        <LogOut size={22} />
                        <span className="text-[10px] md:text-sm uppercase tracking-wider">
                            Logout
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    )
}

const NavLink = ({
    to,
    icon,
    label,
}: {
    to: string
    icon: React.ReactNode
    label: string
}) => (
    <Link
        to={to}
        className="flex flex-col md:flex-row items-center gap-1 p-3 text-slate-500 hover:text-blue-600 font-bold transition-colors"
    >
        {icon}
        <span className="text-[10px] md:text-sm uppercase tracking-wider">
            {label}
        </span>
    </Link>
)

export default Navbar
