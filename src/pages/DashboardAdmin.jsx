import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChartSDG from "../components/ChartSDG";
import Notifications from "../components/Notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDashboard } from "@fortawesome/free-solid-svg-icons";

const DashboardAdmin = () => {
    const [ID, setID] = useState(localStorage.getItem("ID"));
    const [ROLE, setROLE] = useState(localStorage.getItem("ROLE"));

    useEffect(() => {
        if (!ID) {
            window.location.href = "/login";
        }
    }, [ID]);

    return (
        <section className="dashboard bg-white h-screen">
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <div className="p-4">
                    <div className="header flex justify-between items-center">
                        <h3 className="text-3xl font-bold text-gray-700 title">
                            <FontAwesomeIcon
                                icon={faDashboard}
                                className="mr-2"
                            />
                            Dashboard
                        </h3>
                        {ROLE === "sdo" && <Notifications />}
                    </div>
                    <hr className="my-5 border-gray-300 border-1" />
                    <ChartSDG />{" "}
                    <hr className="my-5 border-gray-300 border-1" />
                </div>
            </div>
        </section>
    );
};

export default DashboardAdmin;
