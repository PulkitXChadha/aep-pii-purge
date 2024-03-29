/*
 * <license header>
 */

import React from "react";
import { NavLink } from "react-router-dom";

function SideBar() {
  return (
    <ul className="SideNav">
      <li className="SideNav-item">
        <NavLink
          className="SideNav-itemLink"
          activeClassName="is-selected"
          aria-current="page"
          exact
          to="/"
        >
          Home
        </NavLink>
      </li>
      <li className="SideNav-item">
        <NavLink
          className="SideNav-itemLink"
          activeClassName="is-selected"
          aria-current="page"
          to="/actions"
        >
          Your App Actions
        </NavLink>
      </li>
      <li className="SideNav-item">
        <NavLink
          className="SideNav-itemLink"
          activeClassName="is-selected"
          aria-current="page"
          to="/runtimeLogs"
        >
          Runtime Logs
        </NavLink>
      </li>
      <li className="SideNav-item">
        <NavLink
          className="SideNav-itemLink"
          activeClassName="is-selected"
          aria-current="page"
          to="/aiostatelist"
        >
          AIO State List
        </NavLink>
      </li>
      <li className="SideNav-item">
        <NavLink
          className="SideNav-itemLink"
          activeClassName="is-selected"
          aria-current="page"
          to="/about"
        >
          About Project Firefly Apps
        </NavLink>
      </li>
    </ul>
  );
}

export default SideBar;
