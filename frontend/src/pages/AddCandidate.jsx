import axios from 'axios';
import React, { useState } from 'react';

function AddCandidate() {
  const [candidate, setCandidate] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!candidate || !name) {
      setError('Please enter both candidate ID and name.');
      return;
    }

    try {
      await axios.post("http://localhost:3000/candidate", {
        candidateId: Number(candidate),
        name,
      });

      setSuccess("Candidate added successfully!");
      setError('');
      setCandidate('');
      setName('');
    } catch (err) {
      console.error(err);
      setError("Error adding candidate. Please try again.");
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200">
      <div className="w-[95vw] md:w-[85vw] lg:w-[75vw] xl:w-[70vw] 2xl:w-[60vw] mx-auto p-12 md:p-20 rounded-3xl bg-white shadow-2xl border-4 border-green-300 flex flex-col items-center">
        <h2 className="text-4xl mb-12 text-center font-extrabold text-green-700 tracking-tight drop-shadow-lg">
          Add Candidate
        </h2>
        <form onSubmit={handleSubmit} className="w-full max-w-3xl">
          <div className="mb-10">
            <label htmlFor="candidateID" className="block mb-3 text-2xl text-green-800 font-bold">
              Candidate ID
            </label>
            <input
              id="candidateID"
              type="number"
              value={candidate}
              onChange={e => setCandidate(e.target.value)}
              className="w-full p-5 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none text-green-700 text-2xl font-medium bg-green-50 transition"
              required
            />
          </div>
          <div className="mb-10">
            <label htmlFor="name" className="block mb-3 text-2xl text-green-800 font-bold">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-5 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none text-green-700 text-2xl font-medium bg-green-50 transition"
              required
            />
          </div>
          {error && <div className="text-red-600 mb-6 text-lg font-semibold">{error}</div>}
          {success && <div className="text-green-600 mb-6 text-lg font-semibold">{success}</div>}
          <button
            type="submit"
            className="w-full py-5 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-white font-bold text-2xl shadow-xl hover:from-green-500 hover:to-green-700 transition"
          >
            Add Candidate
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCandidate;