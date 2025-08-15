import { Button } from "@/components/ui/button"

import { Link, useLocation } from "react-router-dom";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import useCampaignStore from 'src/pages/admin/campaigns/store';
import { RiPencilLine } from "react-icons/ri";

export function CampaignDropdown({ data }) {
    const {
        launchCampaign,
        closeCampaign,

    } = useCampaignStore();

    const handleLaunchClick = () => {
        launchCampaign(data.id)
    }

    const handleCloseClick = () => {
        closeCampaign(data.id)
    }
    const location = useLocation();
    console.log(data)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="clear" className="focus:outline-none"><RiPencilLine size={25} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-5" align="start">
                <DropdownMenuGroup>
                    <DropdownMenuItem >
                        <Link
                            to={`/admins/campaigns/${data.id}`}
                            state={{ background: location }}
                            className="w-full h-full px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    {data.isActive ? (
                        <DropdownMenuItem>
                            <div onClick={handleCloseClick} className="w-full h-full px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                                Close
                            </div>
                        </DropdownMenuItem>) : (
                        <DropdownMenuItem>
                            <div onClick={handleLaunchClick} className="w-full h-full px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                                Launch
                            </div>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
