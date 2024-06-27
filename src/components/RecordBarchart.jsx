import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const RecordBarChart = () => {
    const [sdgs, setSdgs] = useState([]);
    const [selectedSdg, setSelectedSdg] = useState(null);
    const [reload, setReload] = useState(false);

    const sdgColors = [
        "#E5243B",
        "#DDA63A",
        "#4C9F38",
        "#C5192D",
        "#FF3A21",
        "#26BDE2",
        "#FCC30B",
        "#A21942",
        "#FD6925",
        "#DD1367",
        "#FD9D24",
        "#BF8B2E",
        "#3F7E44",
        "#0A97D9",
        "#56C02B",
        "#00689D",
        "#19486A",
    ];

    useEffect(() => {
        const fetchSdgs = async () => {
            try {
                const response = await fetch(
                    `https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/sdg/count`
                );
                const data = await response.json();
                // Parse the SDG IDs as integers before sorting
                data.forEach(
                    (sdg) =>
                        (sdg.sdg_id = parseInt(sdg.sdg_id.replace("SDG", "")))
                );
                // Sort the SDGs based on the SDG ID
                data.sort((a, b) => a.sdg_id - b.sdg_id);
                setSdgs(data);
            } catch (error) {
                console.error("Error fetching sdgs:", error);
            }
        };
        const fetchData = async () => {
            await fetchSdgs();
            setReload(false);
        };
        fetchData();
    }, []);

    const data = {
        labels: sdgs.map((sdg) => `SDG ${sdg.sdg_id}`),
        datasets: [
            {
                label: selectedSdg
                    ? `Total Records by ${selectedSdg}`
                    : "Total Records by SDG",
                data: sdgs.map((sdg) => sdg.count),
                backgroundColor: sdgColors,
                borderColor: sdgColors,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Total Records by SDG Accumulated",
            },
        },
    };

    return (
        <div className="card bg-white rounded-lg p-5 border border-red-500 hover:border-blue-500 col-span-2">
            <Bar data={data} options={options} />
        </div>
    );
};

export default RecordBarChart;
