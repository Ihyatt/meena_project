const Button = ({ onClick, children, className }) => {
  return (
    <>
      <button
        onClick={onClick}
        className={`
            transition-colors 
            duration-300
            font-medium 
            text-sm 
            flex-1 
            px-5 
            py-2 
            rounded-sm  
            cursor-pointer 
            ${className}
         `}
      >
        {children}
      </button>
    </>
  );
};
export default Button;
