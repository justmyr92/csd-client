import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTools } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const Instruments = () => {
    const [instruments, setInstruments] = useState([]);
    const [search, setSearch] = useState("");
    const [sdgIndicators, setSdgIndicators] = useState([]);
    const [record, setRecord] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editedRecords, setEditedRecords] = useState([]);
    const [reload, setReload] = useState(false);
    const SDGColors = [
        {
            sdg_id: "SDG1",
            color: "#E5243B",
        },
        {
            sdg_id: "SDG2",
            color: "#DDA63A",
        },
        {
            sdg_id: "SDG3",
            color: "#4C9F38",
        },
        {
            sdg_id: "SDG4",
            color: "#C5192D",
        },
        {
            sdg_id: "SDG5",
            color: "#FF3A21",
        },
        {
            sdg_id: "SDG6",
            color: "#26BDE2",
        },
        {
            sdg_id: "SDG7",
            color: "#FCC30B",
        },
        {
            sdg_id: "SDG8",
            color: "#A21942",
        },
        {
            sdg_id: "SDG9",
            color: "#FD6925",
        },
        {
            sdg_id: "SDG10",
            color: "#DD1367",
        },
        {
            sdg_id: "SDG11",
            color: "#FD9D24",
        },
        {
            sdg_id: "SDG12",
            color: "#BF8B2E",
        },
        {
            sdg_id: "SDG13",
            color: "#3F7E44",
        },
        {
            sdg_id: "SDG14",
            color: "#0A97D9",
        },
        {
            sdg_id: "SDG15",
            color: "#56C02B",
        },
        {
            sdg_id: "SDG16",
            color: "#00689D",
        },
        {
            sdg_id: "SDG17",
            color: "#19486A",
        },
    ];

    useEffect(() => {
        const getInstruments = async () => {
            try {
                const response = await fetch(
                    "https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/getInstrumentsSDG"
                );
                const jsonData = await response.json();
                if (search !== "") {
                    setInstruments(
                        jsonData
                            .filter(
                                (instrument) =>
                                    instrument.name
                                        .toLowerCase()
                                        .includes(search.toLowerCase()) ||
                                    instrument.status
                                        .toLowerCase()
                                        .includes(search.toLowerCase()) ||
                                    new Date(instrument.date_posted)
                                        .toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })
                                        .toLowerCase()
                                        .includes(search.toLowerCase())
                            )
                            .sort((a, b) => {
                                // Sort by sdg_no from lowest to highest
                                return a.sdg_no - b.sdg_no;
                            })
                    );
                } else {
                    setInstruments(
                        jsonData.sort((a, b) => a.sdg_no - b.sdg_no)
                    );

                    console.log(jsonData);
                }
            } catch (err) {
                console.error(err.message);
            }
        };
        getInstruments();
    }, [search]);

    const [page, setPage] = useState(1);
    const [instrument, setInstrument] = useState({});
    const [newRecords, setNewRecords] = useState([]);

    const viewRecord = (instrument) => {
        setInstrument(instrument);
        setPage(2);

        const getRecords = async () => {
            try {
                const response = await fetch(
                    `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/getRecords/${instrument.instrument_id}`
                );
                const jsonData = await response.json();
                setRecord(jsonData);

                setEditedRecords(jsonData.map((record) => ({ ...record })));
            } catch (err) {
                console.error(err.message);
            }
        };
        getRecords();
    };

    const groupRecordsBySdgId = (records) => {
        return records.reduce((grouped, record) => {
            const sdgId = record.sdg_id;

            if (!grouped[sdgId]) {
                grouped[sdgId] = [];
            }
            grouped[sdgId].push(record);
            return grouped;
        }, {});
    };

    useEffect(() => {
        const fetchSdgIndicators = async () => {
            const response = await fetch(
                "https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/sdg"
            );
            const data = await response.json();

            setSdgIndicators(data);
        };
        fetchSdgIndicators();
    }, []);

    useEffect(() => {
        console.log(editedRecords);
    }, [editedRecords]);

    const handleEditSubmit = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3B82F6",
            cancelButtonColor: "#EF4444",
            confirmButtonText: "Yes, update it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                editedRecords.map(async (record) => {
                    try {
                        console.log(record);
                        const response = await fetch(
                            `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/updateRecords`,
                            {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(record),
                            }
                        );
                        if (response.ok) {
                            console.log("Records updated successfully.");
                        } else {
                            console.error("Failed to update records.");
                        }
                    } catch (err) {
                        console.error(err.message);
                    }
                });
                try {
                    const response = await fetch(
                        `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/instrument/name/${instrument.instrument_id}`,
                        {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                name: instrument.name,
                                section: instrument.section,
                            }),
                        }
                    );
                    if (response.ok) {
                        console.log("Instrument status updated successfully.");
                    } else {
                        console.error("Failed to update instrument status.");
                    }
                } catch (err) {
                    console.error(err.message);
                }
                if (newRecords.length > 0) {
                    newRecords.map(async (record) => {
                        //add record id to the record object
                        record.record_id = Math.floor(
                            Math.random() * 100000000
                        );
                        try {
                            const response = await fetch(
                                `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/addRecord`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(record),
                                }
                            );
                            if (response.ok) {
                                console.log("Records added successfully.");
                            } else {
                                console.error("Failed to add records.");
                            }
                        } catch (err) {
                            console.error(err.message);
                        }
                    });
                }
                setReload(!reload);
                Swal.fire(
                    "Updated!",
                    "Your records have been updated.",
                    "success"
                ).then(() => {
                    window.location.href = "/csd/instruments";
                });
            }
        });

        setIsEdit(false);
        setRecord(editedRecords);
    };
    const updateInstrumentStatus = async (instrument_id, status) => {
        const instrument = {
            instrument_id: instrument_id,
            status: status === "Active" ? "Inactive" : "Active",
        };
        let setTitle = `Are you sure you want to set this instrument be ${status
            .toString()
            .toLowerCase()}`;
        Swal.fire({
            title: setTitle,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3B82F6",
            cancelButtonColor: "#EF4444",
            confirmButtonText: "Yes, update it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(
                        "https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/updateInstrumentStatus",
                        {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(instrument),
                        }
                    );
                    const data = await response.json();
                } catch (error) {
                    console.error(error);
                }
                window.location.href = "/csd/instruments";
            }
        });
    };

    const handleAddRecord = () => {
        setNewRecords([
            ...newRecords,
            {
                record_name: "",
                sdg_id: instrument.sdg_id,
                instrument_id: instrument.instrument_id,
            },
        ]);
    };

    useEffect(() => {
        console.log(newRecords);
    }, [newRecords]);

    const [tab, setTab] = useState(1);
    return (
        <section className="dashboard">
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <div className="p-4">
                    <div className="header flex justify-between items-center">
                        <h3 className="text-3xl font-bold text-gray-700 title">
                            <FontAwesomeIcon icon={faTools} className="mr-3" />
                            Instruments
                        </h3>
                        <div className="flex gap-2 items-center justify-end">
                            <Link
                                className="p-2 px-4 bg-blue-500 text-white rounded-lg"
                                to="/csd/instruments-form"
                            >
                                Add Instrument
                            </Link>
                            <div
                                className={`search relative ${
                                    page === 2 && "hidden"
                                }`}
                            >
                                <input
                                    className="p-2 pl-8 border-2 border-gray-500 rounded-lg"
                                    type="text"
                                    placeholder="Search"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <FontAwesomeIcon
                                    className="absolute top-3 left-3 text-gray-500"
                                    icon={faSearch}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="my-5 border-gray-300 border-1" />
                    {page === 1 && (
                        <div className="instruments">
                            <div className="tab">
                                <div className="tab-controls gap-2 flex">
                                    <button
                                        className={`tab-control ${
                                            tab === 1 && "bg-gray-200"
                                        } px-3 py-2`}
                                        onClick={() => setTab(1)}
                                    >
                                        Instruments
                                    </button>
                                    <button
                                        className={`tab-control ${
                                            tab === 2 && "bg-gray-200"
                                        } px-3 py-2`}
                                        onClick={() => setTab(2)}
                                    >
                                        Archives
                                    </button>
                                </div>
                            </div>
                            <DataTable
                                columns={[
                                    {
                                        name: "SDG",
                                        cell: (row) => (
                                            <div className="flex justify-between items-center gap-2">
                                                <p className="text-black">
                                                    {`No. ${
                                                        row.sdg_id &&
                                                        sdgIndicators.find(
                                                            (sdgItem) =>
                                                                sdgItem.sdg_id ===
                                                                row.sdg_id
                                                        )?.sdg_no
                                                    }
                                                `}
                                                </p>

                                                <p>
                                                    {
                                                        sdgIndicators.find(
                                                            (sdgItem) =>
                                                                sdgItem.sdg_id ===
                                                                row.sdg_id
                                                        )?.sdg_name
                                                    }
                                                </p>
                                            </div>
                                        ),
                                        sortable: true,
                                    },
                                    {
                                        name: "Name",
                                        selector: (row) => row.name,
                                        sortable: true,
                                    },
                                    // {
                                    //     name: "Status",
                                    //     cell: (row) => (
                                    //         <span
                                    //             className={`px-2 py-1 text-white rounded-lg text-xs font-medium ${
                                    //                 row.status === "Active"
                                    //                     ? "bg-green-500"
                                    //                     : "bg-red-500"
                                    //             }`}
                                    //         >
                                    //             {row.status}
                                    //         </span>
                                    //     ),
                                    //     sortable: true,
                                    // },
                                    {
                                        name: "Date Posted",
                                        selector: (row) =>
                                            new Date(
                                                row.date_posted
                                            ).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }),
                                        sortable: true,
                                    },
                                    {
                                        name: "Actions",
                                        cell: (row) => (
                                            <div className="flex justify-between items-center gap-2">
                                                <button
                                                    className="text-green-500 me-3"
                                                    onClick={() =>
                                                        viewRecord(row)
                                                    }
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className="text-red-500"
                                                    onClick={() => {
                                                        updateInstrumentStatus(
                                                            row.instrument_id,
                                                            row.status
                                                        );
                                                    }}
                                                >
                                                    Update Archive
                                                </button>
                                            </div>
                                        ),
                                    },
                                ]}
                                data={instruments.sort((a, b) => {
                                    // Sort by sdg_no from lowest to highest
                                    return a.sdg_no - b.sdg_no;
                                })}
                                pagination
                                highlightOnHover
                                pointerOnHover
                                striped
                                fixedHeader
                                className="border border-gray-200 rounded-md"
                            />
                        </div>
                    )}

                    {page === 2 && (
                        <>
                            <table className="table-auto w-full">
                                <tbody>
                                    <tr>
                                        <th className="border px-4 py-2 text-left font-semibold ">
                                            Subtitle
                                        </th>
                                        <td className="border px-4 py-2">
                                            {!isEdit ? (
                                                <p>{instrument.name}</p>
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="border px-2 py-3 border-gray-500 rounded-lg w-full"
                                                    value={instrument.name}
                                                    onChange={(e) => {
                                                        setInstrument({
                                                            ...instrument,
                                                            name: e.target
                                                                .value,
                                                        });
                                                    }}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="border px-4 py-2 text-left font-semibold ">
                                            Section
                                        </th>
                                        <td className="border px-4 py-2">
                                            {!isEdit ? (
                                                <p>{instrument.section}</p>
                                            ) : (
                                                <input
                                                    className="border px-2 py-3 border-gray-500 rounded-lg w-full"
                                                    value={instrument.section}
                                                    onChange={(e) => {
                                                        setInstrument({
                                                            ...instrument,
                                                            section:
                                                                e.target.value,
                                                        });
                                                    }}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                    {instrument && (
                                        <tr>
                                            <td
                                                className={`border px-4 py-2 text-white text-lg font-semibold text-center`}
                                                style={{
                                                    backgroundColor:
                                                        SDGColors &&
                                                        SDGColors.find(
                                                            (sdgItem) =>
                                                                sdgItem.sdg_id ===
                                                                instrument.sdg_id
                                                        ).color,
                                                }}
                                                colSpan={2}
                                            >
                                                Questionnaire
                                            </td>
                                        </tr>
                                    )}

                                    <tr>
                                        <td
                                            className="border px-4 py-2 bg-gray-100 font-semibold text-center"
                                            colSpan={2}
                                        >
                                            SDG{" "}
                                            {
                                                sdgIndicators.find(
                                                    (sdgItem) =>
                                                        sdgItem.sdg_id ===
                                                        instrument.sdg_id
                                                ).sdg_no
                                            }{" "}
                                            -{" "}
                                            {
                                                sdgIndicators.find(
                                                    (sdgItem) =>
                                                        sdgItem.sdg_id ===
                                                        instrument.sdg_id
                                                ).sdg_name
                                            }
                                        </td>
                                    </tr>
                                    {Object.keys(groupRecordsBySdgId(record))
                                        .sort((a, b) => {
                                            return parseInt(a) - parseInt(b);
                                        })
                                        .map((sdg_id) => (
                                            <React.Fragment key={sdg_id}>
                                                {groupRecordsBySdgId(record)[
                                                    sdg_id
                                                ].map(
                                                    (recordItem, index) =>
                                                        recordItem.record_name !==
                                                            "" && (
                                                            <tr key={index}>
                                                                <td
                                                                    className="border px-4 py-2"
                                                                    colSpan={2}
                                                                >
                                                                    {!isEdit ? (
                                                                        <div className="flex justify-between items-center gap-2">
                                                                            <p className="text-gray-700">
                                                                                {index +
                                                                                    1 +
                                                                                    ". " +
                                                                                    recordItem.record_name}
                                                                            </p>
                                                                            <p>
                                                                                {recordItem.record_status ===
                                                                                    "inactive" && (
                                                                                    <span className="px-2 py-1.5 rounded text-white text-center w-[5rem] bg-green-500">
                                                                                        Archived
                                                                                    </span>
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex justify-between items-center gap-2">
                                                                            <input
                                                                                className="border px-2 py-3 border-gray-500 rounded-lg w-full"
                                                                                type="text"
                                                                                value={
                                                                                    editedRecords.find(
                                                                                        (
                                                                                            record
                                                                                        ) =>
                                                                                            record.record_id ===
                                                                                            recordItem.record_id
                                                                                    )
                                                                                        .record_name
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    const newEditedRecords =
                                                                                        [
                                                                                            ...editedRecords,
                                                                                        ];
                                                                                    newEditedRecords.find(
                                                                                        (
                                                                                            record
                                                                                        ) =>
                                                                                            record.record_id ===
                                                                                            recordItem.record_id
                                                                                    ).record_name =
                                                                                        e.target.value;
                                                                                    setEditedRecords(
                                                                                        newEditedRecords
                                                                                    );
                                                                                }}
                                                                            />
                                                                            <td
                                                                                className="px-4 py-2"
                                                                                colSpan={
                                                                                    1
                                                                                }
                                                                            >
                                                                                <button
                                                                                    className="p-2 px-4 bg-green-500 text-white rounded-lg text-xs"
                                                                                    onClick={() => {
                                                                                        const newEditedRecords =
                                                                                            [
                                                                                                ...editedRecords,
                                                                                            ];
                                                                                        const updatedRecords =
                                                                                            newEditedRecords.map(
                                                                                                (
                                                                                                    record
                                                                                                ) =>
                                                                                                    record.record_id ===
                                                                                                    recordItem.record_id
                                                                                                        ? {
                                                                                                              ...record,
                                                                                                              record_status:
                                                                                                                  record.record_status ===
                                                                                                                  "active"
                                                                                                                      ? "inactive"
                                                                                                                      : "active",
                                                                                                          }
                                                                                                        : record
                                                                                            );

                                                                                        setEditedRecords(
                                                                                            updatedRecords
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    {editedRecords.find(
                                                                                        (
                                                                                            record
                                                                                        ) =>
                                                                                            record.record_id ===
                                                                                            recordItem.record_id
                                                                                    )
                                                                                        .record_status ===
                                                                                    "active" ? (
                                                                                        <span>
                                                                                            Archive
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span>
                                                                                            Unarchive
                                                                                        </span>
                                                                                    )}
                                                                                </button>
                                                                            </td>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                )}
                                                {/* genaeter input if theer is ite in the new Record */}
                                            </React.Fragment>
                                        ))}
                                    {isEdit &&
                                        newRecords.map((record, index) => (
                                            <tr key={index}>
                                                <td
                                                    className="border px-4 py-2"
                                                    colSpan={2}
                                                >
                                                    <div className="flex justify-between items-center gap-2">
                                                        <input
                                                            className="border px-2 py-3 border-gray-500 rounded-lg w-full"
                                                            type="text"
                                                            value={
                                                                record.record_name
                                                            }
                                                            onChange={(e) => {
                                                                const newRecordsCopy =
                                                                    [
                                                                        ...newRecords,
                                                                    ];
                                                                newRecordsCopy[
                                                                    index
                                                                ].record_name =
                                                                    e.target.value;
                                                                setNewRecords(
                                                                    newRecordsCopy
                                                                );
                                                            }}
                                                        />
                                                        <td
                                                            className="px-4 py-2"
                                                            colSpan={1}
                                                        >
                                                            <button
                                                                className="p-2 px-4 bg-red-500 text-white rounded-lg text-xs"
                                                                onClick={() => {
                                                                    const newRecordsCopy =
                                                                        [
                                                                            ...newRecords,
                                                                        ];
                                                                    newRecordsCopy.splice(
                                                                        index,
                                                                        1
                                                                    );
                                                                    setNewRecords(
                                                                        newRecordsCopy
                                                                    );
                                                                }}
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    {isEdit && (
                                        <tr>
                                            <td
                                                className="border px-4 py-2 text-lg font-semibold text-start"
                                                colSpan={2}
                                            >
                                                <button
                                                    onClick={handleAddRecord}
                                                    className="p-2 px-4 bg-blue-500 text-white rounded-lg w-fit"
                                                >
                                                    Add Record
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <hr className="my-5 border-gray-300 border-1" />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="p-2 px-4 bg-blue-500 text-white rounded-lg"
                                    onClick={() => {
                                        setPage(1);
                                        setIsEdit(false);
                                    }}
                                >
                                    Back
                                </button>

                                <button
                                    type="button"
                                    className="p-2 px-4 bg-blue-500 text-white rounded-lg"
                                    onClick={() => setIsEdit(!isEdit)}
                                >
                                    {isEdit ? "Cancel" : "Edit"}
                                </button>
                                {isEdit && (
                                    <button
                                        type="button"
                                        className="p-2 px-4 bg-blue-500 text-white rounded-lg"
                                        onClick={handleEditSubmit}
                                    >
                                        Submit
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Instruments;
