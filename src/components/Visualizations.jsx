import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    ComposedChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';

/**
 * Calculate burnup chart data
 * Shows ideal vs actual cumulative hours over the month
 */
export function calculateBurnupData(dailyBreakdown, totalExpectedHours) {
    const data = [];
    let cumulativeActual = 0;
    let cumulativeIdeal = 0;
    const idealHourPerDay = totalExpectedHours / dailyBreakdown.length;

    dailyBreakdown.forEach((record, index) => {
        cumulativeActual += record.workedHours;
        cumulativeIdeal = idealHourPerDay * (index + 1);

        data.push({
            day: index + 1,
            date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            actual: parseFloat(cumulativeActual.toFixed(2)),
            ideal: parseFloat(cumulativeIdeal.toFixed(2)),
        });
    });

    return data;
}

/**
 * Calculate stacked status distribution data
 * Shows breakdown of worked hours, leave hours, and remaining hours
 */
export function calculateStackedData(dailyBreakdown, totalExpectedHours) {
    let totalWorked = 0;
    let totalLeave = 0;

    dailyBreakdown.forEach((record) => {
        if (record.isLeave) {
            totalLeave += record.expectedHours;
        } else {
            totalWorked += record.workedHours;
        }
    });

    const totalRemaining = Math.max(0, totalExpectedHours - totalWorked - totalLeave);

    return [
        {
            name: 'Month Overview',
            'Worked Hours': parseFloat(totalWorked.toFixed(2)),
            'Leave Hours': parseFloat(totalLeave.toFixed(2)),
            'Remaining Hours': parseFloat(totalRemaining.toFixed(2)),
        },
    ];
}

/**
 * Calculate shift type frequency
 * Counts weekday shifts, saturday shifts, and leaves
 */
export function calculateShiftFrequency(dailyBreakdown) {
    let weekdayCount = 0;
    let saturdayCount = 0;
    let leaveCount = 0;

    dailyBreakdown.forEach((record) => {
        if (record.isLeave) {
            leaveCount += 1;
        } else if (record.dayOfWeek === 'Saturday') {
            saturdayCount += 1;
        } else {
            weekdayCount += 1;
        }
    });

    return [
        { type: 'Weekday Shifts', count: weekdayCount },
        { type: 'Saturday Shifts', count: saturdayCount },
        { type: 'Leaves', count: leaveCount },
    ];
}

/**
 * Burnup Chart Component
 */
export function BurnupChart({ data }) {
    return (
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#2c3e50' }}>Cumulative Hours Burnup</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                Ideal vs Actual cumulative hours throughout the month. The dashed line shows the ideal pace.
            </p>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                        formatter={(value) => value.toFixed(2)}
                        labelFormatter={(label) => `Day ${label}`}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="ideal"
                        stroke="#bbb"
                        strokeDasharray="5 5"
                        name="Ideal Path"
                        isAnimationActive={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#3498db"
                        strokeWidth={2}
                        name="Actual Path"
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

/**
 * Stacked Status Distribution Component
 */
export function StackedDistribution({ data }) {
    const stackedData = data[0];
    const total = stackedData['Worked Hours'] + stackedData['Leave Hours'] + stackedData['Remaining Hours'];

    return (
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#2c3e50' }}>Monthly Time Distribution</h3>
            <ResponsiveContainer width="100%" height={120}>
                <ComposedChart data={data} layout="vertical">
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" style={{ fontSize: '12px' }} />
                    <Tooltip formatter={(value) => value.toFixed(2)} />
                    <Bar dataKey="Worked Hours" stackId="a" fill="#2ecc71" />
                    <Bar dataKey="Leave Hours" stackId="a" fill="#f39c12" />
                    <Bar dataKey="Remaining Hours" stackId="a" fill="#ecf0f1" />
                </ComposedChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2ecc71' }}>{stackedData['Worked Hours'].toFixed(1)}</div>
                    <div style={{ color: '#666' }}>Worked Hours</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f39c12' }}>{stackedData['Leave Hours'].toFixed(1)}</div>
                    <div style={{ color: '#666' }}>Leave Hours</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#bbb' }}>{stackedData['Remaining Hours'].toFixed(1)}</div>
                    <div style={{ color: '#666' }}>Remaining Hours</div>
                </div>
            </div>
        </div>
    );
}

/**
 * Shift Type Frequency Component
 */
export function ShiftFrequency({ data }) {
    const colors = ['#3498db', '#9b59b6', '#e74c3c'];

    return (
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#2c3e50' }}>Shift Type Frequency</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                Distribution of working days by shift type. Helps verify date parsing accuracy.
            </p>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3498db" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                {data.map((item, idx) => (
                    <div key={idx} style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colors[idx % colors.length] }}>{item.count}</div>
                        <div style={{ color: '#666' }}>{item.type}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Bullet Graph Component for Productivity
 */
export function ProductivityBullet({ productivity, target = 90 }) {
    const percentage = Math.min(100, (productivity / target) * 100);
    const statusColor = productivity >= target ? '#2ecc71' : productivity >= 70 ? '#f39c12' : '#e74c3c';
    const statusText = productivity >= target ? 'On Target' : productivity >= 70 ? 'At Risk' : 'Below Target';

    return (
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#2c3e50' }}>Productivity Performance</h3>
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Target: {target}%</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: statusColor }}>{statusText}</span>
                </div>

                {/* Background bar */}
                <div style={{
                    backgroundColor: '#ecf0f1',
                    height: '40px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    {/* Poor range (0-70) */}
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '70%',
                        height: '100%',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)'
                    }} />
                    {/* Good range (70-90) */}
                    <div style={{
                        position: 'absolute',
                        left: '70%',
                        top: 0,
                        width: '20%',
                        height: '100%',
                        backgroundColor: 'rgba(243, 156, 18, 0.1)'
                    }} />

                    {/* Actual productivity bar */}
                    <div style={{
                        backgroundColor: statusColor,
                        height: '100%',
                        width: `${percentage}%`,
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        transition: 'width 0.3s ease'
                    }}>
                        {percentage > 10 && `${productivity.toFixed(1)}%`}
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#999' }}>
                    <span>0%</span>
                    <span>70%</span>
                    <span>90%</span>
                    <span>100%</span>
                </div>
            </div>
        </div>
    );
}
