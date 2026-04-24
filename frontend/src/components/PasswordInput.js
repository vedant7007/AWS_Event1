import React from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

/**
 * PasswordInput Component
 * Shows/hides password with strength indicator
 */
export default function PasswordInput({ 
  value, 
  onChange, 
  placeholder = 'Password',
  showStrength = false,
  required = false,
  name = 'password',
  strengthMessage = ''
}) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="mb-4">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          name={name}
          className="w-full px-4 py-2 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <AiOutlineEyeInvisible size={20} />
          ) : (
            <AiOutlineEye size={20} />
          )}
        </button>
      </div>
      
      {/* Password strength indicator */}
      {showStrength && value && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
          <div className="font-semibold text-gray-700 mb-1">Password Requirements:</div>
          <ul className="space-y-1 text-gray-600">
            <li className={value.length >= 8 ? 'text-green-600' : 'text-gray-600'}>
              {value.length >= 8 ? '✓' : '✗'} At least 8 characters
            </li>
            <li className={/[A-Z]/.test(value) ? 'text-green-600' : 'text-gray-600'}>
              {/[A-Z]/.test(value) ? '✓' : '✗'} At least 1 uppercase (A-Z)
            </li>
            <li className={/[a-z]/.test(value) ? 'text-green-600' : 'text-gray-600'}>
              {/[a-z]/.test(value) ? '✓' : '✗'} At least 1 lowercase (a-z)
            </li>
            <li className={/[0-9]/.test(value) ? 'text-green-600' : 'text-gray-600'}>
              {/[0-9]/.test(value) ? '✓' : '✗'} At least 1 number (0-9)
            </li>
            <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) ? 'text-green-600' : 'text-gray-600'}>
              {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) ? '✓' : '✗'} At least 1 special char (!@#$%...)
            </li>
          </ul>
        </div>
      )}

      {/* Strength message */}
      {strengthMessage && (
        <div className="mt-2 text-sm font-semibold" dangerouslySetInnerHTML={{ __html: strengthMessage }} />
      )}
    </div>
  );
}
