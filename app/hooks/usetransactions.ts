import axios from "axios";
export type ProductPriceDetails = {
  price: number;
  quantity_available: number;
  tax_mode: number;
};

export type PricingMode = {
  id: string;
  sales_type: string;
};

export type DairyStore = {
  loc_code: string;
  loc_name: string;
  location_name: string;
};
export async function mpesaTransactions(company_prefix: string, user_id: string) {
  try {
    const formdata = new FormData();

    formdata.append("tp", "loadMpesaTransaction");
    formdata.append("cp", company_prefix);
    formdata.append("id", user_id);

    const response = await axios.postForm(
      "https://marvel.digerp.com/test/process.php",
      formdata
    );

    return response;
  } catch (e: any) {
    console.log("Error fetching MPESA transactions:", e);
    return null;
  }
}


export async function salesOrders (company_prefix: string, user_id: string){
 try {
    const formdata = new FormData();

    formdata.append("tp", "getSalesOrders");
    formdata.append("cp", company_prefix);
    formdata.append("user_id", user_id);

    const response = await axios.postForm(
      "https://marvel.digerp.com/dev/process.php",
      formdata
    );

    return response;
  } catch (e: any) {
    console.log("Error fetching MPESA transactions:", e);
    return null;
  }
}


export async function fetch_user_store_balance(

  company_prefix: string,
  user_id: string,
  user_store_loc_code: string
) {
  console.info("Fetching user store item balance");

  const form = new FormData();
  form.append("tp", "userStoreBalance");
  form.append("cp", company_prefix);
  form.append("id", user_id);
  form.append("loc_code", user_store_loc_code);

  try {
    const response = await axios.postForm(
      "https://marvel.digerp.com/dev/process.php",
      form
    );
    console.info("Successfully fetched store balance items");
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error(e);
      console.log("Failed to fetch user store");
    }
  }

  return null;
}


export async function loadProductPriceDetails(
  
  company_prefix: string,
  user_id: string,
  stock_id: string,
  kit: string | boolean | undefined,
  pricing_mode: PricingMode | undefined,
  store: DairyStore | null = null
): Promise<ProductPriceDetails | null> {
  const form = new FormData();
  form.append("tp", "getItemPriceQtyTaxWithId");
  form.append("it", stock_id);
  form.append("cp", company_prefix);
  form.append(
    "kit",
    typeof kit === "boolean" ? kit.toString() : kit || "false"
  );
  form.append("id", user_id);

  if (pricing_mode) {
    form.append("pid", pricing_mode.id);
  }

  if (store) {
    form.append("loc_code", store.loc_code);
  }

  try {
    const response = await axios.postForm<ProductPriceDetails[]>(
      "https://marvel.digerp.com/dev/process.php",
      form
    );
    console.info("Successfully fetched pricing details");
    // Assuming the API returns an array but we only need the first item
    return response.data.length > 0 ? response.data[0] : null;
  } catch (e) {
    console.error("Failed to fetch product price details:", e);
    return null;
  }
}