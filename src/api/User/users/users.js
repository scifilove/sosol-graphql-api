const {
  FOLLOWING,
  FOLLOWERS,
  EXCLUDE_FOLLOWING,
  // EXCLUDE_FOLLOWERS,
} = require("../../../constants/follow");

module.exports = {
  Query: {
    users: async (parent, args, ctx) => {
      // make sure the user is authenticated
      const userId = ctx.getUserId(ctx);
      if (!userId) throw Error("You need to be authenticated");
      if (
        args.filter &&
        ![FOLLOWING, FOLLOWERS, EXCLUDE_FOLLOWING].includes(args.filter)
      )
        throw Error(`No such filter: ${args.filter}`);

      const offset = args.offset ? args.offset : 0;
      const limit = args.limit ? args.limit : 15;

      if (args.filter === FOLLOWING) {
        // find creators I'm following
        const following = await ctx.prisma.user
          .findUnique({ where: { id: userId } })
          .following();
        const userIds = following.map((user) => user.id);

        // execute find following query
        return ctx.prisma.user.findMany({
          where: {
            id: { userIds },
          },
          skip: offset,
          take: limit,
        });
      } else if (args.filter === FOLLOWERS) {
        // find creators that follow me
        const followers = await ctx.prisma.user
          .findUnique({ where: { id: userId } })
          .followers();
        const userIds = followers.map((user) => user.id);

        // execute find followers query
        return ctx.prisma.user.findMany({
          where: {
            id: { userIds },
          },
          skip: offset,
          take: limit,
        });
      } else if (args.filter === EXCLUDE_FOLLOWING) {
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
