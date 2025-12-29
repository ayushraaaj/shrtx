import { UrlApiItem } from "@/app/interfaces/url";
import UrlTableRow from "./UrlTableRow";

interface Props {
    urls: UrlApiItem[];
}

const UrlTable = (props: Props) => {
    const { urls } = props;

    if (urls.length == 0) {
        return <p className="text-sm text-gray-500">No URLs yet.</p>;
    }

    return (
        <div className="overflow-x-auto border rounded">
            <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-3 text-left">Original URL</th>
                        <th className="p-3 text-left">Short URL</th>
                        <th className="p-3 text-left">QR Code</th>
                        <th className="p-3 text-right">Clicks</th>
                    </tr>
                </thead>

                <tbody>
                    {urls.map((url) => (
                        <UrlTableRow key={url._id} url={url} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UrlTable;
