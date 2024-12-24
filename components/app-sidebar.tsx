"use client";

import * as React from "react";
import { Sidebar } from "@/components/ui/sidebar";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      
    </Sidebar>
  );
}
