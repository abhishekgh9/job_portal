import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10 px-4 md:px-0'>
                
                {/* Badge Section */}
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#5D9C7C] font-medium shadow-sm'>
                    No. 1 Job Hunt Website
                </span>

                {/* Main Heading */}
                <h1 className='text-4xl md:text-5xl font-bold leading-tight'>
                    Search, Apply & <br /> 
                    Get Your <span className='text-[#5D9C7C]'>Dream Job</span>
                </h1>

                {/* Subtext - Replaces Lorem Ipsum */}
                <p className='text-gray-500 max-w-2xl mx-auto text-sm md:text-base'>
                    Connecting top talent with the best companies. Whether you are a fresher or an 
                    experienced professional, find opportunities that match your skills and aspirations 
                    in just a few clicks.
                </p>

                {/* Search Bar Container */}
                <div className='flex w-full md:w-[60%] lg:w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto bg-white overflow-hidden transition-all duration-300 hover:shadow-xl'>
                    <input 
                        type="text" 
                        placeholder='Find your dream jobs (e.g., "Frontend Developer")'
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && searchJobHandler()} // Allows searching by pressing Enter
                        className='outline-none border-none w-full py-3 text-gray-700'
                    />

                    {/* Search Button */}
                    <Button 
                        onClick={searchJobHandler} 
                        className="rounded-r-full bg-[#5D9C7C] hover:bg-[#4a7d63] h-full py-6 px-6"
                    >
                        <Search className='h-5 w-5 text-white'/>
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default HeroSection;