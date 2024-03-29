import {prisma} from 'database';
import {add, isWithinInterval, sub} from 'date-fns';
import {generateRandomString, isWithinExpiration} from 'lucia/utils';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
  const storedUserTokens = await prisma.emailVerificationToken.findMany({
    where: {
      user: {
        id: userId,
      },
    },
  });

  if (storedUserTokens.length > 0) {
    const reusableStoredToken = storedUserTokens.find((token) => {
      // check if expiration is within 1 hour and reuse the token if true
      return isWithinExpiration(token.expires.getTime() - EXPIRES_IN / 2);
    });

    if (reusableStoredToken) {
      return reusableStoredToken.id;
    }
  }

  const emailVerificationToken = await prisma.emailVerificationToken.create({
    data: {
      id: generateRandomString(63),
      expires: add(new Date(), {hours: 2}),
      user_id: userId,
    },
  });

  return emailVerificationToken.id;
};

export const validateEmailVerificationToken = async (token: string) => {
  const storedToken = await prisma.$transaction(async (trx) => {
    const storedToken = await trx.emailVerificationToken.findFirst({
      where: {
        id: token,
      },
    });

    if (!storedToken) {
      throw new Error('Invalid token');
    }

    await trx.emailVerificationToken.delete({
      where: {
        id: storedToken.id,
      },
    });

    return storedToken;
  });

  const tokenExpires = storedToken.expires.getTime();

  if (!isWithinExpiration(tokenExpires)) {
    throw new Error('Token expired!');
  }

  return storedToken.user_id;
};

export const generatePasswordResetToken = async (userId: string) => {
  const storedUserTokens = await prisma.passwordResetToken.findMany({
    where: {
      user_id: userId,
    },
  });

  if (storedUserTokens.length > 0) {
    const reusableStoredToken = storedUserTokens.find((token) => {
      return isWithinInterval(token.expires, {
        start: sub(new Date(), {hours: 2}),
        end: new Date(),
      });
    });

    if (reusableStoredToken) {
      return reusableStoredToken.id;
    }
  }

  const token = generateRandomString(63);

  await prisma.passwordResetToken.create({
    data: {
      id: token,
      expires: add(new Date(), {hours: 2}),
      user_id: userId,
    },
  });

  return token;
};

export const validatePasswordResetToken = async (token: string) => {
  const storedToken = await prisma.$transaction(async (trx) => {
    const storedToken = await trx.passwordResetToken.findFirst({
      where: {
        id: token,
      },
    });

    if (!storedToken) {
      throw new Error('Invalid token');
    }

    await trx.passwordResetToken.delete({
      where: {
        id: storedToken.id,
      },
    });

    return storedToken;
  });

  if (
    !isWithinInterval(storedToken.expires, {
      start: new Date(),
      end: add(new Date(), {hours: 2}),
    })
  ) {
    throw new Error('Expired token');
  }

  return storedToken.user_id;
};

export const isValidPasswordResetToken = async (token: string) => {
  const storedToken = await prisma.passwordResetToken.findFirst({
    where: {
      id: token,
    },
  });

  if (!storedToken) {
    return false;
  }

  const tokenExpires = storedToken.expires.getTime();

  if (!isWithinExpiration(tokenExpires)) {
    return false;
  }

  return true;
};
