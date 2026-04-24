/**
 * Password Validation Utility
 * Ensures passwords meet security requirements
 */

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 */
function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least 1 uppercase letter (A-Z)');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least 1 lowercase letter (a-z)');
  }
  if (!hasNumber) {
    errors.push('Password must contain at least 1 number (0-9)');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least 1 special character (!@#$%^&*...)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculateStrength(password)
  };
}

/**
 * Calculate password strength level
 */
function calculateStrength(password) {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (password.length >= 16) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'fair';
  if (strength <= 6) return 'good';
  return 'strong';
}

/**
 * Get password strength color for UI
 */
function getStrengthColor(strength) {
  switch (strength) {
    case 'weak':
      return 'text-red-600';
    case 'fair':
      return 'text-orange-600';
    case 'good':
      return 'text-yellow-600';
    case 'strong':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}

module.exports = {
  validatePassword,
  calculateStrength,
  getStrengthColor
};
