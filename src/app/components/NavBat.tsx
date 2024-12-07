import Link from "next/link";

const NavBar: React.FC = () => {
    return (
        <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between">
            <Link href="/" className="text-xl font-bold hover:underline">
                Dofus Leveling
            </Link>
            <div className="flex space-x-4">
                <Link href="/crafts" className="hover:underline">
                    Crafts
                </Link>
                <Link href="/plan" className="hover:underline">
                    Planification
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;
