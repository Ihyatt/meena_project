import { Button } from "@/components/ui/button"

import { Link, useLocation } from "react-router-dom";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import useCampaignStore from 'src/pages/admin/campaigns/store.jsx';



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
                <Button variant="clear" ><RiPencilLine size={25} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-5" align="start">
                <DropdownMenuGroup>
                    <DropdownMenuItem >
                        <Link
                            to={`/admins/campaigns/${data.id}`}
                            state={{ background: location }}
                            style={{ color: 'black', textDecoration: 'none', 'fontSize': '14px' }}
                        >
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    {data.isActive ? (
                        <DropdownMenuItem>
                            <div onClick={handleCloseClick}>
                                Close
                            </div>
                        </DropdownMenuItem>) : (
                        <DropdownMenuItem>
                            <div onClick={handleLaunchClick}>
                                Launch
                            </div>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
