# Migration `20200803023744-003`

This migration has been generated at 8/3/2020, 2:37:44 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."article" DROP CONSTRAINT "article_authorId_fkey"

ALTER TABLE "public"."comment" DROP CONSTRAINT "comment_articleId_fkey"

ALTER TABLE "public"."comment" DROP CONSTRAINT "comment_authorId_fkey"

ALTER TABLE "public"."article" DROP COLUMN "authorId",
ADD COLUMN "author_id" text  NOT NULL ;

ALTER TABLE "public"."comment" DROP COLUMN "articleId",
DROP COLUMN "authorId",
ADD COLUMN "article_id" text  NOT NULL ,
ADD COLUMN "author_id" text  NOT NULL ;

ALTER TABLE "public"."article" ADD FOREIGN KEY ("author_id")REFERENCES "public"."author"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."comment" ADD FOREIGN KEY ("article_id")REFERENCES "public"."article"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."comment" ADD FOREIGN KEY ("author_id")REFERENCES "public"."author"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200802163642-002..20200803023744-003
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
@@ -24,9 +24,9 @@
   id        String      @id     @default(cuid())
   theme     String
   content   String?
   author    Author      @relation(fields: [authorId], references: [id])
-  authorId  String
+  authorId  String      @map("author_id")
   comments  Comment[]
   image     String       
   published Boolean     @default(false)
   updatedAt DateTime    @updatedAt    @map("updated_at")
@@ -39,8 +39,8 @@
   cretedAt  DateTime    @default(now())   @map("created_at")
   updatedAt DateTime    @updatedAt        @map("updated_at")
   article   Article     @relation(fields: [articleId], references: [id])
   author    Author      @relation(fields: [authorId], references: [id])
-  articleId String
-  authorId  String
+  articleId String      @map("article_id")
+  authorId  String      @map("author_id")
   @@map("comment")
 }
```


