import React, { useState, useEffect } from "react";

const Card = ({ sdg }) => {
    const [groupedInstruments, setGroupedInstruments] = useState([]);
    const [instruments, setInstruments] = useState([]);
    const [records, setRecords] = useState([]);
    const [tOptions, setTOptions] = useState([]);
    const [recordData, setRecordData] = useState([]);
    const sid = localStorage.getItem("sdo");
    useEffect(() => {
        const getInstruments = async () => {
            try {
                const response = await fetch(
                    `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/instrument/sdg/${sdg}`
                );
                const jsonData = await response.json();
                setInstruments(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        };
        const getRecords = async () => {
            try {
                const response = await fetch(
                    `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/record/sdg/${sdg}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch records");
                }
                const data = await response.json();
                setRecords(data);
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

        const getRecordData = async () => {
            try {
                const response = await fetch(
                    `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/record_data/status`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch record data");
                }
                const data = await response.json();
                setRecordData(data);
            } catch (error) {
                console.error("Error fetching record data:", error);
            }
        };

        getInstruments();
        getRecords();
        getOptions();
        // getRecordData();
    }, [sdg]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getRecordValue = async (id) => {
                    try {
                        const response = await fetch(
                            `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/getRecordValue/${id}/${sid}`
                        );
                        const jsonData = await response.json();

                        return jsonData;
                    } catch (err) {
                        console.error(err.message);
                    }
                };

                const groupedData = await Promise.all(
                    instruments.map(async (instrument) => {
                        const filteredRecords = records.filter(
                            (record) =>
                                record.instrument_id ===
                                instrument.instrument_id
                        );

                        // Get record values for each record
                        const recordValuesPromises = filteredRecords.map(
                            async (record) => {
                                const recordValue = await getRecordValue(
                                    record.record_id
                                );
                                return recordValue;
                            }
                        );

                        // Wait for all record values promises to resolve
                        const recordValues = await Promise.all(
                            recordValuesPromises
                        );
                        // Add record values to each record in filteredRecords
                        const filteredRecordsWithValues = filteredRecords.map(
                            (record, index) => ({
                                ...record,
                                record_values: recordValues[index]
                                    ? recordValues[index]
                                    : null, // Add record values to each record
                            })
                        );

                        return {
                            instrument_id: instrument.instrument_id,
                            name: instrument.name,
                            section: instrument.section,
                            records: filteredRecordsWithValues, // Include record_values in the return object
                        };
                    })
                );

                // Once all data is fetched and processed, update the state
                setGroupedInstruments(groupedData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [instruments, records, tOptions, recordData]);

    return (
        <div className="card w-full border">
            <div className="card-body border w-full">
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <tbody>
                        {groupedInstruments ? (
                            groupedInstruments.map((instrument) => (
                                <tr
                                    key={instrument.instrument_id}
                                    className="border-b border-gray-200"
                                >
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="font-semibold text-lg">
                                                {instrument.name}
                                            </p>
                                            <p className="text-gray-600">
                                                {instrument.section}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 mt-4">
                                            {instrument.records.length > 0 &&
                                                instrument.records.map(
                                                    (record) => (
                                                        <div
                                                            key={
                                                                record.record_id
                                                            }
                                                            className="p-2 bg-gray-100 rounded-lg min-h-[100px]"
                                                        >
                                                            <p className="text-sm">
                                                                {
                                                                    record.record_name
                                                                }
                                                            </p>
                                                            {record.record_values &&
                                                            record.record_values
                                                                .length > 0 ? (
                                                                <ul className="mt-1 ml-2">
                                                                    <li>
                                                                        <p className="text-3xl text-blue-500">
                                                                            {record.rtype ===
                                                                            "number"
                                                                                ? record.record_values.reduce(
                                                                                      (
                                                                                          acc,
                                                                                          curr
                                                                                      ) =>
                                                                                          acc +
                                                                                          parseFloat(
                                                                                              curr.value
                                                                                          ),
                                                                                      0
                                                                                  )
                                                                                : record
                                                                                      .record_values[0]
                                                                                      .value}
                                                                        </p>
                                                                    </li>
                                                                </ul>
                                                            ) : (
                                                                <p className="text-3xl text-blue-500">
                                                                    0
                                                                </p>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="py-4 px-6">
                                    <div>
                                        <p className="font-semibold text-lg">
                                            Loading data...
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Card;
