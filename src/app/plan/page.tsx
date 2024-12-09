import PlanForm from "@/app/components/PlanForm";
import NavBar from "../components/NavBar";

const PlanPage = () => {
    return (
        <div className="min-h-screen">
            <NavBar />
            <div className="p-8 bg-gray-100">
                <h1 className="text-3xl font-bold mb-4">Planification de montée en niveau</h1>
                <PlanForm />
            </div>
        </div>
    );
};

export default PlanPage;
