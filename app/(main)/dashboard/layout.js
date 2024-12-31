import React, { Suspense } from "react";
import DashboardPage from "./page";
import { BarLoader } from "react-spinners";

const DashBoard = () => {
  return (
    <div className="px-5">
      <h1 className="text-6xl font-bold gradient-title">DashBoard</h1>

      {/* dashboardPage */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100"} color="#933ea" />}
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
};

export default DashBoard;
