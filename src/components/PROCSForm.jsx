import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, Folder } from 'lucide-react';

const PROCSForm = ({ onComplete, directoryHandle: initialDirectoryHandle }) => {
  const directoryHandleRef = useRef(initialDirectoryHandle);
  const [showFullForm, setShowFullForm] = useState(false);
  const [browserSupported, setBrowserSupported] = useState(true);
  const [directoryName, setDirectoryName] = useState(initialDirectoryHandle?.name || '');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    question1: '', // In my conversations, it is difficult for me to... engage at a level I feel good about.
    question2: '', // In my conversations, it is difficult for me to... ask questions as I desire.
    question3: '', // In my conversations, it is difficult for me to... share my opinion as I desire.
    question4: '', // In my conversations, it is difficult for me to... share information as I desire.
    question5: '', // In my conversations, it is difficult for me to... keep up with the conversation.
    question6: '', // In my conversations, it is difficult for me to... feel heard by my partner.
    question7: '', // In my conversations, it is difficult for me to... present myself the way I want to.
    question8: '', // In my conversations, it is difficult for me to... connect with my partner as I desire.
    question9: '', // In my conversations, it is difficult for me to... say what I want to say.
    question10: '' // In my conversations, it is difficult for me to... participate.
  });

  // Check browser compatibility on mount
  useEffect(() => {
    const isFileSystemSupported = 'showDirectoryPicker' in window;
    setBrowserSupported(isFileSystemSupported);
  }, []);

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const checkExistingPROCS = async () => {
    try {
      const fileName = `${userId}_procs.csv`;
      await directoryHandleRef.current.getFileHandle(fileName);
      // If we get here, the file exists
      onComplete(userId, directoryHandleRef.current);
      return true;
    } catch {
      // File doesn't exist, show the full form
      setShowFullForm(true);
      return false;
    }
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!userId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    if (!directoryHandleRef.current) {
      setError('Please select a directory');
      return;
    }

    await checkExistingPROCS();
  };

  // Select directory for saving recordings
  const selectDirectory = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      directoryHandleRef.current = dirHandle;
      setDirectoryName(dirHandle.name);
      console.log('Selected directory:', dirHandle.name);
    } catch (err) {
      console.error('Error selecting directory:', err);
      setError('Failed to select directory');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveToCSV = async () => {
    if (!directoryHandleRef.current) {
      setError('Please select a directory first');
      return false;
    }

    if (!userId) {
      setError('Please enter a user ID first');
      return false;
    }

    try {
      // Create CSV content
      const csvContent = [
        'User ID,Question 1,Question 2,Question 3,Question 4,Question 5,Question 6,Question 7,Question 8,Question 9,Question 10',
        `${userId},${formData.question1},${formData.question2},${formData.question3},${formData.question4},${formData.question5},${formData.question6},${formData.question7},${formData.question8},${formData.question9},${formData.question10}`
      ].join('\n');

      const fileName = `${userId}_procs.csv`;
      const fileHandle = await directoryHandleRef.current.getFileHandle(fileName, { create: true });
      const writableStream = await fileHandle.createWritable();
      await writableStream.write(new Blob([csvContent], { type: 'text/csv' }));
      await writableStream.close();

      return true;
    } catch (err) {
      console.error('Error saving CSV:', err);
      setError('Failed to save PROCS responses');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await saveToCSV();
    if (success) {
      onComplete(userId, directoryHandleRef.current);
    }
  };

  const procsQuestions = [
    { id: 'question1', text: 'In my conversations, it is difficult for me to... engage at a level I feel good about.' },
    { id: 'question2', text: 'In my conversations, it is difficult for me to... ask questions as I desire.' },
    { id: 'question3', text: 'In my conversations, it is difficult for me to... share my opinion as I desire.' },
    { id: 'question4', text: 'In my conversations, it is difficult for me to... share information as I desire.' },
    { id: 'question5', text: 'In my conversations, it is difficult for me to... keep up with the conversation.' },
    { id: 'question6', text: 'In my conversations, it is difficult for me to... feel heard by my partner.' },
    { id: 'question7', text: 'In my conversations, it is difficult for me to... present myself the way I want to.' },
    { id: 'question8', text: 'In my conversations, it is difficult for me to... connect with my partner as I desire.' },
    { id: 'question9', text: 'In my conversations, it is difficult for me to... say what I want to say.' },
    { id: 'question10', text: 'In my conversations, it is difficult for me to... participate.' }
  ];

  const responseOptions = [
    { value: 'strongly_disagree', label: 'Strongly Disagree' },
    { value: 'disagree', label: 'Disagree' },
    { value: 'somewhat_disagree', label: 'Somewhat Disagree' },
    { value: 'somewhat_agree', label: 'Somewhat Agree' },
    { value: 'agree', label: 'Agree' },
    { value: 'strongly_agree', label: 'Strongly Agree' }
  ];

  const renderPROCSQuestion = (question, index) => (
    <div key={question.id} className="space-y-3 p-4 bg-white rounded-lg border">
      <h3 className="font-medium text-gray-900">
        {index + 1}. {question.text}
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {responseOptions.map(option => (
          <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={question.id}
              value={option.value}
              checked={formData[question.id] === option.value}
              onChange={handleInputChange}
              required
              className="form-radio text-blue-600"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  if (!showFullForm) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">PROCS Assessment</h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p className="font-bold">Error</p>
            </div>
            <p>{error}</p>
          </div>
        )}

        {!browserSupported && (
          <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4 rounded">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p className="font-bold">Browser Compatibility Issue</p>
            </div>
            <p>
              Your browser doesn&apos;t support all required features. Please use Chrome, Edge, or Opera for full functionality.
            </p>
          </div>
        )}

        <form onSubmit={handleInitialSubmit} className="space-y-6">
          {/* User ID Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">User ID:</label>
            <input
              type="text"
              value={userId}
              onChange={handleUserIdChange}
              className="w-full p-2 border rounded"
              placeholder="Enter user ID"
            />
          </div>

          {/* Directory Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium">Save Location:</label>
                <p className="text-sm text-gray-500">
                  {directoryName ? `Selected: ${directoryName}` : 'No directory selected'}
                </p>
              </div>
              <button
                onClick={selectDirectory}
                type="button"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
              >
                <Folder className="h-4 w-4 mr-2" />
                Select Folder
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">PROCS Assessment</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p className="font-bold">Error</p>
          </div>
          <p>{error}</p>
        </div>
      )}

      {!browserSupported && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4 rounded">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p className="font-bold">Browser Compatibility Issue</p>
          </div>
          <p>
            Your browser doesn&apos;t support all required features. Please use Chrome, Edge, or Opera for full functionality.
          </p>
        </div>
      )}

      {/* User ID Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={handleUserIdChange}
          className="w-full p-2 border rounded"
          placeholder="Enter user ID"
        />
      </div>

      {/* Directory Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium">Save Location:</label>
            <p className="text-sm text-gray-500">
              {directoryName ? `Selected: ${directoryName}` : 'No directory selected'}
            </p>
          </div>
          <button
            onClick={selectDirectory}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
            type="button"
          >
            <Folder className="h-4 w-4 mr-2" />
            Select Folder
          </button>
        </div>
      </div>

      {/* PROCS Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Communication Participation Assessment</h2>
          <p className="text-sm text-gray-700 mb-6">
            Please rate how much you agree or disagree with each statement about your conversations.
            Think about your typical conversations and experiences.
          </p>
          
          <div className="space-y-6">
            {procsQuestions.map((question, index) => renderPROCSQuestion(question, index))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          Save PROCS Responses
        </button>
      </form>
    </div>
  );
};

PROCSForm.propTypes = {
  onComplete: PropTypes.func.isRequired,
  directoryHandle: PropTypes.object
};

export default PROCSForm;