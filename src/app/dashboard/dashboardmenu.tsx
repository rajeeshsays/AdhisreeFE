"use client";

import { FaTruck, FaList, FaRoute, FaUser } from "react-icons/fa";
import "../dashboard/dashboardmenu.css";
import Link from "next/link";

export default function DashboardMenu() {

    const s = 30;
  const menuItems = [
    { key:"vehicle", name: "Vehicle", path: "/vehicle", icon: <FaTruck size={s} /> },
    { key:"vehicleType", name: "Vehicle Type", path: "/vehicletype", icon: <FaList size={40} /> },
    { key:"transport",name: "Transport", path: "/transport", icon: <FaRoute size={40} /> },
    { key:"driver",name: "Driver", path: "/driver", icon: <FaUser size={40} /> },
    { key:"party",name: "Party", path: "/party", icon: <FaTruck size={40} /> },
    { key:"location", name: "Location", path: "/location", icon: <FaRoute size={40} /> },
  ];

  return (
    <>
    <div className="dashboard-head">
    <h1 >🚚  AdhiSree Transport Service</h1></div>
    <div className="dashboard-wrapper">
    <div className="dashboard-container">
      {menuItems.map((item) => (
        <Link key={item.key} href={item.path} className="dashboard-card">
        {item.name}
        </Link>
      ))}
    </div>
    </div>
    </>
  );
}
