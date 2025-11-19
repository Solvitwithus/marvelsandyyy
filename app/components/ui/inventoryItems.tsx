"use client";

/**
 * @author: John Kamiru Mwangi
 * @date november 11 2025
 * @location Digisoft solution limited
 * @purpose Learning to consume the apis provided for easy future debugging
 */
import React, { useEffect, useState } from "react";
import { fetch_user_store_balance } from "@/app/hooks/usetransactions";
import { LoaderIcon } from "lucide-react";
import {
  useSiteInformationPersist,
  useUserInformation,
  useInventoryItems
} from "@/app/store/authstore";

export default function InventoryItems() {
  const { siteInfo } = useSiteInformationPersist();
  const { userInfo } = useUserInformation();
const {setStoreInventory} = useInventoryItems()
  const parsedUser =
    typeof userInfo === "string" ? JSON.parse(userInfo) : userInfo ?? {};
  const [currentStoreData, setCurrentStoreData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await fetch_user_store_balance(
        siteInfo[0].company_prefix,
        parsedUser.id,
        "001"
      );
      if (data) {
        setCurrentStoreData(data);
        setFilteredData(data); 
       
      }
    } catch (e) {
      console.error("Failed to fetch inventory", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle search filter
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = currentStoreData.filter(
      (item: any) =>
        item.stock_id.toLowerCase().includes(value) ||
        item.item.toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

  return (
    <div className="flex flex-col items-center mt-3 justify-center">
      {/* Search & Refresh */}
      <div className="flex w-full justify-center items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search item by ID or name..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-[70%] text-gray-800 border border-gray-400 rounded-md px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <LoaderIcon
          className={`h-6 w-6 ${
            loading ? "animate-spin text-green-600" : "text-blue-600"
          } cursor-pointer hover:text-green-700 transition`}
          onClick={fetchInventory}
        />
      </div>

      {/* Table Container */}
      <div className="w-3/5 bg-white shadow-lg rounded-lg overflow-hidden max-h-[80vh]">
        {/* Header */}
        <div className="sticky top-0 bg-slate-200 py-3 px-4 z-10 border-b">
          <h2 className="text-lg font-semibold text-center text-gray-800">
            Inventory Items
          </h2>
        </div>

        {/* Table */}
        <div className="max-h-[90vh] overflow-y-auto overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-100 flex-none sticky top-0 text-[#c9184a] uppercase text-[0.8rem]">
            <tr>
              <th className="text-left px-4 py-2">Item ID</th>
              <th className="text-right px-4 py-2">Item</th>
              <th className="text-left px-4 py-2">Available</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-4 text-gray-500 italic"
                >
                  Loading...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((val: any, id: number) => (
                <tr
                  key={id}
                  className={`${
                    id % 2 === 0 ? "bg-slate-50" : "bg-slate-100"
                  } hover:bg-slate-200 transition`}
                >
                  <td className="px-4 py-2 text-gray-800 font-medium">
                    {val.stock_id}
                  </td>

                  <td className="px-4 py-2 text-gray-900 text-right">
                    {val.item}
                  </td>

                  <td className="px-4 py-2 text-gray-700 font-semibold text-left">
                    {Number(val.balance).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-4 text-gray-500 italic"
                >
                  No matching items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
