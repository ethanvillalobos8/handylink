'use client'

import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = event => {
        event.preventDefault();
        console.log(searchTerm);
        // Implement logic to perform the search. Probably a Trie data structure would be useful but I'll start with a simple search for now
    };

    return (
        <form onSubmit={handleSubmit} className="relative justify-self-center w-1/2 h-12 mt-4">
            <input className="rounded-full w-full h-full px-4 border-[#fae1ef] border-2 focus:outline-none bg-[#fffafd]" type="text" value={searchTerm} onChange={handleChange} placeholder="Search for a job or provider" />
            <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-slate-500"><CiSearch /></button>
        </form>
    );
}

export default SearchBar;