import { useState } from 'react';
import PROCSForm from './components/PROCSForm';

const App = () => {
  const [isComplete, setIsComplete] = useState(false);
  const [userId, setUserId] = useState('');

  const handleComplete = (newUserId) => {
    setUserId(newUserId);
    setIsComplete(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-8">
        {!isComplete ? (
          <PROCSForm onComplete={handleComplete} />
        ) : (
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
              <h2 className="text-xl font-bold mb-2">Thank You!</h2>
              <p>Your PROCS responses have been saved successfully for user ID: <strong>{userId}</strong></p>
              <p className="mt-2 text-sm">The CSV file has been saved to your selected directory.</p>
            </div>
            <button
              onClick={() => {
                setIsComplete(false);
                setUserId('');
              }}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Complete Another Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;