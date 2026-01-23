import { type ReactNode } from "react";
import { CodeBlock } from "./code-block";

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

export function ComponentDemo({
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
        <h3 className="mb-2 text-2xl font-bold text-balance text-gray-900">
          {title}
        </h3>
        {description && (
          <p className="text-pretty text-gray-600">{description}</p>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="mb-3 text-sm font-semibold text-balance text-gray-700 uppercase">
            Preview
          </h4>
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-white p-8">
            {preview}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-balance text-gray-700 uppercase">
            Code
          </h4>
          <CodeBlock code={code} language="tsx" />
        </div>

        {props && props.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-semibold text-balance text-gray-700 uppercase">
              Props
            </h4>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Default
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
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

export default ComponentDemo;
