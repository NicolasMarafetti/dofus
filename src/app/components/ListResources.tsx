interface Resource {
    id: string;
    name: string;
    price: number;
}

interface ListResourcesProps {
    resources: Resource[];
}

const ListResources: React.FC<ListResourcesProps> = ({ resources }) => {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Liste des Ressources</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Nom</th>
                        <th className="border border-gray-300 px-4 py-2">Prix</th>
                    </tr>
                </thead>
                <tbody>
                    {resources.map((resource) => (
                        <tr key={resource.id}>
                            <td className="border border-gray-300 px-4 py-2">{resource.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{resource.price} Kamas</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListResources;
