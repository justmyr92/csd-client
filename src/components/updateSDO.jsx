import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const UpdateSDOfficer = ({ officer, setReload, setModal }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [updatedOfficer, setUpdatedOfficer] = useState(officer);
    const [campus, setCampus] = useState([]);
    const [password, setPassword] = useState(""); // New password state

    useEffect(() => {
        setUpdatedOfficer(officer);
        fetchCampus();
    }, [officer]);

    const fetchCampus = async () => {
        try {
            const response = await fetch(
                "https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/campus"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch campus data");
            }
            const data = await response.json();
            setCampus(data);
        } catch (error) {
            console.error("Error fetching campus data:", error);
        }
    };

    const submitData = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...updatedOfficer,
                sdo_officer_password: password, // Include password in the data object
            };

            const response = await fetch(
                `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/sdo_officer/${updatedOfficer.sdo_officer_id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to update SD officer");
            } else {
                Swal.fire({
                    title: "Success!",
                    text: "SD Officer updated successfully!",
                    icon: "success",
                    confirmButtonText: "Okay",
                }).then(() => {
                    setReload(true);
                    setModal(false);
                });
            }
        } catch (error) {
            console.error("Error updating SD officer:", error);
        }
    };

    return (
        <div
            id="update-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
            <form onSubmit={submitData}>
                <div className="relative w-full max-w-2xl max-h-full p-4 mx-auto">
                    <div className="relative bg-white rounded-lg shadow">
                        <div className="flex items-start justify-between p-4 border-b rounded-t">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Update SD Officer
                            </h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                                data-modal-hide="update-modal"
                                onClick={() => setModal(false)}
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    autoComplete="name"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter Name"
                                    value={updatedOfficer.sdo_officer_name}
                                    onChange={(e) =>
                                        setUpdatedOfficer({
                                            ...updatedOfficer,
                                            sdo_officer_name: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter Email"
                                    value={updatedOfficer.sdo_officer_email}
                                    onChange={(e) =>
                                        setUpdatedOfficer({
                                            ...updatedOfficer,
                                            sdo_officer_email: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    autoComplete="phone"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter Phone"
                                    value={updatedOfficer.sdo_officer_phone}
                                    onChange={(e) =>
                                        setUpdatedOfficer({
                                            ...updatedOfficer,
                                            sdo_officer_phone: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="campus"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Campus
                                </label>
                                <select
                                    id="campus"
                                    name="campus"
                                    autoComplete="campus"
                                    className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={updatedOfficer.campus_id}
                                    onChange={(e) =>
                                        setUpdatedOfficer({
                                            ...updatedOfficer,
                                            campus_id: e.target.value,
                                        })
                                    }
                                >
                                    <option value="" disabled>
                                        Select Campus
                                    </option>
                                    {campus
                                        .filter(
                                            (campus) =>
                                                campus.campus_id === "1" ||
                                                campus.campus_id === "2" ||
                                                campus.campus_id === "3" ||
                                                campus.campus_id === "4" ||
                                                campus.campus_id === "5"
                                        )
                                        .map((campus) => (
                                            <option
                                                value={campus.campus_id}
                                                key={campus.campus_id}
                                            >
                                                {campus.campus_name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    autoComplete="new-password"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    className="mt-2 text-sm text-gray-500 focus:outline-none"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"} Password
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                            <button
                                data-modal-hide="update-modal"
                                type="submit"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Save
                            </button>
                            <button
                                data-modal-hide="update-modal"
                                type="button"
                                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                                onClick={() => setModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateSDOfficer;
