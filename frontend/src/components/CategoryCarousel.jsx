import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const categories = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer",
    "DevOps Engineer",
    "AI Engineer"
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='w-full'>
            {/* Carousel Container */}
            <Carousel className='w-full max-w-xl mx-auto my-20 px-4 md:px-0'>
                <CarouselContent className="-ml-2 md:-ml-4">
                    {
                        categories.map((cat, index) => (
                            <CarouselItem key={index} className='pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3'>
                                <Button 
                                    onClick={() => searchJobHandler(cat)} 
                                    variant="outline" 
                                    className="rounded-full w-full py-6 bg-white border-gray-300 text-gray-600 hover:border-[#5D9C7C] hover:text-[#5D9C7C] hover:bg-green-50 transition-all duration-300 shadow-sm"
                                >
                                    {cat}
                                </Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                
                {/* Navigation Buttons - Positioned cleanly */}
                <CarouselPrevious className="hidden md:flex -left-12 hover:text-[#5D9C7C]" />
                <CarouselNext className="hidden md:flex -right-12 hover:text-[#5D9C7C]" />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel;