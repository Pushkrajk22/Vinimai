"use client";
import React, { useState } from "react";
import * as Icon from "@phosphor-icons/react/dist/ssr";

const AdminOrdersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Dummy static data
  const orders = Array.from({ length: 22 }, (_, i) => ({
    id: 100 + i,
    customer: `Customer ${i + 1}`,
    total: `₹${(i + 1) * 500}`,
    status: ["Pending", "Completed", "Canceled"][i % 3],
    date: `2025-08-${(i % 30) + 1}`,
  }));

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedData = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full p-7 border border-line rounded-xl bg-white">
      <h6 className="heading6 mb-4 flex items-center gap-2">
        <Icon.Package size={20} />
        All Orders
      </h6>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-secondary border-separate border-spacing-0 rounded-lg overflow-hidden shadow-md">
                <thead className="bg-surface text-xs font-semibold uppercase tracking-wide text-black">
                    <tr>
                    <th className="px-6 py-4 text-left">Customer</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-left">Order ID</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((order, idx) => (
                    <tr
                        key={order.id}
                        className={`${idx % 2 === 0 ? "bg-surface" : "bg-white"} hover:bg-surface2 transition-colors`}
                    >
                        {/* Customer */}
                        <td className="px-6 py-4 font-medium text-black">{order.customer}</td>

                        {/* Total */}
                        <td className="px-6 py-4 text-right font-semibold text-black">
                        {order.total}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-secondary2">
                        {new Date(order.date).toLocaleDateString()}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                        <span
                            className={`px-3 py-1.5 rounded-full text-xs font-medium bg-white border-2 ${
                            order.status === "Completed"
                                ? "text-success border-success"
                                : order.status === "Pending"
                                ? "text-yellow border-yellow"
                                : "text-red border-red"
                            }`}
                        >
                            {order.status}
                        </span>
                        </td>

                        {/* Long Order ID */}
                        <td className="px-6 py-4 font-mono text-secondary2 break-all text-xs">
                        C71b9fb3-Ab14-4097-B6ea-Ee187459cb94{order.id}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>

      {/* Numbered Pagination */}
      <div className="flex items-center justify-center gap-2 p-4 border-t border-line">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
