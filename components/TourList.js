    import React, { useEffect, useState } from "react";

    const TourList = () => {
    const [tours, setTours] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5179/api/tours")  // API của bạn
        .then((response) => response.json())
        .then((data) => setTours(data))
        .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="grid grid-cols-4 gap-4">
        {tours.map((tour) => (
            <div key={tour.id} className="border rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold">{tour.name}</h2>
            <p className="text-gray-500">{tour.location}</p>
            <p>{tour.duration} days</p>
            <p className="text-lg font-semibold">${tour.price} / person</p>
            <button className="bg-blue-500 text-white p-2 rounded mt-2">Book Now</button>
            </div>
        ))}
        </div>
    );
    };

    export default TourList;
