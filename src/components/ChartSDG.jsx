import React, { useState, useEffect } from "react";
import Card from "./Card";
import SDG1 from "../assets/res/E-WEB-Goal-01.png";
import SDG2 from "../assets/res/E-WEB-Goal-02.png";
import SDG3 from "../assets/res/E-WEB-Goal-03.png";
import SDG4 from "../assets/res/E-WEB-Goal-04.png";
import SDG5 from "../assets/res/E-WEB-Goal-05.png";
import SDG6 from "../assets/res/E-WEB-Goal-06.png";
import SDG7 from "../assets/res/E-WEB-Goal-07.png";
import SDG8 from "../assets/res/E-WEB-Goal-08.png";
import SDG9 from "../assets/res/E-WEB-Goal-09.png";
import SDG10 from "../assets/res/E-WEB-Goal-10.png";
import SDG11 from "../assets/res/E-WEB-Goal-11.png";
import SDG12 from "../assets/res/E-WEB-Goal-12.png";
import SDG13 from "../assets/res/E-WEB-Goal-13.png";
import SDG14 from "../assets/res/E-WEB-Goal-14.png";
import SDG15 from "../assets/res/E-WEB-Goal-15.png";
import SDG16 from "../assets/res/E-WEB-Goal-16.png";
import SDG17 from "../assets/res/E-WEB-Goal-17.png";
import RecordPieChart from "./RecordPieChart";
import RecordBarChart from "./RecordBarchart";

const ChartSDG = () => {
    const [sdg, setSdg] = useState("SDG1");
    const [sdgName, setSdgName] = useState("No Poverty");
    const [role, setRole] = useState(localStorage.getItem("ROLE"));
    const [sdgs, setSdgs] = useState([
        { no: "01", id: "SDG1", name: "No Poverty", img: SDG1 },
        { no: "02", id: "SDG2", name: "Zero Hunger", img: SDG2 },
        { no: "03", id: "SDG3", name: "Good Health and Well-being", img: SDG3 },
        { no: "04", id: "SDG4", name: "Quality Education", img: SDG4 },
        { no: "05", id: "SDG5", name: "Gender Equality", img: SDG5 },
        { no: "06", id: "SDG6", name: "Clean Water and Sanitation", img: SDG6 },
        {
            no: "07",
            id: "SDG7",
            name: "Affordable and Clean Energy",
            img: SDG7,
        },
        {
            no: "08",
            id: "SDG8",
            name: "Decent Work and Economic Growth",
            img: SDG8,
        },
        {
            no: "09",
            id: "SDG9",
            name: "Industry, Innovation, and Infrastructure",
            img: SDG9,
        },
        { no: "10", id: "SDG10", name: "Reduced Inequality", img: SDG10 },
        {
            no: "11",
            id: "SDG11",
            name: "Sustainable Cities and Communities",
            img: SDG11,
        },
        {
            no: "12",
            id: "SDG12",
            name: "Responsible Consumption and Production",
            img: SDG12,
        },
        { no: "13", id: "SDG13", name: "Climate Action", img: SDG13 },
        { no: "14", id: "SDG14", name: "Life Below Water", img: SDG14 },
        { no: "15", id: "SDG15", name: "Life on Land", img: SDG15 },
        {
            no: "16",
            id: "SDG16",
            name: "Peace, Justice, and Strong Institutions",
            img: SDG16,
        },
        {
            no: "17",
            id: "SDG17",
            name: "Partnerships for the Goals",
            img: SDG17,
        },
    ]);
    const [reloadKey, setReloadKey] = useState(0);
    const [sdOfficers, setSdOfficers] = useState([]);
    const [instruments, setInstruments] = useState([]);
    const [selectedOfficerIndex, setSelectedOfficerIndex] = useState(0);
    const [reload, setReload] = useState(false);

    useState(() => {
        if (role === "sdo") {
            localStorage.setItem("sdo", localStorage.getItem("ID"));
        }
    }, []);

    const [instrument, setInstrument] = useState(null);

    const handleSDGClick = (selectedSDG) => {
        setSdg(selectedSDG.id);
        setSdgName(selectedSDG.name);

        setReloadKey(reloadKey + 1);
        setReload(!reload);
    };

    const handleOfficerClick = (selectedOfficer) => {
        localStorage.setItem("sdo", selectedOfficer.sdo_officer_id);
        setReloadKey(reloadKey + 1);
        setReload(!reload);
    };

    const handleInstrumentClick = (event) => {
        const selectedInstrument = instruments[event.target.value];
        setInstrument(selectedInstrument);
        setReloadKey(reloadKey + 1);
        setReload(!reload);
    };

    useEffect(() => {
        const getSdOfficers = async () => {
            try {
                const response = await fetch(
                    `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/sdo_officer`
                );
                const jsonData = await response.json();
                setSdOfficers(
                    jsonData.sort((a, b) => a.campus_id - b.campus_id)
                );
                if (role !== "sdo") {
                    localStorage.setItem("sdo", jsonData[0].sdo_officer_id);
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        const getInstruments = async () => {
            try {
                const response = await fetch(
                    `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/getInstruments`
                );
                const jsonData = await response.json();
                setInstruments(jsonData);
                setInstrument(jsonData[0]);
            } catch (err) {
                console.error(err.message);
            }
        };

        getSdOfficers();
        getInstruments();
    }, []);

    function getCampusName(index) {
        switch (index) {
            case 0:
                return "Pablo Borbon Campus";
            case 1:
                return "Alangilan Campus";
            case 2:
                return "Lipa Campus";
            case 3:
                return "Malvar Campus";
            case 4:
                return "ARASOF - Nasugbu Campus";
            default:
                return "";
        }
    }
    return (
        <>
            {role !== "sdo" && (
                <>
                    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
                        <ul className="flex -mb-px">
                            {sdOfficers.map((sdOfficer, index) => (
                                <li
                                    className="me-2"
                                    key={sdOfficer.sdo_officer_id}
                                >
                                    <button
                                        className={`inline-block p-4 rounded-t-lg transition duration-500 ease-in-out ${
                                            selectedOfficerIndex === index
                                                ? "text-blue-600 border-b-2 border-blue-600 active font-semibold"
                                                : "text-gray-700 hover:text-gray-600 hover:border-gray-300"
                                        }`}
                                        onClick={() => {
                                            handleOfficerClick(
                                                sdOfficers[index]
                                            );
                                            setSelectedOfficerIndex(index);
                                        }}
                                    >
                                        SDO {index + 1} : {getCampusName(index)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}

            <div className="grid grid-cols-3 gap-4 my-5">
                <RecordPieChart />
                <RecordBarChart />
            </div>

            <div className="form-group">
                <div className="grid grid-cols-17 gap-1">
                    {sdgs.map((sdg) => (
                        <img
                            src={sdg.img}
                            style={{
                                cursor: "pointer",
                            }}
                            alt={`SDG ${sdg}`}
                            key={sdg.id}
                            onClick={() => handleSDGClick(sdg)}
                        />
                    ))}
                </div>
                <div className="my-5 flex justify-between items-end">
                    <h1 className="text-xl font-bold title text-red-500">
                        {sdgName}
                    </h1>
                    {/* <div className="filter-group flex flex-row items-center gap-2">
                        <h1 className="text-base text-gray-700 mb-1">
                            Filter by Instrument
                        </h1>
                        <select
                            className="form-select bg-white rounded-lg p-2 border border-gray-200 hover:border-blue-500 focus:outline-none w-[20rem]"
                            onChange={(event) => handleInstrumentClick(event)}
                        >
                            {instruments.map((instrument, index) => (
                                <option
                                    value={index}
                                    key={instrument.instrument_id}
                                >
                                    {instrument.name}
                                </option>
                            ))}
                        </select>
                    </div> */}
                </div>

                <hr className="my-5 border-gray-300 border-1" />
            </div>
            <div className="w-full">
                {sdg && localStorage.getItem("sdo") && (
                    <Card sdg={sdg} key={reloadKey} />
                )}
            </div>
        </>
    );
};

export default ChartSDG;
