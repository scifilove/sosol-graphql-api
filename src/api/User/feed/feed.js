module.exports = {
  Query: {
    feed: async (parent, args, ctx) => {
      const {offset, limit} = args;
      // 1. make sure the user is authenticated
      const userId = ctx.getUserId(ctx);
      if (!userId) throw Error("You need to be authenticated");
      if (typeof offset !== 'number') throw Error("Offset argument for limit is missing");
      if (typeof limit !== 'number') throw Error("Limit argument for offset is missing");

      // get the tweets of the user and the people whom they are following
      const following = await ctx.prisma.user
        .findFirst({ where: { id: userId } })
        .following();

      const retweets = await ctx.prisma.retweet.findMany({
        where: { user: { id: { in: following.map((user) => user.id) } } },
      });

      const tweets = await ctx.prisma.tweet.findMany({
        where: {
          OR: [
            {
              // shows tweets by people user follows
              user: {
                id: {
                  in: following.map((user) => user.id).concat([userId]),
                },
              },
            },
            {
              // shows tweets retweeted by people user follows
              id: { 
                in: retweets.map((rt) => rt.tweetId),
              },
            },
          ],
        },
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
