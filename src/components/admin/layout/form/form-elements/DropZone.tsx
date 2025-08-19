"use client";
import React from "react";
import ComponentCard from "../../common/ComponentCard";
// Temporarily disabled react-dropzone for testing AdminDataTable
// import { useDropzone } from "react-dropzone";

const DropzoneComponent: React.FC = () => {
  // const onDrop = (acceptedFiles: File[]) => {
  //   console.log(acceptedFiles);
  // };

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <ComponentCard title="Drop Zone">
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            react-dropzone temporarily disabled for AdminDataTable testing.
          </p>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center dark:border-gray-700">
          <div className="space-y-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-500"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-gray-700 dark:text-gray-300">
              <p className="text-lg font-medium">Drop files here</p>
              <p className="text-sm">or click to select files</p>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

export default DropzoneComponent;
