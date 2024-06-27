import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { storage } from "../firebase";
import { uploadBytes, ref } from "firebase/storage";

const AddRecord = ({ selectedYear, selectedSDG, setShowModal }) => {
    const [ID, setID] = useState(localStorage.getItem("ID"));
    const [sdgs, setSdgs] = useState([]);
    const [records, setRecords] = useState([]);
    const [sdgID, setSdgID] = useState(selectedSDG);
    const [instruments, setInstruments] = useState([]);

    const [instrumentID, setInstrumentID] = useState("");
    const [name, setName] = useState("");
    const [section, setSection] = useState("");
    const [recordID, setRecordID] = useState("");
    const [recordFiles, setRecordFiles] = useState([]);
    const [recordValues, setRecordValues] = useState({});
    const [tags, setTags] = useState([]);
    const [requestID, setRequestID] = useState("");

    const [totalCount, setTotalCount] = useState(0);

    const handleInputChange = (record_id, value) => {
        setRecordValues((prevValues) => ({
            ...prevValues,
            [record_id]: value,
        }));
    };

    useEffect(() => {
        const fetchInstruments = async () => {
            const response = await fetch(
                "https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/getInstruments"
            );
            const data = await response.json();
            if (response.ok) {
                //srot by instrument number
                setInstruments(
                    data.sort(
                        (a, b) => a.instrument_number - b.instrument_number
                    )
                );
            }
        };

        const fetchTags = async () => {
            const response = await fetch(
                `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/sdg/`
            );
            const data = await response.json();
            if (response.ok) {
                setSdgs(data);
            }
        };

        fetchInstruments();
        fetchTags();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/record/`
            );
            const data = await response.json();
            if (response.ok) {
                setRecords(data);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setRecordValues([]);
        records.map((record) => {
            if (record.sdg_id === sdgID) {
                setRecordValues((prevValues) => ({
                    ...prevValues,
                    [record.record_id]:
                        record.rtype === "number"
                            ? 0
                            : tags.find(
                                  (tag) => tag.record_id === record.record_id
                              )?.option_value || "",
                }));
            }
        });
    }, [sdgID, selectedYear, records]);

    useEffect(() => {
        console.log(recordValues);
    }, [recordValues]);

    const handleFileInputChange = (files, instrument_id) => {
        const newFileEntry = { file: files[0], instrument_id };
        setRecordFiles((prevFiles) => [...prevFiles, newFileEntry]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const record_data_id = "RD" + Math.floor(Math.random() * 100000);
        const formData = new FormData();
        formData.append("record_data_id", record_data_id);
        formData.append("record_date", new Date().toISOString().slice(0, 10));
        formData.append("record_status", "For Approval");
        formData.append("unit_id", ID);
        const formJSON = {
            record_data_id: record_data_id,
            record_status: "For Approval",
            unit_id: ID,
            //get the currenct date but the year is the selected year
            record_date: `${selectedYear}-${new Date()
                .toISOString()
                .slice(5, 10)}`,
        };
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, submit it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(
                    "https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/record_data",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formJSON),
                    }
                );

                const data = await response.json();
                if (data.record_data_id) {
                    const recordDataID = data.record_data_id;

                    for (const key in recordValues) {
                        const value = recordValues[key];
                        const values = {
                            record_data_id: recordDataID,
                            record_data_value: value,
                            record_id: key,
                        };

                        const response = await fetch(
                            "https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/record_value",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(values),
                            }
                        );
                        const responseData = await response.json();
                    }
                    recordFiles.map(async (fileEntry) => {
                        const file = fileEntry.file; // Accessing the file object from the fileEntry
                        const instrument_id = fileEntry.instrument_id; // Accessing the instrument_id

                        const filePayload = {
                            file: file.name,
                            record_data_id: recordDataID,
                            file_extension: file.name
                                .split(".")
                                .pop()
                                .toLowerCase(),
                        };

                        if (file) {
                            try {
                                const storageRef = ref(
                                    storage,
                                    `evidence/${filePayload.file}`
                                );
                                const fileRef = await uploadBytes(
                                    storageRef,
                                    file
                                );

                                const fileResponse = await fetch(
                                    "https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/file",
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(filePayload),
                                    }
                                );

                                if (!fileResponse.ok) {
                                    throw new Error(
                                        `HTTP error! Status: ${fileResponse.status}`
                                    );
                                }

                                const fileData = await fileResponse.json();
                            } catch (error) {
                                console.error("Error uploading file:", error);
                            }
                        }
                    });
                }
            }
        });
    };

    //getOptions
    useEffect(() => {
        const getOptions = async () => {
            const response = await fetch(
                `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/getOptions`
            );
            const data = await response.json();
            setTags(data);
        };

        getOptions();
    }, []);

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="p-6 space-y-6">
                <div className="flex flex-col">
                    <h5 className="font-medium">Instrument</h5>
                </div>
                {/* <div className="flex flex-col">
                    SDG
                    <select
                        id="sdg"
                        name="sdg"
                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        onChange={(e) => {
                            setSdgID(e.target.value);
                        }}
                    >
                        <option value="" disabled selected>
                            Select SDG
                        </option>
                        {sdgs.map((sdg, index) => (
                            <option key={sdg.sdg_id} value={sdg.sdg_id}>
                                SDG {index + 1}: {sdg.sdg_name}
                            </option>
                        ))}
                    </select>
                </div> */}

                {sdgID &&
                    instruments.map(
                        (instrument) =>
                            instrument.status === "Active" &&
                            instrument.sdg_id === sdgID && (
                                <div
                                    key={instrument.instrument_id}
                                    className="mb-4"
                                >
                                    <h5 className="font-medium">
                                        Subtitle: {instrument.name}
                                    </h5>
                                    <p className="text-gray-600">
                                        Section: {instrument.section}
                                    </p>
                                    {/* Filter questions for this subtitle and section */}
                                    {records
                                        .filter(
                                            (record) =>
                                                record.instrument_id ===
                                                instrument.instrument_id
                                        )
                                        .map((record) => (
                                            <div
                                                key={record.record_id}
                                                className="mb-4"
                                            >
                                                {record.rtype === "number" ? (
                                                    <>
                                                        {" "}
                                                        <label
                                                            htmlFor={`record-${record.record_id}`}
                                                            className="text-sm font-semibold text-gray-600"
                                                        >
                                                            {record.record_name}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id={`record-${record.record_id}`}
                                                            name={`record-${record.record_id}`}
                                                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                            min="0"
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    record.record_id,
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
                                                                        10
                                                                    )
                                                                )
                                                            }
                                                            value={
                                                                recordValues[
                                                                    record
                                                                        .record_id
                                                                ] !== undefined
                                                                    ? recordValues[
                                                                          record
                                                                              .record_id
                                                                      ]
                                                                    : 0
                                                            }
                                                            required
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <label
                                                            htmlFor={`record-${record.record_id}`}
                                                            className="text-sm font-semibold text-gray-600"
                                                        >
                                                            {record.record_name}
                                                        </label>
                                                        <select
                                                            id={`record-${record.record_id}`}
                                                            name={`record-${record.record_id}`}
                                                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    record.record_id,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={
                                                                recordValues[
                                                                    record
                                                                        .record_id
                                                                ] !== undefined
                                                                    ? recordValues[
                                                                          record
                                                                              .record_id
                                                                      ]
                                                                    : ""
                                                            }
                                                            required
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                                selected
                                                            >
                                                                Select an option
                                                            </option>
                                                            {tags
                                                                .filter(
                                                                    (tag) =>
                                                                        tag.record_id ===
                                                                        record.record_id
                                                                )
                                                                .map((tag) => (
                                                                    <option
                                                                        key={
                                                                            tag.option_id
                                                                        }
                                                                        value={
                                                                            tag.option_value
                                                                        }
                                                                    >
                                                                        {
                                                                            tag.option_value
                                                                        }
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    </>
                                                )}
                                            </div>
                                        ))}

                                    <div className="mb-4">
                                        <label
                                            htmlFor={`file-${instrument.instrument_id}`}
                                            className="text-sm font-semibold text-gray-600"
                                        >
                                            Upload Evidence
                                        </label>
                                        <input
                                            type="file"
                                            id={`file-${instrument.instrument_id}`}
                                            name={`file-${instrument.instrument_id}`}
                                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                            onChange={(e) =>
                                                handleFileInputChange(
                                                    e.target.files,
                                                    instrument.instrument_id
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            )
                    )}
            </div>

            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                <button
                    data-modal-hide="default-modal"
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                    {/* Display count of non-NaN, undefined, and null values in recordValues over totalCount */}
                    Submit
                    {/* (
                                {
                                    Object.keys(recordValues).filter(
                                        (key) =>
                                            recordValues[key] !== null &&
                                            recordValues[key] !== undefined &&
                                            !isNaN(recordValues[key])
                                    ).length
                                }
                                {/* divdetotacl count of record per selected sdg */}
                    {/* /{totalCount}) */}
                </button>
                <button
                    data-modal-hide="default-modal"
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                    onClick={() => setShowModal(false)}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default AddRecord;
