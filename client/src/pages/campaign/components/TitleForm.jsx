import { TITLE_CHARACTERS_MAX } from "src/utils/Constants";

import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";
const TitleForm = () => {
  const { title, setTitle } = useManageCampaign();
  return (
    <div className="sm:px-5 md:px-20 lg:px-35 pt-52 ">
      <form>
        <div className="min-w-75 text-lg font-semibold w-full h-14 bg-transparent hover:bg-[#fafafa] placeholder:text-slate-400 text-slate-700  border border-[#b7b7b6] rounded-lg px-3 py-2 transition duration-300  focus:outline-none focus-within:border-[#232323] focus-within:border-2 flex justify-between items-center ">
          <input
            type="text"
            id="title"
            placeholder="Save the Rainforest..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-none w-full  focus:outline-none "
          />
          <div className=" ml-2">{TITLE_CHARACTERS_MAX - title.length}</div>
        </div>
      </form>
    </div>
  );
};
export default TitleForm;
