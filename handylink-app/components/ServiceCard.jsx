'use client'

import React from 'react';
import { IoMdStar } from "react-icons/io";

export default function ServiceCard() {
    const service = {
        image: 'https://static.vecteezy.com/system/resources/previews/007/085/466/non_2x/plg-letter-logo-design-on-black-background-plg-creative-initials-letter-logo-concept-plg-letter-design-vector.jpg',
        title: 'Service Title',
        providerName: 'Provider Name',
        rating: '4.2',
        location: '123 Main St, City, State, Zip',
        priceRange: '$20 - $30 / hour',
        bio: 'This is a short bio about the provider.'
    };

    const handleClick = () => {
        console.log('Service card clicked');
    }

    return (
        <button onClick={handleClick}>
            <div className="flex flex-col border px-5 py-4 mb-4 rounded-md shadow-md bg-[#fffafd] text-custom-text justify-start">
                <div className="grid grid-cols-2 items-center mb-4">
                    <div className='flex items-center'>
                        <img src={service.image} alt="Service" className="w-16 h-16 object-cover rounded-full mr-4" />
                        <div>
                            <span className="text-lg font-bold">{service.title}</span>
                            <p className="text-sm">by {service.providerName}</p>
                        </div>
                    </div>
                    <span className="justify-self-end text-xs text-gray-500">{service.location}</span>
                </div>
                <p className="flex text-justify">
                    {service.bio}
                </p>
                <div className="flex justify-between items-center mt-4">
                    <span className={`justify-between inline-flex w-grow h-6 text-xs font-semibold text-custom-text items-center`}>
                        <IoMdStar className="text-custom-primary text-[1rem] mr-2 pb-[.05rem]" />
                        {service.rating} &#40;100&#41;
                    </span>
                    <span className="text-xs font-medium text-gray-700">{service.priceRange}</span>
                </div>
            </div>
        </button>
    );
};
