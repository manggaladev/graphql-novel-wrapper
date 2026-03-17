import { Context } from '../graphql/context';

// Extract token from Authorization header
export const extractToken = (authHeader?: string): string | null => {
  if (!authHeader) return null;

  // Support both "Bearer <token>" and just "<token>" formats
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }

  // If no "Bearer" prefix, treat the whole header as token
  return authHeader;
};

// Parse JWT token (basic decode without verification)
// Note: In production, you should verify the token with JWT_SECRET
export const parseJwt = (token: string): { id: string; email: string; username: string; role: 'ADMIN' | 'USER' } | null => {
  try {
    const base64Payload = token.split('.')[1];
    if (!base64Payload) return null;

    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf-8'));

    return {
      id: payload.id || payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role || 'USER',
    };
  } catch {
    return null;
  }
};

// Build context from request headers
export const buildContext = async (req: { headers: Record<string, string | undefined> }): Promise<Omit<Context, 'dataSources'>> => {
  const authHeader = req.headers.authorization;
  const token = extractToken(authHeader);

  let user: Context['user'] = undefined;

  if (token) {
    const decoded = parseJwt(token);
    if (decoded) {
      user = decoded;
    }
  }

  return {
    user,
    token,
  };
};
