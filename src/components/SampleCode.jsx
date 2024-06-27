import React, { useState } from "react";

const SampleCode = () => {
    const [coffee, setCoffee] = useState([
        { name: "Americano", price: 120 },
        { name: "Latte", price: 150 },
        { name: "Cappuccino", price: 140 },
    ]);

    return (
        <div>
            {coffee.map((c, index) => (
                <div key={index} className="person bg-gray-200 p-4 my-2">
                    <h1>{c.name}</h1>
                    <h2>{c.price}</h2>
                    <button onClick={() => setCoffee([])} className="btn">
                        Buy
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SampleCode;
