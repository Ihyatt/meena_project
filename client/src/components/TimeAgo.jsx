import { formatDistanceToNow } from 'date-fns';

const TimeAgo = ({ timestamp }) => {
    const date = new Date(timestamp);
    const timeAgo = formatDistanceToNow(date, { addSuffix: true });

    return <span className="text-xs text-gray-600" title={date.toString()}>{timeAgo}</span>;
}
export default TimeAgo;