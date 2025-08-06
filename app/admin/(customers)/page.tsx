"use client";

import { getCustomers } from "@/actions/admin.action";
import Filter from "@/components/shared/filter";
import Pagination from "@/components/shared/pagination";
import { formatPrice } from "@/lib/utils";
import { SearchParams } from "@/types";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { FC, useEffect, useState } from "react";

interface Props {
  searchParams: SearchParams;
}

const Page: FC<Props> = ({ searchParams }) => {
  const [customers, setCustomers] = useState<any[] | null>(null);
  const [isNext, setIsNext] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Fetch customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      const res = await getCustomers({
        searchQuery: `${searchParams.q || ""}`,
        filter: `${searchParams.filter || ""}`,
        page: `${searchParams.page || "1"}`,
      });
      setCustomers(res?.data?.customers || null);
      setIsNext(res?.data?.isNext || false);
    };
    fetchCustomerData();
  }, [searchParams]);

  // Responsive view mode detection
  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? "cards" : "table");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="space-y-4 p-2 xs:p-4">
      {/* Header with view toggle */}
      <div className=" w-full flex justify-between items-center xs:items-center   gap-3 ">
        <div className="flex items-center justify-between w-full ">
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">
            Customers
          </h1>
          <span className="hidden xs:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            {customers?.length || 0}{" "}
            {customers?.length === 1 ? "customer" : "customers"}
          </span>
        </div>
        <div className=" xs:w-auto flex items-center gap-2">
          <div className="max-lg:hidden">
            <Filter showCategory />
          </div>
          <button
            onClick={() =>
              setViewMode((prev) => (prev === "cards" ? "table" : "cards"))
            }
            className="xs:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label={
              viewMode === "cards"
                ? "Switch to table view"
                : "Switch to card view"
            }
          >
            {viewMode === "cards" ? (
              <svg
                className="w-5 h-5  text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <Separator className="my-3 h-px bg-gray-200 dark:bg-gray-700" />

      {customers && customers.length === 0 && (
        <div className="p-6 text-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="mx-auto w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            No customers found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Cards View (mobile and optional) */}
      {viewMode === "cards" && customers && customers.length > 0 && (
        <div className="grid grid-cols-1 gap-3 xs:gap-4">
          {customers.map((customer, index) => (
            <div
              key={customer._id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 xs:p-4 shadow-xs hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                {/* Customer avatar and basic info */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0">
                    {customer.fullName?.charAt(0)?.toUpperCase() ||
                      customer.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm xs:text-base truncate">
                      {customer.fullName || "Unknown User"}
                    </h3>
                    <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 truncate">
                      {customer.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] xs:text-xs font-medium ${
                      customer.isDeleted
                        ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    }`}
                  >
                    {customer.isDeleted ? "Deleted" : "Active"}
                  </span>
                  <span className="text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400">
                    #{index + 1}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3 xs:w-4 xs:h-4 text-blue-500 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span className="text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {customer.orderCount} orders
                  </span>
                </div>
                <span className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-white">
                  {formatPrice(customer.totalPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

{viewMode === "table" && customers && customers.length > 0 && (
  <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    {/* Responsive table container */}
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr className="text-left text-xs xs:text-sm text-gray-500 dark:text-gray-400">
            <th className="px-2 xs:px-3 py-2 font-medium w-10">#</th>
            <th className="px-2 xs:px-3 py-2 font-medium min-w-[100px]">Customer</th>
            <th className="px-2 xs:px-3 py-2 font-medium min-w-[120px]">Email</th>
            <th className="px-2 xs:px-3 py-2 font-medium text-center w-16 xs:w-20">Orders</th>
            <th className="px-2 xs:px-3 py-2 font-medium text-center w-20 xs:w-24">Status</th>
            <th className="px-2 xs:px-3 py-2 font-medium text-right w-24 xs:w-28">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {customers.map((customer, index) => (
            <tr
              key={customer._id}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td className="px-2 xs:px-3 py-2 text-xs xs:text-sm font-medium text-gray-900 dark:text-white">
                {index + 1}
              </td>
              <td className="px-2 xs:px-3 py-2 min-w-0">
                <div className="flex items-center gap-2 xs:gap-3">
                  <div className="w-6 h-6 xs:w-8 xs:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-[10px] xs:text-xs font-medium shrink-0">
                    {customer.fullName?.charAt(0)?.toUpperCase() ||
                      customer.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </div>
                  <span className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white truncate max-w-[80px] xs:max-w-[120px]">
                    {customer.fullName || "Unknown User"}
                  </span>
                </div>
              </td>
              <td className="px-2 xs:px-3 py-2 text-xs xs:text-sm text-gray-500 dark:text-gray-400 truncate max-w-[100px] xs:max-w-[160px]">
                {customer.email}
              </td>
              <td className="px-2 xs:px-3 py-2 text-center">
                <span className="inline-flex items-center px-1.5 xs:px-2 py-0.5 rounded text-[10px] xs:text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {customer.orderCount}
                </span>
              </td>
              <td className="px-2 xs:px-3 py-2 text-center">
                <span
                  className={`inline-flex items-center px-1.5 xs:px-2 py-0.5 rounded text-[10px] xs:text-xs font-medium ${
                    customer.isDeleted
                      ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  }`}
                >
                  {customer.isDeleted ? "Deleted" : "Active"}
                </span>
              </td>
              <td className="px-2 xs:px-3 py-2 text-right text-xs xs:text-sm font-semibold text-gray-900 dark:text-white">
                {formatPrice(customer.totalPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          isNext={isNext}
          pageNumber={searchParams?.page ? +searchParams.page : 1}
        />
      </div>
    </div>
  );
};

export default Page;
