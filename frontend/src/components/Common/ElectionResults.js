import { Download, Medal, PieChart, Printer, Share2, TrendingUp, Trophy, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { calculateWinner, generateBarGraphData } from '../../utils/auth';

const ElectionResults = ({ election, showDownload = true }) => {
    const [animateBars, setAnimateBars] = useState(false);
    const [viewMode, setViewMode] = useState('graph'); // 'graph', 'pie', 'table'
    const graphRef = useRef(null);

    // Trigger animations when component mounts
    useEffect(() => {
        setAnimateBars(true);
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setAnimateBars(true);
                }
            },
            { threshold: 0.1 }
        );

        if (graphRef.current) {
            observer.observe(graphRef.current);
        }

        return () => observer.disconnect();
    }, []);

    if (!election) return null;

    const { winner, runner } = calculateWinner(election.candidates);
    const graphData = generateBarGraphData(election.candidates);
    const totalVotes = election.candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 1);

    const BarGraph = ({ data }) => {
        const maxVotes = Math.max(...data.map(item => item.votes), 1);

        return (
            <div className="bar-graph-horizontal" ref={graphRef} style={{ padding: '2rem', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
                {data.map((item, index) => {
                    const percent = ((item.votes / totalVotes) * 100);
                    const isWinner = item.name === winner.name;
                    const isRunner = runner && item.name === runner.name;

                    return (
                        <div
                            key={index}
                            className="bar-container-horizontal"
                            style={{
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.5rem',
                                opacity: animateBars ? 1 : 0,
                                transform: animateBars ? 'translateX(0)' : 'translateX(-20px)',
                                transition: `all 0.6s ease-out ${index * 0.1}s`
                            }}
                        >
                            <div className="bar-label" style={{
                                width: '180px',
                                fontWeight: '600',
                                color: isWinner ? '#059669' : isRunner ? '#f59e0b' : '#334155',
                                textAlign: 'right',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontSize: isWinner ? '1.1rem' : '1rem',
                                position: 'relative'
                            }}>
                                {item.name}
                                {(isWinner || isRunner) && (
                                    <span style={{
                                        position: 'absolute',
                                        right: '-30px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '0.9rem',
                                        color: isWinner ? '#059669' : '#f59e0b'
                                    }}>
                                        {isWinner ? <Trophy size={16} /> : <Medal size={16} />}
                                    </span>
                                )}
                            </div>

                            <div className="bar-track" style={{
                                flex: 1,
                                background: 'rgba(226, 232, 240, 0.5)',
                                borderRadius: '12px',
                                height: '32px',
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
                            }}>
                                <div
                                    className="bar-fill"
                                    style={{
                                        width: animateBars ? `${(item.votes / maxVotes) * 100}%` : '0%',
                                        height: '100%',
                                        background: isWinner
                                            ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                                            : isRunner
                                                ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)'
                                                : 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                                        borderRadius: '12px',
                                        transition: `width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15}s`,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Animated shine effect */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                                        animation: 'shimmer 2s infinite',
                                        transform: 'translateX(-100%)'
                                    }}></div>
                                </div>

                                {/* Percentage label inside bar */}
                                <span style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                                    opacity: percent > 15 ? 1 : 0,
                                    transition: 'opacity 0.3s'
                                }}>
                                    {percent.toFixed(1)}%
                                </span>
                            </div>

                            <div className="bar-value" style={{
                                width: '100px',
                                fontWeight: '700',
                                color: isWinner ? '#059669' : isRunner ? '#f59e0b' : '#1e293b',
                                fontSize: '1.1rem',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '1.3rem', marginBottom: '2px' }}>{item.votes}</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'normal' }}>
                                    votes
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const PieChartView = () => {
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];
        const radius = 120;
        const centerX = 150;
        const centerY = 150;
        let cumulativePercent = 0;

        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <svg width="300" height="300" viewBox="0 0 300 300">
                        {graphData.map((item, index) => {
                            const percent = (item.votes / totalVotes) * 100;
                            const angle = (percent / 100) * 360;
                            const startAngle = cumulativePercent * 3.6;
                            const endAngle = startAngle + angle;

                            const startRad = (startAngle - 90) * Math.PI / 180;
                            const endRad = (endAngle - 90) * Math.PI / 180;

                            const x1 = centerX + radius * Math.cos(startRad);
                            const y1 = centerY + radius * Math.sin(startRad);
                            const x2 = centerX + radius * Math.cos(endRad);
                            const y2 = centerY + radius * Math.sin(endRad);

                            const largeArcFlag = angle > 180 ? 1 : 0;

                            const pathData = [
                                `M ${centerX} ${centerY}`,
                                `L ${x1} ${y1}`,
                                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                'Z'
                            ].join(' ');

                            cumulativePercent += percent;

                            return (
                                <path
                                    key={index}
                                    d={pathData}
                                    fill={colors[index % colors.length]}
                                    opacity={animateBars ? 1 : 0}
                                    style={{
                                        transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
                                        transform: animateBars ? 'scale(1)' : 'scale(0)',
                                        transformOrigin: 'center'
                                    }}
                                />
                            );
                        })}
                    </svg>

                    {/* Center text */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '50%',
                        width: '100px',
                        height: '100px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>
                            {totalVotes}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            Total Votes
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                    {graphData.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '2px',
                                background: colors[index % colors.length]
                            }}></div>
                            <span style={{ fontSize: '0.9rem', color: '#334155' }}>
                                {item.name} ({((item.votes / totalVotes) * 100).toFixed(1)}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const ResultsTable = () => {
        return (
            <div className="results-table-enhanced" style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                    }}>
                        <tr>
                            <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', fontWeight: '600', fontSize: '0.95rem' }}>Rank</th>
                            <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', fontWeight: '600', fontSize: '0.95rem' }}>Candidate</th>
                            <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', fontWeight: '600', fontSize: '0.95rem' }}>Votes</th>
                            <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', fontWeight: '600', fontSize: '0.95rem' }}>Percentage</th>
                            <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', fontWeight: '600', fontSize: '0.95rem' }}>Bar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...election.candidates]
                            .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                            .map((candidate, index) => {
                                const votes = candidate.votes || 0;
                                const percent = totalVotes > 0 ? ((votes / totalVotes) * 100) : 0;
                                const isWinner = index === 0;
                                const isRunner = index === 1;

                                return (
                                    <tr
                                        key={index}
                                        style={{
                                            borderBottom: '1px solid #f1f5f9',
                                            background: isWinner
                                                ? 'rgba(16, 185, 129, 0.05)'
                                                : isRunner
                                                    ? 'rgba(245, 158, 11, 0.05)'
                                                    : index % 2 === 0 ? '#fafafa' : 'white',
                                            opacity: animateBars ? 1 : 0,
                                            transform: animateBars ? 'translateY(0)' : 'translateY(10px)',
                                            transition: `all 0.4s ease ${index * 0.05}s`
                                        }}
                                    >
                                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: '#334155' }}>
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                background: isWinner
                                                    ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                                                    : isRunner
                                                        ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
                                                        : '#e2e8f0',
                                                color: isWinner || isRunner ? 'white' : '#64748b',
                                                fontWeight: 'bold'
                                            }}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500', color: '#1e293b' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                {isWinner && <Trophy size={18} color="#10b981" />}
                                                {isRunner && <Medal size={18} color="#f59e0b" />}
                                                {candidate.name}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', fontWeight: '600', color: '#1e293b', fontSize: '1.1rem' }}>
                                            {votes.toLocaleString()}
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: '#334155' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '0.25rem 0.75rem',
                                                background: '#f1f5f9',
                                                borderRadius: '20px',
                                                fontWeight: '600',
                                                color: '#6366f1'
                                            }}>
                                                {percent.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                                            <div style={{
                                                width: '100px',
                                                height: '8px',
                                                background: '#e2e8f0',
                                                borderRadius: '4px',
                                                margin: '0 auto',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: animateBars ? `${percent}%` : '0%',
                                                    height: '100%',
                                                    background: isWinner
                                                        ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                                                        : isRunner
                                                            ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)'
                                                            : 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                                                    borderRadius: '4px',
                                                    transition: `width 1s ease ${index * 0.1}s`
                                                }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        );
    };

    // Add CSS animations
    const styles = `
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes trophySpin {
            0% { transform: rotateY(0); }
            100% { transform: rotateY(360deg); }
        }
    `;

    return (
        <>
            <style>{styles}</style>
            <div className="results-container" style={{
                animation: 'fadeInUp 0.6s ease-out',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem'
            }}>
                {/* Header */}
                <div className="results-header" style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                    paddingBottom: '2rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '24px',
                    padding: '3rem 2rem',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                    }}>
                        Election Code: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{election.code}</span>
                    </div>

                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }}>
                        {election.name}
                    </h2>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        marginTop: '2rem',
                        opacity: animateBars ? 1 : 0,
                        transition: 'opacity 0.6s 0.3s'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{totalVotes}</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Votes</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{election.candidates.length}</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Candidates</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                                {totalVotes > 0 ? Math.round((winner.votes || 0) / totalVotes * 100) : 0}%
                            </div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Winner Share</div>
                        </div>
                    </div>
                </div>

                {/* Winner & Runner Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '2rem',
                    marginBottom: '3rem'
                }}>
                    {/* Winner Card */}
                    <div className="winner-card" style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                        padding: '2.5rem',
                        borderRadius: '24px',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        animation: 'pulse 3s infinite',
                        transformOrigin: 'center'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            fontSize: '3rem',
                            animation: 'trophySpin 4s linear infinite'
                        }}>🏆</div>

                        <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.9, marginBottom: '1rem' }}>
                            <Trophy size={16} style={{ marginRight: '0.5rem' }} /> Winner
                        </div>

                        <h2 style={{
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            margin: '0 0 1rem 0',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                        }}>
                            {winner.name}
                        </h2>

                        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{winner.votes || 0}</div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Votes</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                    {totalVotes > 0 ? (((winner.votes || 0) / totalVotes) * 100).toFixed(1) : 0}%
                                </div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Share</div>
                            </div>
                        </div>
                    </div>

                    {/* Runner Card */}
                    {runner ? (
                        <div className="runner-card" style={{
                            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                            padding: '2rem',
                            borderRadius: '24px',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                fontSize: '2rem'
                            }}>🥈</div>

                            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.9, marginBottom: '0.75rem' }}>
                                <Medal size={14} style={{ marginRight: '0.5rem' }} /> Runner Up
                            </div>

                            <h3 style={{
                                fontSize: '1.8rem',
                                fontWeight: '700',
                                margin: '0 0 0.5rem 0'
                            }}>
                                {runner.name}
                            </h3>

                            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{runner.votes || 0}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Votes</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                        {totalVotes > 0 ? (((runner.votes || 0) / totalVotes) * 100).toFixed(1) : 0}%
                                    </div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Share</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem'
                        }}>
                            <div style={{ textAlign: 'center', color: '#64748b' }}>
                                <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p style={{ fontWeight: '500' }}>Uncontested Election</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* View Mode Toggle */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '2rem',
                    background: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '12px'
                }}>
                    <button
                        onClick={() => setViewMode('graph')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: viewMode === 'graph' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#e2e8f0',
                            color: viewMode === 'graph' ? 'white' : '#64748b',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <TrendingUp size={18} /> Bar Chart
                    </button>
                    <button
                        onClick={() => setViewMode('pie')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: viewMode === 'pie' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#e2e8f0',
                            color: viewMode === 'pie' ? 'white' : '#64748b',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <PieChart size={18} /> Pie Chart
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: viewMode === 'table' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#e2e8f0',
                            color: viewMode === 'table' ? 'white' : '#64748b',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        📊 Table View
                    </button>
                </div>

                {/* Results Visualization */}
                <div className="results-graph" style={{ marginBottom: '3rem' }}>
                    <h4 style={{
                        borderLeft: '4px solid #6366f1',
                        paddingLeft: '1.5rem',
                        marginBottom: '1.5rem',
                        color: '#1e293b',
                        fontSize: '1.5rem',
                        fontWeight: '700'
                    }}>
                        Election Analytics
                    </h4>

                    {viewMode === 'graph' && <BarGraph data={graphData} />}
                    {viewMode === 'pie' && <PieChartView />}
                    {viewMode === 'table' && <ResultsTable />}
                </div>

                {/* Download & Share Options */}
                {showDownload && (
                    <div className="results-actions" style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        padding: '2rem',
                        background: '#f8fafc',
                        borderRadius: '20px',
                        marginTop: '3rem'
                    }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => window.print()}
                            style={{
                                padding: '1rem 2rem',
                                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
                            }}
                        >
                            <Printer size={20} /> Print Official Report
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                // Generate and download PDF/CSV
                                const blob = new Blob([JSON.stringify({
                                    election: election.name,
                                    code: election.code,
                                    totalVotes,
                                    results: election.candidates.map(c => ({
                                        candidate: c.name,
                                        votes: c.votes || 0,
                                        percentage: totalVotes > 0 ? ((c.votes || 0) / totalVotes * 100).toFixed(2) : '0.00'
                                    }))
                                }, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${election.code}-results.json`;
                                a.click();
                            }}
                            style={{
                                padding: '1rem 2rem',
                                background: 'white',
                                color: '#6366f1',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Download size={20} /> Download Data
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                            style={{
                                padding: '1rem 2rem',
                                background: 'white',
                                color: '#f59e0b',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Share2 size={20} /> Share Results
                        </button>
                    </div>
                )}

                {/* Stats Summary */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem',
                    marginTop: '3rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid #e2e8f0'
                }}>
                    <div style={{
                        background: '#f0f9ff',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0369a1' }}>
                            Voting Margin
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0284c7', marginTop: '0.5rem' }}>
                            {winner.votes - (runner?.votes || 0)} votes
                        </div>
                    </div>

                    <div style={{
                        background: '#fef7ff',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#86198f' }}>
                            Win Ratio
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a855f7', marginTop: '0.5rem' }}>
                            {((winner.votes / totalVotes) * 100).toFixed(1)}%
                        </div>
                    </div>

                    <div style={{
                        background: '#f0fdf4',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#166534' }}>
                            Turnout Efficiency
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.5rem' }}>
                            {Math.round((totalVotes / 1000) * 100)}%
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ElectionResults;