
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Auth store for token
interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: "auth-storage", // localStorage key for token
    }
  )
);

// Site info store
interface SiteInfoStore {
  siteInfo: any;
  setSiteInfo: (data: any) => void;
  clearSiteInfo: () => void;
}

export const useSiteInformationPersist= create<SiteInfoStore>()(
  persist(
    (set) => ({
      siteInfo: null,
      setSiteInfo: (data) => set({ siteInfo: data }),
      clearSiteInfo: () => set({ siteInfo: null }),
    }),
    {
      name: "site-info-storage", // localStorage key for site info
    }
  )
);



interface UserInfoStore {
  userInfo: any; // you can type it more strictly if you know the shape
  setUserInfo: (data: any) => void;
  clearUserInfo: () => void;
}

export const useUserInformation = create<UserInfoStore>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (data) => set({ userInfo: data }),
      clearUserInfo: () => set({ userInfo: null }),
    }),
    {
      name: "user-info-storage", // key in localStorage
    }
  )
);


interface StoreInformation {
  storeInventory: any;
  setStoreInventory: (data: any) => void;
  cancelStoreInventory: () => void;
}

export const useInventoryItems = create<StoreInformation>()(
  persist(
    (set) => ({
      storeInventory: [], // ✅ default to []
      setStoreInventory: (data) => set({ storeInventory: data }),
      cancelStoreInventory: () => set({ storeInventory: [] }), // reset to []
    }),
    {
      name: "inventory-store",
    }
  )
);


interface SalesTypeInformation {
  salesType: any[];
  setSalesType: (data: any[]) => void;
  cancelSalesType: () => void;
}

export const useSalesType = create<SalesTypeInformation>()(
  persist(
    (set) => ({
      salesType: [],
     setSalesType: (data) => set({ salesType: data }),

      cancelSalesType: () => set({ salesType: [] }),
    }),
    {
      name: "sales-type-storage",
    }
  )
);
