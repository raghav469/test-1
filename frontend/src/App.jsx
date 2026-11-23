import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const emptyEmployee = {
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
    status: "active",
};

const iconShapes = {
    grid: (
        <>
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </>
    ),
    users: (
        <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="10" cy="7" r="4" />
            <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </>
    ),
    briefcase: (
        <>
            <rect x="3" y="7" width="18" height="14" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
        </>
    ),
    chart: (
        <>
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-5 5" />
        </>
    ),
    settings: (
        <>
            <circle cx="12" cy="12" r="3" />
            <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.7-1.4-2.4L7.1 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2Z" />
        </>
    ),
    search: (
        <>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
        </>
    ),
    plus: (
        <>
            <path d="M12 5v14M5 12h14" />
        </>
    ),
    chevron: <path d="m7 10 5 5 5-5" />,
    edit: (
        <>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </>
    ),
    trash: (
        <>
            <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" />
        </>
    ),
    calendar: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 11h18" />
        </>
    ),
    mail: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </>
    ),
    phone: (
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.8a2 2 0 0 1-.6 1.7L7.7 9.5a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 1.7-.6l2.8.5a2 2 0 0 1 1.5 2.8Z" />
    ),
    close: (
        <>
            <path d="m18 6-12 12M6 6l12 12" />
        </>
    ),
    refresh: (
        <>
            <path d="M20 7v5h-5M4 17v-5h5" />
            <path d="M5.5 9a7 7 0 0 1 11.6-2.6L20 12M4 12l2.9 5.6A7 7 0 0 0 18.5 15" />
        </>
    ),
    menu: (
        <>
            <path d="M4 6h16M4 12h16M4 18h16" />
        </>
    ),
    dots: (
        <>
            <circle cx="5" cy="12" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
        </>
    ),
    sparkle: (
        <>
            <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
            <path d="m19 14 1 2.5 2.5 1-2.5 1L19 21l-1-2.5-2.5-1 2.5-1 1-2.5Z" />
        </>
    ),
};

function Icon({ name, size = 18, strokeWidth = 1.8 }) {
    return (
        <svg
            aria-hidden="true"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {iconShapes[name] || iconShapes.sparkle}
        </svg>
    );
}

async function requestEmployees(path = "", options = {}) {
    let response;
    try {
        response = await fetch(`${API_BASE}/employees${path}`, {
            headers: { "Content-Type": "application/json", ...options.headers },
            ...options,
        });
    } catch {
        throw new Error(
            "Cannot reach the employee API. Check that the backend is running.",
        );
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        throw new Error(
            "The employee API returned a non-JSON response. Restart the frontend and backend, then use the current Vite network URL.",
        );
    }

    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error("The employee API returned invalid JSON.");
    }
    if (!response.ok) {
        const validationMessage = result.errors
            ?.map((error) => error.message)
            .join(". ");
        throw new Error(
            validationMessage ||
                result.message ||
                "The request could not be completed.",
        );
    }

    return result.data;
}

function getInitials(name = "") {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
}

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

function App() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const [notice, setNotice] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formData, setFormData] = useState(emptyEmployee);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const loadEmployees = useCallback(async () => {
        setLoading(true);
        setPageError("");
        try {
            const data = await requestEmployees();
            setEmployees(data);
        } catch (error) {
            setPageError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        requestEmployees()
            .then((data) => {
                if (!cancelled) setEmployees(data);
            })
            .catch((error) => {
                if (!cancelled) setPageError(error.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const activeCount = employees.filter(
        (employee) => employee.status === "active",
    ).length;
    const inactiveCount = employees.length - activeCount;
    const departmentCount = new Set(
        employees.map((employee) => employee.department),
    ).size;

    const filteredEmployees = useMemo(() => {
        const query = search.trim().toLowerCase();
        return employees.filter((employee) => {
            const matchesStatus =
                statusFilter === "all" || employee.status === statusFilter;
            const matchesQuery =
                !query ||
                [
                    employee.name,
                    employee.email,
                    employee.department,
                    employee.designation,
                ].some((value) => value?.toLowerCase().includes(query));
            return matchesStatus && matchesQuery;
        });
    }, [employees, search, statusFilter]);

    function openCreateModal() {
        setEditingEmployee(null);
        setFormData({
            ...emptyEmployee,
            joiningDate: new Date().toISOString().slice(0, 10),
        });
        setFormError("");
        setModalOpen(true);
    }

    function openEditModal(employee) {
        setEditingEmployee(employee);
        setFormData({
            name: employee.name || "",
            email: employee.email || "",
            phone: employee.phone || "",
            department: employee.department || "",
            designation: employee.designation || "",
            joiningDate: employee.joiningDate
                ? new Date(employee.joiningDate).toISOString().slice(0, 10)
                : "",
            status: employee.status || "active",
        });
        setFormError("");
        setModalOpen(true);
    }

    function closeModal() {
        if (saving) return;
        setModalOpen(false);
        setEditingEmployee(null);
        setFormError("");
    }

    function updateForm(event) {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    }

    async function submitEmployee(event) {
        event.preventDefault();
        setSaving(true);
        setFormError("");
        setPageError("");

        try {
            const savedEmployee = await requestEmployees(
                editingEmployee ? `/${editingEmployee._id}` : "",
                {
                    method: editingEmployee ? "PUT" : "POST",
                    body: JSON.stringify(formData),
                },
            );

            setEmployees((current) =>
                editingEmployee
                    ? current.map((employee) =>
                          employee._id === savedEmployee._id
                              ? savedEmployee
                              : employee,
                      )
                    : [savedEmployee, ...current],
            );
            setNotice(
                editingEmployee
                    ? "Employee details updated."
                    : "Employee added successfully.",
            );
            setModalOpen(false);
            setEditingEmployee(null);
        } catch (error) {
            setFormError(error.message);
        } finally {
            setSaving(false);
        }
    }

    async function removeEmployee(employee) {
        const confirmed = window.confirm(
            `Delete ${employee.name}'s employee record? This cannot be undone.`,
        );
        if (!confirmed) return;

        setDeletingId(employee._id);
        setPageError("");
        setNotice("");
        try {
            await requestEmployees(`/${employee._id}`, { method: "DELETE" });
            setEmployees((current) =>
                current.filter((item) => item._id !== employee._id),
            );
            setNotice(`${employee.name}'s record was deleted.`);
        } catch (error) {
            setPageError(error.message);
        } finally {
            setDeletingId("");
        }
    }

    return (
        <div className="app-shell">
            {mobileMenuOpen && (
                <button
                    aria-label="Close navigation menu"
                    className="sidebar-backdrop"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <aside
                className={`sidebar ${mobileMenuOpen ? "sidebar--open" : ""}`}
            >
                <a
                    className="brand"
                    href="#overview"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <span className="brand-mark">
                        <Icon name="sparkle" size={20} />
                    </span>
                    <span>
                        BMDU<span className="brand-light">Management</span>
                    </span>
                </a>

                <div className="workspace-label">WORKSPACE</div>
                <nav className="side-nav" aria-label="Main navigation">
                    <a
                        className="nav-link"
                        href="#overview"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Icon name="grid" />
                        <span>Overview</span>
                    </a>
                    <a
                        className="nav-link nav-link--active"
                        href="#employee-list"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Icon name="users" />
                        <span>Employees</span>
                        <span className="nav-count">{employees.length}</span>
                    </a>
                </nav>

                <div className="sidebar-bottom">
                    <div className="help-card">
                        <span className="help-icon">
                            <Icon name="sparkle" size={16} />
                        </span>
                        <strong>People first</strong>
                        <p>
                            Keep your team information organized in one place.
                        </p>
                    </div>
                    <button className="profile-button" type="button">
                        <span className="profile-avatar">AM</span>
                        <span className="profile-copy">
                            <strong>Alex Morgan</strong>
                            <small>Administrator</small>
                        </span>
                        <Icon name="dots" size={18} />
                    </button>
                </div>
            </aside>

            <main className="main-panel" id="overview">
                <header className="topbar">
                    <button
                        aria-label="Open navigation menu"
                        className="icon-button mobile-menu-button"
                        onClick={() => setMobileMenuOpen(true)}
                        type="button"
                    >
                        <Icon name="menu" />
                    </button>
                    <div className="breadcrumbs">
                        <span>Workspace</span>
                        <span className="breadcrumb-separator">/</span>
                        <strong>Employees</strong>
                    </div>
                    <div className="topbar-right">
                        <span className="today-label">
                            {new Intl.DateTimeFormat("en", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                            }).format(new Date())}
                        </span>
                        <span
                            className="topbar-avatar"
                            aria-label="Administrator"
                        >
                            AM
                        </span>
                    </div>
                </header>

                <div className="dashboard-content">
                    <section className="page-heading">
                        <div>
                            <div className="eyebrow">
                                <span className="eyebrow-dot" /> PEOPLE
                                OPERATIONS
                            </div>
                            <h1>Employee management</h1>
                            <p>Manage your people, all in one place.</p>
                        </div>
                        <button
                            className="primary-button"
                            onClick={openCreateModal}
                            type="button"
                        >
                            <Icon name="plus" size={18} />
                            <span>Add employee</span>
                        </button>
                    </section>

                    {pageError && (
                        <div className="alert alert--error" role="alert">
                            <span>{pageError}</span>
                            <button
                                aria-label="Dismiss error"
                                onClick={() => setPageError("")}
                                type="button"
                            >
                                <Icon name="close" size={16} />
                            </button>
                        </div>
                    )}
                    {notice && (
                        <div className="alert alert--success" role="status">
                            <span>{notice}</span>
                            <button
                                aria-label="Dismiss message"
                                onClick={() => setNotice("")}
                                type="button"
                            >
                                <Icon name="close" size={16} />
                            </button>
                        </div>
                    )}

                    <section
                        className="stats-grid"
                        aria-label="Employee statistics"
                    >
                        <article className="stat-card stat-card--primary">
                            <div className="stat-topline">
                                <span className="stat-icon">
                                    <Icon name="users" />
                                </span>
                                <span className="stat-caption">
                                    Current roster
                                </span>
                            </div>
                            <div className="stat-value">
                                {loading ? "—" : employees.length}
                            </div>
                            <div className="stat-label">Total employees</div>
                            <div className="stat-footnote">
                                Across your organization
                            </div>
                        </article>
                        <article className="stat-card">
                            <div className="stat-topline">
                                <span className="stat-icon stat-icon--green">
                                    <Icon name="sparkle" />
                                </span>
                                <span className="stat-trend">On the team</span>
                            </div>
                            <div className="stat-value">
                                {loading ? "—" : activeCount}
                            </div>
                            <div className="stat-label">Active employees</div>
                            <div className="stat-footnote">
                                Currently active
                            </div>
                        </article>
                        <article className="stat-card">
                            <div className="stat-topline">
                                <span className="stat-icon stat-icon--amber">
                                    <Icon name="briefcase" />
                                </span>
                                <span className="stat-trend">
                                    Team structure
                                </span>
                            </div>
                            <div className="stat-value">
                                {loading ? "—" : departmentCount}
                            </div>
                            <div className="stat-label">Departments</div>
                            <div className="stat-footnote">
                                Represented in your team
                            </div>
                        </article>
                        <article className="stat-card">
                            <div className="stat-topline">
                                <span className="stat-icon stat-icon--rose">
                                    <Icon name="calendar" />
                                </span>
                                <span className="stat-trend">
                                    Not currently active
                                </span>
                            </div>
                            <div className="stat-value">
                                {loading ? "—" : inactiveCount}
                            </div>
                            <div className="stat-label">Inactive employees</div>
                            <div className="stat-footnote">
                                Records marked inactive
                            </div>
                        </article>
                    </section>

                    <section className="employee-panel" id="employee-list">
                        <div className="panel-heading">
                            <div>
                                <h2>All employees</h2>
                                <p>A complete directory of your people.</p>
                            </div>
                            <button
                                className="icon-button refresh-button"
                                onClick={loadEmployees}
                                title="Refresh employees"
                                type="button"
                            >
                                <Icon name="refresh" size={17} />
                            </button>
                        </div>

                        <div className="table-toolbar">
                            <div
                                className="filter-tabs"
                                role="tablist"
                                aria-label="Filter employees by status"
                            >
                                {[
                                    ["all", "All employees"],
                                    ["active", "Active"],
                                    ["inactive", "Inactive"],
                                ].map(([filter, label]) => (
                                    <button
                                        aria-selected={statusFilter === filter}
                                        className={`filter-tab ${statusFilter === filter ? "filter-tab--active" : ""}`}
                                        key={filter}
                                        onClick={() => setStatusFilter(filter)}
                                        role="tab"
                                        type="button"
                                    >
                                        {label}
                                        {filter === "all" && (
                                            <span>{employees.length}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <label className="search-field">
                                <Icon name="search" size={17} />
                                <input
                                    aria-label="Search employees"
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search employees..."
                                    type="search"
                                    value={search}
                                />
                            </label>
                        </div>

                        <div className="table-scroll">
                            <table className="employee-table">
                                <thead>
                                    <tr>
                                        <th scope="col">EMPLOYEE</th>
                                        <th scope="col">DEPARTMENT</th>
                                        <th scope="col">DESIGNATION</th>
                                        <th scope="col">JOINED</th>
                                        <th scope="col">STATUS</th>
                                        <th scope="col">
                                            <span className="visually-hidden">
                                                Actions
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                className="table-message"
                                                colSpan="6"
                                            >
                                                Loading employees...
                                            </td>
                                        </tr>
                                    ) : filteredEmployees.length === 0 ? (
                                        <tr>
                                            <td
                                                className="table-message"
                                                colSpan="6"
                                            >
                                                <div className="empty-state">
                                                    <span className="empty-icon">
                                                        <Icon
                                                            name="users"
                                                            size={22}
                                                        />
                                                    </span>
                                                    <strong>
                                                        {employees.length
                                                            ? "No matching employees"
                                                            : "No employees yet"}
                                                    </strong>
                                                    <span>
                                                        {employees.length
                                                            ? "Try another search or status filter."
                                                            : "Add your first employee to start building your directory."}
                                                    </span>
                                                    {!employees.length && (
                                                        <button
                                                            className="text-button"
                                                            onClick={
                                                                openCreateModal
                                                            }
                                                            type="button"
                                                        >
                                                            Add your first
                                                            employee
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredEmployees.map(
                                            (employee, index) => (
                                                <tr key={employee._id}>
                                                    <td>
                                                        <div className="employee-cell">
                                                            <span
                                                                className={`employee-avatar avatar-tone-${index % 5}`}
                                                            >
                                                                {getInitials(
                                                                    employee.name,
                                                                )}
                                                            </span>
                                                            <span className="employee-copy">
                                                                <strong>
                                                                    {
                                                                        employee.name
                                                                    }
                                                                </strong>
                                                                <span>
                                                                    {
                                                                        employee.email
                                                                    }
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="department-cell">
                                                            {
                                                                employee.department
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="designation-cell">
                                                        {employee.designation}
                                                    </td>
                                                    <td className="date-cell">
                                                        {formatDate(
                                                            employee.joiningDate,
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`status-pill status-pill--${employee.status}`}
                                                        >
                                                            <span />
                                                            {employee.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="row-actions">
                                                            <button
                                                                aria-label={`Edit ${employee.name}`}
                                                                className="row-action"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        employee,
                                                                    )
                                                                }
                                                                title="Edit employee"
                                                                type="button"
                                                            >
                                                                <Icon
                                                                    name="edit"
                                                                    size={16}
                                                                />
                                                            </button>
                                                            <button
                                                                aria-label={`Delete ${employee.name}`}
                                                                className="row-action row-action--delete"
                                                                disabled={
                                                                    deletingId ===
                                                                    employee._id
                                                                }
                                                                onClick={() =>
                                                                    removeEmployee(
                                                                        employee,
                                                                    )
                                                                }
                                                                title="Delete employee"
                                                                type="button"
                                                            >
                                                                <Icon
                                                                    name="trash"
                                                                    size={16}
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="table-footer">
                            <span>
                                Showing{" "}
                                <strong>{filteredEmployees.length}</strong> of{" "}
                                <strong>{employees.length}</strong> employees
                            </span>
                            <span className="footer-note">
                                <span className="live-dot" /> Up to date
                            </span>
                        </div>
                    </section>

                    <footer className="dashboard-footer">
                        <span>
                            Peopleflow <span className="footer-year">/</span>{" "}
                            Employee directory
                        </span>
                        <span>Built for better teams</span>
                    </footer>
                </div>
            </main>

            {modalOpen && (
                <div
                    className="modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeModal();
                    }}
                >
                    <section
                        aria-labelledby="employee-modal-title"
                        aria-modal="true"
                        className="employee-modal"
                        role="dialog"
                    >
                        <div className="modal-heading">
                            <div>
                                <span className="modal-eyebrow">
                                    {editingEmployee
                                        ? "EMPLOYEE RECORD"
                                        : "NEW TEAM MEMBER"}
                                </span>
                                <h2 id="employee-modal-title">
                                    {editingEmployee
                                        ? "Edit employee"
                                        : "Add an employee"}
                                </h2>
                                <p>
                                    {editingEmployee
                                        ? "Update employee details below."
                                        : "Add someone new to your organization."}
                                </p>
                            </div>
                            <button
                                aria-label="Close dialog"
                                className="icon-button"
                                onClick={closeModal}
                                type="button"
                            >
                                <Icon name="close" />
                            </button>
                        </div>

                        {formError && (
                            <div className="form-error" role="alert">
                                {formError}
                            </div>
                        )}

                        <form
                            className="employee-form"
                            onSubmit={submitEmployee}
                        >
                            <div className="form-grid">
                                <label className="form-field form-field--wide">
                                    <span>
                                        Full name <b>*</b>
                                    </span>
                                    <input
                                        autoComplete="name"
                                        name="name"
                                        onChange={updateForm}
                                        required
                                        value={formData.name}
                                    />
                                </label>
                                <label className="form-field">
                                    <span>
                                        Email address <b>*</b>
                                    </span>
                                    <input
                                        autoComplete="email"
                                        name="email"
                                        onChange={updateForm}
                                        required
                                        type="email"
                                        value={formData.email}
                                    />
                                </label>
                                <label className="form-field">
                                    <span>
                                        Phone number <b>*</b>
                                    </span>
                                    <input
                                        autoComplete="tel"
                                        name="phone"
                                        onChange={updateForm}
                                        required
                                        type="tel"
                                        value={formData.phone}
                                    />
                                </label>
                                <label className="form-field">
                                    <span>
                                        Department <b>*</b>
                                    </span>
                                    <input
                                        name="department"
                                        onChange={updateForm}
                                        required
                                        value={formData.department}
                                    />
                                </label>
                                <label className="form-field">
                                    <span>
                                        Designation <b>*</b>
                                    </span>
                                    <input
                                        name="designation"
                                        onChange={updateForm}
                                        required
                                        value={formData.designation}
                                    />
                                </label>
                                <label className="form-field">
                                    <span>
                                        Joining date <b>*</b>
                                    </span>
                                    <input
                                        name="joiningDate"
                                        onChange={updateForm}
                                        required
                                        type="date"
                                        value={formData.joiningDate}
                                    />
                                </label>
                                <label className="form-field">
                                    <span>Status</span>
                                    <select
                                        name="status"
                                        onChange={updateForm}
                                        value={formData.status}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button
                                    className="secondary-button"
                                    disabled={saving}
                                    onClick={closeModal}
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="primary-button"
                                    disabled={saving}
                                    type="submit"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingEmployee
                                          ? "Save changes"
                                          : "Add employee"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}

export default App;
