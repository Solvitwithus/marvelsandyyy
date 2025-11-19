"use client";

import { useEffect } from "react";
import { fetch_user_store_balance } from "@/app/hooks/usetransactions";
import {
  useInventoryItems,
  useSiteInformationPersist,
  useUserInformation,
} from "@/app/store/authstore";

function AllItems() {
  const { siteInfo } = useSiteInformationPersist();
  const { userInfo } = useUserInformation();
  const { setStoreInventory } = useInventoryItems();

  const parsedUser =
    typeof userInfo === "string" ? JSON.parse(userInfo) : userInfo ?? {};

  useEffect(() => {
    // Wait for siteInfo and userInfo to load
    if (!siteInfo || siteInfo.length === 0 || !parsedUser?.id) return;

    const fetchInventory = async () => {
      try {
        const data = await fetch_user_store_balance(
          siteInfo[0].company_prefix,
          parsedUser.id,
          "001"
        );

        if (data) {
          setStoreInventory(data);
        }
      } catch (e) {
        console.error("Failed to fetch inventory", e);
      }
    };

    fetchInventory();
  }, [siteInfo, parsedUser?.id, setStoreInventory]);

  return null;
}

export default AllItems;
