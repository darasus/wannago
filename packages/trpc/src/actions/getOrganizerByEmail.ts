import {organizerNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  email: z.string().email(),
});

export function getOrganizerByEmail(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const {email} = validation.parse(input);

    const [user, organization] = await Promise.all([
      ctx.prisma.user.findFirst({
        where: {
          email,
        },
      }),
      ctx.prisma.organization.findFirst({
        where: {
          email,
        },
      }),
    ]);

    invariant(user || organization, organizerNotFoundError);

    return user || organization;
  };
}
