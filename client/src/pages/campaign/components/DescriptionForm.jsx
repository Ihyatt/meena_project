import useManageCampaign from "src/pages/campaign/hooks/useManageCampaign";
const DescriptionForm = () => {
  const { description, setDescription } = useManageCampaign();
  return (
    <div className="sm:px-5 md:px-20 lg:px-35 pt-52 ">
      <form className="">
        <div className="p-2">
          <textarea
            id="description"
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-w-75 
                  resize-none w-full h-75 p-4 border rounded
                  text-lg font-semibold w-full h-14 bg-transparent placeholder:text-slate-400 text-slate-700  border border-[#b7b7b6] rounded-lg px-3 py-2  focus:outline-none   "
          ></textarea>
        </div>
      </form>
    </div>
  );
};
export default DescriptionForm;
