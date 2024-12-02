import Home from "@/page/home";
import About from "@/page/about";
import { RouteObject } from "react-router-dom";
import Settings from "@/page/settings";
import React from "react";
import Dashboard from "@/page/dashboard";
import Tools from "@/page/tools";
import CustomCalendar from "@/page/calendar";

const routes: RouteObject[] = [
  {
    path: "/",
    element: React.createElement(Home),
  },
  {
    path: "/tools",
    element: React.createElement(Tools),
  },
  {
    path: "/calendar",
    element: React.createElement(CustomCalendar),
  },

  {
    path: "/about",
    element: React.createElement(About),
  },
  {
    path: "/dashboard",
    element: React.createElement(Dashboard),
  },
  {
    path: "/settings",
    element: React.createElement(Settings),
  },
];

export default routes;
