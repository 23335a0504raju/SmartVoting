import { useEffect, useState } from 'react';
import '../../styles/components.css';

const AdminElectionDetails = ({ election, onNavigate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        electionType: '',
        startAt: '',
        endAt: '',
        status: '',
        candidates: []
    });
    const [uploading, setUploading] = useState(false);

    // Sync state with props when election data loads/changes
    useEffect(() => {
        if (election) {
            setFormData({
                name: election.name || election.title || '',
                electionType: election.election_type || '',
                startAt: election.start_at ? election.start_at.slice(0, 16) : '',
                endAt: election.end_at ? election.end_at.slice(0, 16) : '',
                status: election.status || '',
                // Ensure candidates have symbolUrl and other fields
                candidates: election.candidates ? election.candidates.map(c => ({
                    ...c,
                    symbol: null, // For new file uploads
                    previewUrl: c.symbolUrl || null // For display
                })) : []
            });
        }
    }, [election]);

    if (!election) {
        return (
            <div className="form-container" style={{ textAlign: 'center', padding: '50px' }}>
                <div className="loader"></div>
                <p>Loading election details...</p>
                <button className="btn btn-secondary" onClick={() => onNavigate('dashboard')}>
                    Return to Dashboard
                </button>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCandidateChange = (index, field, value) => {
        const newCandidates = [...formData.candidates];
        newCandidates[index] = { ...newCandidates[index], [field]: value };
        setFormData({ ...formData, candidates: newCandidates });
    };

    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const newCandidates = [...formData.candidates];
            newCandidates[index].symbol = file;
            newCandidates[index].previewUrl = URL.createObjectURL(file);
            setFormData({ ...formData, candidates: newCandidates });
        }
    };

    const handleSave = async () => {
        setUploading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('electionType', formData.electionType);
            data.append('startAt', new Date(formData.startAt).toISOString());
            data.append('endAt', new Date(formData.endAt).toISOString());
            data.append('status', formData.status);

            // Append candidates as JSON (excluding file objects)
            const candidatesForJson = formData.candidates.map(c => ({
                id: c.id,
                name: c.name,
                age: c.age,
                branch: c.branch,
                symbolUrl: c.symbolUrl || '' // Keep existing URL if no new file
            }));
            data.append('candidates', JSON.stringify(candidatesForJson));

            // Append new files
            formData.candidates.forEach((candidate, index) => {
                if (candidate.symbol) {
                    data.append(`candidate_${index}_symbol`, candidate.symbol);
                }
            });

            const response = await fetch(`http://localhost:5000/api/elections/${election.id}`, {
                method: 'PUT',
                body: data
            });

            if (response.ok) {
                alert('Election updated successfully!');
                setIsEditing(false);
                onNavigate('adminProfile');
            } else {
                const result = await response.json();
                alert(`Failed to update election: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Update Error:", error);
            alert('Error updating election: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '1200px', width: '95%' }}>
            <div className="form-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="form-title" style={{ margin: 0 }}>
                    {isEditing ? 'Edit Election Details' : 'Election Details'}
                </h2>
                <div>
                    {!isEditing ? (
                        <>
                            <button className="btn btn-secondary" onClick={() => onNavigate('adminProfile')} style={{ marginRight: '10px' }}>
                                ← Back
                            </button>
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                Edit Details
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-secondary" onClick={() => setIsEditing(false)} style={{ marginRight: '10px' }} disabled={uploading}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={uploading}>
                                {uploading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Banner Section */}
            <div className="profile-section" style={{ marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '12px', borderLeft: `6px solid ${election.status === 'active' ? '#166534' : '#666'}` }}>
                {/* Single Row for Everything */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '3rem', alignItems: 'flex-start', flexWrap: 'nowrap' }}>

                    {/* Block 1: Identity */}
                    <div style={{ flex: '1.5', minWidth: '300px' }}>
                        <h6 style={{ textTransform: 'uppercase', color: '#888', fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '0.05em' }}>Election Identity</h6>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            {isEditing ? (
                                <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} placeholder="Election Name" style={{ fontSize: '1.2rem', fontWeight: 'bold' }} />
                            ) : (
                                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111', lineHeight: '1.2' }}>{election.name || election.title}</div>
                            )}
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.8rem', color: '#666', marginRight: '8px' }}>Code:</label>
                            <span style={{ fontFamily: 'monospace', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '1rem' }}>{election.code}</span>
                        </div>
                    </div>

                    {/* Block 2: Properties */}
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <h6 style={{ textTransform: 'uppercase', color: '#888', fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '0.05em' }}>Properties</h6>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Status</label>
                            {isEditing ? (
                                <select name="status" className="form-input" value={formData.status} onChange={handleChange}>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="closed">Closed</option>
                                </select>
                            ) : (
                                <span style={{
                                    padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600',
                                    background: election.status === 'active' ? '#dcfce7' : (election.status === 'completed' ? '#dbeafe' : '#fee2e2'),
                                    color: election.status === 'active' ? '#166534' : (election.status === 'completed' ? '#1e40af' : '#991b1b'),
                                    textTransform: 'capitalize', display: 'inline-block'
                                }}>
                                    {election.status}
                                </span>
                            )}
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Type</label>
                            {isEditing ? (
                                <select name="electionType" className="form-input" value={formData.electionType} onChange={handleChange}>
                                    <option value="College wise">College wise</option>
                                    <option value="Class wise">Class wise</option>
                                    <option value="Campus wise">Campus wise</option>
                                    <option value="Branch wise">Branch wise</option>
                                </select>
                            ) : (
                                <div style={{ fontWeight: '500' }}>{election.election_type || 'N/A'}</div>
                            )}
                        </div>
                    </div>

                    {/* Block 3: Timeline */}
                    <div style={{ flex: '1', minWidth: '250px' }}>
                        <h6 style={{ textTransform: 'uppercase', color: '#888', fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '0.05em' }}>Timeline</h6>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Start Time</label>
                            {isEditing ? (
                                <input type="datetime-local" name="startAt" className="form-input" value={formData.startAt} onChange={handleChange} />
                            ) : (
                                <div style={{ fontSize: '0.95rem' }}>{formatDate(election.start_at)}</div>
                            )}
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>End Time</label>
                            {isEditing ? (
                                <input type="datetime-local" name="endAt" className="form-input" value={formData.endAt} onChange={handleChange} />
                            ) : (
                                <div style={{ fontSize: '0.95rem' }}>{formatDate(election.end_at)}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Candidates Section */}
            <div className="profile-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, color: 'var(--primary)' }}>
                        Candidates ({formData.candidates?.length || 0})
                    </h3>
                    {isEditing && (
                        <button
                            className="btn btn-primary"
                            style={{ padding: '5px 10px', fontSize: '0.85rem' }}
                            onClick={() => {
                                const newCandidate = { id: `new_${Date.now()}`, name: '', branch: '', age: '', symbolUrl: '' };
                                setFormData({ ...formData, candidates: [...(formData.candidates || []), newCandidate] });
                            }}
                        >
                            + Add Candidate
                        </button>
                    )}
                </div>

                <div className="election-list">
                    {formData.candidates && formData.candidates.map((candidate, index) => (
                        <div key={index} className="election-item" style={{ cursor: 'default', flexDirection: isEditing ? 'column' : 'row', alignItems: isEditing ? 'stretch' : 'center', border: '1px solid #eee', padding: '15px' }}>
                            {isEditing ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 60px auto', gap: '15px', alignItems: 'start' }}>

                                    {/* Symbol Upload */}
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ width: '60px', height: '60px', border: '1px dashed #ccc', borderRadius: '4px', overflow: 'hidden', marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {candidate.previewUrl ? (
                                                <img src={candidate.previewUrl} alt="Symbol" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            ) : (
                                                <span style={{ fontSize: '0.7rem', color: '#999' }}>No Img</span>
                                            )}
                                        </div>
                                        <label htmlFor={`file-${index}`} style={{ fontSize: '0.7rem', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
                                            {candidate.previewUrl ? 'Change' : 'Upload'}
                                        </label>
                                        <input
                                            id={`file-${index}`}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileChange(index, e)}
                                        />
                                    </div>

                                    {/* Fields */}
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: '#666' }}>Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={candidate.name}
                                            onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: '#666' }}>Branch</label>
                                        <select
                                            className="form-input"
                                            value={candidate.branch || ''}
                                            onChange={(e) => handleCandidateChange(index, 'branch', e.target.value)}
                                        >
                                            <option value="">Select Branch</option>
                                            <option value="CSE">CSE</option>
                                            <option value="ECE">ECE</option>
                                            <option value="EEE">EEE</option>
                                            <option value="MECH">MECH</option>
                                            <option value="CIVIL">CIVIL</option>
                                            <option value="IT">IT</option>
                                            <option value="AI&DS">AI&DS</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: '#666' }}>Age</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={candidate.age || ''}
                                            onChange={(e) => handleCandidateChange(index, 'age', e.target.value)}
                                        />
                                    </div>

                                    <div style={{ paddingTop: '22px' }}>
                                        <button
                                            style={{ background: '#fee2e2', border: 'none', color: '#dc2626', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={() => {
                                                const newCandidates = formData.candidates.filter((_, i) => i !== index);
                                                setFormData({ ...formData, candidates: newCandidates });
                                            }}
                                        >
                                            Del
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '50px', height: '50px', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden',
                                            background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {candidate.symbolUrl ? (
                                                <img src={candidate.symbolUrl} alt={candidate.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            ) : (
                                                <span style={{ fontSize: '1.2rem' }}>🗳️</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{candidate.name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{candidate.branch || 'No Branch'} | Age: {candidate.age || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="election-status" style={{ background: '#f3f4f6', color: '#374151' }}>
                                        Votes: {candidate.votes || 0}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    {(!formData.candidates || formData.candidates.length === 0) && (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No candidates yet.</div>
                    )}
                </div>
            </div>

            {!isEditing && (
                <div className="form-actions" style={{ marginTop: '2rem' }}>
                    <button className="btn btn-primary" onClick={() => onNavigate('adminGenerateResults', { election })}>
                        View Results / Analytics
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminElectionDetails;
