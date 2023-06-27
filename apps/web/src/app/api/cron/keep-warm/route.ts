export const config = {
  runtime: 'edge',
};

export async function GET(req: Request) {
  try {
    await fetch('https://www.wannago.app/e/FyThYG');
    return new Response(JSON.stringify({success: true}));
  } catch (error) {
    return new Response('Something went wrong.', {status: 400});
  }
}
