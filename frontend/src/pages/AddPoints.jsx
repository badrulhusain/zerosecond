import React, { useState, useEffect } from 'react';
import socket from '../socket.js';
import axios from 'axios';
// ... same imports

function AddPoints() {
  const [inputMark, setInputMark] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/candidates')
      .then(res => {
        setCandidates(res.data);
        setMarks(res.data.map(c => ({
          candidateId: c.candidateId,
          points: c.points
        })));
      })
      .catch(err => console.error('❌ Failed to fetch candidates:', err))
      .finally(() => setLoading(false));

    socket.on('pointsUpdated', (updated) => {
      setMarks(updated);
    });

    return () => socket.off('pointsUpdated');
  }, []);

  const toggleCandidate = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleMarkUpdate = (type) => {
    const value = parseFloat(inputMark);
    if (isNaN(value) || selectedIds.length === 0) {
      alert("❗ Please enter a valid mark and select candidates.");
      return;
    }

    const mark = type === 'add' ? value : -value;

    socket.emit('bulkUpdatePoints', {
      candidateIds: selectedIds,
      mark,
    });

    setInputMark('');
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 bg-gray-50 min-h-screen">
  <div className="w-full max-w-4xl space-y-6 bg-white p-10 rounded-2xl shadow-lg">
    <input
      type="text"
      value={inputMark}
      onChange={(e) => setInputMark(e.target.value)}
      placeholder="Enter mark (e.g. 2.5, -1.75)"
      className="w-full text-lg px-6 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto border-2 rounded-xl p-4 bg-gray-50">
      {candidates.map(c => (
        <label key={c.candidateId} className="flex items-center space-x-2 text-base">
          <input
            type="checkbox"
            checked={selectedIds.includes(c.candidateId)}
            onChange={() => toggleCandidate(c.candidateId)}
            className="w-5 h-5"
          />
          <span className="font-medium">#{c.candidateId} {c.name}</span>
        </label>
      ))}
    </div>

    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={() => handleMarkUpdate('add')}
        className="w-full sm:w-1/2 bg-green-600 text-white text-lg py-3 rounded-xl hover:bg-green-700 transition"
      >
        ➕ Add Mark
      </button>
      <button
        onClick={() => handleMarkUpdate('minus')}
        className="w-full sm:w-1/2 bg-red-600 text-white text-lg py-3 rounded-xl hover:bg-red-700 transition"
      >
        ➖ Minus Mark
      </button>
    </div>
  </div>


      {!loading && (
        <div className="mt-6 w-full max-w-xl">
          <h2 className="text-lg font-bold mb-2 text-center">📊 Candidate Scores</h2>
          <ul className="bg-white shadow rounded divide-y max-h-64 overflow-y-auto text-sm">
            {marks
              .sort((a, b) => b.points - a.points)
              .map(c => (
                <li key={c.candidateId} className="p-2 flex justify-between">
                  <span>#{c.candidateId}</span>
                  <span className="font-semibold text-red-600">{c.points.toFixed(2)} pts</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AddPoints;
