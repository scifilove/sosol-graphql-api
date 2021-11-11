module.exports = {
  Mutation: {
    toggleReaction: async (parent, args, ctx) => {
      const userId = ctx.getUserId(ctx);

      const emoji = await ctx.prisma.reaction.findFirst({
        where: {
          AND: [{ user: { id: userId } }, { tweet: { id: args.id } }, { emojiId: args.emojiId }, { skin: args.skin }],
        },
      });

      if (emoji) {
        await ctx.prisma.reaction.delete({ where: { id: emoji.id } });
        return true;
      }

      if (!emoji) {
        await ctx.prisma.reaction.create({
          data: {
            emojiId: args.emojiId,
            skin: args.skin,
            tweet: { connect: { id: args.id } },
            user: { connect: { id: userId } },
          },
        });
        return true;
      }

      return false;
    },
  },
};
