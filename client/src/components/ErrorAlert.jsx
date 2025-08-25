import { RiCloseLine, RiErrorWarningLine } from "react-icons/ri";


const ErrorAlert = ({ errors, onClose }) => {
    return (
        <div className="grid w-full max-w-xl items-start gap-4 border border-red-500 bg-red-50 p-3 rounded-lg" onClick={onClose}>
            <div className="flex justify-end">
                <RiCloseLine className="h-4 w-4 text-red-500 hover:cursor-pointer" />
            </div>
            <div className="flex items-center gap-2">
                <RiErrorWarningLine className="h-4 w-4 text-red-500" />
                <span className="text-red-700 font-semibold">Errors:</span>
            </div>
            <ul className="list-inside list-disc text-sm">
                {errors.map((msg, index) => (
                    <li key={index} className="text-red-700">
                        {msg}
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default ErrorAlert;
