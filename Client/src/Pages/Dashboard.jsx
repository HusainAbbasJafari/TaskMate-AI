import StatusDonutChart from "../components/StatusDonutChart";
import '../tailwind.css' ;
export default function Dashboard() {
  return (

    <>
      <h1 className=" px-6 pt-6 pb-10 text-2xl font-semibold mb-4">Summary</h1>

      {/* Top Stats */}
      <div className=" px-6 pt-6 pb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {["0 completed", "1 updated", "1 created", "0 due soon"].map((text, i) => (
          <div
            key={i}
            className="bg-gray-100 p-4 rounded-lg text-center font-medium text-gray-800 shadow-sm"
          >
            {text}
          </div>
        ))}
      </div>

      {/* Donut + Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Donut Chart */}
        <div className=" px-6 pt-6 pb-10 bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Status overview</h2>
          <StatusDonutChart />
        </div>

        {/* Activity Feed */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Recent activity</h2>
          <ul className="text-sm space-y-4">
            <li className="text-gray-600">
              <span className="font-bold text-blue-600">saifakhtar285</span> updated field "status" on
              <span className="ml-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">JC-1: create jira clone</span>
              <div className="text-xs text-gray-400">about 2 hours ago</div>
            </li>
            {/* Add more activities here */}
          </ul>
        </div>
      </div>

      {/* Additional Summary Sections */}
      <div className="px-6 pt-6 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Priority breakdown</h2>
          <div className="text-sm text-gray-600 mb-2">Get a holistic view of how work is being prioritized.</div>
          <div className="h-40 flex items-end space-x-4 justify-center">
            {["Highest", "High", "Medium", "Low", "Lowest"].map((label, i) => (
              <div key={label} className="flex flex-col items-center">
                <div
                  className={`w-6 rounded bg-blue-500 ${label === "Medium" ? "h-32" : "h-6"} transition-all`}
                ></div>
                <span className="text-xs mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Types of Work */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Types of work</h2>
          <div className="space-y-3 mt-4">
            {[
              { label: "Task", percent: 100, color: "bg-blue-500" },
              { label: "Epic", percent: 0, color: "bg-purple-400" },
              { label: "Subtask", percent: 0, color: "bg-gray-300" },
            ].map(({ label, percent, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>{label}</span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div
                    className={`${color} h-2 rounded`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Workload */}
        <div className=" px-6 pt-6 pb-10 bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Team workload</h2>
          <div className="text-sm text-gray-600 mb-2">Monitor the capacity of your team.</div>
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-800 mb-1">Unassigned</div>
            <div className="w-full h-3 bg-gray-200 rounded">
              <div className="bg-gray-600 h-3 rounded" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>

        {/* Epic Progress */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center mb-2">
            <span className="text-blue-500 text-2xl font-bold">+</span>
          </div>
          <h2 className="font-semibold mb-1">Epic progress</h2>
          <p className="text-sm text-gray-600">Use epics to track larger initiatives in your project.</p>
        </div>
      </div>

    </>
  );
}
