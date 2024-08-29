import { NextRequest, NextResponse } from 'next/server';
import { JigsawStack } from 'jigsawstack';

// Initialize JigsawStack with your API key from environment variables
const jigsawstack = JigsawStack({
  apiKey: process.env.JIGSAWSTACK_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();


    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const result = await jigsawstack.web.ai_scrape({
      url: url,
      element_prompts: ["article"], // Adjust prompts as necessary
    });
    let text = ""
    result.data.forEach((element :any)=> {
      text += element?.results?.[0]?.text
    });

    const summary = await jigsawstack.summary({
      text: text,
      type: "text"
    });

    if (summary.success) {
      console.log('Generated Summary:', summary); 
      return NextResponse.json({ summary:summary.summary });
    } else {
      console.log('Scrape failed');
      return NextResponse.json({ error: 'Failed to scrape content' }, { status: 500 });
    }
  } catch (error) {
    
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}

function summarize(text: any): string {
 
 
  return text.length > 300 ? `${text.substring(0, 300)}...` : text;
}
