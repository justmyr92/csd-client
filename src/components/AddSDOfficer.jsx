import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const AddSDOfficer = ({ setReload, setModal }) => {
    const [campus, setCampus] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [sdo_officer, setSDOOfficer] = useState({
        sdo_officer_id: "SD" + Math.floor(Math.random() * 1000000),
        sdo_officer_name: "",
        sdo_officer_email: "",
        sdo_officer_phone: "",
        sdo_officer_password: "",
        campus_id: "",
    });
    useEffect(() => {
        const getCampus = async () => {
            const response = await fetch(
                "https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/campus"
            );
            const data = await response.json();
            setCampus(data);
        };
        getCampus();
    }, []);

    const submitData = async (e) => {
        e.preventDefault();
        //check if the form data is all filled
        if (
            sdo_officer.sdo_officer_name === "" ||
            sdo_officer.sdo_officer_email === "" ||
            sdo_officer.sdo_officer_phone === "" ||
            sdo_officer.sdo_officer_password === "" ||
            sdo_officer.campus_id === ""
        ) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please fill all fields!",
            });
            return;
        }

        //check email format
        if (
            !sdo_officer.sdo_officer_email.match(
                /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
            )
        ) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter a valid email address!",
            });
            return;
        }

        //check password length , should be alteast 8 characters, with atleast 1 uppercase, 1 lowercase, 1 number and 1 special character
        if (
            !sdo_officer.sdo_officer_password.match(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
            )
        ) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Password should be atleast 8 characters long, with atleast 1 uppercase, 1 lowercase, 1 number and 1 special character!",
            });
            return;
        }

        const response = await fetch(
            "https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/sdo_officer",
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(sdo_officer),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "SD Officer Added Successfully",
            }).then(() => {
                setReload(true);
                setModal(false);
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        }
    };

    return (
        <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
            <form onSubmit={submitData}>
                <div className="relative w-full max-w-2xl max-h-full p-4 mx-auto">
                    <div className="relative bg-white rounded-lg shadow">
                        <div className="flex items-start justify-between p-4 border-b rounded-t">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Add SD Officer
                            </h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                                data-modal-hide="default-modal"
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
                            {/* createa a selectinput where user  can select campus */}
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    htmlFor="campus"
                                >
                                    Campus
                                </label>
                                <select
                                    id="campus"
                                    name="campus"
                                    autoComplete="campus"
                                    className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={sdo_officer.campus_id}
                                    onChange={(e) =>
                                        setSDOOfficer({
                                            ...sdo_officer,
                                            campus_id: e.target.value,
                                        })
                                    }
                                >
                                    <option value="0" selected>
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
                                    value={sdo_officer.sdo_officer_name}
                                    onChange={(e) =>
                                        setSDOOfficer({
                                            ...sdo_officer,
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
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        autoComplete="email"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Enter Email"
                                        value={FormData.sdo_officer_email}
                                        onChange={(e) =>
                                            setSDOOfficer({
                                                ...sdo_officer,
                                                sdo_officer_email:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Phone
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        autoComplete="phone"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Enter Phone"
                                        value={FormData.sdo_officer_phone}
                                        onChange={(e) =>
                                            setSDOOfficer({
                                                ...sdo_officer,
                                                sdo_officer_phone:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            {/* password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        id="password"
                                        autoComplete="password"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Enter Password"
                                        onChange={(e) =>
                                            setSDOOfficer({
                                                ...sdo_officer,
                                                sdo_officer_password:
                                                    e.target.value,
                                            })
                                        }
                                        value={sdo_officer.sdo_officer_password}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                                            id="showPasswordToggle"
                                            checked={showPassword}
                                            onChange={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        />
                                        <label
                                            htmlFor="showPasswordToggle"
                                            className="ml-2 text-sm text-gray-700"
                                        >
                                            Show Password
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                            <button
                                data-modal-hide="default-modal"
                                type="submit"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Save
                            </button>
                            <button
                                data-modal-hide="default-modal"
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

export default AddSDOfficer;
