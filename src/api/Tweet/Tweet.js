module.exports = {
  Tweet: {
    commentsCount: async (parent, _args, ctx) => {
      return await ctx.prisma.comment.count({
        where: { tweet: { id: parent.id } },
      });
    },
    retweetsCount: async (parent, _args, ctx) => {
      return await ctx.prisma.retweet.count({
        where: {
          tweet: {
            id: parent.id,
          },
        },
      });
    },
    isTweetMine: async (parent, _args, ctx) => {
      const userId = ctx.getUserId(ctx, false);
      if (!userId) return false;

      const mine =  await ctx.prisma.tweet.findFirst({
        where: {
          AND: [{ id: parent.id }, { user: { id: userId } }],
        },
      });

      return mine ? true : false;
    },
    isRetweet: async (parent, _args, ctx) => {
      const userId = ctx.getUserId(ctx, false);
      if (!userId) return false;

      const retweet = await ctx.prisma.retweet.findFirst({
        where: {
          user: { id: userId },
          tweet: { id: parent.id },
        },
      });

      return retweet ? true : false;
    },
  },
};
