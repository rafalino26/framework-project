"use client";

const DashboardContent = () => {
    return (
        <div className="space-y-6">
            {/* Baris 1 - 2 Card Lebar */}
            <div className="grid grid-cols-2 gap-28">
                {/* Card 1 */}
                <div className="bg-white p-4 rounded-lg shadow-md ml-14 w-11/12 h-48">
                    <h2 className="font-bold">Stock Update</h2>
                    {/* Bisa tambah chart di sini */}
                </div>

                {/* Card 2 */}
                <div className="bg-white p-4 rounded-lg shadow-md -ml-6 w-11/12 h-48">
                    <h2 className="font-bold">Price Comparison</h2>
                    {/* Bisa tambah tabel di sini */}
                </div>
            </div>

           {/* Baris 2 */}
           <div className="grid grid-cols-3 ml-14 gap-32">
                {/* Kolom Kiri - 2 Card Bersebelahan */}
                <div className="col-span-1 grid grid-cols-2 gap-56">
                    <div className="bg-white p-4 rounded-lg shadow-md w-72 h-96 flex-1">
                        <h2 className="font-bold">Report</h2>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md ml-24 w-72 h-96 flex-1">
                        <h2 className="font-bold">Inventory Summary</h2>
                    </div>
                </div>

                {/* Kolom Kanan - 3 Card Vertikal */}
                <div className="col-span-2 flex flex-col ml-72 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-md w-96 h-28">
                        <h2 className="font-bold">Other Info 1</h2>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md w-96 h-28">
                        <h2 className="font-bold">Other Info 2</h2>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md w-96 h-28">
                        <h2 className="font-bold">Other Info 3</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;
