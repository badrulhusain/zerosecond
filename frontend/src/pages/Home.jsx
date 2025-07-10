import React, { useState, useEffect } from 'react';
import socket from '../socket.js';
import axios from 'axios';

function Home() {
  const [candidates, setCandidates] = useState([]);
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/candidates')
      .then(res => {
        setCandidates(res.data);
        setMarks(res.data.map(c => ({
          candidateId: c.candidateId,
          points: c.points
        })));
      })
      .catch(err => console.error('❌ Failed to fetch candidates:', err));

    const handlePointsUpdated = (updated) => {
      setMarks(updated);
    };

    socket.on('pointsUpdated', handlePointsUpdated);
    return () => socket.off('pointsUpdated', handlePointsUpdated);
  }, []);

  const sorted = [...candidates].sort((a, b) => {
    const aPoints = marks.find(c => c.candidateId === a.candidateId)?.points || 0;
    const bPoints = marks.find(c => c.candidateId === b.candidateId)?.points || 0;
    return bPoints - aPoints;
  });

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-green-100 via-emerald-100 to-blue-100 flex items-center justify-center">
      <div className="w-full h-full max-w-6xl bg-white/90 border border-emerald-300 rounded-none shadow-2xl">
        <table className="w-full h-full table-fixed text-center border-collapse">
          <thead className="bg-emerald-400 text-white text-sm h-[5%] uppercase tracking-wider">
            <tr>
              <th>Rank</th>
              <th>ID</th>
              <th>Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody className="text-emerald-900 text-sm font-medium">
            {sorted.slice(0, 20).map((item, index) => {
              const points = marks.find(c => c.candidateId === item.candidateId)?.points || 0;
              const rankEmoji = ['🥇', '🥈', '🥉'][index] || index + 1;

              return (
                <tr key={item.candidateId} className="even:bg-emerald-50 h-[4.75%]">
                  <td>{rankEmoji}</td>
                  <td>{item.candidateId}</td>
                  <td className="uppercase">{item.name}</td>
                  <td className="text-red-600 font-bold">{points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
