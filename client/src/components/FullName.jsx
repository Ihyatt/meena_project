const FullName = ({ handleChange }) => {
  return (
    <>
      <input
        required
        type="text"
        id="name"
        name="fullName"
        onChange={handleChange}
        placeholder="Name"
        className="border-b border-gray-400  p-2 mb-2 focus:outline-none"
      />
    </>
  );
};
export default FullName;
