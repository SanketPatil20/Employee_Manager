import { useState, useEffect, useRef } from 'react';
import './App.css';
import {
  BurnupChart,
  StackedDistribution,
  ShiftFrequency,
  ProductivityBullet,
  calculateBurnupData,
  calculateStackedData,
  calculateShiftFrequency,
} from './components/Visualizations';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  // Default to current date, but will update automatically
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [expandBreakdown, setExpandBreakdown] = useState(false); // Accordion state
  const hasInitialized = useRef(false);

  // 1. Fetch employees list on load
  useEffect(() => {
    fetchEmployees();
  }, []);

  // 2. When employee changes, fetch their available data months
  useEffect(() => {
    if (selectedEmployee) {
      fetchAvailableMonths(selectedEmployee);
    }
  }, [selectedEmployee]);

  // 3. When filters change, fetch the dashboard stats
  useEffect(() => {
    if (selectedEmployee && selectedYear && selectedMonth) {
      fetchDashboardData();
    }
  }, [selectedEmployee, selectedYear, selectedMonth]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/employees`);
      const data = await response.json();
      if (data.employees && data.employees.length > 0) {
        setEmployees(data.employees);
        // Only set default if none selected
        if (!selectedEmployee) {
          setSelectedEmployee(data.employees[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchAvailableMonths = async (employeeName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/months/${encodeURIComponent(employeeName)}`);
      const data = await response.json();

      if (data.monthYearCombos && data.monthYearCombos.length > 0) {
        setAvailableDates(data.monthYearCombos);

        // Only auto-select the latest month on first load
        if (!hasInitialized.current) {
          hasInitialized.current = true;
          // Find the latest entry to auto-select
          // Sort by Year DESC, then Month DESC
          const sorted = data.monthYearCombos.sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.month - a.month;
          });

          const latest = sorted[0];

          // Auto-update state to show data immediately
          setSelectedYear(latest.year);
          setSelectedMonth(latest.month);
        }
      }
    } catch (error) {
      console.error('Error fetching available months:', error);
    }
  };

  const fetchDashboardData = async () => {
    if (!selectedEmployee) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard?employeeName=${encodeURIComponent(selectedEmployee)}&year=${selectedYear}&month=${selectedMonth}`
      );
      const data = await response.json();
      if (response.ok) {
        setDashboardData(data);
      } else {
        console.error('Error fetching dashboard:', data.error);
        setDashboardData(null);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage('Please select a file');
      return;
    }

    setUploading(true);
    setUploadMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadMessage(`✅ ${data.message}`);
        setFile(null);
        document.getElementById('file-input').value = '';

        // Refresh everything
        await fetchEmployees();
        if (selectedEmployee) {
          await fetchAvailableMonths(selectedEmployee);
        }
      } else {
        let errorMsg = data.error || 'Upload failed';
        if (data.message) errorMsg += `: ${data.message}`;
        setUploadMessage(`❌ ${errorMsg}`);
      }
    } catch (error) {
      setUploadMessage(`❌ Error: ${error.message || 'Connection failed'}`);
    } finally {
      setUploading(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="app">
      <header className="header">
        <h1>Leave & Productivity Analyzer</h1>
      </header>

      <main className="main-content">
        <section className="upload-section">
          <h2>Upload Attendance Excel File</h2>
          <div className="upload-controls">
            <input
              id="file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="upload-btn"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {uploadMessage && (
            <div className={`message ${uploadMessage.includes('✅') ? 'success' : 'error'}`}>
              {uploadMessage}
            </div>
          )}
        </section>

        {employees.length > 0 && (
          <section className="dashboard-section">
            <h2>Dashboard</h2>

            <div className="filters">
              <div className="filter-group">
                <label>Employee:</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  {employees.map(emp => (
                    <option key={emp} value={emp}>{emp}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Year:</label>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  min="2020"
                  max="2100"
                />
              </div>

              <div className="filter-group">
                <label>Month:</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>{month}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading...</div>
            ) : dashboardData ? (
              <div className="dashboard-data">
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Expected Hours</h3>
                    <p className="stat-value">{dashboardData.totalExpectedHours}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Actual Hours</h3>
                    <p className="stat-value">{dashboardData.totalActualHours}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Leaves Used</h3>
                    <p className="stat-value">
                      {dashboardData.leavesUsed} / {dashboardData.leavesAllowed}
                    </p>
                  </div>
                  <div className="stat-card">
                    <h3>Productivity</h3>
                    <p className={`stat-value ${dashboardData.productivity >= 90 ? 'good' : dashboardData.productivity >= 70 ? 'medium' : 'low'}`}>
                      {dashboardData.productivity.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Visualizations Section */}
                <div className="visualizations-section">
                  <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#2c3e50' }}>Performance Analytics</h2>

                  <div className="visualizations-grid">
                    {/* Burnup Chart */}
                    <div className="viz-card viz-large">
                      <BurnupChart data={calculateBurnupData(dashboardData.dailyBreakdown, dashboardData.totalExpectedHours)} />
                    </div>

                    {/* Stacked Distribution */}
                    <div className="viz-card viz-large">
                      <StackedDistribution data={calculateStackedData(dashboardData.dailyBreakdown, dashboardData.totalExpectedHours)} />
                    </div>

                    {/* Shift Frequency */}
                    <div className="viz-card">
                      <ShiftFrequency data={calculateShiftFrequency(dashboardData.dailyBreakdown)} />
                    </div>

                    {/* Productivity Bullet */}
                    <div className="viz-card">
                      <ProductivityBullet productivity={dashboardData.productivity} target={90} />
                    </div>
                  </div>
                </div>

                <div className="daily-breakdown">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      padding: '0.75rem',
                      backgroundColor: expandBreakdown ? '#f0f0f0' : 'transparent',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => setExpandBreakdown(!expandBreakdown)}
                  >
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{expandBreakdown ? '▼' : '▶'}</span>
                      Daily Attendance Breakdown
                    </h3>
                  </div>

                  {expandBreakdown && (
                    <div style={{ marginTop: '1rem' }}>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {dashboardData.dailyBreakdown.map((record, index) => (
                          <li key={index} style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ minWidth: '120px', color: '#666' }}>{new Date(record.date).toLocaleDateString()}</div>
                            <div style={{ marginLeft: 'auto' }}>
                              {record.isLeave ? (
                                <span className="badge leave">Leave</span>
                              ) : record.expectedHours === 4 && record.workedHours > 0 ? (
                                <span className="badge halfday">Half Day</span>
                              ) : record.workedHours > 0 ? (
                                <span className="badge present">Present</span>
                              ) : (
                                <span className="badge absent">Absent</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="no-data">
                <p>No data found for {months[selectedMonth - 1]} {selectedYear}.</p>
                {availableDates.length > 0 && (
                  <p className="hint">
                    Available data for {selectedEmployee}: {availableDates.map(d => `${months[d.month - 1]} ${d.year}`).join(', ')}
                  </p>
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;