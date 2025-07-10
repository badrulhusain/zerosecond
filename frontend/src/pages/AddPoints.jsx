import React, { useState, useEffect } from 'react';
import socket from '../socket.js';
import axios from 'axios';

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

    const handlePointsUpdated = (updated) => {
      setMarks(updated);
    };

    socket.on('pointsUpdated', handlePointsUpdated);
    return () => socket.off('pointsUpdated', handlePointsUpdated);
  }, []);

  const toggleCandidate = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleMarkUpdate = (type) => {
    const value = parseInt(inputMark);
    if (isNaN(value) || selectedIds.length === 0) {
      alert("❗ Please enter a valid mark and select candidates.");
      return;
    }

    const updated = marks.map(c =>
      selectedIds.includes(c.candidateId)
        ? { ...c, points: type === 'add' ? c.points + value : c.points - value }
        : c
    );

    setMarks(updated);
    socket.emit('updatePoints', updated);

    setInputMark('');
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-xl space-y-4 bg-white p-6 rounded shadow">
        <input
          type="number"
          value={inputMark}
          onChange={(e) => setInputMark(e.target.value)}
          placeholder="Enter mark"
          className="w-full px-4 py-2 border rounded focus:outline-none"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto border rounded p-2">
          {candidates.map(c => (
            <label key={c.candidateId} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(c.candidateId)}
                onChange={() => toggleCandidate(c.candidateId)}
              />
              <span className="text-sm font-medium">#{c.candidateId} {c.name}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleMarkUpdate('add')}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            ➕ Add Mark
          </button>
          <button
            onClick={() => handleMarkUpdate('minus')}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
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
                  <span className="font-semibold text-red-600">{c.points} pts</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AddPoints;
