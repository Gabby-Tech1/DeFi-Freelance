"use client";

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';

interface Settings {
  notifications: {
    email: boolean;
    proposals: boolean;
    messages: boolean;
    disputes: boolean;
  };
  privacy: {
    showProfile: boolean;
    showEarnings: boolean;
    showActivity: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    currency: string;
  };
}

const DEFAULT_SETTINGS: Settings = {
  notifications: {
    email: true,
    proposals: true,
    messages: true,
    disputes: true,
  },
  privacy: {
    showProfile: true,
    showEarnings: false,
    showActivity: true,
  },
  preferences: {
    theme: 'system',
    language: 'en',
    currency: 'USD',
  },
};

export default function Settings() {
  const { isConnected, connectWallet } = useWallet();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h1>
        <p className="text-gray-600 mb-6">Please connect your wallet to access settings.</p>
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here we would save settings to the blockchain or backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-gray-700 capitalize">{key}</label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      [key]: e.target.checked,
                    },
                  }))}
                  className="w-5 h-5 text-blue-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Privacy</h2>
          <div className="space-y-4">
            {Object.entries(settings.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    privacy: {
                      ...prev.privacy,
                      [key]: e.target.checked,
                    },
                  }))}
                  className="w-5 h-5 text-blue-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Theme</label>
              <select
                value={settings.preferences.theme}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    theme: e.target.value as Settings['preferences']['theme'],
                  },
                }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Language</label>
              <select
                value={settings.preferences.language}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    language: e.target.value,
                  },
                }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Currency</label>
              <select
                value={settings.preferences.currency}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    currency: e.target.value,
                  },
                }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
} 