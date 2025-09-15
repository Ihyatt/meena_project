const EmailAddress = ({ handleChange }) => {
  return (
    <>
      <input
        required
        type="email"
        id="emailAddress"
        name="emailAddress"
        onChange={handleChange}
        placeholder="Email"
        className="border-b border-gray-400  p-2 mb-2 focus:outline-none"
      />
    </>
  );
};
export default EmailAddress;
