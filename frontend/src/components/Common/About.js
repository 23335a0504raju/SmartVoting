import '../../styles/components.css';

const About = ({ onNavigate }) => {
    return (
        <div className="about-container" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '12px', color: '#333', lineHeight: '1.6' }}>

            {/* Title Page */}
            <div style={{ textAlign: 'center', marginBottom: '60px', borderBottom: '2px solid #eee', paddingBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '10px' }}>SMARTBALLOT</h1>
                <h2 style={{ fontSize: '1.5rem', color: '#7f8c8d', marginBottom: '30px' }}>AI-POWERED FACIAL RECOGNITION VOTING SYSTEM</h2>

                <div style={{ margin: '30px 0' }}>
                    <p><strong>A PROJECT REPORT</strong></p>
                    <p>Submitted in partial fulfillment of the requirements for the award of the degree of</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '10px 0' }}>Bachelor of Technology</p>
                    <p>in</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '10px 0' }}>COMPUTER SCIENCE AND ENGINEERING</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '600px', margin: '40px auto', textAlign: 'left' }}>
                    <div>
                        <p><strong>Ch. Nithin Kumar</strong> (22331A0534)</p>
                        <p><strong>D. Ramjagan</strong> (22331A0539)</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p><strong>J. Madhu</strong> (22331A0563)</p>
                        <p><strong>B. Lakshmi Priya</strong> (22331A0510)</p>
                    </div>
                </div>

                <div style={{ marginTop: '40px' }}>
                    <p>Under the Supervision of</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>K. Hymavathi</p>
                    <p>Assistant Professor</p>
                </div>

                <div style={{ marginTop: '50px' }}>
                    <p><strong>DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</strong></p>
                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>MAHARAJ VIJAYARAM GAJAPATHI RAJ COLLEGE OF ENGINEERING (Autonomous)</p>
                    <p style={{ fontSize: '0.9rem', color: '#555' }}>Approved by AICTE, New Delhi, and permanently affiliated to JNTUGV, Vizianagaram</p>
                    <p style={{ fontSize: '0.9rem', color: '#555' }}>Vijayaram Nagar Campus, Chintalavalasa, Vizianagaram-535005, Andhra Pradesh</p>
                    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>APRIL, 2026</p>
                </div>
            </div>

            {/* Abstract */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ borderLeft: '5px solid var(--primary)', paddingLeft: '15px', color: 'var(--primary)' }}>ABSTRACT</h2>
                <p>
                    In the modern digital era, secure and remote voting systems are essential to ensure transparency, accessibility, and efficiency in democratic processes.
                    <strong> SmartBallot</strong> is an intelligent online voting platform that integrates AI-based facial recognition and liveness detection to provide a highly secure and user-friendly voting experience.
                </p>
                <p>
                    This system allows users to cast their votes online after verifying their identity through real-time face authentication. Unlike traditional systems that rely on passwords or OTPs, SmartBallot employs deep learning models to detect and prevent spoofing attacks, such as using photos or videos for unauthorized access.
                </p>
                <p>
                    Key modules of the system include voter registration with face capture, AI-powered liveness detection, secure vote casting, and an admin dashboard for monitoring election results. The backend is developed using Node.js/Express (migrated from Python Flask concepts), face recognition APIs, and secure database practices. The system ensures that each user can vote only once, and all transactions are securely logged for auditability.
                </p>
            </section>

            {/* Chapter 1 */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ borderLeft: '5px solid var(--primary)', paddingLeft: '15px', color: 'var(--primary)' }}>1. INTRODUCTION</h2>

                <h3>1.1 Background and Problem Statement</h3>
                <p>
                    With the rapid digital transformation of governance and institutional processes, online voting systems have emerged as a promising solution to enable accessible and efficient electoral participation. These systems are particularly beneficial for remote users. However, traditional online voting systems primarily rely on usernames, passwords, or OTPs, which are vulnerable to unauthorized access/identity fraud.
                </p>
                <p>
                    To enhance security, the integration of biometric technologies, especially facial recognition offers a reliable alternative. AI and deep learning have enabled real-time liveness detection to distinguish between real persons and spoofing attempts.
                </p>

                <h3>1.2 Project Objectives</h3>
                <ul>
                    <li><strong>Primary:</strong> Design and develop a secure online voting platform using facial recognition and AI-powered liveness detection.</li>
                    <li><strong>Secondary:</strong> User-friendly dashboards, spoofing detection, real-time analytics, and data privacy.</li>
                </ul>

                <h3>1.3 Scope</h3>
                <p>
                    Focuses on prototype levels suitable for small-scale elections (institutions, clubs). Limitations include dependency on camera hardware and internet access.
                </p>
            </section>

            {/* Chapter 2 */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ borderLeft: '5px solid var(--primary)', paddingLeft: '15px', color: 'var(--primary)' }}>2. LITERATURE REVIEW</h2>
                <p>
                    Existing systems like Helios Voting offer transparency but lack biometrics. FaceVote prototypes often lacked real-time performance. SmartBallot addresses the gap by offering AI-based multimodal verification (Face + Liveness) in a lightweight web application.
                </p>
                <div style={{ overflowX: 'auto', margin: '20px 0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Parameter</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Traditional E-Voting</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>SmartBallot (Proposed)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Authentication</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>ID/Password</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}><strong>Facial Recognition (AI)</strong></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Accuracy</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Moderate</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}><strong>Very High</strong></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Fraud Prevention</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Low</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}><strong>High (Liveness Check)</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Chapter 3 */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ borderLeft: '5px solid var(--primary)', paddingLeft: '15px', color: 'var(--primary)' }}>3. METHODOLOGY & SYSTEM DESIGN</h2>
                <p>
                    The project follows the <strong>Agile Methodology</strong> for iterative development.
                </p>
                <h3>System Requirements</h3>
                <ul>
                    <li><strong>Hardware:</strong> Webcam, Internet connectivity.</li>
                    <li><strong>Software:</strong> Node.js/Express (Backend), React (Frontend), Python (AI Engine), Supabase/PostgreSQL (Database).</li>
                </ul>
                <h3>Modules</h3>
                <ul>
                    <li><strong>User Registration:</strong> Face capture and embedding generation.</li>
                    <li><strong>Authentication:</strong> Live comparison of captured face vs. stored embedding.</li>
                    <li><strong>Voting:</strong> Secure interface with auto-submission timer.</li>
                    <li><strong>Admin:</strong> Election management and analytics.</li>
                </ul>
            </section>

            {/* Chapter 4 */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ borderLeft: '5px solid var(--primary)', paddingLeft: '15px', color: 'var(--primary)' }}>4. IMPLEMENTATION</h2>
                <p>
                    <strong>Stack Change Note:</strong> While the initial proposal mentioned Flask/MongoDB, the final implementation utilizes <strong>Node.js, Express, and Supabase (PostgreSQL with pgvector)</strong> for enhanced scalability and vector similarity search performance, while retaining a <strong>Python AI Service</strong> for the core biometric processing (DeepFace).
                </p>
                <h3>Key Features Implemented</h3>
                <ul>
                    <li><strong>Face Registration:</strong> Webcam captures image &rarr; Python API generates vector &rarr; Stored in Supabase.</li>
                    <li><strong>Liveness Detection:</strong> Basic challenges (blink/head turn) to prevent photo spoofing.</li>
                    <li><strong>Real-time Results:</strong> Admin dashboard uses dynamic charts to show vote counts instantly.</li>
                </ul>
            </section>

            {/* Chapter 5,6 */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ borderLeft: '5px solid var(--primary)', paddingLeft: '15px', color: 'var(--primary)' }}>5. CONCLUSION</h2>
                <p>
                    SmartBallot successfully demonstrates a secure, transparent, and user-friendly online voting system. By integrating AI-driven facial recognition, it effectively mitigates the risks of impersonation common in traditional e-voting.
                </p>
                <p>
                    <strong>Future Scope:</strong> Integration with national ID databases, advanced deepfake detection models, and blockchain for immutable vote recording.
                </p>
            </section>

            <div style={{ textAlign: 'center', marginTop: '60px' }}>
                <button className="btn btn-primary" onClick={() => onNavigate && onNavigate('dashboard')} style={{ padding: '12px 30px' }}>
                    Back to Dashboard
                </button>
            </div>

        </div>
    );
};

export default About;
