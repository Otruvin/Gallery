# Migration `20200802001910-001`

This migration has been generated at 8/2/2020, 12:19:10 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."author" (
"id" text  NOT NULL ,
"name" text  NOT NULL ,
"email" text  NOT NULL ,
"password" text  NOT NULL ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."article" (
"id" text  NOT NULL ,
"theme" text  NOT NULL ,
"content" text   ,
"image" text  NOT NULL ,
"published" boolean  NOT NULL DEFAULT false,
"updated_at" timestamp(3)  NOT NULL ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."comment" (
"id" text  NOT NULL ,
"text" text  NOT NULL ,
"created_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" timestamp(3)  NOT NULL ,
PRIMARY KEY ("id"))

CREATE UNIQUE INDEX "author.email" ON "public"."author"("email")

ALTER TABLE "public"."article" ADD FOREIGN KEY ("id")REFERENCES "public"."author"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."comment" ADD FOREIGN KEY ("id")REFERENCES "public"."article"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."comment" ADD FOREIGN KEY ("id")REFERENCES "public"."author"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200802001910-001
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,43 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model Author {
+  id        String     @id     @default(cuid())
+  name      String
+  email     String     @unique
+  password  String
+  articles  Article[]
+  comments  Comment[]
+  @@map("author")
+}
+
+model Article {
+  id        String      @id     @default(cuid())
+  theme     String
+  content   String?
+  author    Author      @relation(fields: [id], references: [id])
+  comments  Comment[]
+  image     String       
+  published Boolean     @default(false)
+  updatedAt DateTime    @updatedAt    @map("updated_at")
+  @@map("article")
+}
+
+model Comment {
+  id        String      @id     @default(cuid())
+  text      String
+  cretedAt  DateTime    @default(now())   @map("created_at")
+  updatedAt DateTime    @updatedAt        @map("updated_at")
+  article   Article     @relation(fields: [id], references: [id])
+  author    Author      @relation(fields: [id], references: [id])
+  @@map("comment")
+}
```


