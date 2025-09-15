// React and hooks

// Local components and state
import ErrorAlert from "src/components/ErrorAlert";
import useDonationForm from "src/pages/donation/hooks/useDonationForm.jsx";

import TermsOfService from "src/pages/donation/components/DonationForm/TermsOfService";
import CheckBox from "src/pages/donation/components/DonationForm/CheckBox";
import CustomAmount from "src/pages/donation/components/DonationForm/CustomAmount";
import EmailAddress from "src/pages/donation/components/DonationForm/EmailAddress";
import FullName from "src/pages/donation/components/DonationForm/FullName";
import AmountButton from "src/pages/donation/components/DonationForm/AmountButton";
import DonateButton from "src/pages/donation/components/DonationForm/DonateButton";

const DonationForm = ({ targetRef }) => {
  const {
    errors,
    customAmount,
    activeButton,
    form,
    handleChange,
    handleCustomAmount,
    handleClick,
    handleCheckboxChange,
    handleDonateClick,
    handleErrorClose,
    blockInvalidChar,
  } = useDonationForm();
  return (
    <div className="p-10 md:p-20 lg:p-20 bg-white rounded-lg shadow-lg mt-6 w-full lg:w-7/8 ">
      <div className="text-2xl font-bold">Select Gift Amount</div>
      <div className="mb-3 text-gray-400 text-xs">_ _ _</div>
      <form onSubmit={handleDonateClick}>
        <div>One-time donation</div>
        <div
          className="flex gap-5 my-[25px] transition-all duration-300 ease-in-out"
          id="amountSelector"
        >
          <AmountButton
            activeButton={activeButton}
            amount={15}
            buttonId={"button1"}
            handleClick={handleClick}
          />
          <AmountButton
            activeButton={activeButton}
            amount={30}
            buttonId={"button2"}
            handleClick={handleClick}
          />
          <AmountButton
            activeButton={activeButton}
            amount={100}
            buttonId={"button3"}
            handleClick={handleClick}
          />
          <AmountButton
            activeButton={activeButton}
            amount={500}
            buttonId={"button4"}
            handleClick={handleClick}
          />
        </div>

        <div className="flex flex-col">
          <CustomAmount
            amount={customAmount}
            setAmount={handleCustomAmount}
            blockInvalidChar={blockInvalidChar}
          />

          <EmailAddress handleChange={handleChange} />

          <FullName handleChange={handleChange} />
        </div>
        <CheckBox
          name={"isAnonymous"}
          checked={form.isAnonymous}
          handleCheckboxChange={handleCheckboxChange}
          message={
            <>
              <span className="font-bold  text-gray-600">yes,</span> I would
              like my donation to be anonymous
            </>
          }
        />
        <CheckBox
          name={"isEmailSubscription"}
          checked={form.isEmailSubscription}
          handleCheckboxChange={handleCheckboxChange}
          message={
            <>
              <span className="font-bold text-gray-600">yes,</span> I would like
              to receive email updates
            </>
          }
        />

        <div ref={targetRef}>
          <DonateButton />
        </div>
        <TermsOfService />
        {errors.length > 0 && (
          <ErrorAlert errors={errors} onClose={handleErrorClose} />
        )}
      </form>
    </div>
  );
};
export default DonationForm;
