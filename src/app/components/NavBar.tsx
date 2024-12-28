import Link from "next/link";

const NavBar: React.FC = () => {
    return (
        <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between">
            <Link href="/" className="text-xl font-bold hover:underline">
                Dofus Leveling
            </Link>
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
                <Link href="/resources" className="hover:underline">
                    Ressources Rentables
                </Link>
                <Link href="/monsters" className="hover:underline">
                    Monstres
                </Link>
                <Link href="/equipement" className="hover:underline">
                    Equipements
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;
