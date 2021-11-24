module.exports = {
  Mutation: {
    newTweet: async (parent, args, ctx) => {
      // 1. make sure the user is authenticated
      const userId = ctx.getUserId(ctx);

      // 2. create a new tweet
      const { text, files, gif, nft, tags = [], mentions = [] } = args;

      const tweet = await ctx.prisma.tweet.create({
        data: {
          text,
          tags: {
            set: tags,
          },
          user: { connect: { id: userId } },
        },
      });

      // 3. if there is any file, create it
      if (files && files.length) {
        files.forEach(async (file) => {
          await ctx.prisma.file.create({
            data: {
              url: file,
              tweet: { connect: { id: tweet.id } },
              user: { connect: { id: userId } },
            },
          });
        });
      }

      if (gif) {
        await ctx.prisma.gif.create({
          data: {
            title: gif.title,
            fixedHeightUrl: gif.fixedHeightUrl,
            originalUrl: gif.originalUrl,
            tweet: { connect: { id: tweet.id } },
          },
        });
      };

      if (nft) {
        await ctx.prisma.nFT.create({
          data: {
            publicKey: nft.publicKey,
            name: nft.name,
            symbol: nft.symbol,
            description: nft.description,
            sellerFeeBasisPoints: nft.sellerFeeBasisPoints,
            image: nft.image,
            attributes: nft.attributes,
            collection: nft.collection,
            properties: nft.properties,
            tweet: { connect: { id: tweet.id } },
          },
        });
      };

      if (tweet && mentions.length) {
        mentions.forEach(async (handle) => {
          handle = handle.substring(1);
          const user = await ctx.prisma.user.findFirst({ where: { handle } });
          if (user && user.id && userId !== user.id) {
            await ctx.prisma.mention.create({
              data: {
                user: {
                  connect: { id: user.id },
                },
                tweet: {
                  connect: { id: tweet.id },
                },
              },
            });
          }
        });
      }

      // 4. for every tag associate it with the tweet
      if (tweet.tags && tweet.tags.length) {
        tweet.tags.forEach(async (tag) => {
          const hasTag = await ctx.prisma.tag.findFirst({
            where: { text: tag },
          });
          if (!hasTag) {
            await ctx.prisma.tag.create({
              data: {
                text: tag,
                tweets: {
                  connect: { id: tweet.id },
                },
              },
            });
          } else {
            await ctx.prisma.tag.update({
              where: { text: tag },
              data: {
                tweets: {
                  connect: { id: tweet.id },
                },
              },
            });
          }
        });
      }

      // 5. return tweet
      return tweet;
    },
  },
};
