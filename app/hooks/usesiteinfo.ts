import axios from "axios";

export interface LoginParams {
  site: string;
  username: string;
  password: string;
  company: string;
}
export async function fetch_site_info (site:string){
     const formdata = new FormData()
     formdata.append("tp","getsites");
     formdata.append("cmp", site);
try{
     const response = await axios.postForm("https://digerp.com/config_site.php",formdata,{headers:{ "Content-Type": "multipart/form-data",}})
      if (response.data.length === 0) {
      return null;
    }fetch_site_info


    return response.data;

  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.log("Failed to login. Network error: ", e.message);
    }
    return null;
  }
}

export async function login({
  site,
  username,
  password,
  company
  }:LoginParams
) {
  try {
    const form_data = new FormData();
    form_data.append("tp", "login");
    form_data.append("un", username);
    form_data.append("up", password);
    form_data.append("cp", company);
    const response = await axios.postForm(
      "https://marvel.digerp.com/test/process.php",
      form_data
    );


    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}


export async function salesTypeInfo(
  prefix:string
){
  try{
const form = new FormData()
 form.append("tp", "loadPriceSelector");
      form.append("cp", prefix)

  const response = await axios.postForm(
      "https://marvel.digerp.com/test/process.php",
      form
    );


    return response;

  }
 catch (e) {
    console.log(e);
    return null;
  }
}