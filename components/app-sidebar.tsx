"use client";

import * as React from "react";
import { PieChart, BookOpen, Bot} from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "John Doe",
    email: "new@gmail.com"},

  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
    },
  ],
  navMain: [
    {
      title: "QR Codes",
      url: "/dashboard/qr-codes",
      icon: Bot,
      items: [
        {
          title: "All QR Codes",
          url: "/dashboard/qr-codes",
        },
        {
          title: "Create QR Code",
          url: "/dashboard/qr-codes/create",
        },
      ],
    },
    {
      title: "Shortened URLs",
      url: "/dashboard/urls",
      icon: BookOpen,
      items: [
        {
          title: "All URLs",
          url: "/dashboard/urls",
        },
        {
          title: "Create Shortened URL",
          url: "/dashboard/urls/create",
        },
      ],
    },
  ],
};



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
