# Migration `20200927003543-005`

This migration has been generated at 9/27/2020, 12:35:43 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."_FavoritiesRelashion" DROP CONSTRAINT "_FavoritiesRelashion_A_fkey"

ALTER TABLE "public"."_FavoritiesRelashion" DROP CONSTRAINT "_FavoritiesRelashion_B_fkey"

CREATE TABLE "public"."favorites_on_author" (
"author_id" text  NOT NULL ,
"article_id" text  NOT NULL ,
"created_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("author_id","article_id"))

ALTER TABLE "public"."favorites_on_author" ADD FOREIGN KEY ("author_id")REFERENCES "public"."author"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."favorites_on_author" ADD FOREIGN KEY ("article_id")REFERENCES "public"."article"("id") ON DELETE CASCADE ON UPDATE CASCADE

DROP TABLE "public"."_FavoritiesRelashion";
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200926220320-004..20200927003543-005
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
@@ -14,9 +14,9 @@
   id        String     @id     @default(cuid())
   name      String
   email     String     @unique
   password  String
-  favorites Article[]  @relation("FavoritiesRelashion")
+  favorites FavoratiesOnAuthor[]
   articles  Article[]
   comments  Comment[]
   @@map("author")
 }
@@ -25,9 +25,9 @@
   id        String      @id     @default(cuid())
   theme     String
   content   String?
   author    Author      @relation(fields: [authorId], references: [id])
-  fans      Author[]    @relation("FavoritiesRelashion")
+  fans      FavoratiesOnAuthor[]
   authorId  String      @map("author_id")
   comments  Comment[]
   image     String       
   published Boolean     @default(false)
@@ -44,5 +44,15 @@
   author    Author      @relation(fields: [authorId], references: [id])
   articleId String      @map("article_id")
   authorId  String      @map("author_id")
   @@map("comment")
+}
+
+model FavoratiesOnAuthor {
+    author      Author      @relation(fields: [authorId], references: [id])
+    authorId    String      @map("author_id")
+    article     Article     @relation(fields: [articleId], references: [id])
+    articleId   String      @map("article_id")
+    createdAt   DateTime    @default(now())     @map("created_at")
+    @@map("favorites_on_author")
+    @@id([authorId, articleId])
 }
```


