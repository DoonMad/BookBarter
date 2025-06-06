// Primary colors
const primaryBlue = '#1E90FF'; // dodgerblue
const primaryDarkBlue = '#0066CC';
const primaryLightBlue = '#E6F2FF';

// Neutral colors
const lightGray = '#F3F4F6';
const mediumGray = '#D1D5DB';
const darkGray = '#6B7280';
const black = '#111827';
const white = '#FFFFFF';

// Status colors
const successGreen = '#10B981';
const errorRed = '#EF4444';
const warningAmber = '#F59E0B';
const infoBlue = '#3B82F6';

export default {
  light: {
    // Base colors
    text: black,
    textSecondary: darkGray,
    background: white,
    cardBackground: lightGray,
    border: mediumGray,
    
    // Primary colors
    primary: primaryBlue,
    primaryDark: primaryDarkBlue,
    primaryLight: primaryLightBlue,
    tint: primaryBlue,
    
    // Status colors
    success: successGreen,
    error: errorRed,
    warning: warningAmber,
    info: infoBlue,
    
    // Tab bar
    tabIconDefault: mediumGray,
    tabIconSelected: primaryBlue,
    
    // Buttons
    buttonPrimary: primaryBlue,
    buttonPrimaryText: white,
    buttonSecondary: lightGray,
    buttonSecondaryText: black,
  },
  dark: {
    // Base colors
    text: white,
    textSecondary: mediumGray,
    background: '#121212', // Dark background
    cardBackground: '#1E1E1E',
    border: '#333333',
    
    // Primary colors
    primary: primaryBlue,
    primaryDark: primaryDarkBlue,
    primaryLight: primaryLightBlue,
    tint: white,
    
    // Status colors
    success: successGreen,
    error: errorRed,
    warning: warningAmber,
    info: infoBlue,
    
    // Tab bar
    tabIconDefault: darkGray,
    tabIconSelected: white,
    
    // Buttons
    buttonPrimary: primaryBlue,
    buttonPrimaryText: white,
    buttonSecondary: '#2D2D2D',
    buttonSecondaryText: white,
  },
};