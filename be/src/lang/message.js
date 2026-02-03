const MESSAGE = {
  1001: 'login successfully',
  1002: 'register successfully',
  1003: 'Email not exist. please register first!',
  1004: 'Your password is not correct.',
  1005: 'Email already exist.',
  1006: 'Profile fetched successfully',
  1007: 'Logged out successfully',

  1100: 'Document already exists',
  1101: 'Document created successfully',
  1102: 'Document updated successfully',
  1103: 'Document deleted successfully',
  1104: 'Document(s) fetched successfully',

  
  1200: 'Only one text file is allowed',

  9001: 'Unauthorized',
  9002: 'Your account was deleted.',
  9003: 'Your account has been inactive by admin.',
  9004: 'Your account is inactive. Please verify your account.',
  9005: 'You have not permission to access this route.',
  9006: 'Please attach files.',

  9998: 'validation failed.',
  9999: 'Something went wrong.',

};

const getMessage = (messageCode) => MESSAGE[messageCode] || messageCode;

export { getMessage };
