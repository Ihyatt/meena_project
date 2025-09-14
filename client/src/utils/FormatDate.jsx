const FormatDate = ({ date }) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString('en-US', options);
    return <span>{formattedDate}</span>;
}
export default FormatDate;