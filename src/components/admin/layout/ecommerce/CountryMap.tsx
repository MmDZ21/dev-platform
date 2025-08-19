import React from "react";
// Temporarily disabled VectorMap for testing AdminDataTable
// import { VectorMap } from "@react-jvectormap/core";
// import { worldMill } from "@react-jvectormap/world";
// import dynamic from "next/dynamic";

// const VectorMap = dynamic(
//   () => import("@react-jvectormap/core").then((mod) => mod.VectorMap),
//   { ssr: false }
// );

// Define the component props
interface CountryMapProps {
  mapColor?: string;
}

type MarkerStyle = {
  initial: {
    fill: string;
    r: number; // Radius for markers
  };
};

type Marker = {
  latLng: [number, number];
  name: string;
  style?: {
    fill: string;
    borderWidth: number;
    borderColor: string;
    stroke?: string;
    strokeOpacity?: number;
  };
};

const CountryMap: React.FC<CountryMapProps> = ({ mapColor }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Country Map
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          VectorMap temporarily disabled for AdminDataTable testing.
        </p>
      </div>
      <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded">
        <p className="text-gray-700 dark:text-gray-300">
          Map component disabled
        </p>
      </div>
    </div>
  );
};

export default CountryMap;
