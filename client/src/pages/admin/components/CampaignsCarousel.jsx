import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


import { Campaign } from 'src/pages/admin/components/cards/Campaign';

import useAdminStore from 'src/stores/Admin';


const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 768 },
        items: 2,
        slidesToSlide: 1
    },
    mobile: {
        breakpoint: { max: 767, min: 464 },
        items: 1,
        slidesToSlide: 1
    }
};


const Campaigns = () => {
    const { campaigns } = useAdminStore();


    return (
        <div className=" lg:col-span-12 md:col-span-12 bg-white ">
            <div style={{ position: "relative" }}>
                <Carousel
                    showDots={true}
                    responsive={responsive}
                    arrows={false}
                >
                    {campaigns.map((campaign) => {
                        return (
                            <Campaign key={campaign.id} data={campaign} />
                        );
                    })}
                </Carousel>
            </div>
        </div>
    );
};

export default Campaigns;