import jwt from 'jsonwebtoken';

const verifyAuthToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  // Check if Authorization header exists and starts with 'Bearer '
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No valid token found in the request.' });
  }

  // Extract the token from the Authorization header
  const token = authorizationHeader.split(' ')[1];

  try {
    // Verify the JWT token using the secret key
    const decodedData = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    req.user = { id: decodedData.id }; // Attach user ID to request object for later use
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('JWT token verification failed:', error);
    res.status(401).json({ message: 'Unauthorized access. Invalid token.' });
  }
};

export default verifyAuthToken;
