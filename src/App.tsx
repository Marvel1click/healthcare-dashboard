import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bed,
  Bell,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  Code2,
  Eye,
  FileText,
  Filter,
  HeartPulse,
  Hospital,
  LayoutDashboard,
  LockKeyhole,
  MapPin,
  Menu,
  Moon,
  Palette,
  Pencil,
  Plus,
  Quote,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  Trash2,
  TrendingUp,
  Trophy,
  UserRoundCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type WorkspaceTab = "dashboard" | "patients" | "appointments" | "analytics";
type PatientStatus = "Active" | "Recovered" | "Critical";
type AppointmentStatus = "Scheduled" | "Completed" | "In Progress";

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: PatientStatus;
  lastVisit: string;
  carePlan: string;
  riskScore: number;
}

interface Appointment {
  id: string;
  patientName: string;
  doctor: string;
  time: string;
  date: string;
  status: AppointmentStatus;
  type: string;
  department: string;
}

interface Metric {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  tone: "teal" | "blue" | "mint" | "amber" | "rose";
}

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

const patients: Patient[] = [
  {
    id: "P-1042",
    name: "Sarah Johnson",
    age: 34,
    condition: "Hypertension",
    status: "Active",
    lastVisit: "Apr 22, 2026",
    carePlan: "Cardiology review",
    riskScore: 42,
  },
  {
    id: "P-1189",
    name: "Michael Chen",
    age: 45,
    condition: "Diabetes",
    status: "Recovered",
    lastVisit: "Apr 18, 2026",
    carePlan: "Quarterly check-in",
    riskScore: 18,
  },
  {
    id: "P-1277",
    name: "Emily Rodriguez",
    age: 28,
    condition: "Asthma",
    status: "Critical",
    lastVisit: "Apr 27, 2026",
    carePlan: "Respiratory escalation",
    riskScore: 86,
  },
  {
    id: "P-1350",
    name: "David Wilson",
    age: 52,
    condition: "Heart Disease",
    status: "Active",
    lastVisit: "Apr 20, 2026",
    carePlan: "Medication adherence",
    riskScore: 61,
  },
];

const appointments: Appointment[] = [
  {
    id: "A-2201",
    patientName: "Emily Rodriguez",
    doctor: "Dr. Michael Lee",
    time: "09:00",
    date: "Apr 28, 2026",
    status: "Completed",
    type: "Cardiology consult",
    department: "Cardiology",
  },
  {
    id: "A-2202",
    patientName: "James Anderson",
    doctor: "Dr. Sarah Mitchell",
    time: "09:30",
    date: "Apr 28, 2026",
    status: "In Progress",
    type: "Orthopedics follow-up",
    department: "Orthopedics",
  },
  {
    id: "A-2203",
    patientName: "Olivia Williams",
    doctor: "Dr. David Brown",
    time: "10:00",
    date: "Apr 28, 2026",
    status: "Scheduled",
    type: "Neurology intake",
    department: "Neurology",
  },
];

const overviewMetrics: Metric[] = [
  {
    label: "Total Patients",
    value: "18,532",
    change: "+12.4% vs last month",
    icon: Users,
    tone: "teal",
  },
  {
    label: "Today's Appointments",
    value: "256",
    change: "+8.7% vs yesterday",
    icon: CalendarCheck,
    tone: "blue",
  },
  {
    label: "Average Wait Time",
    value: "24 min",
    change: "-6 min vs last month",
    icon: Clock3,
    tone: "mint",
  },
  {
    label: "Bed Occupancy",
    value: "76%",
    change: "+5.3% vs last month",
    icon: Bed,
    tone: "amber",
  },
  {
    label: "Revenue (MTD)",
    value: "$2.48M",
    change: "+15.2% vs last month",
    icon: TrendingUp,
    tone: "teal",
  },
];

const proofMetrics = [
  { value: "250+", label: "Healthcare Facilities", icon: Hospital },
  { value: "1.2M+", label: "Patients Managed", icon: Users },
  { value: "98.6%", label: "On-time Appointments", icon: TrendingUp },
  { value: "HIPAA", label: "Aligned Controls", icon: ShieldCheck },
];

const features: Feature[] = [
  {
    title: "Unified Dashboard",
    description:
      "Real-time visibility into clinical, operational, and financial performance in one executive view.",
    icon: LayoutDashboard,
  },
  {
    title: "Smarter Scheduling",
    description:
      "Capacity-aware appointment tools reduce no-shows, conflicts, and provider idle time.",
    icon: CalendarDays,
  },
  {
    title: "Patient-Centric Care",
    description:
      "Concise profiles, risk indicators, and care-plan context help teams prioritize the right actions.",
    icon: UserRoundCheck,
  },
  {
    title: "Actionable Insights",
    description:
      "Operational trends and department-level reports make bottlenecks easier to spot and resolve.",
    icon: BarChart3,
  },
];

const workspaceTabs: Array<{
  id: WorkspaceTab;
  label: string;
  icon: LucideIcon;
}> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "patients", label: "Patients", icon: Users },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const departmentVisits = [
  { name: "Cardiology", value: 3652 },
  { name: "Orthopedics", value: 2845 },
  { name: "Neurology", value: 2312 },
  { name: "Pediatrics", value: 2101 },
  { name: "General Medicine", value: 1987 },
];

const statusStyles: Record<PatientStatus | AppointmentStatus, string> = {
  Active: "border-blue-200 bg-blue-50 text-blue-700",
  Recovered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Critical: "border-rose-200 bg-rose-50 text-rose-700",
  Scheduled: "border-indigo-200 bg-indigo-50 text-indigo-700",
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "In Progress": "border-amber-200 bg-amber-50 text-amber-700",
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="brand-mark">
        <HeartPulse className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="leading-tight">
        <p className="font-semibold text-[var(--text)]">HealthCare</p>
        <p className="-mt-0.5 text-xs font-semibold text-[var(--muted)]">
          Analytics
        </p>
      </div>
    </div>
  );
}

function SectionEyebrow({ children }: { children: string }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
      {children}
    </p>
  );
}

function IconBadge({
  icon: Icon,
  tone = "teal",
}: {
  icon: LucideIcon;
  tone?: Metric["tone"];
}) {
  return (
    <div className={`icon-badge icon-badge-${tone}`}>
      <Icon className="h-5 w-5" aria-hidden="true" />
    </div>
  );
}

function MetricCard({ metric, compact = false }: { metric: Metric; compact?: boolean }) {
  const Icon = metric.icon;

  return (
    <div className={`surface-card ${compact ? "p-4" : "p-5"} metric-card`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[var(--muted)]">
            {metric.label}
          </p>
          <p className={`${compact ? "text-2xl" : "text-3xl"} mt-2 font-bold text-[var(--text)]`}>
            {metric.value}
          </p>
        </div>
        <IconBadge icon={Icon} tone={metric.tone} />
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[var(--positive)]">
        <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
        {metric.change}
      </p>
    </div>
  );
}

function MiniLineChart() {
  return (
    <svg
      viewBox="0 0 440 220"
      role="img"
      aria-label="Appointments completed, scheduled, and cancelled over one week"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0fafa7" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0fafa7" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[40, 80, 120, 160].map((y) => (
        <line
          key={y}
          x1="38"
          x2="420"
          y1={y}
          y2={y}
          stroke="var(--chart-grid)"
          strokeWidth="1"
        />
      ))}
      <path
        d="M40 178 L94 164 L148 132 L202 148 L256 108 L310 158 L364 132 L418 142"
        fill="none"
        stroke="#0fafa7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        className="chart-line"
      />
      <path
        d="M40 178 L94 164 L148 132 L202 148 L256 108 L310 158 L364 132 L418 142 L418 202 L40 202 Z"
        fill="url(#chartFill)"
      />
      <path
        d="M40 158 L94 158 L148 140 L202 162 L256 142 L310 166 L364 146 L418 152"
        fill="none"
        stroke="#3b82f6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        className="chart-line chart-line-delay"
      />
      <path
        d="M40 184 L94 176 L148 168 L202 182 L256 170 L310 186 L364 174 L418 178"
        fill="none"
        stroke="#f59e0b"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        className="chart-line chart-line-delay-2"
      />
    </svg>
  );
}

function DonutChart() {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="donut-chart" aria-label="Patient demographics chart">
        <div className="donut-chart-center">
          <span className="text-lg font-bold text-[var(--text)]">18,532</span>
          <span className="text-[10px] font-medium text-[var(--muted)]">
            Total
          </span>
        </div>
      </div>
      <div className="grid flex-1 gap-2 text-xs">
        {[
          ["0-18", "18%", "#3b82f6"],
          ["19-35", "24%", "#10b981"],
          ["36-50", "28%", "#0fafa7"],
          ["51-65", "20%", "#8b5cf6"],
          ["65+", "10%", "#64748b"],
        ].map(([label, value, color]) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-[var(--muted)]">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {label}
            </span>
            <span className="font-semibold text-[var(--text)]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DepartmentBars() {
  return (
    <div className="space-y-3">
      {departmentVisits.map((department) => {
        const percent = Math.round((department.value / departmentVisits[0].value) * 100);
        return (
          <div key={department.name} className="grid grid-cols-[112px_1fr_48px] items-center gap-3 text-xs">
            <span className="truncate font-medium text-[var(--muted)]">
              {department.name}
            </span>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--soft)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-right font-semibold text-[var(--text)]">
              {department.value.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PatientAvatar({ name }: { name: string }) {
  return (
    <div className="patient-avatar" aria-hidden="true">
      {initials(name)}
    </div>
  );
}

function PreviewShell({
  activeWorkspace,
  setActiveWorkspace,
}: {
  activeWorkspace: WorkspaceTab;
  setActiveWorkspace: (tab: WorkspaceTab) => void;
}) {
  return (
    <div className="dashboard-frame animate-rise" aria-label="Healthcare analytics preview">
      <aside className="preview-sidebar">
        <LogoMark />
        <div className="mt-8 space-y-1">
          {workspaceTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeWorkspace === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveWorkspace(item.id)}
                aria-pressed={isActive}
                className={`preview-nav-item ${isActive ? "is-active" : ""}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-auto hidden rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-cyan-50/80 lg:block">
          <p className="font-semibold text-white">Need Support?</p>
          <p className="mt-1">Response team online</p>
        </div>
      </aside>
      <div className="min-w-0 flex-1 bg-[var(--surface)]">
        <div className="preview-topbar">
          <div>
            <p className="text-sm font-bold text-[var(--text)]">
              {activeWorkspace === "dashboard"
                ? "Overview"
                : workspaceTabs.find((tab) => tab.id === activeWorkspace)?.label}
            </p>
            <p className="text-xs text-[var(--muted)]">
              Welcome back, Dr. Sarah Mitchell
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button type="button" className="mini-control">
              Apr 22 - Apr 28
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button type="button" className="mini-control">
              <Filter className="h-3.5 w-3.5" aria-hidden="true" />
              Filters
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          {activeWorkspace === "dashboard" && <OverviewPreview />}
          {activeWorkspace === "patients" && <PatientsPreview />}
          {activeWorkspace === "appointments" && <AppointmentsPreview />}
          {activeWorkspace === "analytics" && <AnalyticsPreview />}
        </div>
      </div>
    </div>
  );
}

function OverviewPreview() {
  return (
    <div className="space-y-4">
      <div className="preview-metrics-grid">
        {overviewMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} compact />
        ))}
      </div>
      <div className="preview-main-grid">
        <div className="surface-card p-4">
          <PanelHeader
            title="Appointments Overview"
            subtitle="Completed, scheduled, and cancelled"
          />
          <div className="h-[210px]">
            <MiniLineChart />
          </div>
        </div>
        <div className="surface-card p-4">
          <PanelHeader title="Patient Demographics" subtitle="Age mix by volume" />
          <DonutChart />
        </div>
        <div className="surface-card p-4">
          <PanelHeader title="Recent Alerts" subtitle="Clinical and capacity signals" />
          <div className="space-y-3">
            {[
              ["High Wait Time", "Emergency Dept. is above target", AlertTriangle, "amber"],
              ["Bed Occupancy", "ICU occupancy is at 92%", AlertTriangle, "rose"],
              ["Inventory Low", "Surgical masks below minimum", ClipboardList, "teal"],
            ].map(([title, detail, Icon, tone]) => (
              <div key={title as string} className="alert-row">
                <Icon className={`h-4 w-4 alert-${tone}`} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-[var(--text)]">
                    {title as string}
                  </p>
                  <p className="truncate text-[11px] text-[var(--muted)]">
                    {detail as string}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="preview-secondary-grid">
        <div className="surface-card p-4">
          <PanelHeader title="Today's Appointments" subtitle="Provider schedule health" />
          <AppointmentTable compact />
        </div>
        <div className="surface-card p-4">
          <PanelHeader title="Top Departments by Visits" subtitle="Current month" />
          <DepartmentBars />
        </div>
      </div>
    </div>
  );
}

function PatientsPreview() {
  return (
    <div className="preview-two-grid">
      <div className="surface-card p-4">
        <PanelHeader title="Priority Patients" subtitle="Risk-based care queue" />
        <div className="space-y-3">
          {patients.map((patient) => (
            <PatientRow key={patient.id} patient={patient} />
          ))}
        </div>
      </div>
      <div className="surface-card p-4">
        <PanelHeader title="Patient Profile" subtitle="Emily Rodriguez" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--soft)] p-4">
            <p className="text-xs font-semibold uppercase text-[var(--muted)]">
              Current condition
            </p>
            <p className="mt-2 text-2xl font-bold text-[var(--text)]">Asthma</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Escalated from routine follow-up due to breathing difficulty and
              recent ER activity.
            </p>
          </div>
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-900">
            <p className="text-xs font-semibold uppercase">Risk score</p>
            <p className="mt-2 text-3xl font-bold">86</p>
            <p className="mt-2 text-sm">Respiratory review recommended today.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {["Care plan updated", "Insurance verified", "Next visit pending"].map(
            (item) => (
              <div key={item} className="mini-stat">
                <CheckCircle2 className="h-4 w-4 text-[var(--positive)]" />
                <span>{item}</span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function AppointmentsPreview() {
  return (
    <div className="preview-two-grid">
      <div className="surface-card p-4">
        <PanelHeader title="Provider Schedule" subtitle="Capacity-aware appointment flow" />
        <div className="schedule-grid">
          {["09:00", "09:30", "10:00", "10:30", "11:00"].map((time, index) => (
            <div key={time} className="contents">
              <span className="schedule-time">{time}</span>
              <div className={`schedule-event schedule-event-${index % 3}`}>
                <span className="font-semibold">
                  {appointments[index % appointments.length].patientName}
                </span>
                <span>{appointments[index % appointments.length].department}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="surface-card p-4">
        <PanelHeader title="Utilization" subtitle="Clinic capacity today" />
        <div className="space-y-4">
          {[
            ["Rooms", 84],
            ["Providers", 92],
            ["Nursing", 78],
            ["Diagnostics", 68],
          ].map(([label, value]) => (
            <ProgressRow key={label as string} label={label as string} value={value as number} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsPreview() {
  return (
    <div className="preview-two-grid">
      <div className="surface-card p-4">
        <PanelHeader title="Performance Scorecard" subtitle="Operating indicators" />
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Wait-time reduction", "32%", "vs baseline"],
            ["Appointment utilization", "25%", "increase"],
            ["Operational efficiency", "18%", "growth"],
            ["Annualized impact", "$1.2M", "projected"],
          ].map(([label, value, caption]) => (
            <div key={label} className="impact-card">
              <p className="text-xs text-[var(--muted)]">{label}</p>
              <p className="mt-2 text-2xl font-bold text-[var(--text)]">{value}</p>
              <p className="mt-1 text-xs font-semibold text-[var(--positive)]">
                {caption}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="surface-card p-4">
        <PanelHeader title="Department Visits" subtitle="Volume concentration" />
        <DepartmentBars />
        <div className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--soft)] p-4 text-sm text-[var(--muted)]">
          Cardiology and Orthopedics account for 42% of all visits, creating
          the strongest opportunity for schedule smoothing.
        </div>
      </div>
    </div>
  );
}

function PanelHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h3 className="font-bold text-[var(--text)]">{title}</h3>
        {subtitle && <p className="mt-1 text-xs text-[var(--muted)]">{subtitle}</p>}
      </div>
    </div>
  );
}

function AppointmentTable({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-xs">
        <thead>
          <tr className="border-b border-[var(--border)] text-[var(--muted)]">
            <th className="pb-3 font-semibold">Time</th>
            <th className="pb-3 font-semibold">Patient</th>
            <th className="pb-3 font-semibold">Department</th>
            <th className="pb-3 font-semibold">Provider</th>
            <th className="pb-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="border-b border-[var(--border)] last:border-0">
              <td className="py-3 font-semibold text-[var(--text)]">{appointment.time}</td>
              <td className="py-3 text-[var(--text)]">{appointment.patientName}</td>
              <td className="py-3 text-[var(--muted)]">{appointment.department}</td>
              <td className="py-3 text-[var(--muted)]">
                {compact ? appointment.doctor.replace("Dr. ", "Dr. ") : appointment.doctor}
              </td>
              <td className="py-3">
                <Badge
                  variant="outline"
                  className={`rounded-md ${statusStyles[appointment.status]}`}
                >
                  {appointment.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PatientRow({ patient }: { patient: Patient }) {
  return (
    <div className="patient-row">
      <PatientAvatar name={patient.name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-[var(--text)]">{patient.name}</p>
          <Badge variant="outline" className={`rounded-md ${statusStyles[patient.status]}`}>
            {patient.status}
          </Badge>
        </div>
        <p className="truncate text-sm text-[var(--muted)]">
          {patient.condition} · {patient.carePlan}
        </p>
      </div>
      <div className="hidden text-right sm:block">
        <p className="text-xs text-[var(--muted)]">Risk</p>
        <p className="font-bold text-[var(--text)]">{patient.riskScore}</p>
      </div>
    </div>
  );
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-[var(--text)]">{label}</span>
        <span className="text-[var(--muted)]">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--soft)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Hero({
  activeWorkspace,
  setActiveWorkspace,
}: {
  activeWorkspace: WorkspaceTab;
  setActiveWorkspace: (tab: WorkspaceTab) => void;
}) {
  return (
    <section id="home" className="hero-section">
      <div className="mx-auto grid max-w-[1500px] items-center gap-6 px-5 py-6 sm:px-8 sm:py-10 lg:grid-cols-[0.66fr_1.34fr] lg:gap-10 lg:px-10 lg:py-10 xl:py-12">
        <div className="max-w-2xl">
          <div className="hero-eyebrow">
            <SectionEyebrow>Healthcare operations dashboard</SectionEyebrow>
          </div>
          <h1 className="text-balance text-4xl font-black leading-[1.05] text-[var(--text)] sm:text-5xl xl:text-6xl">
            Smarter Operations. Better Patient Outcomes.
          </h1>
          <div className="hero-divider mt-6 h-1 w-14 rounded-full bg-[var(--accent)]" />
          <p className="hero-copy mt-6 max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            HealthCare Analytics brings hospital data, team workflows, and
            performance signals into one executive-grade dashboard for faster,
            clearer operational decisions.
          </p>
          <div className="hero-actions mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={() => {
                setActiveWorkspace("dashboard");
                scrollToId("workspace");
              }}
              className="premium-button h-12 rounded-lg px-6 text-sm font-bold"
            >
              View live dashboard
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => scrollToId("case-study")}
              className="secondary-button h-12 rounded-lg px-6 text-sm font-bold"
            >
              Read case study
              <FileText className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="mt-10 hidden grid-cols-2 gap-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] xl:grid xl:grid-cols-4">
            {proofMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="border-b border-r border-[var(--border)] p-4 last:border-r-0 sm:border-b-0"
                >
                  <Icon className="mb-3 h-6 w-6 text-[var(--accent)]" aria-hidden="true" />
                  <p className="text-2xl font-black text-[var(--text)]">{metric.value}</p>
                  <p className="mt-1 text-xs font-medium text-[var(--muted)]">
                    {metric.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <PreviewShell
          activeWorkspace={activeWorkspace}
          setActiveWorkspace={setActiveWorkspace}
        />
      </div>
    </section>
  );
}

function FeatureStrip() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-[1500px] gap-0 px-5 sm:px-8 lg:grid-cols-4 lg:px-10">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="feature-tile group border-b border-[var(--border)] py-7 lg:border-b-0 lg:border-r lg:px-8 lg:last:border-r-0"
            >
              <IconBadge icon={Icon} />
              <div>
                <h3 className="font-bold text-[var(--text)]">{feature.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">
                  {feature.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function WorkspaceSection({
  activeWorkspace,
  setActiveWorkspace,
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  isAppointmentModalOpen,
  setIsAppointmentModalOpen,
}: {
  activeWorkspace: WorkspaceTab;
  setActiveWorkspace: (tab: WorkspaceTab) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (open: boolean) => void;
}) {
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.carePlan.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        selectedFilter === "all" ||
        patient.status.toLowerCase() === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);

  return (
    <section id="workspace" className="section-block">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10">
        <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <SectionEyebrow>Product experience</SectionEyebrow>
            <h2 className="text-3xl font-black text-[var(--text)] sm:text-4xl">
              A portfolio-ready healthcare command center
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
              The dashboard keeps the original patient, appointment, and
              analytics workflows, but presents them with stronger hierarchy,
              better scanability, and more credible business context.
            </p>
          </div>
          <div className="workspace-tabs" role="tablist" aria-label="Workspace views">
            {workspaceTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeWorkspace === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveWorkspace(tab.id)}
                  className={`workspace-tab ${isActive ? "is-active" : ""}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="workspace-panel animate-rise">
          {activeWorkspace === "dashboard" && <DashboardWorkspace />}
          {activeWorkspace === "patients" && (
            <PatientsWorkspace
              filteredPatients={filteredPatients}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          )}
          {activeWorkspace === "appointments" && (
            <AppointmentsWorkspace
              isAppointmentModalOpen={isAppointmentModalOpen}
              setIsAppointmentModalOpen={setIsAppointmentModalOpen}
            />
          )}
          {activeWorkspace === "analytics" && <AnalyticsWorkspace />}
        </div>
      </div>
    </section>
  );
}

function DashboardWorkspace() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {overviewMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card p-5">
          <PanelHeader
            title="Patient Flow and Appointment Health"
            subtitle="Trend monitoring across the current operating week"
          />
          <div className="h-[300px]">
            <MiniLineChart />
          </div>
        </div>
        <div className="surface-card p-5">
          <PanelHeader
            title="Department Distribution"
            subtitle="Visit mix and capacity concentration"
          />
          <DonutChart />
          <div className="mt-6">
            <DepartmentBars />
          </div>
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="surface-card p-5">
          <PanelHeader title="Recent Patients" subtitle="Latest high-priority care activity" />
          <div className="space-y-3">
            {patients.map((patient) => (
              <PatientRow key={patient.id} patient={patient} />
            ))}
          </div>
        </div>
        <div className="surface-card p-5">
          <PanelHeader title="Today's Appointments" subtitle="Schedule quality and patient flow" />
          <AppointmentTable />
        </div>
      </div>
    </div>
  );
}

function PatientsWorkspace({
  filteredPatients,
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
}: {
  filteredPatients: Patient[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-2xl font-black text-[var(--text)]">
            Patient Management
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Search, segment, and prioritize patients by condition and risk.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search patients or conditions"
              className="h-11 rounded-lg border-[var(--border)] bg-[var(--surface)] pl-9 text-[var(--text)]"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(event) => setSelectedFilter(event.target.value)}
            className="h-11 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="recovered">Recovered</option>
            <option value="critical">Critical</option>
          </select>
          <Button className="premium-button h-11 rounded-lg px-5 font-bold">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Patient
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filteredPatients.map((patient) => (
          <article key={patient.id} className="surface-card p-5">
            <div className="flex items-start gap-4">
              <PatientAvatar name={patient.name} />
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-bold text-[var(--text)]">{patient.name}</h4>
                <p className="text-sm text-[var(--muted)]">
                  {patient.id} · Age {patient.age}
                </p>
                <Badge
                  variant="outline"
                  className={`mt-3 rounded-md ${statusStyles[patient.status]}`}
                >
                  {patient.status}
                </Badge>
              </div>
            </div>
            <div className="mt-5 space-y-3 rounded-lg bg-[var(--soft)] p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-[var(--muted)]">Condition</span>
                <span className="text-right font-semibold text-[var(--text)]">
                  {patient.condition}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[var(--muted)]">Last visit</span>
                <span className="text-right font-semibold text-[var(--text)]">
                  {patient.lastVisit}
                </span>
              </div>
              <ProgressRow label="Risk score" value={patient.riskScore} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <ActionButton label="View" icon={Eye} />
              <ActionButton label="Edit" icon={Pencil} />
              <ActionButton label="Delete" icon={Trash2} tone="danger" />
            </div>
          </article>
        ))}
      </div>
      {filteredPatients.length === 0 && (
        <div className="surface-card p-8 text-center">
          <Search className="mx-auto h-8 w-8 text-[var(--muted)]" />
          <p className="mt-3 font-bold text-[var(--text)]">No patients found</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Try a different search term or status filter.
          </p>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  icon: LucideIcon;
  tone?: "default" | "danger";
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={`h-9 rounded-lg text-xs font-bold ${
        tone === "danger" ? "danger-action" : "subtle-action"
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}

function AppointmentsWorkspace({
  isAppointmentModalOpen,
  setIsAppointmentModalOpen,
}: {
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (open: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h3 className="text-2xl font-black text-[var(--text)]">
            Appointment Management
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Coordinate providers, rooms, and patient demand from a single flow.
          </p>
        </div>
        <Dialog open={isAppointmentModalOpen} onOpenChange={setIsAppointmentModalOpen}>
          <DialogTrigger asChild>
            <Button className="premium-button h-11 rounded-lg px-5 font-bold">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[92vw] rounded-lg border-[var(--border)] bg-[var(--surface)] text-[var(--text)] sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">
                Schedule New Appointment
              </DialogTitle>
              <DialogDescription className="text-sm text-[var(--muted)]">
                Capture the patient, provider, time, and care context for a new
                clinic appointment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-3">
              <FormField id="patient" label="Patient" placeholder="Select patient" />
              <FormField id="doctor" label="Provider" placeholder="Select provider" />
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField id="date" label="Date" type="date" />
                <FormField id="time" label="Time" type="time" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes" className="font-semibold text-[var(--text)]">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Care context, access needs, or internal notes"
                  className="min-h-24 rounded-lg border-[var(--border)] bg-[var(--soft)] text-[var(--text)]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAppointmentModalOpen(false)}
                className="secondary-button rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => setIsAppointmentModalOpen(false)}
                className="premium-button rounded-lg"
              >
                Save Appointment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card p-5">
          <PanelHeader title="Calendar View" subtitle="Tuesday, Apr 28, 2026" />
          <div className="calendar-board">
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, dayIndex) => (
              <div key={day} className="calendar-day">
                <p className="mb-3 text-xs font-bold uppercase text-[var(--muted)]">
                  {day}
                </p>
                {[0, 1, 2].map((slot) => (
                  <div
                    key={`${day}-${slot}`}
                    className={`calendar-slot ${
                      dayIndex === 1 && slot === 0 ? "is-priority" : ""
                    }`}
                  >
                    <span>{slot + 9}:00</span>
                    <span>{slot === 1 ? "Follow-up" : "Consult"}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="surface-card p-5">
          <PanelHeader title="Today's Appointments" subtitle="Live appointment queue" />
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <article key={appointment.id} className="appointment-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-[var(--text)]">
                      {appointment.patientName}
                    </h4>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {appointment.type}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`rounded-md ${statusStyles[appointment.status]}`}
                  >
                    {appointment.status}
                  </Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-[var(--muted)]">
                  <span>{appointment.time}</span>
                  <span>{appointment.doctor}</span>
                  <span>{appointment.department}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="font-semibold text-[var(--text)]">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className="h-11 rounded-lg border-[var(--border)] bg-[var(--soft)] text-[var(--text)]"
      />
    </div>
  );
}

function AnalyticsWorkspace() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-2xl font-black text-[var(--text)]">
          Analytics and Reporting
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Executive metrics translated into clear action for clinical and
          administrative leaders.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Average Wait Time", value: "15 min", icon: Clock3 },
          { label: "Patient Satisfaction", value: "4.8/5", icon: Trophy },
          { label: "Bed Occupancy", value: "87%", icon: Bed },
          { label: "Staff Utilization", value: "92%", icon: Stethoscope },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="surface-card p-5">
              <IconBadge icon={Icon} />
              <p className="mt-5 text-sm text-[var(--muted)]">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-[var(--text)]">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card p-5">
          <PanelHeader
            title="Monthly Patient Flow"
            subtitle="Volume, demand, and appointment conversion trends"
          />
          <div className="h-[300px]">
            <MiniLineChart />
          </div>
        </div>
        <div className="surface-card p-5">
          <PanelHeader title="Business Impact" subtitle="Outcome metrics for stakeholders" />
          <div className="space-y-3">
            {[
              ["32%", "Reduction in average wait time"],
              ["25%", "Increase in appointment utilization"],
              ["18%", "Growth in operational efficiency"],
              ["$1.2M", "Projected annual revenue lift"],
            ].map(([value, label]) => (
              <div key={label} className="impact-row">
                <TrendingUp className="h-5 w-5 text-[var(--positive)]" />
                <span className="text-xl font-black text-[var(--text)]">{value}</span>
                <span className="text-sm text-[var(--muted)]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseStudySection() {
  const caseStudyBlocks = [
    {
      title: "Overview",
      icon: FileText,
      body: "A modern healthcare operations dashboard designed for hospital administrators who need a single source of truth across patient flow, scheduling, analytics, and departmental performance.",
    },
    {
      title: "Problem",
      icon: AlertTriangle,
      body: "Disconnected systems made it difficult to see appointment demand, high-risk patients, staffing pressure, and operational bottlenecks quickly enough to act.",
    },
    {
      title: "Solution",
      icon: CheckCircle2,
      body: "A unified analytics platform with executive KPIs, patient prioritization, appointment management, alerting, and department-level reporting in one responsive interface.",
    },
  ];

  const detailedBlocks = [
    {
      title: "Key features",
      icon: Sparkles,
      items: [
        "Real-time operational dashboard",
        "Patient search, filtering, and risk visibility",
        "Appointment scheduling and queue management",
        "Department performance analytics",
        "Alerts, status badges, and care-plan context",
      ],
    },
    {
      title: "Tech stack",
      icon: Code2,
      items: ["React", "TypeScript", "Tailwind CSS", "Radix UI", "Vite", "Lucide Icons"],
    },
    {
      title: "Design decisions",
      icon: Palette,
      items: [
        "Dashboard-first hero to show the real product immediately",
        "Calm healthcare palette with teal, blue, mint, and amber states",
        "Compact cards and tables for quick executive scanning",
        "Accessible focus states, contrast, and responsive stacking",
        "Subtle motion for polish without distracting from data",
      ],
    },
    {
      title: "Business value",
      icon: Rocket,
      items: [
        "Reduces manual reporting overhead",
        "Improves schedule utilization and capacity planning",
        "Helps teams prioritize at-risk patients sooner",
        "Creates a credible executive view for operational decisions",
      ],
    },
  ];

  return (
    <section id="case-study" className="case-study-section">
      <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:px-10 lg:py-16">
        <aside className="case-study-aside">
          <SectionEyebrow>Case study</SectionEyebrow>
          <h2 className="text-3xl font-black leading-tight text-[var(--text)] sm:text-4xl">
            How CityCare Hospital transformed operations with HealthCare
            Analytics
          </h2>
          <div className="mt-8 flex items-center gap-4">
            <div className="brand-mark brand-mark-large">
              <HeartPulse className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-black text-[var(--text)]">CityCare</p>
              <p className="font-semibold text-[var(--muted)]">Hospital</p>
            </div>
          </div>
          <div className="mt-8 space-y-4 text-sm text-[var(--muted)]">
            {[
              [Bed, "300+ Beds"],
              [Users, "1,000+ Staff"],
              [ShieldCheck, "Multi-Specialty"],
              [MapPin, "Urban, USA"],
            ].map(([Icon, label]) => {
              const ItemIcon = Icon as LucideIcon;
              return (
                <div key={label as string} className="flex items-center gap-3">
                  <ItemIcon className="h-4 w-4 text-[var(--accent)]" />
                  <span>{label as string}</span>
                </div>
              );
            })}
          </div>
        </aside>
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-3">
            {caseStudyBlocks.map((block) => {
              const Icon = block.icon;
              return (
                <article key={block.title} className="surface-card p-5">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <h3 className="text-lg font-black text-[var(--text)]">
                      {block.title}
                    </h3>
                    <Icon className="h-5 w-5 text-[var(--accent)]" />
                  </div>
                  <p className="text-sm leading-7 text-[var(--muted)]">{block.body}</p>
                </article>
              );
            })}
          </div>
          <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
            <div className="grid gap-5 md:grid-cols-2">
              {detailedBlocks.map((block) => {
                const Icon = block.icon;
                return (
                  <article key={block.title} className="surface-card p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <IconBadge icon={Icon} />
                      <h3 className="font-black text-[var(--text)]">{block.title}</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-[var(--muted)]">
                      {block.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--positive)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
            <article className="final-result-card">
              <Trophy className="h-7 w-7 text-amber-500" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-black text-[var(--text)]">
                Final result
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                A polished, responsive healthcare analytics product that feels
                credible in a portfolio and demonstrates the full workflow from
                operational insight to patient-level action.
              </p>
              <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
                <Quote className="h-5 w-5 text-[var(--accent)]" />
                <p className="mt-3 text-sm leading-7 text-[var(--text)]">
                  HealthCare Analytics gives leadership the visibility we need
                  to make smarter staffing, scheduling, and care decisions.
                </p>
                <p className="mt-4 text-xs font-bold text-[var(--muted)]">
                  Dr. Michael Lee · Chief Medical Officer
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

function Header({
  activeWorkspace,
  setActiveWorkspace,
  isDarkMode,
  setIsDarkMode,
}: {
  activeWorkspace: WorkspaceTab;
  setActiveWorkspace: (tab: WorkspaceTab) => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleWorkspaceClick = (tab: WorkspaceTab) => {
    setActiveWorkspace(tab);
    setMobileMenuOpen(false);
    scrollToId(tab === "dashboard" ? "home" : "workspace");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <button type="button" onClick={() => scrollToId("home")} className="text-left">
          <LogoMark />
        </button>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {workspaceTabs.map((tab) => {
            const isActive = activeWorkspace === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleWorkspaceClick(tab.id)}
                className={`top-nav-link ${isActive ? "is-active" : ""}`}
              >
                {tab.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => scrollToId("case-study")}
            className="top-nav-link"
          >
            Case Study
          </button>
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden min-w-[260px] items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 xl:flex">
            <Search className="h-4 w-4 text-[var(--muted)]" aria-hidden="true" />
            <span className="ml-2 text-xs text-[var(--muted)]">
              Search patients, appointments...
            </span>
          </div>
          <button
            type="button"
            className="icon-button notification-action"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            <span className="notification-dot">3</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="icon-button"
            aria-label={isDarkMode ? "Use light theme" : "Use dark theme"}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className="icon-button settings-action"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="hidden items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 xl:flex">
            <PatientAvatar name="Sarah Mitchell" />
            <div className="leading-tight">
              <p className="text-sm font-bold text-[var(--text)]">Dr. Sarah Mitchell</p>
              <p className="text-xs text-[var(--muted)]">Administrator</p>
            </div>
            <ChevronDown className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <button
            type="button"
            className="icon-button mobile-menu-action"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-5 py-4 lg:hidden">
          <div className="grid gap-2">
            {workspaceTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleWorkspaceClick(tab.id)}
                className="mobile-nav-link"
              >
                {tab.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToId("case-study");
              }}
              className="mobile-nav-link"
            >
              Case Study
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-5 py-8 text-sm text-[var(--muted)] sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <LogoMark />
        <p>
          Portfolio case study for a responsive healthcare analytics dashboard.
        </p>
        <div className="flex items-center gap-2 font-semibold text-[var(--text)]">
          <LockKeyhole className="h-4 w-4 text-[var(--accent)]" />
          Built for operational clarity
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceTab>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <div className={`healthcare-app ${isDarkMode ? "theme-dark" : "theme-light"}`}>
      <Header
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <main>
        <Hero
          activeWorkspace={activeWorkspace}
          setActiveWorkspace={setActiveWorkspace}
        />
        <FeatureStrip />
        <WorkspaceSection
          activeWorkspace={activeWorkspace}
          setActiveWorkspace={setActiveWorkspace}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          isAppointmentModalOpen={isAppointmentModalOpen}
          setIsAppointmentModalOpen={setIsAppointmentModalOpen}
        />
        <CaseStudySection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
