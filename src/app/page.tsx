"use client";
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { FaRegMoon } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import Image from 'next/image';

export default function Home() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to fetch summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={`flex flex-col items-center justify-center min-h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
        <h1 className="text-3xl sm:text-5xl font-bold text-center mb-6 sm:mb-10">Web Article Summarizer ✍🏽</h1>

        <div className={`w-full max-w-md sm:max-w-lg p-4 sm:p-6 border rounded-md shadow ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="text"
              className={`bg-gray-50 border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${theme === 'light' ? 'text-gray-900 border-gray-300' : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'}`}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter the URL"
              required
            />
            <button
              type="submit"
              className={`mt-4 w-full text-sm px-5 py-2.5 font-medium ${theme === 'light' ? 'text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100' : 'text-white bg-gray-800 border-gray-600 hover:bg-gray-700 focus:ring-gray-700'}`}
              disabled={loading}
            >
              {loading ? 'Summarizing...' : 'Summarize'}
            </button>
          </form>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          {summary && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Summary:</h2>
              <p>{summary}</p>
            </div>
          )}
        </div>

        <button
          onClick={toggleTheme}
          className="mt-6 sm:mt-10"
          style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {theme === 'light' ? <FaRegMoon /> : <MdOutlineWbSunny color="white" />}
        </button>
      </div>

      <footer className={`items-center  ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
        <div className="w-full mx-auto max-w-screen-xl p-4 flex flex-col sm:flex-row items-center justify-between">
        <a href="https://jigsawstack.com/?ref=powered-by" rel="follow">
      <Image
        src="https://jigsawstack.com/badge.svg" // Corrected to use 'src' instead of 'href'
        alt="Powered by JigsawStack" // Adding an 'alt' attribute for accessibility
        width={100} // Specify the width of the image
        height={50} // Specify the height of the image
      />
    </a>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">View demo on GitHub</a>
            </li>
            
          </ul>
        </div>
      </footer>
    </div>
  );
}
