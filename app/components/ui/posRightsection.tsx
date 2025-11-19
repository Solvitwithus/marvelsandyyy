"use client";
import React, { useEffect, useState } from "react";
import { useSiteInformationPersist, useUserInformation } from "@/app/store/authstore";
import { mpesaTransactions } from "@/app/hooks/usetransactions";
interface MpesaTransaction {
  id?: string | number;
  mpesaRef?: string;
  reference?: string;
  amount?: string | number;
  phone?: string;
  date?: string;
  // add other fields you expect
  [key: string]: any; // fallback if you're not sure yet
}
function PosRightsection() {
  const { siteInfo } = useSiteInformationPersist();
  const { userInfo } = useUserInformation();
  const [mpesaPayment, setmpesaPayment] = useState(false);
  const [transactions, setTransactions] = useState<MpesaTransaction[]>([]);

  // Parse user info safely
  const parsedUser =
    typeof userInfo === "string" ? JSON.parse(userInfo) : userInfo;

useEffect(() => {
  const fetchMpesaTransactions = async () => {
    try {
      if (!siteInfo?.[0]?.company_prefix || !parsedUser?.id) return;

      const response = await mpesaTransactions(
        siteInfo[0].company_prefix,
        parsedUser.id
      );

      // THIS IS THE KEY FIX:
      setTransactions(response?.data ?? []); // extract .data and fallback to empty array
      // or if your hook already returns response.data:
      // setTransactions(response ?? []);
    } catch (e) {
      console.error("Error fetching mpesa transactions:", e);
      setTransactions([]); // optional: reset on error
    }
  };

  fetchMpesaTransactions();
}, [siteInfo, parsedUser]);

  if (!parsedUser)
    return <div className="text-red-500">⚠️ No user info found.</div>;

  return (
    <div className="text-cyan-900  w-1/4 p-2">
      <div>Company: {siteInfo?.[0]?.company_prefix || "N/A"}</div>
      <div>USER ID: {parsedUser?.id || parsedUser?.user_id || "N/A"}</div>

      <h1
        className="cursor-pointer underline text-blue-600"
        onClick={() => setmpesaPayment(true)}
      >
        Mpesa
      </h1>

      <div>
        <input type="text" placeholder="Name" className="w-[90%] placeholder-black/30 rounded-xl text-black/40 border mb-1 border-black/30 px-1 py-2"/>
         <input type="text" placeholder="KRA Pin" className="w-[90%] placeholder-black/30 rounded-xl text-black/40 border mb-1 border-black/30 px-1 py-2"/>
         <button type="button" className="w-[90%] mb-2 bg-[#c9184a] py-2 rounded-xl text-white font-bold text-[1rem]">process</button>

         <table className="w-[90%]">
          <tbody>
            <tr className="border-b border-black/25 mb-5">
              <td>Total</td>
              <td className="text-right">Ksh 0</td>
            </tr>
             <tr className="border-b border-black/25">
              <td>Paid</td>
              <td className="text-right">Ksh 0</td>
            </tr>
             <tr className="border-b border-black/25">
              <td>Balance</td>
              <td className="text-right">Ksh 0</td>
            </tr>
          </tbody>
         </table>

         <p className="text-black mb-2 text-[1.14rem] font-extrabold">Customer</p>
         <input type="text" placeholder="Cash Sale" className="w-[90%] placeholder-black/30 rounded-xl text-black/40 border mb-1 border-black/35 px-1 py-2"/>
         <p className="text-black mb-2 text-[0.9rem] font-medium">Pricing Mode:</p>
         <button type="button" className="w-[90%] mb-2 bg-[#fffbff] border border-black/20 text-left py-2 rounded-xl text-black/30 font-light pl-2 text-[1rem]">Cash</button>
          <button type="button" className="w-[90%] mb-2 bg-[#fffbff] border border-black/20 text-left py-2 rounded-xl text-black/30 font-light pl-2 text-[1rem]">Mpesa</button>
           <button type="button" className="w-[90%] mb-2 bg-[#fffbff] border border-black/20 text-left py-2 rounded-xl text-black/30 font-light pl-2 text-[1rem]">Family Bank</button>
            <button type="button" className="w-[90%] mb-2 bg-[#fffbff] border border-black/20 text-left py-2 rounded-xl text-black/30 font-light pl-2 text-[1rem]">Manual Bank</button>
      </div>

      {mpesaPayment && (
        <div>
          {transactions.length > 0 ? (
            transactions.map((t: any, i: number) => (
              <div key={i} className="border-b py-1">
                <h6>{t.mpesaRef || t.reference || "No Ref"}</h6>
              </div>
            ))
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PosRightsection;
