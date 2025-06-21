import { useState } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, Folder } from 'lucide-react';

const RoleSelection = ({ onRoleSelect, directoryHandle: initialDirectoryHandle }) => {
  const [browserSupported, setBrowserSupported] = useState(true);
  const [directoryName, setDirectoryName] = useState(initialDirectoryHandle?.name || '');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(null);
  const [directoryHandle, setDirectoryHandle] = useState(initialDirectoryHandle);

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const selectDirectory = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      setDirectoryHandle(dirHandle);
      setDirectoryName(dirHandle.name);
      console.log('Selected directory:', dirHandle.name);
    } catch (err) {
      console.error('Error selecting directory:', err);
      setError('Failed to select directory');
    }
  };

  const handleRoleSelection = (role) => {
    setError(null);

    if (!userId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    if (!directoryHandle) {
      setError('Please select a directory');
      return;
    }

    onRoleSelect(role, userId, directoryHandle);
  };

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

      <div className="space-y-6">
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

        {/* General Form Button */}
        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelection('general')}
            className="w-full p-6 text-white rounded-lg hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#7b241c' }}
          >
            <h3 className="text-xl font-semibold mb-2">General Communication Assessment</h3>
            <p className="text-sm opacity-90">
              Rate your communication in this conversation
            </p>
          </button>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Select your role:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleRoleSelection('speaker')}
              className="p-6 bg-navy-800 text-white rounded-lg hover:bg-navy-900 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">Speaker</h3>
              <p className="text-sm opacity-90">
                I am the person with Parkinson's Disease
              </p>
            </button>
            <button
              onClick={() => handleRoleSelection('listener')}
              className="p-6 text-white rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#196f3d' }}
            >
              <h3 className="text-xl font-semibold mb-2">Listener</h3>
              <p className="text-sm opacity-90">
                I am the conversation partner/friend
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

RoleSelection.propTypes = {
  onRoleSelect: PropTypes.func.isRequired,
  directoryHandle: PropTypes.object
};

export default RoleSelection;