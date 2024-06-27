import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { storage } from "../firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

const AnnualReports = () => {
    const [ID, setID] = useState(localStorage.getItem("ID"));
    const [ROLE, setROLE] = useState(localStorage.getItem("ROLE"));
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [reload, setReload] = useState(false);
    const handleAccordionClick = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };
    const [annualReports, setAnnualReports] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [annualReport, setAnnualReport] = useState({
        annual_report_id: Math.floor(Math.random() * 1000000),
        annual_report_year: new Date().getFullYear(),
        annual_report_file: null,
        sdo_officer_id: ID,
    });

    useEffect(() => {
        const getAnnualReports = async () => {
            try {
                const response = await fetch(
                    `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/annual_report/`
                );
                const jsonData = await response.json();
                const promises = jsonData.map(async (annualReport) => {
                    const storageRef = ref(
                        storage,
                        `reports/${annualReport.annual_report_file}`
                    );

                    const url = await getDownloadURL(storageRef);

                    console.log(url);
                    return {
                        ...annualReport,
                        annual_report_file: url,
                    };
                });

                const results = await Promise.all(promises);
                console.log(results);
                setAnnualReports(results);
            } catch (err) {
                console.error(err.message);
            }
        };

        getAnnualReports();
    }, [reload]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAnnualReport({ ...annualReport, [name]: value });
    };

    const handleFileChange = (e) => {
        setAnnualReport({
            ...annualReport,
            annual_report_file: e.target.files[0],
        });
    };

    const [errorFile, setErrorFile] = useState("");

    useEffect(() => {});

    const saveAnnualReport = async () => {
        try {
            const fileExtension =
                annualReport.annual_report_file.name.split(".")[1];
            const newFileName = `Annual Report ${annualReport.annual_report_year}.${fileExtension}`;
            const getYear = annualReport.annual_report_year.split("-")[0];

            const fileSize = annualReport.annual_report_file.size / 1024 / 1024;

            if (fileExtension === "pdf") {
                if (fileSize > 50) {
                    setErrorFile("PDF file size must not exceed 50MB");
                    return;
                }
            } else if (
                fileExtension === "jpg" ||
                fileExtension === "jpeg" ||
                fileExtension === "png"
            ) {
                if (fileSize > 10) {
                    setErrorFile("Image file size must not exceed 10MB");
                    return;
                }
            } else {
                setErrorFile("File must be in pdf, jpg, jpeg or png format");
                return;
            }

            const requestBody = {
                annual_report_id: annualReport.annual_report_id,
                annual_report_file: newFileName,
                annual_report_year: getYear,
                sdo_officer_id: annualReport.sdo_officer_id,
            };

            console.log(JSON.stringify(requestBody));

            const response = await fetch(
                "https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/annual_report",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                }
            );
            if (response.status === 200) {
                const storageRef = ref(storage, `reports/${newFileName}`);
                await uploadBytes(storageRef, annualReport.annual_report_file);
            }

            console.log(response.data);
        } catch (error) {
            console.error(error.message);
        }
        setReload(true);
        if (errorFile === "") {
            setShowModal(false);
        }
    };

    return (
        <section className="annual-reports">
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <div className="p-4">
                    <div className="header flex justify-between items-center">
                        <h3 className="text-3xl font-bold text-gray-700 title">
                            <FontAwesomeIcon icon={faBook} className="mr-3" />
                            Annual Reports
                        </h3>
                        {ROLE === "sdo" ? (
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer"
                            >
                                Upload Reports
                            </button>
                        ) : null}
                        {showModal ? (
                            <div
                                id="default-modal"
                                tabindex="-1"
                                aria-hidden="true"
                                class="overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex"
                            >
                                <div class="relative p-4 w-full max-w-2xl max-h-full">
                                    <div class="relative bg-white rounded-lg shadow">
                                        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                            <h3 class="text-xl font-semibold text-gray-900">
                                                Submit Annual Report
                                            </h3>
                                            <button
                                                type="button"
                                                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                                                data-modal-hide="default-modal"
                                                onClick={() => {
                                                    setShowModal(false);
                                                }}
                                            >
                                                <svg
                                                    class="w-3 h-3"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 14 14"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        stroke-linejoin="round"
                                                        strokeWidth="2"
                                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                                    />
                                                </svg>
                                                <span class="sr-only">
                                                    Close modal
                                                </span>
                                            </button>
                                        </div>
                                        <div className="p-4 md:p-5 space-y-4">
                                            <form className="space-y-4">
                                                <div className="flex flex-col">
                                                    <label
                                                        className="text-sm font-semibold mb-1"
                                                        htmlFor="annual_report_year"
                                                    >
                                                        Year:
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="annual_report_year"
                                                        value={
                                                            annualReport.annual_report_year
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className="border rounded-md p-2 focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>

                                                <div className="flex flex-col">
                                                    <label
                                                        className="text-sm font-semibold mb-1"
                                                        htmlFor="annual_report_file"
                                                    >
                                                        File (pdf, jpg, jpeg or
                                                        png format):
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            onChange={
                                                                handleFileChange
                                                            }
                                                            className="border rounded-md p-2 focus:outline-none focus:border-blue-500 w-full"
                                                            id="fileInput"
                                                        />
                                                        <p className="text-sm text-red-500">
                                                            {errorFile}
                                                        </p>
                                                    </div>
                                                </div>
                                                <hr />
                                                <button
                                                    type="button"
                                                    onClick={saveAnnualReport}
                                                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer"
                                                >
                                                    Save Annual Report
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <hr className="my-5 border-gray-300 border-1" />

                    <div id="accordion-collapse" data-accordion="collapse">
                        {annualReports.map((annualReport, index) => (
                            <div key={annualReport.annual_report_id}>
                                <h2 id={`accordion-collapse-heading-${index}`}>
                                    <button
                                        type="button"
                                        className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200"
                                        data-accordion-target={`#accordion-collapse-body-${index}`}
                                        aria-expanded={
                                            activeAccordion === index
                                        }
                                        aria-controls={`accordion-collapse-body-${index}`}
                                        onClick={() =>
                                            handleAccordionClick(index)
                                        }
                                    >
                                        <span>
                                            Annual Report Year :{" "}
                                            {annualReport.annual_report_year}
                                        </span>
                                        <svg
                                            data-accordion-icon
                                            className={`w-3 h-3 rotate-${
                                                activeAccordion === index
                                                    ? "0"
                                                    : "180"
                                            } shrink-0`}
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 10 6"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5 5 1 1 5"
                                            />
                                        </svg>
                                    </button>
                                </h2>
                                <div
                                    id={`accordion-collapse-body-${index}`}
                                    className={`p-5 border border-b-0 border-gray-200 ${
                                        activeAccordion === index
                                            ? "block"
                                            : "hidden"
                                    }`}
                                    aria-labelledby={`accordion-collapse-heading-${index}`}
                                >
                                    <div className="p-5 border border-b-0 border-gray-200">
                                        {/* Embed pdf */}
                                        <iframe
                                            src={`${annualReport.annual_report_file}`}
                                            width="100%"
                                            height="600px"
                                            title={`Annual Report ${annualReport.annual_report_year}`}
                                            style={{
                                                width: "100%",
                                                border: "none",
                                            }}
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AnnualReports;
