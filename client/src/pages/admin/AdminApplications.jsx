import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileCheck, Search, Filter, Shield } from 'lucide-react';
import { getApplicationsStats, getApplications } from '../../../services/applicationsService';
import StatusBadge from '../../../components/volunteer/StatusBadge';
import Pagination from '../../../components/volunteer/Pagination';
import SkeletonLoader from '../../../components/volunteer/SkeletonLoader';

const AdminApplications = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsRes = await getApplicationsStats();
        const appsRes = await getApplications();
        if (statsRes.success) setStats(statsRes.data);
        if (appsRes.success) setApplications(appsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Shield size={20} className="text-primary" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</span>
          </div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Application Management</h1>
          <p style={{ color: 'var(--color-body)', marginTop: '0.5rem' }}>Review and manage volunteer applications across all programs.</p>
        </div>
      </div>

      {loading ? <SkeletonLoader type="dashboard" /> : (
        <>
          {stats && (
            <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)', borderRadius: '50%' }}><FileCheck size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.pending}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Pending Review</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)', borderRadius: '50%' }}><Users size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.today}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>New Today</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', borderRadius: '50%' }}><Users size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.newVolunteers}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Total Volunteers</div></div>
              </div>
            </div>
          )}

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Recent Applications</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
                  <input type="text" placeholder="Search applicants..." className="form-control" style={{ paddingLeft: '2.25rem', width: '250px' }} />
                </div>
                <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Filter size={16} /> Filter
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Applicant</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Program</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Date Applied</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                            {/* Dummy initials since mock doesn't have applicant name */}
                            US
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--color-heading)' }}>Urmika Sharma</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-body)' }}>urmika@example.com</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>{app.programTitle}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--color-body)' }}>
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <StatusBadge status={app.status} />
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '1rem 1.5rem' }}>
              <Pagination currentPage={1} totalPages={3} totalItems={24} onPageChange={() => {}} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminApplications;
