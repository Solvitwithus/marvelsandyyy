"use client";
import React, { useEffect, useState } from "react";
import {
  useSiteInformationPersist,
  useUserInformation,
  useInventoryItems,
  useSalesType
} from "@/app/store/authstore";
import { salesOrders } from "@/app/hooks/usetransactions";
import { salesTypeInfo } from "@/app/hooks/usesiteinfo";
import {
  XOctagonIcon,
  ShoppingCart,
  PackageIcon,
  WeightIcon,
} from "lucide-react";
import Itemstable from "./itemstable";

function PosHandler() {
  const { siteInfo } = useSiteInformationPersist();
  const { userInfo } = useUserInformation();
const {storeInventory} = useInventoryItems()
  const [salesOrdersItems, setSalesOrdersItems] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  const [cartVerifier, setCartVerifier] = useState(false);

const [searchparam, setSearchparam] = useState<string>("")
  const [filteredData, setFilteredData] = useState<any[]>([])
const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

const {salesType,setSalesType} = useSalesType()
  const changeTerm = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const value =  e.target.value.toLowerCase();
    setSearchparam(value)
salesType
  

      const filtered = storeInventory.filter(
      (item: any) =>
        item.stock_id.toLowerCase().includes(value) ||
        item.item.toLowerCase().includes(value)
    );

    setFilteredData(filtered)
  }
  const parsedUser =
    typeof userInfo === "string" ? JSON.parse(userInfo) : userInfo ?? {};

  useEffect(() => {
    const fetchOrders = async () => {
      if (!siteInfo?.[0]?.company_prefix || !parsedUser?.id) return;

      try {
        const response = await salesOrders(
          siteInfo[0].company_prefix,
          parsedUser.id
        );

        if (response?.data?.status === "SUCCESS") {
          setSalesOrdersItems(response.data.data);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (e) {
        console.error("Error fetching sales orders:", e);
      }
    };

    fetchOrders();
  }, [siteInfo, parsedUser?.id]);



useEffect(() => {
  if (!siteInfo?.[0]?.company_prefix) return;

  (async () => {
    const res = await salesTypeInfo(siteInfo[0].company_prefix);
    if (res?.data) setSalesType(res.data);
  })();
}, [siteInfo]);






 const handleAddToCart = () => {
  if (!selectedOrder) return; // Safety check
  setModalOpen(false);
  setCartVerifier(true);
};

  return (
    <div className="p-4 w-[60%] border border-black rounded-lg shadow-sm bg-white">
      {/* Search & Buttons */}
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Search Item"
          value={searchparam}
          onChange={changeTerm}
          className="w-[80%] text-black/40 border placeholder-black/30 pl-2 border-black/25 rounded"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="font-bold text-sm cursor-pointer border border-black/30 px-4 py-1 rounded-2xl bg-[#ffd9dc] text-[#201a1a]"
          >
            Load Order
          </button>
          <button className="text-[#c9184a] border border-black/30 px-4 py-1 rounded-2xl font-bold text-sm">
            Pause
          </button>
        </div>
      </div>

      <Itemstable/>

     {
     searchparam.length >1 ?
     filteredData.length > 0 && (
  <div className="bg-red-500 rounded-lg mt-2">
    <table className="w-full text-sm text-left text-gray-800">
      <thead className="bg-gray-100 text-gray-700 uppercase">
        <tr>
          <th className="px-4 py-2">Item</th>
          <th className="px-4 py-2">Balance</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((val) => (
          <tr key={val.stock_id} className="border-b border-gray-300">
            <td className="px-4 py-2">{val.item}</td>
            <td className="px-4 py-2">{Number(val.balance).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
):null}


      {/* Modal */}
      {
      
      modalOpen && (
        <div className="mt-4 border-t pt-3 bg-amber-200 p-2 rounded-lg h-3/4 max-h-[75vh] flex flex-col">
          {/* --- Fixed Header Section --- */}
          <div className="flex-none sticky top-0 bg-amber-200 z-10 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-[#c9184a] text-[1rem] font-semibold">
                  Select Order
                </h2>
                <p className="text-sm text-black">
                  Choose a pending order to add to cart
                </p>
              </div>
              <XOctagonIcon
                className="w-6 h-6 text-red-500 hover:text-red-800 cursor-pointer"
                onClick={() => {
                  setModalOpen(false);
                  setActiveOrderId(null);
                }}
              />
            </div>

            <input
              type="text"
              placeholder="Search by customer name, reference, or receipt number..."
              className="w-full placeholder-black/60 text-center text-black border border-black/30 bg-white/50 py-1 mt-2 rounded-xl pl-2"
            />
          </div>

          {/* --- Scrollable Orders List --- */}
          <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {salesOrdersItems.length > 0 ? (
              salesOrdersItems.map((val: any, index: number) => (
                <div
                  key={index}
                  className={`p-3 border-b border-gray-200 cursor-pointer transition-colors ${
                    activeOrderId === index
                      ? "bg-white"
                      : index % 2 === 0
                      ? "bg-amber-100"
                      : "bg-amber-50"
                  }`}
                 onClick={() => {
  setActiveOrderId(activeOrderId === index ? null : index);
  setSelectedOrder(val); 
}}

                >
                  {/* Order header */}
                  <span className="text-sm text-gray-500">Customer Name:</span>
                  <span className="font-xl font-bold text-black/80">
                    {val.deliver_to}
                  </span>

                  <div className="w-[98%] my-2 border-b border-black/30 mx-auto" />

                  {/* Order summary */}
                  <div className="flex justify-between flex-wrap gap-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-black/30 text-[0.7rem]">
                        Reference
                      </span>
                      <span className="text-gray-700 text-[0.9rem]">
                        {val.reference}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-semibold text-black/30 text-[0.7rem]">
                        Receipt No
                      </span>
                      <span className="text-gray-700 text-[0.9rem]">
                        {val.receipt_no}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-semibold text-black/30 text-[0.7rem]">
                        Order Date
                      </span>
                      <span className="text-gray-700 text-[0.9rem]">
                        {val.ord_date}
                      </span>
                    </div>

                    <div className="flex flex-col text-right">
                      <span className="text-[0.9rem] font-semibold text-[#c9184a]">
                        Total
                      </span>
                      <span className="text-green-400 font-extrabold text-[1rem]">
                        {val.total.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                  </div>

                  {/* Lower section */}
                  <div className="flex items-center justify-between mt-2 text-[0.8rem]">
                    <div className="flex gap-2">
                      <div className="flex gap-1 items-center">
                        <PackageIcon className="h-3 w-3 text-[#c9184a]" />
                        <span className="text-black">
                          {val.items?.length || 0}
                        </span>
                      </div>

                      <div className="flex gap-1 items-center">
                        <ShoppingCart className="h-3 w-3 text-[#c9184a]" />
                        <span className="text-black">
                          {val.items?.reduce(
                            (sum: number, item: any) =>
                              sum + Number(item.quantity),
                            0
                          ) || 0}{" "}
                          Units
                        </span>
                      </div>

                      <div
                        className={`flex items-center gap-1 px-4 py-1 rounded-2xl ${
                          val.is_weight_complete === "1"
                            ? "bg-green-400"
                            : "bg-amber-200"
                        }`}
                      >
                        <WeightIcon className="h-3 w-3 text-[#c9184a]" />
                        <span className="text-black">
                          {
                            val.items?.filter(
                              (item: any) => Number(item.qty_taken) > 0
                            ).length
                          }
                          /{val.items?.length}{" "}
                          {val.is_weight_complete === "1"
                            ? "Fully Weighted"
                            : "Partially Weighted"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[0.7rem] text-black/30">
                        Entry Placed By:{" "}
                        <span className="text-blue-950">
                          {val?.salesperson_option}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Show Items if this order is active */}
                  {activeOrderId === index && (
                    <div className="mt-3 bg-white border border-black/20 rounded-lg p-2">
                      <h4 className="text-[0.9rem] font-bold text-[#c9184a] mb-1">
                        Order Items
                      </h4>
                      {val.items?.length > 0 ? (
                        val.items.map((item: any, i: number) => (
                          <div
                            key={i}
                            className="flex justify-between items-center text-[0.8rem] py-1 border-b border-gray-200"
                          >
                            
                            <span className="text-black">
                              {item.description}
                            </span>
                             
                            
                            <span className="text-gray-700">
                              {item.quantity} ×{" "}
                              {item.unit_price.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ","
                              )}{" "}
                              ={" "}
                              {(
                                Number(item.quantity) * Number(item.unit_price)
                              ).toLocaleString()}
                            </span>
                           
                            <span className="text-gray-500">
                              Code: {item.stk_code}
                            </span>

                          
                          </div>
                          
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No items found for this order.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm p-4">No orders found.</div>
            )}

              <div className="bg-amber-50 flex justify-around sticky bottom-1">
               <button onClick={()=>setModalOpen(false)} className=" bg-[#c9184a] w-[45%] text-white font-medium px-6 rounded-xl py-1 ">Cancel</button>
              <button onClick={handleAddToCart} className=" bg-[#0b5538] w-[45%] sticky bottom-1 text-white font-medium px-6 rounded-xl py-1 ">Add to Cart</button>
              </div>
          </div>
        </div>
      )}
{cartVerifier && (
  <div className="p-4 bg-white border rounded-lg shadow-lg mt-4">
    <h2 className="font-bold text-xl text-[#c9184a]">Review Order Items</h2>
    <p className="text-gray-700 mt-2">
      Customer: <span className="font-semibold">{selectedOrder?.deliver_to}</span>
    </p>
    <p>Order: <span>{selectedOrder?.reference}</span></p>
    <p><span>{selectedOrder?.receipt_no}</span></p>
    <p>Pricing: <span>{salesType?.[0]?.sales_type}</span></p>

    
  </div>
)}

    </div>

    
  );
}

export default PosHandler;
