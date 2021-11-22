module.exports = {
  Query: {
    tweet: (parent, args, ctx) => {
      return ctx.prisma.tweet.findFirst({
        where: { id: args.id },
        include: {
          user: true,
          files: true,
          gif: true,
          comments: {
            include: { user: true },
          },
          reactions: true,
        },
      });
    },
  },
};
