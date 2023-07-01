import {baseScheme, user, email} from 'clerk-webhook-handler';

export async function POST(req: Request) {
  const body = await req.json();
  const input = baseScheme.parse(body);

  if (input.type === 'user.created') {
    await user.created(input);
  }
  if (input.type === 'user.updated') {
    await user.updated(input);
  }
  if (input.type === 'user.deleted') {
    await user.deleted(input);
  }
  if (input.type === 'email.created') {
    await email.created(input);
  }

  return new Response(JSON.stringify({success: true}));
}
