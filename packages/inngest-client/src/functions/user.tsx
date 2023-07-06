import {inngest} from '../client';

export const userAccountRegistered = inngest.createFunction(
  {
    name: 'User Account Registered',
  },
  {event: 'user/account.registered'},
  async (ctx) => {
    await ctx.step.sleep(5000);

    const user = await ctx.step.run('Fetch user', () => {
      return ctx.prisma.user.findUnique({
        where: {
          id: ctx.event.data.userId,
        },
      });
    });

    if (!user) {
      return null;
    }

    await ctx.step.run('Notify admins about created user', async () => {
      await ctx.postmark.sendToTransactionalStream({
        subject: 'New user registered',
        to: 'hello@wannago.app',
        htmlString: `
          <div>
            <p>New user registered!</p>
            <p>Name: ${user.firstName} ${user.lastName}</p>
            <p>Email: ${user.email}</p>
            <a href="https://www.wannago.app/u/${user.id}" target="_blank">View user</a>
          </div>
        `,
      });
    });
  }
);
