import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";
import ViewRecords from "../components/ViewRecords";
import AddRecord from "../components/AddRecord";

const Records = () => {
    const [selectedYear, setSelectedYear] = useState("2023");
    const [recordDataId, setRecordDataId] = useState("");
    const [selectedSDG, setSelectedSDG] = useState("SDG1");

    useEffect(() => {
        console.log(selectedYear, selectedSDG);
    }, [selectedYear, selectedSDG]);
    useEffect(() => {
        const getRecordDataId = async () => {
            try {
                const response = await fetch(
                    `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/recordy_data/${selectedYear}/${localStorage.getItem(
                        "ID"
                    )}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch record data");
                }
                const data = await response.json();
                setRecordDataId(data[0].record_data_id);

                data.map(async (record) => {
                    console.log(record, "record");

                    // router.get("/getSDGA/:id/:sdg_id", async (req, res) => {
                    //     //record_table to eget sdg_id column from record_table inner join with record_data_table sing consditoin record data id
                    //     try {
                    //         const { id, sdg_id } = req.params;
                    //         const sdg = await pool.query(
                    //             "SELECT record_table.sdg_id inner join record_data_table on record_table.record_id = record_data_table.record_id where record_data_table.record_data_id = $1 and record_table.sdg_id = $2",
                    //             [id, sdg_id]
                    //         );
                    //         res.json(sdg.rows);
                    //     } catch (err) {
                    //         console.error(err.message);
                    //     }
                    // });

                    const getSDGA = async (id, sdg_id) => {
                        try {
                            const response = await fetch(
                                `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/getSDGA/${id}`
                            );
                            if (!response.ok) {
                                throw new Error("Failed to fetch record data");
                            }
                            const data2 = await response.json();
                            data2.map((record2) => {
                                console.log(record2, "record2");
                                if (record2.sdg_id === selectedSDG) {
                                    setRecordDataId(record2.record_data_id);
                                    return;
                                }
                            });
                        } catch (error) {
                            console.error("Error fetching record data:", error);
                        }
                    };

                    await getSDGA(record.record_data_id, selectedSDG);
                });
            } catch (error) {
                console.error("Error fetching record data:", error);
            }
        };

        getRecordDataId();
    }, [selectedYear, selectedSDG]);
    useEffect(() => {
        console.log(recordDataId, "recordDataId");
    }, [recordDataId]);
    const sdgOptions = [
        { value: "SDG1", label: "SDG 1 - No Poverty" },
        { value: "SDG2", label: "SDG 2 - Zero Hunger" },
        { value: "SDG3", label: "SDG 3 - Good Health and Well-being" },
        { value: "SDG4", label: "SDG 4 - Quality Education" },
        { value: "SDG5", label: "SDG 5 - Gender Equality" },
        { value: "SDG6", label: "SDG 6 - Clean Water and Sanitation" },
        { value: "SDG7", label: "SDG 7 - Affordable and Clean Energy" },
        { value: "SDG8", label: "SDG 8 - Decent Work and Economic Growth" },
        {
            value: "SDG9",
            label: "SDG 9 - Industry, Innovation and Infrastructure",
        },
        { value: "SDG10", label: "SDG 10 - Reduced Inequality" },
        {
            value: "SDG11",
            label: "SDG 11 - Sustainable Cities and Communities",
        },
        {
            value: "SDG12",
            label: "SDG 12 - Responsible Consumption and Production",
        },
        { value: "SDG13", label: "SDG 13 - Climate Action" },
        { value: "SDG14", label: "SDG 14 - Life Below Water" },
        { value: "SDG15", label: "SDG 15 - Life on Land" },
        {
            value: "SDG16",
            label: "SDG 16 - Peace, Justice and Strong Institutions",
        },
        { value: "SDG17", label: "SDG 17 - Partnerships for the Goals" },
    ];

    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        // Whenever selectedSDG changes, update reloadKey to trigger a re-render
        setReloadKey((prevKey) => prevKey + 1);
    }, [selectedSDG]);

    return (
        <>
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg h-full">
                    <h3 className="text-xl font-semibold text-gray-900">
                        View Record
                    </h3>
                    <div className="flex items-center justify-between mt-4 w-full">
                        <div className="flex items-center justify-between p-4 gap-2a border border-gray-200 rounded-md">
                            <select
                                className="w-32 px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                value={selectedYear || "2023"}
                                onChange={(e) =>
                                    setSelectedYear(e.target.value)
                                }
                            >
                                <option value="2023" selected>
                                    2023
                                </option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                            </select>
                            <select
                                className="px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                value={selectedSDG || "SDG1"}
                                onChange={(e) => setSelectedSDG(e.target.value)}
                            >
                                {sdgOptions.map((option, index) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                        selected={index === 0}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {recordDataId !== "" ? (
                        <ViewRecords
                            key={reloadKey}
                            selectedYear={selectedYear}
                            record_data_id={recordDataId}
                            selectedSDG={selectedSDG}
                            setRecordDataId={setRecordDataId}
                        />
                    ) : (
                        <AddRecord
                            key={reloadKey}
                            selectedYear={selectedYear}
                            selectedSDG={selectedSDG}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Records;
