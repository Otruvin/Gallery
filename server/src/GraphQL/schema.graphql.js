import { 
    GraphQLObjectType, 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLBoolean, 
    GraphQLList, 
    GraphQLSchema, 
    GraphQLError} from 'graphql'
import {PrismaClient} from '@prisma/client'
import bcrypt from 'bcryptjs'
import Validator from 'password-validator'
import emailValidator from 'email-validator'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const passwordValidator = new Validator()

passwordValidator
    .is().min(6)
    .is().max(20)
    .has().not().spaces()

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents of author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        favorites: {
            type: new GraphQLList(ArticleType),
            resolve: async (author) => {
                const relations = await prisma.favoratiesOnAuthor.findMany({
                    where: {
                        authorId: author.id
                    }
                })
                const favoriteArticlesIds = relations.map((relation) => {
                    return relation.articleId
                })
                return await prisma.article.findMany({
                    where: {
                        id: {
                            in: favoriteArticlesIds
                        }
                    }
                })
            }
        },
        articles: {
            type: new GraphQLList(ArticleType),
            resolve: async (author) => await prisma.article.findMany({
                where: {
                    authorId: author.id
                }
            })
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve: async (author) => await prisma.comment.findMany({
                where: {
                    authorId: author.id
                }
            })
        }
    })
})

const ArticleType = new GraphQLObjectType({
    name: 'Article',
    description: 'This represents a article of the author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString) },
        theme: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLString },
        published: { type: GraphQLBoolean },
        updatedAt: { type: GraphQLNonNull(GraphQLString) },
        image: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLString) },
        fans: {
            type: new GraphQLList(AuthorType),
            resolve: async (article) => {
                const relations = await prisma.favoratiesOnAuthor.findMany({
                    where: {
                        articleId: article.id
                    }
                })
                const fansIds = relations.map((relation) => {
                    return relation.authorId
                })
                return await prisma.author.findMany({
                    where: {
                        id: {
                            in: fansIds
                        }
                    }
                })
            }
        },
        author: {
            type: AuthorType,
            resolve: async (article) => await prisma.author.findOne({
                where: {
                    id: article.authorId
                }
            })
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve: async (article) => await prisma.comment.findMany({
                where: {
                    articleId: article.id
                }
            })
        }
    })
})

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    description: 'This represents a comment of the author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString) },
        text: { type: GraphQLNonNull(GraphQLString) },
        createdAt: { type: GraphQLNonNull(GraphQLString) },
        updatedAt: { type: GraphQLNonNull(GraphQLString) },
        articleId: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLString) },
        article: {
            type: ArticleType,
            resolve: async (comment) => await prisma.article.findOne({
                where: {
                    id: comment.articleId
                }
            })
        },
        author: {
            type: AuthorType,
            resolve: async (comment) => await prisma.author.findOne({
                where: {
                    id: comment.authorId
                }
            })
        }
    })
})

const TokenUserType = new GraphQLObjectType({
    name: 'JWT_USER',
    description: 'Response jwt_token',
    fields: () => ({
        user: { type: GraphQLNonNull(GraphQLString) },
        token: { type: GraphQLNonNull(GraphQLString) }
    })
})

const RelationType = new GraphQLObjectType({
    name: 'relation',
    description: 'Relation between favor and user',
    fields: () => ({
        authorId: { type: GraphQLNonNull(GraphQLString) },
        articleId: { type: GraphQLNonNull(GraphQLString) },
        author: {
            type: AuthorType,
            resolve: async (relation) => await prisma.author.findOne({
                where: {
                    id: relation.authorId
                }
            })
        },
        article: {
            type: ArticleType,
            resolve: async (relation) => await prisma.article.findOne({
                where: {
                    id: relation.articleId
                }
            })
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        authors: {
            type: GraphQLList(AuthorType),
            description: 'List of all authors',
            resolve: async () => await prisma.author.findMany()
        },
        articles: {
            type: GraphQLList(ArticleType),
            description: 'List of all articles',
            resolve: async () => await prisma.article.findMany()
        },
        comments: {
            type: GraphQLList(CommentType),
            description: 'List of all comments',
            resolve: async () => await prisma.comment.findMany()
        }
    })
})

const RootMutationsType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutations',
    fields: () => ({
        registerUser: {
            type: AuthorType,
            description: 'Register new author',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => {
                if (!passwordValidator.validate(args.password)) {
                    throw new GraphQLError("Password need to have 8 - 20 symbols length, without spaces")
                }
                if (!emailValidator.validate(args.email)) {
                    throw new GraphQLError("Email is wrong")
                }
                try {
                    const createdAuthor = await prisma.author.create({
                        data: {
                            name: args.name,
                            email: args.email,
                            password: await bcrypt.hash(args.password, 12)
                        }
                    })
                    return createdAuthor
                } catch (e) {
                    throw new GraphQLError("User with this email already registrated or server can't submit your query")
                }
            }
        },
        loginUser: {
            type: TokenUserType,
            description: 'Login registered user',
            args: {
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => {

                try {

                    if (args.email.length === 0) {
                        throw new GraphQLError("You need to enter email")
                    }
                    if (!emailValidator.validate(args.email)) {
                        throw new GraphQLError("Entered wrong email")
                    }
                    if (args.password.length === 0) {
                        throw new GraphQLError("You need to enter your password")
                    }
                    if (!passwordValidator.validate(args.password)) {
                        throw new GraphQLError("Password need to have 8 - 20 symbols length, without spaces")
                    }
                    const author = await prisma.author.findOne({
                        where: {
                            email: args.email
                        }
                    })
    
                    if (!author) {
                        throw new GraphQLError("User not found")
                    }
    
                    const isEntered = await bcrypt.compare(args.password, author.password)
    
                    if (!isEntered) {
                        throw new GraphQLError("Wrong password, try again")
                    }
    
                    const token = jwt.sign(
                        { authorId: author.id },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    )
    
                    return {
                        user: author.id,
                        token: token
                    }

                } catch (e) {
                    throw new GraphQLError(`Something goes wrong (${e.message})`)
                }
                
            }
        },
        deleteAuthor: {
            type: AuthorType,
            description: 'Deleting authro',
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => await prisma.author.delete({
                where: {
                    id: args.id
                }
            })
        },
        createComment: {
            type: CommentType,
            description: 'Creating comment',
            args: {
                text: { type: GraphQLNonNull(GraphQLString) },
                articleId: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => await prisma.comment.create({
                data: {
                    text: args.text,
                    author: {
                        connect: { id: args.authorId }
                    },
                    article: {
                        connect: { id: args.articleId }
                    }
                }
            })
        },
        createArticle: {
            type: ArticleType,
            description: 'Creating article',
            args: {
                theme: { type: GraphQLNonNull(GraphQLString) },
                content: { type: GraphQLString },
                image: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (parent, args) => await prisma.article.create({
                data: {
                    theme: args.theme,
                    content: args.content,
                    image: args.image,
                    author: {
                        connect: { id: args.authorId }
                    }
                }
            })
        },
        deleteComment: {
            type: CommentType,
            description: 'Deleting comment',
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => await prisma.comment.delete({
                where: {
                    id: args.id
                }
            })
        },
        deleteArticle: {
            type: ArticleType,
            description: 'Deleting article',
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => await prisma.article.delete({
                where: {
                    id: args.id
                }
            })
        },
        updateComment: {
            type: CommentType,
            description: 'Updating comment',
            args: {
                id: { type: GraphQLNonNull(GraphQLString) },
                newText: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => await prisma.comment.update({
                where: {
                    id: args.id
                },
                data: {
                    text: args.newText
                }
            })
        },
        addFavorite: {
            type: RelationType,
            description: 'Add article to favorite',
            args: {
                idArticle: { type: GraphQLNonNull(GraphQLString) },
                idUser: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => await prisma.favoratiesOnAuthor.create({
                data: {
                    article: { connect: { id: args.idArticle } },
                    author: { connect: { id: args.idUser } }
                }
            })
        }

    })
})

const Schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationsType
})

export { Schema }