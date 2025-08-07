import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faUsers,
  faCalendar,
  faChartBar,
  faBell,
  faCog,
  faHeartbeat,
  faBars,
  faSun,
  faMoon,
  faPlus,
  faSearch,
  faEye,
  faEdit,
  faTrash,
  faTimes,
  faCalendarCheck,
  faChartLine,
  faHospital,
  faCalendarAlt,
  faClock,
  faStar,
  faBed,
  faUserMd,
} from "@fortawesome/free-solid-svg-icons";
import * as echarts from "echarts";

// Add icons to the library
library.add(
  faHome,
  faUsers,
  faCalendar,
  faChartBar,
  faBell,
  faCog,
  faHeartbeat,
  faBars,
  faSun,
  faMoon,
  faPlus,
  faSearch,
  faEye,
  faEdit,
  faTrash,
  faTimes,
  faCalendarCheck,
  faChartLine,
  faHospital,
  faCalendarAlt,
  faClock,
  faStar,
  faBed,
  faUserMd
);

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: "Active" | "Recovered" | "Critical";
  lastVisit: string;
  avatar: string;
}

interface Appointment {
  id: string;
  patientName: string;
  doctor: string;
  time: string;
  date: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  type: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] =
    useState<boolean>(false);
  
  // Initialize sidebar collapsed state based on screen size
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024; // Collapse on mobile/tablet (lg breakpoint)
    }
    return false;
  });

  const patients: Patient[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      age: 34,
      condition: "Hypertension",
      status: "Active",
      lastVisit: "2024-01-15",
      avatar:
        "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20aged%20woman%20with%20warm%20smile%20wearing%20medical%20scrubs%20in%20a%20clean%20modern%20hospital%20setting%20with%20soft%20lighting%20and%20neutral%20background&width=60&height=60&seq=patient1&orientation=squarish",
    },
    {
      id: "2",
      name: "Michael Chen",
      age: 45,
      condition: "Diabetes",
      status: "Recovered",
      lastVisit: "2024-01-12",
      avatar:
        "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20aged%20asian%20man%20with%20friendly%20expression%20wearing%20casual%20shirt%20in%20a%20clean%20modern%20hospital%20setting%20with%20soft%20lighting%20and%20neutral%20background&width=60&height=60&seq=patient2&orientation=squarish",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      age: 28,
      condition: "Asthma",
      status: "Critical",
      lastVisit: "2024-01-14",
      avatar:
        "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20hispanic%20woman%20with%20confident%20smile%20wearing%20light%20blue%20top%20in%20a%20clean%20modern%20hospital%20setting%20with%20soft%20lighting%20and%20neutral%20background&width=60&height=60&seq=patient3&orientation=squarish",
    },
    {
      id: "4",
      name: "David Wilson",
      age: 52,
      condition: "Heart Disease",
      status: "Active",
      lastVisit: "2024-01-13",
      avatar:
        "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20mature%20caucasian%20man%20with%20gentle%20expression%20wearing%20dark%20shirt%20in%20a%20clean%20modern%20hospital%20setting%20with%20soft%20lighting%20and%20neutral%20background&width=60&height=60&seq=patient4&orientation=squarish",
    },
  ];

  const appointments: Appointment[] = [
    {
      id: "1",
      patientName: "Sarah Johnson",
      doctor: "Dr. Smith",
      time: "09:00",
      date: "2024-01-16",
      status: "Scheduled",
      type: "Consultation",
    },
    {
      id: "2",
      patientName: "Michael Chen",
      doctor: "Dr. Brown",
      time: "10:30",
      date: "2024-01-16",
      status: "Scheduled",
      type: "Follow-up",
    },
    {
      id: "3",
      patientName: "Emily Rodriguez",
      doctor: "Dr. Davis",
      time: "14:00",
      date: "2024-01-16",
      status: "Completed",
      type: "Emergency",
    },
  ];

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      patient.status.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Patient Trends Chart
    const trendsChartElement = document.getElementById("trendsChart");
    const trendsOption = {
      animation: false,
      backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
      grid: {
        top: 20,
        right: 20,
        bottom: 40,
        left: 40,
      },
      xAxis: {
        type: "category",
        data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        axisLine: { lineStyle: { color: isDarkMode ? "#4b5563" : "#E5E7EB" } },
        axisTick: { show: false },
        axisLabel: { color: isDarkMode ? "#9ca3af" : "#6B7280" },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: isDarkMode ? "#9ca3af" : "#6B7280" },
        splitLine: { lineStyle: { color: isDarkMode ? "#374151" : "#F3F4F6" } },
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
          smooth: true,
          lineStyle: { color: "#2563EB", width: 3 },
          itemStyle: { color: "#2563EB" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(37, 99, 235, 0.3)" },
              { offset: 1, color: "rgba(37, 99, 235, 0.1)" },
            ]),
          },
        },
      ],
    };
    if (trendsChartElement) {
      const trendsChart = echarts.init(trendsChartElement);
      trendsChart.setOption(trendsOption);
    }

    // Department Distribution Chart
    const deptChartElement = document.getElementById("deptChart");
    const deptOption = {
      animation: false,
      backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          data: [
            { value: 335, name: "Cardiology", itemStyle: { color: "#2563EB" } },
            { value: 310, name: "Neurology", itemStyle: { color: "#10B981" } },
            {
              value: 234,
              name: "Orthopedics",
              itemStyle: { color: "#F59E0B" },
            },
            { value: 135, name: "Pediatrics", itemStyle: { color: "#EF4444" } },
          ],
          label: {
            show: true,
            formatter: "{b}: {c}",
            color: isDarkMode ? "#e5e7eb" : "#374151",
          },
        },
      ],
    };
    if (deptChartElement) {
      const deptChart = echarts.init(deptChartElement);
      deptChart.setOption(deptOption);
    }

    // Recovery Rate Chart
    const recoveryChartElement = document.getElementById("recoveryChart");
    const recoveryOption = {
      animation: false,
      backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
      grid: {
        top: 20,
        right: 20,
        bottom: 40,
        left: 40,
      },
      xAxis: {
        type: "category",
        data: ["Week 1", "Week 2", "Week 3", "Week 4"],
        axisLine: { lineStyle: { color: isDarkMode ? "#4b5563" : "#E5E7EB" } },
        axisTick: { show: false },
        axisLabel: { color: isDarkMode ? "#9ca3af" : "#6B7280" },
      },
      yAxis: {
        type: "value",
        max: 100,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: isDarkMode ? "#9ca3af" : "#6B7280",
          formatter: "{value}%",
        },
        splitLine: { lineStyle: { color: isDarkMode ? "#374151" : "#F3F4F6" } },
      },
      series: [
        {
          data: [85, 88, 92, 95],
          type: "bar",
          itemStyle: { color: "#10B981" },
          barWidth: "60%",
        },
      ],
    };
    if (recoveryChartElement) {
      const recoveryChart = echarts.init(recoveryChartElement);
      recoveryChart.setOption(recoveryOption);
    }

    return () => {
      const trendsChartElement = document.getElementById("trendsChart");
      const deptChartElement = document.getElementById("deptChart");
      const recoveryChartElement = document.getElementById("recoveryChart");

      if (trendsChartElement) {
        echarts.getInstanceByDom(trendsChartElement)?.dispose();
      }
      if (deptChartElement) {
        echarts.getInstanceByDom(deptChartElement)?.dispose();
      }
      if (recoveryChartElement) {
        echarts.getInstanceByDom(recoveryChartElement)?.dispose();
      }
    };
  }, [isDarkMode]);

  const getStatusColor = (status: string) => {
    if (isDarkMode) {
      switch (status) {
        case "Active":
          return "bg-blue-900 text-blue-200 border border-blue-700";
        case "Recovered":
          return "bg-green-900 text-green-200 border border-green-700";
        case "Critical":
          return "bg-red-900 text-red-200 border border-red-700";
        case "Scheduled":
          return "bg-yellow-900 text-yellow-200 border border-yellow-700";
        case "Completed":
          return "bg-green-900 text-green-200 border border-green-700";
        case "Cancelled":
          return "bg-red-900 text-red-200 border border-red-700";
        default:
          return "bg-gray-700 text-gray-200 border border-gray-600";
      }
    } else {
      switch (status) {
        case "Active":
          return "bg-blue-100 text-blue-800";
        case "Recovered":
          return "bg-green-100 text-green-800";
        case "Critical":
          return "bg-red-100 text-red-800";
        case "Scheduled":
          return "bg-yellow-100 text-yellow-800";
        case "Completed":
          return "bg-green-100 text-green-800";
        case "Cancelled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: faHome },
    { id: "patients", label: "Patients", icon: faUsers },
    { id: "appointments", label: "Appointments", icon: faCalendar },
    { id: "analytics", label: "Analytics", icon: faChartBar },
    { id: "notifications", label: "Notifications", icon: faBell },
    { id: "settings", label: "Settings", icon: faCog },
  ];

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        } ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } shadow-lg border-r ${
          sidebarCollapsed 
            ? "hidden lg:block" 
            : "block lg:block"
        }`}
      >
        <div
          className={`p-3 sm:p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon
                icon={faHeartbeat}
                className="text-white text-sm sm:text-lg"
              />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1
                  className={`text-lg sm:text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  HealthCare
                </h1>
                <p
                  className={`text-xs sm:text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Analytics
                </p>
              </div>
            )}
          </div>
        </div>
        <nav className="mt-4 sm:mt-8">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                // Auto-collapse sidebar on mobile when menu item is clicked
                if (window.innerWidth < 1024) {
                  setSidebarCollapsed(true);
                }
              }}
              className={`w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-left transition-colors cursor-pointer ${
                activeTab === item.id
                  ? `${
                      isDarkMode
                        ? "bg-gray-700 border-blue-400"
                        : "bg-blue-50 border-blue-600"
                    } border-r-2`
                  : `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-50"}`
              }`}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={`text-sm sm:text-lg ${
                  activeTab === item.id
                    ? "text-blue-600"
                    : `${isDarkMode ? "text-gray-400" : "text-gray-500"}`
                }`}
              />
              {!sidebarCollapsed && (
                <span
                  className={`ml-2 sm:ml-3 text-sm sm:text-base ${
                    activeTab === item.id
                      ? "text-blue-600 font-medium"
                      : `${isDarkMode ? "text-gray-300" : "text-gray-700"}`
                  }`}
                >
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 min-h-screen overflow-x-hidden ${
          sidebarCollapsed 
            ? "ml-0 lg:ml-16" 
            : "ml-0 lg:ml-64"
        }`}
        onClick={() => {
          // Close sidebar when clicking on main content on mobile
          if (!sidebarCollapsed && window.innerWidth < 1024) {
            setSidebarCollapsed(true);
          }
        }}
      >
        {/* Header */}
        <header
          className={`${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } shadow-sm border-b px-3 sm:px-4 lg:px-6 py-3 sm:py-4 sticky top-0 z-40 w-full`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <FontAwesomeIcon
                  icon={faBars}
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                />
              </button>
              <h2
                className={`text-lg sm:text-xl lg:text-2xl font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } capitalize`}
              >
                {activeTab}
              </h2>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <FontAwesomeIcon
                  icon={isDarkMode ? faSun : faMoon}
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                />
              </button>
              <div className="relative hidden sm:block">
                <button
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faBell}
                    className={`${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              </div>
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20confident%20healthcare%20administrator%20wearing%20white%20coat%20with%20stethoscope%20in%20modern%20medical%20facility%20with%20clean%20background%20and%20professional%20lighting&width=40&height=40&seq=admin1&orientation=squarish" />
                <AvatarFallback className={`text-xs sm:text-sm ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>DR</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <Card
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } hover:shadow-lg transition-all duration-200`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-xs sm:text-sm font-medium ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Total Patients
                      </p>
                      <p
                        className={`text-2xl sm:text-3xl font-bold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        2,847
                      </p>
                      <p className="text-xs sm:text-sm text-green-600">
                        +12% from last month
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${
                        isDarkMode ? "bg-blue-900" : "bg-blue-100"
                      } rounded-lg flex items-center justify-center`}
                    >
                      <FontAwesomeIcon
                        icon={faUsers}
                        className={`${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        } text-lg sm:text-xl`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } hover:shadow-lg transition-all duration-200`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-xs sm:text-sm font-medium ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Today's Appointments
                      </p>
                      <p
                        className={`text-2xl sm:text-3xl font-bold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        24
                      </p>
                      <p className="text-xs sm:text-sm text-green-600">
                        +8% from yesterday
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${
                        isDarkMode ? "bg-green-900" : "bg-green-100"
                      } rounded-lg flex items-center justify-center`}
                    >
                      <FontAwesomeIcon
                        icon={faCalendarCheck}
                        className={`${
                          isDarkMode ? "text-green-400" : "text-green-600"
                        } text-lg sm:text-xl`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } hover:shadow-lg transition-all duration-200`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-xs sm:text-sm font-medium ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Recovery Rate
                      </p>
                      <p
                        className={`text-2xl sm:text-3xl font-bold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        95%
                      </p>
                      <p className="text-xs sm:text-sm text-green-600">
                        +3% from last week
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${
                        isDarkMode ? "bg-yellow-900" : "bg-yellow-100"
                      } rounded-lg flex items-center justify-center`}
                    >
                      <FontAwesomeIcon
                        icon={faChartLine}
                        className={`${
                          isDarkMode ? "text-yellow-400" : "text-yellow-600"
                        } text-lg sm:text-xl`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } hover:shadow-lg transition-all duration-200`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-xs sm:text-sm font-medium ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Department Performance
                      </p>
                      <p
                        className={`text-2xl sm:text-3xl font-bold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        98.5%
                      </p>
                      <p className="text-xs sm:text-sm text-green-600">
                        +1.2% from last month
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${
                        isDarkMode ? "bg-red-900" : "bg-red-100"
                      } rounded-lg flex items-center justify-center`}
                    >
                      <FontAwesomeIcon
                        icon={faHospital}
                        className={`${
                          isDarkMode ? "text-red-400" : "text-red-600"
                        } text-lg sm:text-xl`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <Card
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } hover:shadow-lg transition-all duration-200`}
              >
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle
                    className={`text-lg sm:text-xl ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Patient Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div
                    id="trendsChart"
                    style={{ width: "100%", height: "250px" }}
                  ></div>
                </CardContent>
              </Card>

              <Card
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } hover:shadow-lg transition-all duration-200`}
              >
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle
                    className={`text-lg sm:text-xl ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Department Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div
                    id="deptChart"
                    style={{ width: "100%", height: "250px" }}
                  ></div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              <Card
                className={`xl:col-span-2 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } hover:shadow-lg transition-all duration-200`}
              >
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle
                    className={`text-lg sm:text-xl ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Recent Patients
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3 sm:space-y-4">
                    {patients.slice(0, 3).map((patient) => (
                      <div
                        key={patient.id}
                        className={`flex items-center space-x-3 sm:space-x-4 p-3 rounded-lg transition-colors ${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                        }`}
                      >
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                          <AvatarImage src={patient.avatar} />
                          <AvatarFallback className={`text-xs sm:text-sm ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium text-sm sm:text-base truncate ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {patient.name}
                          </p>
                          <p
                            className={`text-xs sm:text-sm truncate ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {patient.condition}
                          </p>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } hover:shadow-lg transition-all duration-200`}
              >
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle
                    className={`text-lg sm:text-xl ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Recovery Rate Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div
                    id="recoveryChart"
                    style={{ width: "100%", height: "200px" }}
                  ></div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === "patients" && (
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
            {/* Search and Filter */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="w-full">
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                  <Input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 w-full !rounded-button ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className={`px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer text-sm flex-1 sm:flex-none sm:min-w-[140px] ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="recovered">Recovered</option>
                  <option value="critical">Critical</option>
                </select>
                <Button
                  className={`!rounded-button whitespace-nowrap cursor-pointer px-4 py-2 text-sm w-full sm:w-auto ${
                    isDarkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                      : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  }`}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Patient
                </Button>
              </div>
            </div>

            {/* Patients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {filteredPatients.map((patient) => (
                <Card
                  key={patient.id}
                  className={`hover:shadow-lg transition-shadow ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                      <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                        <AvatarImage src={patient.avatar} />
                        <AvatarFallback className={`text-xs sm:text-sm ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold text-sm sm:text-base truncate ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {patient.name}
                        </h3>
                        <p
                          className={`text-xs sm:text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Age: {patient.age}
                        </p>
                        <Badge
                          className={`mt-1 text-xs ${getStatusColor(patient.status)}`}
                        >
                          {patient.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span
                          className={`text-xs sm:text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Condition:
                        </span>
                        <span
                          className={`text-xs sm:text-sm font-medium truncate ml-2 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {patient.condition}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          className={`text-xs sm:text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Last Visit:
                        </span>
                        <span
                          className={`text-xs sm:text-sm font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {patient.lastVisit}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1 sm:space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`flex-1 !rounded-button whitespace-nowrap cursor-pointer text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${
                          isDarkMode 
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white" 
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`flex-1 !rounded-button whitespace-nowrap cursor-pointer text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${
                          isDarkMode 
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white" 
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`!rounded-button whitespace-nowrap cursor-pointer text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${
                          isDarkMode 
                            ? "border-gray-600 hover:bg-red-900 hover:border-red-700" 
                            : "border-gray-300 hover:bg-red-50 hover:border-red-200"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-red-500"
                        />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
            <div className="flex flex-col gap-3 sm:gap-4">
              <h3
                className={`text-lg sm:text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Appointment Management
              </h3>
              <Dialog
                open={isAppointmentModalOpen}
                onOpenChange={setIsAppointmentModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className={`!rounded-button whitespace-nowrap cursor-pointer px-4 py-2 text-sm w-full sm:w-auto ${
                    isDarkMode 
                      ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" 
                      : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  }`}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Schedule Appointment
                  </Button>
                </DialogTrigger>

                <DialogContent
                  className={`max-w-[95vw] sm:max-w-[425px] ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                >
                  <DialogHeader>
                    <DialogTitle
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Schedule New Appointment
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="patient"
                        className={`text-right ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Patient
                      </Label>
                      <Input
                        id="patient"
                        placeholder="Select patient..."
                        className={`col-span-3 !rounded-button ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="doctor"
                        className={`text-right ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Doctor
                      </Label>
                      <Input
                        id="doctor"
                        placeholder="Select doctor..."
                        className={`col-span-3 !rounded-button ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="date"
                        className={`text-right ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        className={`col-span-3 !rounded-button ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="time"
                        className={`text-right ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Time
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        className={`col-span-3 !rounded-button ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="notes"
                        className={`text-right ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional notes..."
                        className={`col-span-3 !rounded-button ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsAppointmentModalOpen(false)}
                      className={`!rounded-button whitespace-nowrap cursor-pointer px-6 py-2 transition-all duration-200 ${
                        isDarkMode
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white focus:ring-gray-500"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-500"
                      }`}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setIsAppointmentModalOpen(false)}
                      className={`!rounded-button whitespace-nowrap cursor-pointer px-6 py-2 transition-all duration-200 ${
                        isDarkMode
                          ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl"
                          : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      Schedule Appointment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Calendar and Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Calendar */}
              <Card
                className={`lg:col-span-2 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } hover:shadow-lg transition-all duration-200`}
              >
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle
                    className={`text-lg sm:text-xl ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Calendar View
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div
                    className={`${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    } rounded-lg p-4 h-64 sm:h-96 flex items-center justify-center`}
                  >
                    <div className="text-center">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className={`text-3xl sm:text-4xl ${
                          isDarkMode ? "text-gray-400" : "text-gray-400"
                        } mb-4`}
                      />
                      <p
                        className={`text-sm sm:text-base ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Interactive Calendar
                      </p>
                      <p
                        className={`text-xs sm:text-sm ${
                          isDarkMode ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        July 2025
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Appointments */}
              <Card
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } hover:shadow-lg transition-all duration-200`}
              >
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle
                    className={`text-lg sm:text-xl ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Today's Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3 sm:space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`p-3 border rounded-lg ${
                          isDarkMode ? "border-gray-600" : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4
                            className={`font-medium text-sm sm:text-base ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {appointment.patientName}
                          </h4>
                          <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <p
                          className={`text-xs sm:text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {appointment.doctor}
                        </p>
                        <p
                          className={`text-xs sm:text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {appointment.time} - {appointment.type}
                        </p>
                        <div className="flex space-x-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`!rounded-button whitespace-nowrap cursor-pointer text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${
                              isDarkMode 
                                ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white" 
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <FontAwesomeIcon icon={faEdit} className="mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`!rounded-button whitespace-nowrap cursor-pointer text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${
                              isDarkMode 
                                ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white" 
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <FontAwesomeIcon icon={faTimes} className="mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className={`grid w-full grid-cols-2 lg:grid-cols-4 ${
                isDarkMode 
                  ? "bg-gray-800 border-gray-700" 
                  : "bg-gray-100 border-gray-200"
              }`}>
                <TabsTrigger 
                  value="overview"
                  className={`text-xs sm:text-sm px-2 py-1 ${
                    isDarkMode 
                      ? "data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400" 
                      : "data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600"
                  }`}
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="patients"
                  className={`text-xs sm:text-sm px-2 py-1 ${
                    isDarkMode 
                      ? "data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400" 
                      : "data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600"
                  }`}
                >
                  Patient Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="appointments"
                  className={`text-xs sm:text-sm px-2 py-1 ${
                    isDarkMode 
                      ? "data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400" 
                      : "data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600"
                  }`}
                >
                  Appointment Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="departments"
                  className={`text-xs sm:text-sm px-2 py-1 ${
                    isDarkMode 
                      ? "data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400" 
                      : "data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600"
                  }`}
                >
                  Department Analytics
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <Card
                    className={`${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } hover:shadow-lg transition-all duration-200`}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`text-xs sm:text-sm font-medium ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Average Wait Time
                          </p>
                          <p
                            className={`text-xl sm:text-2xl font-bold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            15 min
                          </p>
                        </div>
                        <FontAwesomeIcon
                          icon={faClock}
                          className="text-xl sm:text-2xl text-blue-600"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } hover:shadow-lg transition-all duration-200`}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`text-xs sm:text-sm font-medium ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Patient Satisfaction
                          </p>
                          <p
                            className={`text-xl sm:text-2xl font-bold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            4.8/5
                          </p>
                        </div>
                        <FontAwesomeIcon
                          icon={faStar}
                          className="text-xl sm:text-2xl text-yellow-500"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } hover:shadow-lg transition-all duration-200`}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`text-xs sm:text-sm font-medium ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Bed Occupancy
                          </p>
                          <p
                            className={`text-xl sm:text-2xl font-bold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            87%
                          </p>
                        </div>
                        <FontAwesomeIcon
                          icon={faBed}
                          className="text-xl sm:text-2xl text-green-600"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } hover:shadow-lg transition-all duration-200`}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`text-xs sm:text-sm font-medium ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Staff Utilization
                          </p>
                          <p
                            className={`text-xl sm:text-2xl font-bold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            92%
                          </p>
                        </div>
                        <FontAwesomeIcon
                          icon={faUserMd}
                          className="text-xl sm:text-2xl text-purple-600"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                  <Card
                    className={`${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } hover:shadow-lg transition-all duration-200`}
                  >
                    <CardHeader className="pb-2 sm:pb-4">
                      <CardTitle
                        className={`text-lg sm:text-xl ${isDarkMode ? "text-white" : "text-gray-900"}`}
                      >
                        Monthly Patient Flow
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div
                        className={`${
                          isDarkMode ? "bg-gray-700" : "bg-gray-50"
                        } rounded-lg p-4 h-48 sm:h-64 flex items-center justify-center`}
                      >
                        <p
                          className={`text-sm sm:text-base ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Patient Flow Chart
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } hover:shadow-lg transition-all duration-200`}
                  >
                    <CardHeader className="pb-2 sm:pb-4">
                      <CardTitle
                        className={`text-lg sm:text-xl ${isDarkMode ? "text-white" : "text-gray-900"}`}
                      >
                        Revenue Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div
                        className={`${
                          isDarkMode ? "bg-gray-700" : "bg-gray-50"
                        } rounded-lg p-4 h-48 sm:h-64 flex items-center justify-center`}
                      >
                        <p
                          className={`text-sm sm:text-base ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Revenue Chart
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Other tabs content would be similar... */}
        {(activeTab === "notifications" || activeTab === "settings") && (
          <div className="p-4 sm:p-6">
            <Card
              className={`${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } hover:shadow-lg transition-all duration-200`}
            >
              <CardContent className="p-6 sm:p-8 text-center">
                <FontAwesomeIcon
                  icon={activeTab === "notifications" ? faBell : faCog}
                  className={`text-3xl sm:text-4xl ${
                    isDarkMode ? "text-gray-400" : "text-gray-400"
                  } mb-4`}
                />
                <h3
                  className={`text-lg sm:text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-2 capitalize`}
                >
                  {activeTab}
                </h3>
                <p
                  className={`text-sm sm:text-base ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  This section is under development.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
