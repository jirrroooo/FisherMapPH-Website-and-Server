import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 flex justify-between items-center h-15 p-4 text-white">
      <p className="text-yellow-50 ml-4 font-semibold text-2xl mr-auto">
        FisherMap PH
      </p>
      <ul className="flex gap-6 list-none text-gray-200">
        <li>
          <a>Super Admin</a>
        </li>
      </ul>
    </nav>
  );
}
