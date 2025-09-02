// 1. React and Router
import { Link, useLocation } from "react-router-dom";

// 2. UI Component Libraries
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 3. Icons
import { RiPencilLine } from "react-icons/ri";

// 4. State Management
import useCampaignStore from "src/pages/admin/campaigns/store";

export function CampaignDropdown({ data }) {
  const { launchCampaign, closeCampaign } = useCampaignStore();

  const handleLaunchClick = () => {
    launchCampaign(data.id);
  };

  const handleCloseClick = () => {
    closeCampaign(data.id);
  };
  const location = useLocation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="clear" className="focus:outline-none">
          <RiPencilLine size={25} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-5" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem>
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
              <div
                onClick={handleCloseClick}
                className="w-full h-full px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                Close
              </div>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <div
                onClick={handleLaunchClick}
                className="w-full h-full px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                Launch
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
