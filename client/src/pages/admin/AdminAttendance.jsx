import React, { useState, useEffect } from 'react';
import { Shield, Clock, Users, CalendarCheck, Search, Download } from 'lucide-react';
import { adminGetAttendance } from '../../../services/attendanceService';
import StatusBadge from '../../../components/volunteer/StatusBadge';
import SkeletonLoader from '../../../components/volunteer/SkeletonLoader';

const AdminAttendance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await adminGetAttendance();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Shield size={20} className="text-primary" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</span>
          </div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Attendance Tracking</h1>
          <p style={{ color: 'var(--color-body)', marginTop: '0.5rem' }}>Monitor real-time check-ins and volunteer hours.</p>
        </div>
        <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={16} /> Export Report
        </button>
      </div>

      {loading ? <SkeletonLoader type="dashboard" /> : (
        <>
          {data && (
            <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', borderRadius: '50%' }}><Users size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{data.stats.todayPresent}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Present Today</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', borderRadius: '50%' }}><Users size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{data.stats.todayAbsent}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Absent Today</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)', borderRadius: '50%' }}><Clock size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{data.stats.totalHoursToday}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Hours Logged Today</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)', borderRadius: '50%' }}><CalendarCheck size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{data.stats.programsRunning}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Active Programs</div></div>
              </div>
            </div>
          )}

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Today's Check-ins</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
                  <input type="text" placeholder="Search..." className="form-control" style={{ paddingLeft: '2.25rem' }} />
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Volunteer</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Program</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Check In</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Check Out</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recentActivity?.map((record, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{record.volunteerName}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>{record.programTitle}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--color-body)' }}>{record.checkInTime || '-'}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--color-body)' }}>{record.checkOutTime || '-'}</td>
                      <td style={{ padding: '1rem 1.5rem' }}><StatusBadge status={record.status} /></td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>{record.hoursWorked || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAttendance;
