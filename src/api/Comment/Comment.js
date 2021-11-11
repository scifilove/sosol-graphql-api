module.exports = {
  Comment: {
    isCommentMine: async (parent, _args, ctx) => {
      // 1. make sure the user is authenticated
      const userId = ctx.getUserId(ctx, false);
      if (!userId) return false;

      const mine = await ctx.prisma.comment.findFirst({
        where: { AND: [{ id: parent.id }, { user: { id: userId } }] },
      });

      return mine ? true : false;
    },
  },
};
