module.exports = {
  Query: {
    userFollow: async (parent, args, ctx) => {
      // make sure the user is authenticated
      const userId = ctx.getUserId(ctx);
      if (!userId) throw Error("You need to be authenticated");

      const offset = args.offset ? args.offset : 0;
      const limit = args.limit ? args.limit : 4;

      console.log(limit);

      // find creators I am following already to exclude
      const following = await ctx.prisma.user
        .findUnique({ where: { id: userId } })
        .following();
      const userIds = following.map((user) => user.id);

      // execute find not in creators I am following already
      return ctx.prisma.user.findMany({
        where: {
          id: { notIn: userIds },
        },
        skip: offset,
        take: limit,
      });
    },
  },
};
