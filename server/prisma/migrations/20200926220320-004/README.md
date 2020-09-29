# Migration `20200926220320-004`

This migration has been generated at 9/26/2020, 10:03:20 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."_FavoritiesRelashion" (
"A" text  NOT NULL ,
"B" text  NOT NULL )

CREATE UNIQUE INDEX "_FavoritiesRelashion_AB_unique" ON "public"."_FavoritiesRelashion"("A","B")

CREATE  INDEX "_FavoritiesRelashion_B_index" ON "public"."_FavoritiesRelashion"("B")

ALTER TABLE "public"."_FavoritiesRelashion" ADD FOREIGN KEY ("A")REFERENCES "public"."article"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_FavoritiesRelashion" ADD FOREIGN KEY ("B")REFERENCES "public"."author"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200803023744-003..20200926220320-004
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
@@ -14,8 +14,9 @@
   id        String     @id     @default(cuid())
   name      String
   email     String     @unique
   password  String
+  favorites Article[]  @relation("FavoritiesRelashion")
   articles  Article[]
   comments  Comment[]
   @@map("author")
 }
@@ -24,8 +25,9 @@
   id        String      @id     @default(cuid())
   theme     String
   content   String?
   author    Author      @relation(fields: [authorId], references: [id])
+  fans      Author[]    @relation("FavoritiesRelashion")
   authorId  String      @map("author_id")
   comments  Comment[]
   image     String       
   published Boolean     @default(false)
```


