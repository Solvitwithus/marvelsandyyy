"use client";
import { useSiteInformationPersist } from '@/app/store/authstore';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { BookAIcon, PowerIcon } from 'lucide-react';

function Header() {
  const path = usePathname();
  const { siteInfo } = useSiteInformationPersist();

  const theNavigationLinks = [
    { name: "POS", path: "/pos" },
    { name: "Inventory", path: "/inventory" },
    { name: "Reports", path: "/reports" },
  ];

  const leftsectionlinks = [
    { name: "Manual", path: "/sectionlinks/manual", icon: BookAIcon },
    { name: "Log Out", path: "/", icon: PowerIcon },
  ];

  return (
    <div className="flex items-center justify-between px-6 py-0 bg-[#fffbff] border-b border-black/30">
      {/* Left section */}
      <div>
        <h5 className="text-[#c9184a] font-black text-2xl">Digisales Pos</h5>
        <p className='text-gray-900 text-sm'>{siteInfo?.[0]?.branch || "No branch selected"}</p>
      </div>

      {/* Right group (middle + right items together) */}
      <div className="flex items-center gap-8">
        {/* Middle navigation */}
        <div className="flex gap-6">
          {theNavigationLinks.map((val) => (
            <Link
              key={val.path}
              href={val.path}
              className={path === val.path ? "text-red-600 font-bold" : "text-gray-600 hover:text-red-600"}
            >
              {val.name}
            </Link>
          ))}
        </div>

        {/* Right utility links */}
        <div className="hidden sm:flex gap-4 items-center">
          {leftsectionlinks.map((val) => (
            <Link
              href={val.path}
              key={val.name}
              className="flex gap-2 text-[#7c7c7c] font-semibold items-center"
            >
              <span>{val.name}</span>
              <val.icon className="text-[#c9184a]" size={20} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Header;
