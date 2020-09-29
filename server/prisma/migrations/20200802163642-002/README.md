# Migration `20200802163642-002`

This migration has been generated at 8/2/2020, 4:36:42 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."article" DROP CONSTRAINT "article_id_fkey"

ALTER TABLE "public"."comment" DROP CONSTRAINT "comment_id_fkey1"

ALTER TABLE "public"."comment" DROP CONSTRAINT "comment_id_fkey"

ALTER TABLE "public"."article" ADD COLUMN "authorId" text  NOT NULL ;

ALTER TABLE "public"."comment" ADD COLUMN "articleId" text  NOT NULL ,
ADD COLUMN "authorId" text  NOT NULL ;

ALTER TABLE "public"."article" ADD FOREIGN KEY ("authorId")REFERENCES "public"."author"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."comment" ADD FOREIGN KEY ("articleId")REFERENCES "public"."article"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."comment" ADD FOREIGN KEY ("authorId")REFERENCES "public"."author"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200802001910-001..20200802163642-002
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
@@ -23,9 +23,10 @@
 model Article {
   id        String      @id     @default(cuid())
   theme     String
   content   String?
-  author    Author      @relation(fields: [id], references: [id])
+  author    Author      @relation(fields: [authorId], references: [id])
+  authorId  String
   comments  Comment[]
   image     String       
   published Boolean     @default(false)
   updatedAt DateTime    @updatedAt    @map("updated_at")
@@ -36,8 +37,10 @@
   id        String      @id     @default(cuid())
   text      String
   cretedAt  DateTime    @default(now())   @map("created_at")
   updatedAt DateTime    @updatedAt        @map("updated_at")
-  article   Article     @relation(fields: [id], references: [id])
-  author    Author      @relation(fields: [id], references: [id])
+  article   Article     @relation(fields: [articleId], references: [id])
+  author    Author      @relation(fields: [authorId], references: [id])
+  articleId String
+  authorId  String
   @@map("comment")
 }
```


