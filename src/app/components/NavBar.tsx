import Link from "next/link";

const NavBar: React.FC = () => {
    return (
        <nav className="bg-gray-800 text-white py-4 px-6 flex items-center justify-between">
            {/* Logo + Nom du site */}
            <Link href="/" className="flex items-center space-x-2 hover:underline">
                <img
                    src="/logo.png"
                    alt="Logo de L'Almanach de Maraf"
                    className="w-10 h-10"
                />
                <span className="text-xl font-bold">L'Almanach de Maraf</span>
            </Link>

            {/* Liens de navigation */}
            <div className="flex space-x-4">
                <Link href="/items" className="hover:underline">
                    Objets
                </Link>
                <Link href="/crafts" className="hover:underline">
                    Crafts
                </Link>
                <Link href="/plan" className="hover:underline">
                    Planification
                </Link>
                <Link href="/monsters" className="hover:underline">
                    Monstres
                </Link>
                <Link href="/equipement" className="hover:underline">
                    Équipements
                </Link>
                <Link href="/zones" className="hover:underline">
                    Zones
                </Link>
                <Link href="/items/power" className="hover:underline">
                    Puissance
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;
