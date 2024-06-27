import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import logo from "../assets/logo-1267x1283.png";
import {
    faDashboard,
    faUser,
    faBuilding,
    faFileAlt,
    faCheck,
    faUsers,
    faChartBar,
    faBook,
    faSignOut,
    faTools,
    faGear,
} from "@fortawesome/free-solid-svg-icons";
import bsuLOGO from "../assets/bsu-logo.png";

const Sidebar = () => {
    const location = useLocation();

    const [role, setRole] = useState(localStorage.getItem("ROLE"));
    const [name, setName] = useState(localStorage.getItem("NAME"));
    const [links, setLinks] = useState([]);
    const [sideMenu, setSideMenu] = useState(false);

    useEffect(() => {
        if (role === "csd") {
            setLinks([
                {
                    url: "/csd/sd/dashboard",
                    text: "Dashboard",
                    icon: faDashboard,
                },
                {
                    url: "/csd/sd-officers",
                    text: "SD Officers",
                    icon: faUser,
                },
                // {
                //     url: "/csd/units",
                //     text: "Units",
                //     icon: faBuilding,
                // },
                // {
                //     url: "/csd/annual-reports",
                //     text: "Annual Reports",
                //     icon: faBook,
                // },
                {
                    url: "/csd/instruments",
                    text: "Instruments",
                    icon: faTools,
                },
                {
                    url: "/csd/admin/records",
                    text: "Records",
                    icon: faFileAlt,
                },
            ]);
        } else if (role === "sdo") {
            setLinks([
                {
                    url: "/csd/dashboard",
                    text: "Dashboard",
                    icon: faDashboard,
                },

                {
                    url: "/csd/sd/records",
                    text: "Records",
                    icon: faFileAlt,
                },
                // {
                //     url: "/csd/annual-reports",
                //     text: "Annual Reports",
                //     icon: faBook,
                // },
            ]);
        } else if (role === "unit") {
            setLinks([
                {
                    url: "/csd/records",
                    text: "Records",
                    icon: faFileAlt,
                },
                {
                    url: "/csd/annual-reports",
                    text: "Annual Reports",
                    icon: faBook,
                },
            ]);
        }
    }, [role]);

    return (
        <aside
            id="default-sidebar"
            className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
            aria-label="Sidebar"
        >
            <div className="h-full px-3 py-4 overflow-y-auto bg-[#E6243B] shadow-xl relative">
                <div className="flex items-center justify-between mb-5">
                    <img src={logo} alt="logo" className="w-16 h-16 mx-auto" />
                    <h3 className="text-2xl font-semibold text-white">
                        CSD Dashboard
                    </h3>
                </div>
                <hr className="my-5" />
                <ul className="space-y-2">
                    {links.map((link, index) => (
                        <li key={index}>
                            <a
                                href={link.url}
                                className={`flex items-center py-2 px-3 rounded-sm text-base transition-colors duration-200 ${
                                    location.pathname === link.url ||
                                    (location.pathname.includes("instrument") &&
                                        link.url.includes("instrument"))
                                        ? "bg-white text-gray-800"
                                        : "text-white hover:bg-white hover:text-gray-800"
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={link.icon}
                                    className="mr-2"
                                />
                                {link.text}
                            </a>
                        </li>
                    ))}
                    {/* Add logout item here */}
                    <li>
                        <button
                            className={`flex flex-col items-start border-gray-500 p-2 rounded-sm text-gray-100 hover:bg-white hover:text-gray-800 w-full text-base transition-colors duration-200 ${
                                sideMenu ? "" : "bg-white text-gray-800"
                            }`}
                            onClick={() => {
                                setSideMenu(!sideMenu);
                            }}
                        >
                            <h6 className="text-base font-semibold">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="mr-2"
                                />
                                {name}
                            </h6>
                        </button>
                        <div
                            className={`w-full p-2 rounded-sm shadow-lg mt-2 z-2 top-0 right-0 transition-all duration-300 ${
                                sideMenu ? "bg-white" : "bg-transparent"
                            }`}
                            style={{
                                display: sideMenu ? "block" : "none",
                            }}
                        >
                            <button
                                className="w-full h-1/2 text-left text-gray-800"
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.href = "/";
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faSignOut}
                                    className="mr-2"
                                />
                                Logout
                            </button>
                        </div>
                    </li>
                </ul>
                <img
                    src={bsuLOGO}
                    alt="bsu-logo"
                    className="opacity-20 w-[150px] absolute bottom-10 right-1/2 transform translate-x-1/2 z-1"
                />
            </div>
        </aside>
    );
};

export default Sidebar;
