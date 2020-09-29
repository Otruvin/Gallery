import express from 'express'
import { Schema } from './GraphQL/schema.graphql'
import { graphqlHTTP } from 'express-graphql'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())

app.use('/data', graphqlHTTP({
    schema: Schema,
    graphiql: true
}))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))