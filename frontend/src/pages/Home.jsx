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

  const leftColumn = sorted.slice(0, 10);
  const rightColumn = sorted.slice(10, 20);

  const renderTable = (data, offset) => (
    <table className="w-full h-full table-fixed text-center border-collapse">
      <thead className="bg-emerald-500 text-white text-sm uppercase tracking-wider h-[10%]">
        <tr>
          <th className="py-2">Rank</th>
          <th className="py-2">ID</th>
          <th className="py-2">Name</th>
          <th className="py-2">Points</th>
        </tr>
      </thead>
      <tbody className="text-emerald-900 text-sm font-medium">
        {data.map((item, index) => {
          const points = marks.find(c => c.candidateId === item.candidateId)?.points || 0;
          const overallIndex = offset + index;
          const rankEmoji = ['🥇', '🥈', '🥉'][overallIndex] || overallIndex + 1;

          return (
            <tr key={item.candidateId} className="even:bg-emerald-50 h-[9%]">
              <td className="uppercase text-xl">{rankEmoji}</td>
              <td className="uppercase text-xl">{item.candidateId}</td>
              <td className="uppercase text-xl">{item.name}</td>
              <td className="text-red-600 font-bold text-2xl">{points}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-green-100 via-emerald-100 to-blue-100 p-0 m-0">
      <div className="flex w-full h-full">
        <div className="w-1/2 h-full p-2">
          <div className="w-full h-full bg-white/90 border border-emerald-300 rounded-none shadow-inner">
            {renderTable(leftColumn, 0)}
          </div>
        </div>
        <div className="w-1/2 h-full p-2">
          <div className="w-full h-full bg-white/90 border border-emerald-300 rounded-none shadow-inner">
            {renderTable(rightColumn, 10)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
