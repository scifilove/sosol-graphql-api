module.exports = {
  Query: {
    feed: async (parent, args, ctx) => {
      const {offset, limit} = args;
      // 1. make sure the user is authenticated
      const userId = ctx.getUserId(ctx, false);

      if (typeof offset !== 'number') throw Error("Offset argument for limit is missing");
      if (typeof limit !== 'number') throw Error("Limit argument for offset is missing");

      const tweets = await ctx.prisma.tweet.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          files: true,
          reactions: true,
        },
        skip: offset,
        take: limit,
      });

      return tweets;
    },
  },
};
