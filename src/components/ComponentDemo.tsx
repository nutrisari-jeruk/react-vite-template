import { type ReactNode } from "react";
import CodeBlock from "./CodeBlock";

interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

interface ComponentDemoProps {
  title: string;
  description?: string;
  preview: ReactNode;
  code: string;
  props?: PropRow[];
  className?: string;
}

export default function ComponentDemo({
  title,
  description,
  preview,
  code,
  props,
  className = "",
}: ComponentDemoProps) {
  return (
    <div
      className={`mb-12 ${className}`}
      id={title.toLowerCase().replace(/\s+/g, "-")}
    >
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        {description && <p className="text-gray-600">{description}</p>}
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Preview
          </h4>
          <div className="bg-white border border-gray-200 rounded-lg p-8 flex flex-wrap items-center gap-4">
            {preview}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Code
          </h4>
          <CodeBlock code={code} language="tsx" />
        </div>

        {props && props.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Props
            </h4>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        Type
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        Default
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {props.map((prop, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-blue-600">
                          {prop.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-purple-600">
                          {prop.type}
                        </td>
                        <td className="px-4 py-3 font-mono text-gray-600">
                          {prop.default || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {prop.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
