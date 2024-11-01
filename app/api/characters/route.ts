import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:5000/api/characters', {
      method: 'GET',
    });
    const data = await response.json();
    // Ensure we always return an array
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error fetching characters:', error);
    // Return empty array on error instead of error response
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const personalityFile = formData.get('personality') as File;
    const backgroundFile = formData.get('background') as File;

    const personality = await personalityFile.text();
    const background = await backgroundFile.text();

    const response = await fetch('http://localhost:5000/api/characters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        personality,
        background,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 }
    );
  }
}
