import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-500">Dofus Leveling</h1>
      <p className="mt-4 text-lg">Optimisez la montée en niveau de vos métiers.</p>
      <Link
        href="/crafts"
        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Aller à la page des Crafts
      </Link>
    </div>
  );
}
