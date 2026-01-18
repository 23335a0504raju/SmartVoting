import { useState } from 'react';
import '../../styles/components.css';
import ElectionResults from '../Common/ElectionResults';

const Elections = ({ elections, onNavigate, user }) => {
    const [viewingResults, setViewingResults] = useState(null);
    const [loadingResults, setLoadingResults] = useState(false);

    const handleViewResults = async (election) => {
        setLoadingResults(true);
        try {
            // Fetch fresh data to ensure vote counts are up to date
            const response = await fetch(`http://localhost:5000/api/elections/${election.id}`);
            if (response.ok) {
                const data = await response.json();
                setViewingResults(data);
            } else {
                alert("Failed to load latest results.");
                setViewingResults(election); // Fallback to provided data
            }
        } catch (error) {
            console.error("Error fetching results:", error);
            setViewingResults(election); // Fallback
        } finally {
            setLoadingResults(false);
        }
    };

    // Helper to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    // Helper for status badge styling
    const getStatusStyle = (status) => {
        switch (status) {
            case 'active': return { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' };
            case 'upcoming': return { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' };
            case 'closed': case 'completed': return { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' };
            case 'announced': return { backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' };
            default: return { backgroundColor: '#e2e3e5', color: '#383d41' };
        }
    };

    if (viewingResults) {
        return (
            <div className="dashboard-content">
                <button
                    className="btn btn-secondary"
                    onClick={() => setViewingResults(null)}
                    style={{ marginBottom: '1rem' }}
                >
                    ← Back to Elections
                </button>
                <ElectionResults election={viewingResults} showDownload={false} />
            </div>
        );
    }

    return (
        <div className="dashboard-content">
            <h2 className="section-title">Election Center</h2>
            <p className="section-subtitle">View and participate in ongoing and upcoming elections.</p>

            <div className="table-container" style={{ marginTop: '2rem', overflowX: 'auto', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                {elections.length === 0 ? (
                    <div className="no-data-message" style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>No elections found at this time.</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '1.2rem', textAlign: 'left', color: '#666', fontWeight: '600', width: '50px' }}>#</th>
                                <th style={{ padding: '1.2rem', textAlign: 'left', color: '#666', fontWeight: '600', width: '25%' }}>Election Details</th>
                                <th style={{ padding: '1.2rem', textAlign: 'left', color: '#666', fontWeight: '600', width: '15%' }}>Code</th>
                                <th style={{ padding: '1.2rem', textAlign: 'left', color: '#666', fontWeight: '600', width: '35%' }}>Candidates</th>
                                <th style={{ padding: '1.2rem', textAlign: 'left', color: '#666', fontWeight: '600', width: '15%' }}>Timeline</th>
                                <th style={{ padding: '1.2rem', textAlign: 'center', color: '#666', fontWeight: '600' }}>Status</th>
                                <th style={{ padding: '1.2rem', textAlign: 'center', color: '#666', fontWeight: '600' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {elections.map((election, index) => (
                                <tr key={election.id} style={{ borderBottom: '1px solid #f1f1f1', transition: 'background 0.2s' }}>

                                    {/* Serial Number */}
                                    <td style={{ padding: '1.2rem', verticalAlign: 'top', color: '#888', fontWeight: '500' }}>
                                        {election.serialNumber || index + 1}
                                    </td>

                                    {/* Title & Description */}
                                    <td style={{ padding: '1.2rem', verticalAlign: 'top' }}>
                                        <div style={{ fontWeight: '700', color: '#2c3e50', fontSize: '1.1rem', marginBottom: '4px' }}>
                                            {election.title || election.name}
                                        </div>
                                        {election.description && (
                                            <div style={{ fontSize: '0.85rem', color: '#777', lineHeight: '1.4' }}>
                                                {election.description.replace('[ANNOUNCED]', '').trim()}
                                            </div>
                                        )}
                                        <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            {election.election_type}
                                        </div>
                                    </td>

                                    {/* Code */}
                                    <td style={{ padding: '1.2rem', verticalAlign: 'top' }}>
                                        <span style={{ fontFamily: 'monospace', background: '#f8f9fa', padding: '4px 8px', borderRadius: '6px', fontSize: '0.9rem', border: '1px solid #eee', color: '#555' }}>
                                            {election.code}
                                        </span>
                                    </td>

                                    {/* Candidates List - Improved UI */}
                                    <td style={{ padding: '1.2rem', verticalAlign: 'top' }}>
                                        {election.candidates && election.candidates.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {election.candidates.map((candidate, idx) => (
                                                    <div key={idx} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        background: '#fff',
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        border: '1px solid #f1f1f1'
                                                    }}>
                                                        {/* Large Symbol */}
                                                        <div style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            borderRadius: '50%',
                                                            overflow: 'hidden',
                                                            border: '2px solid #fff',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            flexShrink: 0,
                                                            background: '#f8f9fa',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            {candidate.symbolUrl ? (
                                                                <img src={candidate.symbolUrl} alt={candidate.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                <span style={{ fontSize: '1.2rem' }}>👤</span>
                                                            )}
                                                        </div>

                                                        {/* Candidate Info */}
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: '600', color: '#333', fontSize: '0.95rem' }}>{candidate.name}</div>
                                                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                                                                {candidate.branch} • {candidate.age} yrs
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span style={{ color: '#999', fontStyle: 'italic', fontSize: '0.9rem' }}>No candidates listed</span>
                                        )}
                                    </td>

                                    {/* Timeline */}
                                    <td style={{ padding: '1.2rem', verticalAlign: 'top', fontSize: '0.85rem', color: '#555' }}>
                                        <div style={{ marginBottom: '6px' }}>
                                            <span style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Starts</span>
                                            {formatDate(election.start_at)}
                                        </div>
                                        <div>
                                            <span style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Ends</span>
                                            {formatDate(election.end_at)}
                                        </div>
                                    </td>

                                    {/* Status Badge */}
                                    <td style={{ padding: '1.2rem', verticalAlign: 'middle', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.4rem 1rem',
                                            borderRadius: '50px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            ...getStatusStyle(election.status),
                                            display: 'inline-block',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }}>
                                            {election.status}
                                        </span>
                                    </td>

                                    {/* Action Button */}
                                    <td style={{ padding: '1.2rem', verticalAlign: 'middle', textAlign: 'center' }}>
                                        {(election.description && election.description.includes('[ANNOUNCED]')) ? (
                                            <button
                                                className="btn"
                                                onClick={() => handleViewResults(election)}
                                                disabled={loadingResults}
                                                style={{
                                                    padding: '0.6rem 1.2rem',
                                                    fontSize: '0.85rem',
                                                    background: '#6366f1',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap',
                                                    boxShadow: '0 4px 6px rgba(99, 102, 241, 0.2)'
                                                }}
                                            >
                                                📈 View Results
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-primary"
                                                disabled={election.status !== 'active'}
                                                onClick={() => onNavigate('voting', { election: election })}
                                                style={{
                                                    padding: '0.6rem 1.2rem',
                                                    fontSize: '0.85rem',
                                                    opacity: election.status === 'active' ? 1 : 0.6,
                                                    cursor: election.status === 'active' ? 'pointer' : 'not-allowed',
                                                    whiteSpace: 'nowrap',
                                                    borderRadius: '6px',
                                                    boxShadow: election.status === 'active' ? '0 4px 6px rgba(37, 99, 235, 0.2)' : 'none'
                                                }}
                                            >
                                                {election.status === 'active' ? 'Vote Now' : 'Closed'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Elections;
