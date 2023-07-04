import {organizerNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  id: z.string().uuid(),
});

export function getOrganizerById(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const {id} = validation.parse(input);

    const [user, organization] = await Promise.all([
      ctx.prisma.user.findFirst({
        where: {
          id,
        },
      }),
      ctx.prisma.organization.findFirst({
        where: {
          id,
        },
      }),
    ]);

    invariant(user || organization, organizerNotFoundError);

    return user || organization;
  };
}
