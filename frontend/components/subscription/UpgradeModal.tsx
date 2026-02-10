const UpgradeModal = () => {
    return (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-100">
            <div className="bg-white w-96 rounded-xl p-6 shadow-lg">
                <h2 className="text-lg font-bold mb-4">PRO feature</h2>

                <p className="text-gray-600 mb-4">
                    Document processing is a PRO feature.
                </p>

                <div className="flex justify-center">
                    <button
                        onClick={() => (window.location.href = "/pricing")}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Upgrade to PRO
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
