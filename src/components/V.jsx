import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AddRecord from "./AddRecord";

const V = ({ record_data_id, setViewRecordModal }) => {
    const role = localStorage.getItem("ROLE");
    const [instruments, setInstruments] = useState([]);
    const [records, setRecords] = useState([]);
    const [toptions, setTOptions] = useState([]);

    useEffect(() => {
        const getInstruments = async () => {
            try {
                const response = await fetch(
                    `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/getInstruments`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch instruments");
                }
                const data = await response.json();
                setInstruments(
                    data.sort(
                        (a, b) => a.instrument_number - b.instrument_number
                    )
                );
                console.log(data);
            } catch (error) {
                console.error("Error fetching instruments:", error);
            }
        };
        const getRecords = async () => {
            try {
                const response = await fetch(
                    `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/record_value/${record_data_id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch records");
                }
                const data = await response.json();
                setRecords(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching records:", error);
            }
        };
        const getOptions = async () => {
            try {
                const response = await fetch(
                    `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/toption`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch options");
                }
                const data = await response.json();
                setTOptions(data);
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        };

        getInstruments();
        if (record_data_id !== "") {
            getRecords();
        } else {
            setRecords([]);
        }
        getOptions();
    }, [record_data_id]);

    const [groupedRecords, setGroupedRecords] = useState([]);

    const handleInputChange = (value, index, groupIndex) => {
        setGroupedRecords((prevGroupedRecords) => {
            const updatedGroupedRecords = [...prevGroupedRecords];
            const updatedGroup = { ...updatedGroupedRecords[groupIndex] };
            const updatedRecords = [...updatedGroup.records];

            // Update the value of the record
            updatedRecords[index] = {
                ...updatedRecords[index],
                value: value,
            };

            // Update the records array in the group
            updatedGroup.records = updatedRecords;

            // Update the group in the grouped records array
            updatedGroupedRecords[groupIndex] = updatedGroup;

            return updatedGroupedRecords;
        });
    };

    // Whenever records change, update the grouped records
    useEffect(() => {
        const grouped = [];

        // Loop through each record
        records.forEach((record) => {
            // Get the instrument ID of the current record
            const instrumentId = record.instrument_id;

            // Find the index of the existing group for this instrument ID
            const groupIndex = grouped.findIndex(
                (group) => group.instrumentId === instrumentId
            );

            // If a group for this instrument ID doesn't exist, create a new one
            if (groupIndex === -1) {
                grouped.push({
                    instrumentId: instrumentId,
                    records: [record],
                    sdg_id: instruments?.find(
                        (instrument) =>
                            instrument.instrument_id === instrumentId
                    ).sdg_id,
                });
            } else {
                // If a group for this instrument ID already exists, add the record to it
                grouped[groupIndex].records.push(record);
            }
        });

        // Update the state with the new grouped records
        setGroupedRecords(grouped);
    }, [records]); // Trigger the effect whenever records change

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Iterate over the grouped records
            for (const group of groupedRecords) {
                // Iterate over the records in each group
                for (const record of group.records) {
                    const response = await fetch(
                        `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/update_record_values/${record.record_value_id}`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ value: record.value }),
                        }
                    );

                    if (!response.ok) {
                        throw new Error(
                            `Failed to update record value for record ID ${record.record_value_id}`
                        );
                    } else {
                        console.log(
                            "Record value updated successfully" +
                                record.record_value_id
                        );
                    }
                }
            }

            // Update the record data status if needed
            // This is just an example, adjust it according to your requirements
            await fetch(
                `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/record_data/${record_data_id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: "For Approval" }),
                }
            );

            // Show a success message
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Record values updated successfully!",
                timer: 1500,
            });
        } catch (error) {
            console.error("Error updating record values:", error);
            // Handle errors if necessary
        }
        window.location.reload();
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 space-y-6">
                    <table className="table-auto w-full">
                        <tbody>
                            {groupedRecords.length !== 0 &&
                                groupedRecords.map((group, groupIndex) => (
                                    <tr key={group.instrumentId}>
                                        <td className="text-sm font-semibold text-gray-600 p-4">
                                            <div className="mb-4">
                                                <span className="text-lg">
                                                    {/* find the instrument name from instruments */}
                                                    {
                                                        instruments.find(
                                                            (instrument) =>
                                                                instrument.instrument_id ===
                                                                group.instrumentId
                                                        )?.name
                                                    }
                                                </span>{" "}
                                                <br />
                                                <span className="text-gray-500">
                                                    Section:{" "}
                                                    {
                                                        instruments.find(
                                                            (instrument) =>
                                                                instrument.instrument_id ===
                                                                group.instrumentId
                                                        )?.section
                                                    }
                                                </span>
                                            </div>

                                            <div className="border border-gray-200 rounded-md p-4">
                                                {group.records.map(
                                                    (record, recordIndex) => (
                                                        <div
                                                            key={
                                                                record.record_value_id
                                                            }
                                                            className="flex items-center justify-between mb-2"
                                                        >
                                                            <div className="text-sm font-semibold text-gray-600">
                                                                {recordIndex +
                                                                    1}
                                                                .{" "}
                                                                {
                                                                    record.record_name
                                                                }
                                                            </div>
                                                            <div>
                                                                {record.rtype ===
                                                                "choice" ? (
                                                                    <select
                                                                        id={`record-${record.record_value_id}`}
                                                                        name={`record-${record.record_value_id}`}
                                                                        className="block px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                                        value={
                                                                            record.value
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleInputChange(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                recordIndex,
                                                                                groupIndex
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            role ===
                                                                            "csd"
                                                                        }
                                                                    >
                                                                        {toptions
                                                                            .filter(
                                                                                (
                                                                                    option
                                                                                ) => {
                                                                                    return (
                                                                                        option.record_id ===
                                                                                        record.record_id
                                                                                    );
                                                                                }
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    option
                                                                                ) => (
                                                                                    <option
                                                                                        key={
                                                                                            option.option_id
                                                                                        }
                                                                                        value={
                                                                                            option.option_id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            option.option_value
                                                                                        }
                                                                                    </option>
                                                                                )
                                                                            )}
                                                                    </select>
                                                                ) : (
                                                                    <input
                                                                        type="number"
                                                                        id={`record-${record.record_value_id}`}
                                                                        name={`record-${record.record_value_id}`}
                                                                        className="block w-24 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                                        value={
                                                                            record.value
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleInputChange(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                recordIndex,
                                                                                groupIndex
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            role ===
                                                                            "csd"
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                    <button
                        data-modal-hide="default-modal"
                        type="button"
                        className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                        onClick={() => setViewRecordModal(false)}
                    >
                        Close
                    </button>
                    {role !== "csd" && (
                        <button
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm font-medium px-5 py-2.5"
                            // onClick={handleSave}
                            onClick={handleSubmit}
                        >
                            Save
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default V;
