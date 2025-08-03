

import { Campaign } from 'src/pages/admin/components/cards/Campaign';

import useAdminStore from 'src/stores/Admin';

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"


const Campaigns = () => {
    const { campaigns } = useAdminStore();

    return (
        // Set a specific width, e.g., 400px, and ensure it's not limited by max-w-xs
        <Carousel className="relative w-full max-w-xs"> {/* Changed to w-[400px] and removed max-w-xs */}
            <CarouselContent>
                {campaigns.map((campaign, index) => (
                    <CarouselItem key={index} className="rounded-lg">
                        <Campaign data={campaign} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className="absolute top-1/2 left-2 flex items-center justify-center">
                <CarouselPrevious className="relative left-0 -translate-x-10 " />
            </div>
            <div className="absolute top-1/2 right-2 flex items-center justify-center">
                <CarouselNext className="relative right-0 translate-x-17 " />
            </div>
        </Carousel>
    );
};

export default Campaigns;