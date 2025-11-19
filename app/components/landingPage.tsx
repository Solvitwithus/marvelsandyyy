"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetch_site_info, login } from "../hooks/usesiteinfo";
import { useAuthStore, useSiteInformationPersist,useUserInformation } from "../store/authstore";

const LandingPage: React.FC = () => {
  const { setToken,token } = useAuthStore();
  const { siteInfo, setSiteInfo } = useSiteInformationPersist();
  const {  userInfo,setUserInfo} = useUserInformation()
  const router = useRouter();

  const [formData, setFormData] = useState({
    sitename: "",
    username: "",
    password: "",
    company: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch site info when sitename changes
  useEffect(() => {
    if (!formData.sitename.trim()) return;

    const fetchSite = async () => {
      try {
        setLoading(true);
        setError(null);
        const responseData = await fetch_site_info(formData.sitename);
        if (responseData) {
          setSiteInfo(responseData); // ✅ Persist site info in Zustand
        }
      } catch (err) {
        setError("Failed to fetch site info. Please check the site name.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [formData.sitename, setSiteInfo]);


  // Redirect if token exists
useEffect(() => {
  if (token) {
    router.push("/pos");
  }
}, [token, router]);


  // Handle login
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const loginData = await login({
        username: formData.username,
        password: formData.password,
        site: formData.sitename,
        company: siteInfo?.[0]?.company_prefix,
      });


      if (loginData?.status === 200) {
        // Persist token
        const token = loginData?.data?.token || "dummy-token";
        setToken(token);
        setUserInfo(loginData.data)
        console.log(loginData);
        router.push("/pos");
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Something went wrong during login.");
    } finally {
      setLoading(false);
    }
  };



  return (
    
    <div className="bg-[#fffbff] flex flex-col items-center justify-center min-h-screen text-[#222222]">
      <h2 className="text-[#c9184a] text-center font-black text-2xl mb-6">
        DIGI<span className="text-black">-</span>Sales
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 bg-white shadow-md rounded-xl p-6 border border-[#e0e0e0]"
      >
        <input
          type="text"
          name="sitename"
          value={formData.sitename}
          onChange={handleChange}
          placeholder="Enter Site Name"
          className="input-style"
        />

        {loading && <p className="text-gray-500 text-sm">Fetching site info...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="User Name"
          className="input-style"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="input-style"
        />

        <select
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="input-style"
        >
          <option value="">Company Name</option>
          {siteInfo?.[0]?.branch && (
            <option value={siteInfo[0].branch}>{siteInfo[0].branch}</option>
          )}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-[24rem] text-white bg-[#c9184a] py-2 mt-2 font-semibold rounded-md active:scale-95 hover:scale-105 transition-all disabled:opacity-50"
        >
          {loading ? "Please wait..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default LandingPage;
