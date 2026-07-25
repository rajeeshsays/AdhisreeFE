'use client'
import React from "react";
import DashboardMenu from "./dashboard/dashboardmenu";
export default function Home()  {
  console.log(process.env.NEXT_PUBLIC_API_URL)
  return (
   <DashboardMenu/>
  );
};


