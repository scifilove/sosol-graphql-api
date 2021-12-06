module.exports = {
  Query: {
    profile: async (parent, args, ctx) => {
      const userExists = await ctx.prisma.user.findUnique({
        where: { id: args.id },
        include: {
          tweets: {
            include: {
              user: true,
              files: true,
              reactions: true,
              gif: true,
              nft: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          retweets: true,
          following: true,
          followers: true,
          comments: true,
        }
      });

      if (!userExists) throw Error(`No user found for id - ${args.id}`);
      return userExists;
    },
  },
};
