import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, tempOAuthData } = await request.json();

    if (!username || !tempOAuthData) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    // Validate username format
    if (!/^[a-z0-9_]+$/.test(username) || username.length < 3) {
      return NextResponse.json(
        { error: 'Invalid username format' },
        { status: 400 }
      );
    }

    // TODO: Create user in backend database
    // This would typically involve:
    // 1. Create user record with OAuth data
    // 2. Set username
    // 3. Generate session token
    
    console.log('Creating OAuth user:', {
      username,
      provider: tempOAuthData.provider,
      email: tempOAuthData.email,
      name: tempOAuthData.name,
    });

    // For now, just return success
    return NextResponse.json({ 
      success: true,
      message: 'Account setup completed successfully' 
    });
  } catch (error) {
    console.error('OAuth completion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
