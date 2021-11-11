module.exports = {
  Reaction: {
    isMine: async (parent, args, ctx) => {
      const userId = ctx.getUserId(ctx, false);
      if (!userId) return false

      const reaction = await ctx.prisma.reaction.findFirst({
        where: {
          AND: [
            { id: parent.id },
            { user: { id: userId } },
            { emoji: parent.emoji },
          ],
        },
      });
      return reaction ? true : false;
    },
    count: async (parent, args, ctx) => {
      const count = await ctx.prisma.reaction.count({
        where: { AND: [{ tweetId: parent.tweetId }, { emojiId: parent.emojiId }]},
      });
      return count;
    },
  },
};
