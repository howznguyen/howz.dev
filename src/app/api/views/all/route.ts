import { NextResponse } from 'next/server';
import { umamiService } from '@/services/umami/umami.service';

export async function GET() {
  try {
    if (!umamiService.isConfigured()) {
      return NextResponse.json({ 
        error: 'Umami not configured',
        views: {} 
      }, { status: 200 });
    }

    const viewsMap = await umamiService.getViewsMap();
    const viewsObject = Object.fromEntries(viewsMap);

    return NextResponse.json({ 
      success: true,
      views: viewsObject,
      total: Array.from(viewsMap.values()).reduce((sum, views) => sum + views, 0),
      count: viewsMap.size
    });
  } catch (error) {
    console.error('Error fetching views:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch views',
      views: {} 
    }, { status: 500 });
  }
}