# Migration `20200928163112-006`

This migration has been generated at 9/28/2020, 4:31:12 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."favorites_on_author" DROP COLUMN "created_at";
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200927003543-005..20200928163112-006
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -51,8 +51,7 @@
     author      Author      @relation(fields: [authorId], references: [id])
     authorId    String      @map("author_id")
     article     Article     @relation(fields: [articleId], references: [id])
     articleId   String      @map("article_id")
-    createdAt   DateTime    @default(now())     @map("created_at")
     @@map("favorites_on_author")
     @@id([authorId, articleId])
 }
```


