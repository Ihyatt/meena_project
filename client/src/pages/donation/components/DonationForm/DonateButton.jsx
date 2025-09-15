const DonateButton = () => {
  return (
    <>
      <input
        className="
            text-xl
            w-full 
            p-[15px] 
            bg-[#0fa347] 
            text-white 
            rounded 
            cursor-pointer
            transition-colors
            duration-300 
            block
            mx-auto 
            hover:bg-[#2bbd62]
            my-5
            
            "
        type="submit"
        value="Donate"
      />
    </>
  );
};
export default DonateButton;
