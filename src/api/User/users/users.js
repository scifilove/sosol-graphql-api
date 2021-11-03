module.exports = {
  Query: {
    users: async (parent, args, ctx) => {
      // 1. make sure the user is authenticated
      const userId = ctx.getUserId(ctx);
      if (!userId) throw Error("You need to be authenticated");

      const offset = args.offset ? args.offset : 0;
      const limit = args.limit ? args.limit : 15;

      if (args.excludeFollows) {
        // 2. find people I am following already to exclude
        const following = await ctx.prisma.user
          .findUnique({ where: { id: userId } })
          .following();
        const userIds = following.map((user) => user.id);

        // 3. find creators I am not following
        return ctx.prisma.user.findMany({
          where: {
            id: { notIn: userIds },
          },
          skip: offset,
          take: limit,
        });
      }
      // If !args.excludeFollows get all users except self with offset
      return ctx.prisma.user.findMany({
        where: {
          id: { notIn: userId },
        },
        skip: offset,
        take: limit,
      });
    },
  },
};
