import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="flex justify-center bg-custom-background text-custom-text px-8 py-4 border-b-2 border-[#F7e7f0] w-full h-12">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-lg font-semibold tracking-wide">
                    HandyLink
                </div>
                <ul className="flex space-x-4">
                    <Link href='/' className="hover:text-custom-primary p-2 rounded">Home</Link>
                    <Link href='/about' className="hover:text-custom-primary p-2 rounded">About</Link>
                    <Link href='/contact' className="hover:text-custom-primary p-2 rounded">Contact</Link>
                    <Link href='/login' className="hover:text-custom-primary bg-indigo-600 p-2 rounded">Login</Link>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
