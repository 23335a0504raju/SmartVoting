import { useState } from 'react';
import '../../styles/components.css';

const AdminCreateElection = ({ onAddElection, onNavigate, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    electionType: 'College wise', // Default
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    candidates: [{ name: '', age: '', branch: '', symbol: null, symbolUrl: '' }, { name: '', age: '', branch: '', symbol: null, symbolUrl: '' }]
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const electionTypes = [
    'College wise',
    'Class wise',
    'Campus wise',
    'Branch wise'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleCandidateChange = (index, field, value) => {
    const newCandidates = [...formData.candidates];
    newCandidates[index] = {
      ...newCandidates[index],
      [field]: value
    };
    setFormData({ ...formData, candidates: newCandidates });
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newCandidates = [...formData.candidates];
      newCandidates[index].symbol = file;

      // Create a preview URL immediately for local display
      newCandidates[index].previewUrl = URL.createObjectURL(file);

      setFormData({ ...formData, candidates: newCandidates });
    }
  };

  const addCandidate = () => {
    setFormData({
      ...formData,
      candidates: [...formData.candidates, { name: '', age: '', branch: '', symbol: null, symbolUrl: '' }]
    });
  };

  const removeCandidate = (index) => {
    if (formData.candidates.length > 2) {
      const newCandidates = formData.candidates.filter((_, i) => i !== index);
      setFormData({ ...formData, candidates: newCandidates });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Election name is required';
    if (!formData.serialNumber.trim()) newErrors.serialNumber = 'Serial number is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';

    // Validate Candidates
    const validCandidates = formData.candidates.filter(c => c.name.trim() && c.age && c.branch.trim());
    if (validCandidates.length < 2) {
      newErrors.candidates = 'At least 2 candidates with full details (Name, Age, Branch) are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUploading(true);

    try {
      // Create FormData object
      const data = new FormData();

      data.append('name', formData.name);
      data.append('serialNumber', formData.serialNumber);
      data.append('electionType', formData.electionType);

      // Combine Date and Time
      const startAt = new Date(`${formData.startDate}T${formData.startTime}:00`).toISOString();
      const endAt = new Date(`${formData.endDate}T${formData.endTime}:00`).toISOString();

      data.append('startAt', startAt);
      data.append('endAt', endAt);
      data.append('createdBy', user?.name || 'admin');

      // Append candidates as JSON string (excluding files)
      const candidatesForJson = formData.candidates.map(c => ({
        name: c.name,
        age: c.age,
        branch: c.branch,
        symbolUrl: ''
      }));
      data.append('candidates', JSON.stringify(candidatesForJson));

      // Append files separately with unique keys
      formData.candidates.forEach((candidate, index) => {
        if (candidate.symbol) {
          data.append(`candidate_${index}_symbol`, candidate.symbol);
        }
      });

      console.log("Sending Election FormData...");

      // Note: Do NOT set Content-Type header manually when sending FormData, 
      // fetch/browser will set it with the boundary.
      const response = await fetch('http://localhost:5000/api/elections', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create election');
      }

      onAddElection(result);
      alert('Election created successfully!');
      onNavigate('dashboard');
    } catch (error) {
      console.error("Creation Error:", error);
      alert('Error creating election: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create New Election</h2>
      <form onSubmit={handleSubmit}>
        {/* Election Type & Name */}
        <div className="form-group">
          <label className="form-label">Election Type</label>
          <select name="electionType" className="form-input" value={formData.electionType} onChange={handleInputChange}>
            {electionTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Election Name *</label>
          <input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} placeholder="E.g., B.Tech President 2024" />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Serial Number *</label>
          <input type="text" name="serialNumber" className="form-input" value={formData.serialNumber} onChange={handleInputChange} placeholder="E.g., SN-001" />
          {errors.serialNumber && <div className="error-message">{errors.serialNumber}</div>}
        </div>

        {/* Timings */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Start Date *</label>
            <input type="date" name="startDate" className="form-input" value={formData.startDate} onChange={handleInputChange} />
            {errors.startDate && <div className="error-message">{errors.startDate}</div>}
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Start Time *</label>
            <input type="time" name="startTime" className="form-input" value={formData.startTime} onChange={handleInputChange} />
            {errors.startTime && <div className="error-message">{errors.startTime}</div>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">End Date *</label>
            <input type="date" name="endDate" className="form-input" value={formData.endDate} onChange={handleInputChange} />
            {errors.endDate && <div className="error-message">{errors.endDate}</div>}
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">End Time *</label>
            <input type="time" name="endTime" className="form-input" value={formData.endTime} onChange={handleInputChange} />
            {errors.endTime && <div className="error-message">{errors.endTime}</div>}
          </div>
        </div>

        {/* Candidates */}
        <div className="form-group">
          <label className="form-label">Candidates *</label>
          {errors.candidates && <div className="error-message">{errors.candidates}</div>}

          {formData.candidates.map((candidate, index) => (
            <div key={index} className="candidate-card" style={{ padding: '15px', border: '1px solid #ddd', marginBottom: '15px', borderRadius: '8px', background: '#f9f9f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong>Candidate {index + 1}</strong>
                {formData.candidates.length > 2 && (
                  <button type="button" onClick={() => removeCandidate(index)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                <input type="text" className="form-input" placeholder="Name" value={candidate.name} onChange={(e) => handleCandidateChange(index, 'name', e.target.value)} />
                <input type="number" className="form-input" placeholder="Age" value={candidate.age} onChange={(e) => handleCandidateChange(index, 'age', e.target.value)} />
                <select className="form-input" value={candidate.branch} onChange={(e) => handleCandidateChange(index, 'branch', e.target.value)}>
                  <option value="">Select Branch</option>
                  <option value="Computer Science & Engineering (CSE)">CSE</option>
                  <option value="Electronics & Communication (ECE)">ECE</option>
                  <option value="Electrical & Electronics (EEE)">EEE</option>
                  <option value="Mechanical Engineering (ME)">ME</option>
                  <option value="Civil Engineering (CE)">CE</option>
                  <option value="Information Technology (IT)">IT</option>
                  <option value="Artificial Intelligence & DS (AIDS)">AIDS</option>
                </select>

                {/* Symbol Upload */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Symbol Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e)}
                    style={{ fontSize: '0.8rem' }}
                  />
                  {candidate.previewUrl && (
                    <img
                      src={candidate.previewUrl}
                      alt="Preview"
                      style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #ccc', marginTop: '5px' }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={addCandidate}>+ Add Candidate</button>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? 'Uploading & Creating...' : 'Create Election'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate('dashboard')} disabled={uploading}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateElection;