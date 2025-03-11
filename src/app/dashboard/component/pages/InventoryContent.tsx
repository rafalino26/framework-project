"use client";

import { useState } from "react";

export default function InventoryContent() {
    const [searchTerm, setSearchTerm] = useState("");

    // Placeholder data
    const inventoryData = [
        { id: 1, product: "Sugar", itemCode: "0001", price: "Rp15.000", stock: "25 pcs"},
        { id: 2, product: "Flour", itemCode: "0002", price: "Rp12.000", stock: "30 pcs"},
        { id: 3, product: "Rice", itemCode: "0003", price: "Rp20.000", stock: "50 pcs"},
        { id: 4, product: "Salt", itemCode: "0004", price: "Rp5.000", stock: "100 pcs"},
        { id: 5, product: "Oil", itemCode: "0005", price: "Rp25.000", stock: "40 pcs"},
        { id: 6, product: "Oil", itemCode: "0005", price: "Rp25.000", stock: "40 pcs"},
        { id: 7, product: "Oil", itemCode: "0005", price: "Rp25.000", stock: "40 pcs"},
    ]

    return (
        <div className="p-6 -mt-5 bg-[#C7DFEA] min-h-screen text-black">
            {/* Search, Filter & Button (Terpisah) */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-1/3 focus:outline-none shadow-sm"
                />
                <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none shadow-sm">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>All Time</option>
                </select>
                <button className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm">
                    New Product <span className="ml-2">+</span>
                </button>
            </div>

            {/* Tabel Inventory */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <table className="w-full border-collapse text-black">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2">Product</th>
                            <th className="p-2">Item Code</th>
                            <th className="p-2">Price</th>
                            <th className="p-2">Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryData
                            .filter((item) =>
                                item.product.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-2 flex items-center space-x-2">
                                        <span>{item.product}</span>
                                    </td>
                                    <td className="p-2">{item.itemCode}</td>
                                    <td className="p-2">{item.price}</td>
                                    <td className="p-2">{item.stock}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
